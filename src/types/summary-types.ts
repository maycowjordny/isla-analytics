export interface StandardMetric {
  total: number;
  percentageChange: number;
  previous: number;
}

export interface MembersReachedMetric {
  value: number;
  previous: number;
  delta: number;
}

export interface EngagementRateMetric {
  value: string;
  total: string;
  percentageChange: number | string;
  delta: number;
  isPositive: boolean;
}

export interface DailyMomentum {
  date: string;
  impressions: number;
  engagements: number;
  er: number;
}

export interface FollowerGrowth {
  date: string;
  new_followers: number;
  total_followers: number;
}

export interface TopContent {
  url: string;
  published_at: string;
  impressions: number;
  engagements: number;
  engagement_rate: number;
}

export interface AudienceItem {
  label: string;
  percentage: number;
}

export interface LinkedInSummaryData {
  summary: {
    impressions: StandardMetric;
    engagements: StandardMetric;
    new_followers: StandardMetric;

    members_reached: MembersReachedMetric;
    engagement_rate: EngagementRateMetric;
  };
  daily_momentum_chart: DailyMomentum[];
  follower_growth_chart: FollowerGrowth[];
  top_content: TopContent[];
  audience_profile: Record<string, AudienceItem[]>;
}
