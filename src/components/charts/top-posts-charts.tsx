import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp } from "lucide-react";
import { PostCard } from "../cards/post-card";

type TopPost = {
  id: string;
  preview: string;
  date: string;
  impressions: number;
  engagements: number;
  engagementRate: number;
  url: string;
};

type TopPostsProps = {
  byEngagement: TopPost[];
  byImpressions: TopPost[];
};

export function TopPosts({ byEngagement, byImpressions }: TopPostsProps) {
  return (
    <div
      className="chart-card animate-fade-in"
      style={{ animationDelay: "400ms" }}
    >
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">
          Top Content This Week
        </h3>
      </div>

      <Tabs defaultValue="engagement" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="engagement">By Engagement</TabsTrigger>
          <TabsTrigger value="impressions">By Impressions</TabsTrigger>
        </TabsList>

        <TabsContent value="engagement">
          <ScrollArea className="h-50">
            <div className="space-y-3 pr-4">
              {byEngagement.map((post, index) => (
                <PostCard key={post.id} post={post} rank={index + 1} />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="impressions">
          <ScrollArea className="h-50">
            <div className="space-y-3 pr-4">
              {byImpressions.map((post, index) => (
                <PostCard key={post.id} post={post} rank={index + 1} />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
