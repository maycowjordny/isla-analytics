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

  const dataToUpsert = entries.map((entry) => {
    const dailyTotal = currentRunningTotal;
    const formattedData = {
      metric_date: formatDate(entry.metric_date),
      new_followers: entry.new_followers,
      total_followers: dailyTotal,
    };

    currentRunningTotal = currentRunningTotal - entry.new_followers;

    return formattedData;
  });

  if (dataToUpsert.length > 0) {
    const { error } = await supabase
      .from("linkedin_followers_daily")
      .upsert(dataToUpsert, { onConflict: "metric_date" });

    if (error) {
      console.error("Erro no bulk upsert de seguidores:", error.message);
      throw error;
    }
  }
}
