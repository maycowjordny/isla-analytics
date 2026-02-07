import { Users } from "lucide-react";

export function EmptyFollowerChart() {
  return (
    <div className="h-90 flex flex-col items-center justify-center text-muted-foreground">
      <Users className="w-10 h-10 mb-3 opacity-40" />
      <p className="text-sm font-medium">Not enough data available</p>
      <p className="text-xs mt-1">
        Follower growth data will appear here once there's enough activity.
      </p>
    </div>
  );
}
