import { Lightbulb } from "lucide-react";

export function EmptyInsightSection() {
  return (
    <div className="flex flex-col items-center justify-center text-muted-foreground py-10">
      <Lightbulb className="w-10 h-10 mb-3 opacity-40" />
      <p className="text-sm font-medium">No insights available</p>
      <p className="text-xs mt-1">
        Insights will appear here once there's enough data to analyze.
      </p>
    </div>
  );
}
