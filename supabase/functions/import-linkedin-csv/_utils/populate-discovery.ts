import { supabase } from "../../_shared/supabase.ts";

export async function populateDiscovery(rows: string[][]) {
  const normalize = (v: string) => v?.toString().trim().toLowerCase()

  let dateRange = ""
  let impressions = 0
  let membersReached = 0

  for (const row of rows) {
    const label = normalize(row?.[0] ?? "")

    if (label.startsWith("overall performance"))  dateRange = (row?.[1] ?? "").toString().trim()
    if (label === "impressions") impressions = Number(row?.[1] ?? 0)
    if (label === "members reached") membersReached = Number(row?.[1] ?? 0)
  }

  await supabase
    .from("linkedin_discovery_metrics")
    .upsert(
      {
        date_range: dateRange,
        impressions,
        members_reached: membersReached,
      },
      { onConflict: "date_range" }
    )

  return { dateRange };
}