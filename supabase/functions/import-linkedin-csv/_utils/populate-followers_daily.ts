import { supabase } from "../../_shared/supabase.ts";
import { formatDate } from "./format-date.ts";

export async function populateFollowersDaily(rows: string[][]) {
  const finalTotalFollowers = Number(rows[0]?.[1] ?? 0);

  const entries = [];

  for (let i = 2; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length < 2) continue;

    const dateStr = row[0]?.toString().trim() ?? "";
    const newFollowers = Number(row[1] ?? 0);

    if (!dateStr || !dateStr.includes("/")) continue;

    entries.push({
      metric_date: dateStr,
      new_followers: newFollowers,
    });
  }

  entries.sort(
    (a, b) =>
      new Date(b.metric_date).getTime() - new Date(a.metric_date).getTime(),
  );

  let currentRunningTotal = finalTotalFollowers;

  for (const entry of entries) {
    const dailyTotal = currentRunningTotal;

    const { error } = await supabase.from("linkedin_followers_daily").upsert(
      {
        metric_date: formatDate(entry.metric_date),
        new_followers: entry.new_followers,
        total_followers: dailyTotal,
      },
      { onConflict: "metric_date" },
    );

    if (error) {
      console.error(
        `Error inserting follower data for ${entry.metric_date}:`,
        error,
      );
    }

    currentRunningTotal = currentRunningTotal - entry.new_followers;
  }
}
