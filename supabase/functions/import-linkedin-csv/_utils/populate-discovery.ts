import { supabase } from "../../_shared/supabase.ts";
import { formatDate } from "./format-date.ts";

export async function populateDiscovery(
  rowsDiscovery: string[][],
  rowsEngagement: string[][],
) {
  const dateRange = (rowsDiscovery[0]?.[1] ?? "").toString().trim();
  const impressions = Number(rowsDiscovery[1]?.[1] ?? 0);
  const membersReached = Number(rowsDiscovery[2]?.[1] ?? 0);

  let engagements = 0;
  for (let i = 1; i < rowsEngagement.length; i++) {
    const row = rowsEngagement[i];
    if (!row || row.length < 3) continue;
    engagements += Number(row[2] ?? 0);
  }

  if (!dateRange) {
    console.error("Discovery rows:", rowsDiscovery);
    throw new Error("Date range not found in discovery data");
  }

  const dateParts = dateRange.split("-");
  const endDate = dateParts[1]?.trim() ?? "";

  if (!endDate) {
    console.error("Date range found:", dateRange);
    console.error("Split parts:", dateParts);
    throw new Error(
      `Could not parse metric_date from dateRange: "${dateRange}". Expected format: "DD/MM/YYYY - DD/MM/YYYY"`,
    );
  }

  const metricDate = formatDate(endDate);

  const { error } = await supabase.from("linkedin_daily_metrics").upsert(
    {
      metric_date: metricDate,
      impressions,
      members_reached: membersReached,
      engagements,
    },
    { onConflict: "metric_date" },
  );

  if (error) {
    console.error("Error inserting discovery metrics:", error);
    throw new Error("Failed to insert discovery metrics");
  }
}
