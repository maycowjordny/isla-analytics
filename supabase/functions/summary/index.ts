import { supabase } from "../_shared/supabase.ts";
import { calculateGrowth } from "./_utils/calculate-growth.ts";
import { getER } from "./_utils/get-er.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);
    const startDateParam = url.searchParams.get("startDate");
    const endDateParam = url.searchParams.get("endDate");

    let currentStart: Date;
    let currentEnd: Date;

    if (startDateParam && endDateParam) {
      currentStart = new Date(startDateParam);
      currentEnd = new Date(endDateParam);
    } else {
      const now = new Date();
      currentEnd = now;
      currentStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const durationTime = currentEnd.getTime() - currentStart.getTime();
    const previousStart = new Date(currentStart.getTime() - durationTime);
    const dateIsoStart = currentStart.toISOString().split("T")[0];
    const dateIsoPrevStart = previousStart.toISOString().split("T")[0];

    const [
      metricsResponse,
      followersResponse,
      postsResponse,
      demographicsResponse,
    ] = await Promise.all([
      supabase
        .from("linkedin_daily_metrics")
        .select("impressions, engagements, members_reached, metric_date")
        .gte("metric_date", dateIsoPrevStart)
        .lte("metric_date", currentEnd.toISOString().split("T")[0])
        .order("metric_date", { ascending: true }),

      supabase
        .from("linkedin_followers_daily")
        .select("new_followers, total_followers, metric_date")
        .gte("metric_date", dateIsoPrevStart)
        .lte("metric_date", currentEnd.toISOString().split("T")[0])
        .order("metric_date", { ascending: true }),

      supabase
        .from("linkedin_posts")
        .select(
          "published_at, impressions, engagements, engagement_rate, post_url",
        )
        .gte("published_at", dateIsoStart)
        .lte("published_at", currentEnd.toISOString().split("T")[0])
        .order("engagements", { ascending: false }),

      supabase
        .from("linkedin_audience_demographics")
        .select("category, label, percentage")
        .order("percentage", { ascending: false }),
    ]);

    if (metricsResponse.error) throw metricsResponse.error;
    if (followersResponse.error) throw followersResponse.error;
    if (postsResponse.error) throw postsResponse.error;
    if (demographicsResponse.error) throw demographicsResponse.error;

    const currentPeriodMetrics = metricsResponse.data.filter(
      (d) => new Date(d.metric_date) >= currentStart,
    );
    const prevPeriodMetrics = metricsResponse.data.filter(
      (d) =>
        new Date(d.metric_date) < currentStart &&
        new Date(d.metric_date) >= previousStart,
    );

    const currentPeriodFollowers = followersResponse.data.filter(
      (d) => new Date(d.metric_date) >= currentStart,
    );

    const currentER = getER(currentPeriodMetrics);
    const prevER = getER(prevPeriodMetrics);
    const erGrowth = prevER > 0 ? currentER - prevER : 0;

    const dailyMomentumChart = currentPeriodMetrics.map((day) => {
      const dailyER =
        day.impressions > 0 ? (day.engagements / day.impressions) * 100 : 0;
      return {
        date: day.metric_date,
        impressions: day.impressions,
        engagements: day.engagements,
        er: Number(dailyER.toFixed(2)),
      };
    });

    const followerGrowthChart = currentPeriodFollowers.map((day) => ({
      date: day.metric_date,
      new_followers: day.new_followers,
      total_followers: day.total_followers,
    }));

    const topContentList = postsResponse.data.map((post) => ({
      url: post.post_url,
      published_at: post.published_at,
      impressions: post.impressions,
      engagements: post.engagements,
      engagement_rate: post.engagement_rate,
    }));

    const audienceProfile = demographicsResponse.data.reduce(
      (acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push({
          label: item.label,
          percentage: item.percentage,
        });
        return acc;
      },
      {} as Record<string, Array<{ label: string; percentage: number }>>,
    );

    return new Response(
      JSON.stringify({
        summary: {
          impressions: calculateGrowth(
            metricsResponse.data,
            "impressions",
            currentStart,
          ),
          members_reached: calculateGrowth(
            metricsResponse.data,
            "members_reached",
            currentStart,
          ),
          engagements: calculateGrowth(
            metricsResponse.data,
            "engagements",
            currentStart,
          ),
          new_followers: calculateGrowth(
            followersResponse.data,
            "new_followers",
            currentStart,
          ),
          engagement_rate: {
            total: currentER.toFixed(2) + "%",
            percentageChange: erGrowth.toFixed(2) + "pp",
            isPositive: erGrowth >= 0,
          },
        },
        daily_momentum_chart: dailyMomentumChart,
        follower_growth_chart: followerGrowthChart,
        top_content: topContentList,
        audience_profile: audienceProfile,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
