import type { LinkedInSummaryData } from "../types/summary-types";

export function useKpisFromSummary(summaryData: LinkedInSummaryData | null) {
  const summary = summaryData?.summary;

  return {
    impressions: {
      value: summary?.impressions?.total
        ? Number(summary.impressions.total)
        : 0,
      delta: summary?.impressions?.percentageChange
        ? Number(Number(summary.impressions.percentageChange).toFixed(2))
        : 0,
    },
    membersReached: {
      value: summary?.members_reached?.value
        ? Number(summary.members_reached.value)
        : 0,
      delta: summary?.members_reached?.delta
        ? Number(Number(summary.members_reached.delta).toFixed(2))
        : 0,
    },
    engagements: {
      value: summary?.engagements?.total
        ? Number(summary.engagements.total)
        : 0,
      delta: summary?.engagements?.percentageChange
        ? Number(Number(summary.engagements.percentageChange).toFixed(2))
        : 0,
    },
    engagementRate: {
      value: summary?.engagement_rate?.value ?? "0.00%",
      delta: summary?.engagement_rate?.delta
        ? Number(Number(summary.engagement_rate.delta).toFixed(2))
        : 0,
    },
    newFollowers: {
      value: summary?.new_followers?.total
        ? Number(summary.new_followers.total)
        : 0,
      delta: summary?.new_followers?.percentageChange
        ? Number(Number(summary.new_followers.percentageChange).toFixed(2))
        : 0,
    },
  };
}
