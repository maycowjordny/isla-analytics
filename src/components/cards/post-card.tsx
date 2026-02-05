import { ExternalLink, Eye, MessageSquare } from "lucide-react";

type TopPost = {
  id: string;
  preview: string;
  date: string;
  impressions: number;
  engagements: number;
  engagementRate: number;
  url: string;
};

export function PostCard({ post, rank }: { post: TopPost; rank: number }) {
  return (
    <div className="leaderboard-item group">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-bold text-muted-foreground">
        {rank}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground font-medium truncate mb-1">
          {post.preview}
        </p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>{post.date}</span>
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {post.impressions.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            {post.engagements}
          </span>
          <span className="text-primary font-medium">
            {post.engagementRate.toFixed(2)}% ER
          </span>
        </div>
      </div>

      <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-muted rounded-lg">
        <ExternalLink className="w-4 h-4 text-muted-foreground" />
      </button>
    </div>
  );
}
