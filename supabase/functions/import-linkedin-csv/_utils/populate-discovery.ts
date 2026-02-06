import { supabase } from "../../_shared/supabase.ts";
import { formatDate } from "./format-date.ts";

export async function populateDiscovery(
  rowsDiscovery: string[][],
  rowsEngagement: string[][],
) {
  const dateRange = rowsDiscovery[0]?.[1]?.toString().trim();
  const totalImpressions = Number(rowsDiscovery[1]?.[1] || 0);
  const totalMembersReached = Number(rowsDiscovery[2]?.[1] || 0);
  const totalEngagements = Number(rowsDiscovery[3]?.[1] || 0);

  if (dateRange) {
    const { error: summaryError } = await supabase
      .from("linkedin_import_summaries")
      .insert({
        date_range_text: dateRange,
        total_impressions: totalImpressions,
        total_members_reached: totalMembersReached,
        total_engagements: totalEngagements,
      });

    if (summaryError) {
      console.error("Error saving summary:", summaryError);
    }
  }

  const cleanRows = rowsEngagement.slice(1);
  const metricsToSave = cleanRows
    .map((row) => {
      const rawDate = row[0];
      const formattedDate = formatDate(rawDate);

      if (!formattedDate) return null;

      return {
        metric_date: formattedDate,
        impressions: Number(row[1] || 0),
        engagements: Number(row[2] || 0),
      };
    })
    .filter((item) => item !== null);

  if (metricsToSave.length > 0) {
    const { error: dailyError } = await supabase
      .from("linkedin_daily_metrics")
      .upsert(metricsToSave, {
        onConflict: "metric_date",
        ignoreDuplicates: false,
      });

    if (dailyError) throw dailyError;
  }
}
