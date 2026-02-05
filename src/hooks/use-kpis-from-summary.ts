import type { LinkedInSummaryData } from "@/types/summary-types";

export function useKpisFromSummary(summaryData: LinkedInSummaryData | null) {
  const summary = summaryData?.summary;
  return {
    impressions: {
      value: summary?.impressions?.total
        ? Number(summary.impressions.total)
        : 0,
      delta: summary?.impressions?.percentageChange
        ? parseFloat(summary.impressions.percentageChange)
        : 0,
    },
    membersReached: {
      value: summary?.members_reached?.total
        ? Number(summary.members_reached.total)
        : 0,
      delta: summary?.members_reached?.percentageChange
        ? parseFloat(summary.members_reached.percentageChange)
        : 0,
    },
    engagements: {
      value: summary?.engagements?.total
        ? Number(summary.engagements.total)
        : 0,
      delta: summary?.engagements?.percentageChange
        ? parseFloat(summary.engagements.percentageChange)
        : 0,
    },
    engagementRate: {
      value: summary?.engagement_rate?.total ?? "0.00%",
      delta: summary?.engagement_rate?.percentageChange
        ? parseFloat(
            String(summary.engagement_rate.percentageChange).replace("pp", ""),
          )
        : 0,
    },
    newFollowers: {
      value: summary?.new_followers?.total
        ? Number(summary.new_followers.total)
        : 0,
      delta: summary?.new_followers?.percentageChange
        ? parseFloat(summary.new_followers.percentageChange)
        : 0,
    },
  };
}
