import { supabase } from "@/lib/supabase";
import { differenceInDays, format, subDays } from "date-fns";
import {
  Eye,
  FlaskConical,
  MessageSquare,
  RefreshCw,
  Target,
  TrendingUp,
  Trophy,
  UserPlus,
  Users,
  Wrench,
} from "lucide-react";
import { useEffect, useMemo, useState, useTransition } from "react";
import type { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { InsightItem } from "./components/cards/insight-item-card";
import { KPICard } from "./components/cards/kpi-cards";
import { AudienceDemographics } from "./components/charts/audience-demographics";
import { FollowerChart } from "./components/charts/follower-chart";
import { MomentumChart } from "./components/charts/momentum-chart";
import { TopPosts } from "./components/charts/top-posts-charts";
import { DashboardHeader } from "./components/header/dashboard-header";
import { UploadAnalyticsModal } from "./components/modal/upload-analytics-modal";
import { DashboardSkeleton } from "./components/skeleton/dashboard-skeleton";
import { Button } from "./components/ui/button";
import { useKpisFromSummary } from "./hooks/use-kpis-from-summary";
import type { LinkedInSummaryData } from "./types/summary-types";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [summaryData, setSummaryData] = useState<LinkedInSummaryData | null>(
    null,
  );
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 6),
    to: new Date(),
  });
  const [insightsData, setInsightsData] = useState<any>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  const dailyMomentumChart = summaryData?.daily_momentum_chart || [];
  const followerGrowthChart = summaryData?.follower_growth_chart || [];

  async function handleModalUpload(file: File) {
    const form = new FormData();
    form.append("file", file);

    try {
      const { error } = await supabase.functions.invoke("import-linkedin-csv", {
        body: form,
      });

      if (error) throw error;

      fetchSummary();
      fetchInsights();
      toast.success("File uploaded successfully.");
    } catch (error: any) {
      const message =
        error.message || "An error occurred while uploading the file.";
      toast.error(message);
      console.error(error);
    }
  }

  async function fetchSummary() {
    if (!dateRange?.from || !dateRange?.to) return;

    try {
      const formattedStart = format(dateRange.from, "yyyy-MM-dd");
      const formattedEnd = format(dateRange.to, "yyyy-MM-dd");

      const { data, error } = await supabase.functions.invoke("summary", {
        body: {
          startDate: formattedStart,
          endDate: formattedEnd,
        },
      });

      if (error) throw error;

      setSummaryData(data);
    } catch (error) {
      console.error("Error fetching summary:", error);
      toast.error("Failed to fetch summary data");
    }
  }

  async function fetchInsights() {
    if (!dateRange?.from || !dateRange?.to) return;

    setIsLoadingInsights(true);
    try {
      const formattedStart = format(dateRange.from, "yyyy-MM-dd");
      const formattedEnd = format(dateRange.to, "yyyy-MM-dd");

      const { data, error } = await supabase.functions.invoke("insights", {
        body: {
          startDate: formattedStart,
          endDate: formattedEnd,
        },
      });

      if (error) throw error;

      setInsightsData(data);
    } catch (error) {
      console.error("Error fetching insights:", error);
    } finally {
      setIsLoadingInsights(false);
    }
  }

  useEffect(() => {
    startTransition(async () => {
      await fetchSummary();
      fetchInsights();
    });
  }, [dateRange]);

  const periodLabel = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return "Weekly";
    const days = differenceInDays(dateRange.to, dateRange.from) + 1;
    if (days <= 7) return "Weekly";
    if (days <= 14) return "2-Week";
    if (days <= 31) return "Monthly";
    if (days <= 62) return "2-Month";
    return "3-Month";
  }, [dateRange]);

  const kpis = useKpisFromSummary(summaryData?.summary ? summaryData : null);

  const totalFollowers =
    followerGrowthChart.length > 0
      ? followerGrowthChart[followerGrowthChart.length - 1].total_followers
      : 0;

  const momentumData = dailyMomentumChart.map((item) => ({
    date: item.date,
    impressions: item.impressions,
    engagements: item.engagements,
    er: item.er,
  }));

  const followerData = followerGrowthChart.map((item) => ({
    date: item.date,
    newFollowers: item.new_followers,
    totalFollowers: item.total_followers,
  }));

  const topPostsRaw = summaryData?.top_content || [];
  const topPostsByEngagement = topPostsRaw
    .slice()
    .sort((a, b) => b.engagements - a.engagements)
    .map((item, _) => ({
      id: item.url,
      preview: item.url,
      date: item.published_at
        ? new Date(item.published_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        : "",
      impressions: item.impressions,
      engagements: item.engagements,
      engagementRate: item.engagement_rate,
      url: item.url,
    }));

  const topPostsByImpressions = topPostsRaw
    .slice()
    .sort((a, b) => b.impressions - a.impressions)
    .map((item) => ({
      id: item.url,
      preview: item.url,
      date: item.published_at
        ? new Date(item.published_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        : "",
      impressions: item.impressions,
      engagements: item.engagements,
      engagementRate: item.engagement_rate,
      url: item.url,
    }));

  const audienceProfile = summaryData?.audience_profile || {};
  const getDemographic = (
    keys: string[],
  ): { name: string; percentage: number }[] => {
    for (const key of keys) {
      if (audienceProfile[key]) {
        return audienceProfile[key].map((item) => ({
          name: item.label,
          percentage: item.percentage * 100,
        }));
      }
    }
    return [];
  };
  const audienceData = {
    jobTitles: getDemographic(["Job titles", "Cargos"]),
    locations: getDemographic(["Locations", "Localidades"]),
    industries: getDemographic(["Industries", "Setores"]),
    seniority: getDemographic(["Seniority", "Nível de experiência"]),
    companySize: getDemographic(["Company size", "Tamanho da empresa"]),
  };

  const isLoading = isPending || !summaryData;

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="min-h-screen bg-background">
      <main>
        <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
          <DashboardHeader
            onUploadClick={() => setIsModalOpen(true)}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
          <section className="mb-8">
            <h2 className="section-title mb-4">{periodLabel} Scoreboard</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <KPICard
                label="Impressions"
                value={kpis.impressions.value.toLocaleString()}
                delta={kpis.impressions.delta}
                icon={<Eye className="w-4 h-4" />}
                delay={0}
                description="Times your posts were seen on LinkedIn."
              />
              <KPICard
                label="Members Reached"
                value={kpis.membersReached.value.toLocaleString()}
                delta={kpis.membersReached.delta}
                icon={<Users className="w-4 h-4" />}
                delay={50}
                description="Unique LinkedIn members who saw your content."
              />
              <KPICard
                label="Engagements"
                value={kpis.engagements.value.toLocaleString()}
                delta={kpis.engagements.delta}
                icon={<MessageSquare className="w-4 h-4" />}
                delay={100}
                description="The number of times your content was engaged with."
              />
              <KPICard
                label="Engagement Rate"
                value={kpis.engagementRate.value}
                suffix=""
                delta={kpis.engagementRate.delta}
                icon={<TrendingUp className="w-4 h-4" />}
                delay={150}
                description="Post engagements divided by impressions."
              />
              <KPICard
                label="New Followers"
                value={`+${kpis.newFollowers.value.toLocaleString()}`}
                delta={kpis.newFollowers.delta}
                icon={<UserPlus className="w-4 h-4" />}
                delay={200}
                description="New followers gained during this period."
              />
            </div>
          </section>
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <MomentumChart data={momentumData} />
            <FollowerChart
              data={followerData}
              totalFollowers={totalFollowers}
            />
          </section>
          <section className="bg-card rounded-2xl border border-border p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Insights of this week
                </h3>
                <p className="text-sm text-slate-400 font-medium">
                  January 1st - January 7th
                </p>
              </div>
              <Button
                variant="outline"
                size="icon-lg"
                onClick={fetchInsights}
                disabled={isLoadingInsights}
              >
                <RefreshCw
                  className={`w-5 h-5 ${isLoadingInsights ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
            <div className="flex flex-col">
              <InsightItem
                icon={<Trophy className="w-5 h-5" />}
                title="What Worked"
                description={insightsData?.what_worked}
                loading={isLoadingInsights}
              />
              <InsightItem
                icon={<Wrench className="w-5 h-5" />}
                title="Improve"
                description={insightsData?.improve}
                loading={isLoadingInsights}
              />
              <InsightItem
                icon={<Target className="w-5 h-5" />}
                title="Next Week Goal"
                description={insightsData?.next_week_goal}
                loading={isLoadingInsights}
              />
              <InsightItem
                icon={<FlaskConical className="w-5 h-5" />}
                title="Try It"
                description={insightsData?.try_it}
                loading={isLoadingInsights}
              />
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <TopPosts
              byEngagement={topPostsByEngagement}
              byImpressions={topPostsByImpressions}
            />
            <AudienceDemographics data={audienceData} />
          </section>
        </div>
        <UploadAnalyticsModal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          onUpload={handleModalUpload}
        />
      </main>
    </div>
  );
}

export default App;
