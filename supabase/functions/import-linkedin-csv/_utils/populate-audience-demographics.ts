import { supabase } from "../../_shared/supabase.ts";

export async function populateAudienceDemographics(rows: string[][]) {
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

    if (!percentage) continue;

    const { error } = await supabase
      .from("linkedin_audience_demographics")
      .upsert(
        {
          category,
          label,
          percentage,
        },
        { onConflict: "category,label" },
      );

    if (error) {
      console.error(
        `Error inserting audience demographic (${category} - ${label}):`,
        error,
      );
    }
  }
}
