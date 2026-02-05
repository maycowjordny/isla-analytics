import { supabase } from "../../_shared/supabase.ts";
import { formatDate } from "./format-date.ts";

export async function populateTopPosts(rowsTopPosts: string[][]) {
  const postsMap = new Map<
    string,
    {
      url: string;
      publishedAt: string;
      engagements: number;
      impressions: number;
    }
  >();

  for (let i = 0; i < rowsTopPosts.length; i++) {
    const row = rowsTopPosts[i];
    if (!row || row.length < 3) continue;

    const url1 = row[0]?.toString().trim();
    const date1 = row[1]?.toString().trim();
    const engagements = Number(row[2] ?? 0);

    if (url1 && url1.startsWith("http") && date1 && date1.includes("/")) {
      const publishedAt = formatDate(date1);
      if (publishedAt) {
        if (postsMap.has(url1)) {
          postsMap.get(url1)!.engagements = engagements;
        } else {
          postsMap.set(url1, {
            url: url1,
            publishedAt,
            engagements,
            impressions: 0,
          });
        }
      }
    }

    if (row.length >= 7) {
      const url2 = row[4]?.toString().trim();
      const date2 = row[5]?.toString().trim();
      const impressions = Number(row[6] ?? 0);

      if (url2 && url2.startsWith("http") && date2 && date2.includes("/")) {
        const publishedAt = formatDate(date2);
        if (publishedAt) {
          if (postsMap.has(url2)) {
            postsMap.get(url2)!.impressions = impressions;
          } else {
            postsMap.set(url2, {
              url: url2,
              publishedAt,
              engagements: 0,
              impressions,
            });
          }
        }
      }
    }
  }

  for (const post of postsMap.values()) {
    const engagementRate =
      post.impressions > 0 ? (post.engagements / post.impressions) * 100 : 0;

    const { error } = await supabase.from("linkedin_posts").upsert(
      {
        post_url: post.url,
        published_at: post.publishedAt,
        impressions: post.impressions,
        engagements: post.engagements,
        engagement_rate: Number(engagementRate.toFixed(2)),
      },
      { onConflict: "post_url" },
    );

    if (error) {
      console.error(`Error inserting post ${post.url}:`, error);
    }
  }
}
