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

  const operations = [];

  if (dateRange) {
    operations.push(
      supabase
        .from("linkedin_import_summaries")
        .insert({
          date_range_text: dateRange,
          total_impressions: totalImpressions,
          total_members_reached: totalMembersReached,
          total_engagements: totalEngagements,
        })
        .then(({ error }) => {
          if (error) console.error("Error saving summary:", error);
        }),
    );
  }

  const metricsToSave = rowsEngagement
    .slice(1)
    .map((row) => {
      const formattedDate = formatDate(row[0]);
      if (!formattedDate) return null;

      return {
        metric_date: formattedDate,
        impressions: Number(row[1] || 0),
        engagements: Number(row[2] || 0),
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  if (metricsToSave.length > 0) {
    operations.push(
      supabase
        .from("linkedin_daily_metrics")
        .upsert(metricsToSave, {
          onConflict: "metric_date",
        })
        .then(({ error }) => {
          if (error) throw error;
        }),
    );
  }

  await Promise.all(operations);
}
