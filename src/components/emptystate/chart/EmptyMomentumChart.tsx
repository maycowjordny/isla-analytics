import { BarChart3 } from "lucide-react";

export function EmptyMomentumChart() {
  return (
    <div className="h-80 flex flex-col items-center justify-center text-muted-foreground">
      <BarChart3 className="w-10 h-10 mb-3 opacity-40" />
      <p className="text-sm font-medium">Not enough data available</p>
      <p className="text-xs mt-1">
        Momentum data will appear here once there's enough activity.
      </p>
    </div>
  );
}
