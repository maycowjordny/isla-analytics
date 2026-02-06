import { supabase } from "../../_shared/supabase.ts";

export async function populateAudienceDemographics(rows: string[][]) {
  const dataToUpsert = [];

  for (let i = 2; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length < 3) continue;

    const category = row[0]?.toString().trim() || "";
    const label = row[1]?.toString().trim() || "";
    const percentageStr = row[2]?.toString().trim() || "";

    if (!category || !label) continue;

    let percentage = 0;
    if (percentageStr) {
      const cleanPercentage = percentageStr
        .replace("%", "")
        .replace("<", "")
        .trim();
      percentage = Number(cleanPercentage) || 0;
    }

    if (percentage > 0) {
      dataToUpsert.push({ category, label, percentage });
    }
  }

  if (dataToUpsert.length > 0) {
    const { error } = await supabase
      .from("linkedin_audience_demographics")
      .upsert(dataToUpsert, { onConflict: "category,label" });

    if (error)
      console.error("Error in bulk upsert Demographics:", error.message);
  }
}
