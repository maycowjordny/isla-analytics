export interface MetricDetail {
  total: number | string;
  percentageChange: string;
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
    impressions: MetricDetail;
    members_reached: MetricDetail;
    engagements: MetricDetail;
    new_followers: MetricDetail;
    engagement_rate: MetricDetail;
  };
  daily_momentum_chart: DailyMomentum[];
  follower_growth_chart: FollowerGrowth[];
  top_content: TopContent[];
  audience_profile: Record<string, AudienceItem[]>;
}
