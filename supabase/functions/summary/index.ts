import { corsHeaders } from "../_shared/cors.ts";
import { supabase } from "../_shared/supabase.ts";
import { calculateGrowth } from "./_utils/calculate-growth.ts";
import { getER } from "./_utils/get-er.ts";

Deno.serve(async (req) => {
  // Tratamento de OPTIONS (CORS)
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { startDate: startDateParam, endDate: endDateParam } =
      await req.json();

    // 1. Lógica de Datas Simplificada
    const now = new Date();
    const currentEnd = endDateParam ? new Date(endDateParam) : now;
    const currentStart = startDateParam
      ? new Date(startDateParam)
      : new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const durationTime = currentEnd.getTime() - currentStart.getTime();
    const previousStart = new Date(currentStart.getTime() - durationTime);

    // Formatação ISO para o Supabase
    const dateIsoStart = currentStart.toISOString().split("T")[0];
    const dateIsoEnd = currentEnd.toISOString().split("T")[0];
    const dateIsoPrevStart = previousStart.toISOString().split("T")[0];

    // 2. Execução das Queries em Paralelo
    // Mantemos as respostas separadas aqui para preservar a TIPAGEM do TypeScript
    const [metricsRes, followersRes, postsRes, demographicsRes, summariesRes] =
      await Promise.all([
        supabase
          .from("linkedin_daily_metrics")
          .select("impressions, engagements, metric_date")
          .gte("metric_date", dateIsoPrevStart)
          .lte("metric_date", dateIsoEnd)
          .order("metric_date", { ascending: true }),

        supabase
          .from("linkedin_followers_daily")
          .select("new_followers, total_followers, metric_date")
          .gte("metric_date", dateIsoPrevStart)
          .lte("metric_date", dateIsoEnd)
          .order("metric_date", { ascending: true }),

        supabase
          .from("linkedin_posts")
          .select(
            "published_at, impressions, engagements, engagement_rate, post_url",
          )
          .gte("published_at", dateIsoStart)
          .lte("published_at", dateIsoEnd)
          .order("engagements", { ascending: false }),

        supabase
          .from("linkedin_audience_demographics")
          .select("category, label, percentage")
          .order("percentage", { ascending: false }),

        supabase
          .from("linkedin_import_summaries")
          .select("total_members_reached, imported_at, date_range_text")
          .order("imported_at", { ascending: false })
          .limit(2),
      ]);

    // 3. Verificação de Erros Unificada (Substitui os 5 ifs)
    // Criamos um array apenas para checar se existe algum erro
    const firstError = [
      metricsRes,
      followersRes,
      postsRes,
      demographicsRes,
      summariesRes,
    ].find((res) => res.error)?.error;

    if (firstError) throw firstError;

    // 4. Extração Segura dos Dados
    // Usamos '|| []' para garantir que nunca seja null, evitando quebras nos filtros
    const metricsData = metricsRes.data || [];
    const followersData = followersRes.data || [];
    const postsData = postsRes.data || [];
    const demographicsData = demographicsRes.data || [];
    const summariesData = summariesRes.data || [];

    // 5. Processamento (Filtros de Data)
    const currentPeriodMetrics = metricsData.filter(
      (d) => new Date(d.metric_date) >= currentStart,
    );
    const prevPeriodMetrics = metricsData.filter((d) => {
      const dDate = new Date(d.metric_date);
      return dDate < currentStart && dDate >= previousStart;
    });

    const currentPeriodFollowers = followersData.filter(
      (d) => new Date(d.metric_date) >= currentStart,
    );

    // 6. Cálculos
    const currentER = getER(currentPeriodMetrics);
    const prevER = getER(prevPeriodMetrics);
    const erGrowth = prevER > 0 ? ((currentER - prevER) / prevER) * 100 : 0;

    const latestSummary = summariesData[0];
    const previousSummary = summariesData[1];
    const currentMembersReached = latestSummary?.total_members_reached || 0;
    const prevMembersReached = previousSummary?.total_members_reached || 0;
    const membersReachedDelta =
      prevMembersReached > 0
        ? ((currentMembersReached - prevMembersReached) / prevMembersReached) *
          100
        : 0;

    // 7. Montagem dos Charts e Objetos de Resposta
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

    const topContentList = postsData.map((post) => ({
      url: post.post_url,
      published_at: post.published_at,
      impressions: post.impressions,
      engagements: post.engagements,
      engagement_rate: post.engagement_rate,
    }));

    const audienceProfile = demographicsData.reduce(
      (acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push({
          label: item.label,
          percentage: item.percentage,
        });
        return acc;
      },
      {} as Record<string, Array<{ label: string; percentage: number }>>,
    );

    // 8. Retorno Final
    return new Response(
      JSON.stringify({
        summary: {
          impressions: calculateGrowth(
            metricsData,
            "impressions",
            currentStart,
          ),
          members_reached: {
            value: currentMembersReached,
            previous: prevMembersReached,
            delta: membersReachedDelta,
          },
          engagements: calculateGrowth(
            metricsData,
            "engagements",
            currentStart,
          ),
          new_followers: calculateGrowth(
            followersData,
            "new_followers",
            currentStart,
          ),
          engagement_rate: {
            value: currentER.toFixed(2) + "%",
            total: currentER.toFixed(2) + "%",
            percentageChange: erGrowth.toFixed(2),
            delta: erGrowth,
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
