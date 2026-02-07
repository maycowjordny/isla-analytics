import { PieChart } from "lucide-react";

export function EmptyDemographicList() {
  return (
    <div className="py-10 flex flex-col items-center justify-center text-muted-foreground">
      <PieChart className="w-10 h-10 mb-3 opacity-40" />
      <p className="text-sm font-medium">Not enough data available</p>
      <p className="text-xs mt-1">
        Demographic data will appear here once there's enough activity.
      </p>
    </div>
  );
}
