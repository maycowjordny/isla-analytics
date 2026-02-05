import "@supabase/functions-js/edge-runtime.d.ts";
import * as XLSX from "xlsx";
import { populateAudienceDemographics } from "./_utils/populate-audience-demographics.ts";
import { populateDiscovery } from "./_utils/populate-discovery.ts";
import { populateFollowersDaily } from "./_utils/populate-followers_daily.ts";
import { populateTopPosts } from "./_utils/populate-top-posts.ts";

const SHEET_INDEX = {
  DISCOVERY: 0,
  ENGAGEMENT: 1,
  TOP_POSTS: 2,
  FOLLOWERS: 3,
  DEMOGRAPHICS: 4,
};

Deno.serve(async (req) => {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!file || !(file instanceof File))
      return new Response("File not found", { status: 400 });

    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });

    if (workbook.SheetNames.length < 5) {
      return new Response(
        `The Excel file is incomplete. Expected 5 sheets, found ${workbook.SheetNames.length}.`,
        { status: 400 },
      );
    }

    const discoverySheetName = workbook.SheetNames[SHEET_INDEX.DISCOVERY];
    const engagementSheetName = workbook.SheetNames[SHEET_INDEX.ENGAGEMENT];
    const followersSheetName = workbook.SheetNames[SHEET_INDEX.FOLLOWERS];
    const topPostsSheetName = workbook.SheetNames[SHEET_INDEX.TOP_POSTS];
    const demographicsSheetName = workbook.SheetNames[SHEET_INDEX.DEMOGRAPHICS];

    const getSheetData = (sheetName: string) => {
      const sheet = workbook.Sheets[sheetName];
      return XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1 });
    };

    const rowsDiscovery = getSheetData(discoverySheetName);
    const rowsEngagement = getSheetData(engagementSheetName);
    const rowsFollowers = getSheetData(followersSheetName);
    const rowsTopPosts = getSheetData(topPostsSheetName);
    const rowsAudienceDemographics = getSheetData(demographicsSheetName);

    await populateDiscovery(rowsDiscovery, rowsEngagement);

    await populateFollowersDaily(rowsFollowers);

    await populateTopPosts(rowsTopPosts);

    await populateAudienceDemographics(rowsAudienceDemographics);

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
