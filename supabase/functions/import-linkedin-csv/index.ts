import * as XLSX from "xlsx";
import { corsHeaders } from "../_shared/cors.ts";
import { supabase } from "../_shared/supabase.ts";
import { populateAudienceDemographics } from "./_utils/populate-audience-demographics.ts";
import { populateDiscovery } from "./_utils/populate-discovery.ts";
import { populateFollowersDaily } from "./_utils/populate-followers_daily.ts";
import { populateTopPosts } from "./_utils/populate-top-posts.ts";
import { validateLinkedInExport } from "./_utils/validate-linkedin-export.ts";

const SHEET_INDEX = {
  DISCOVERY: 0,
  ENGAGEMENT: 1,
  TOP_POSTS: 2,
  FOLLOWERS: 3,
  DEMOGRAPHICS: 4,
};

const badRequest = (message: string) =>
  new Response(JSON.stringify({ message }), {
    status: 400,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  const uploadId = crypto.randomUUID();
  const userId = `userId-${crypto.randomUUID()}`;

  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!file || !(file instanceof File)) {
      return badRequest("File not provided.");
    }

    if (file.size === 0) {
      return badRequest("The CSV file is empty or unreadable.");
    }

    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });

    const validation = validateLinkedInExport(workbook);
    if (!validation.ok) {
      return badRequest(validation.message);
    }

    const discoverySheetName = workbook.SheetNames[SHEET_INDEX.DISCOVERY];
    const discoverySheet = workbook.Sheets[discoverySheetName];

    let weekStart = "unknown_start";
    let weekEnd = "unknown_end";

    const dateRangeString = discoverySheet["B1"]?.v;

    if (typeof dateRangeString === "string") {
      const dates = dateRangeString
        .split("-")
        .map((d) => d.trim().replaceAll("/", "-"));

      if (dates.length >= 2) {
        weekStart = dates[0];
        weekEnd = dates[1];
      }
    }

    const csvContent = XLSX.utils.sheet_to_csv(discoverySheet);
    const filePath = `${userId}/${weekStart}_${weekEnd}/${uploadId}.csv`;

    const { error: storageError } = await supabase.storage
      .from("linkedin_exports")
      .upload(filePath, csvContent, {
        contentType: "text/csv",
        upsert: false,
      });

    if (storageError) throw new Error(`Storage Error: ${storageError.message}`);

    const { error: dbError } = await supabase.from("uploads").insert({
      id: uploadId,
      user_id: userId,
      file_path: filePath,
      status: "processing",
      week_start: weekStart,
      week_end: weekEnd,
    });

    if (dbError) console.error("DB Log Error:", dbError.message);

    const getSheetData = (sheetName: string | undefined) => {
      if (!sheetName) return [];
      const sheet = workbook.Sheets[sheetName];
      return XLSX.utils.sheet_to_json<string[]>(sheet, {
        header: 1,
        defval: "",
      });
    };

    await populateDiscovery(
      getSheetData(discoverySheetName),
      getSheetData(workbook.SheetNames[SHEET_INDEX.ENGAGEMENT]),
    );

    await populateFollowersDaily(
      getSheetData(workbook.SheetNames[SHEET_INDEX.FOLLOWERS]),
    );

    await populateTopPosts(
      getSheetData(workbook.SheetNames[SHEET_INDEX.TOP_POSTS]),
    );

    await populateAudienceDemographics(
      getSheetData(workbook.SheetNames[SHEET_INDEX.DEMOGRAPHICS]),
    );

    await supabase
      .from("uploads")
      .update({ status: "ready" })
      .eq("id", uploadId);

    return new Response(JSON.stringify({ ok: true, id: uploadId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    if (userId) {
      await supabase
        .from("uploads")
        .update({ status: "failed", error_message: errorMessage })
        .eq("id", uploadId);
    }

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
