import { FileText } from "lucide-react";

export function EmptyPostList() {
  return (
    <div className="h-50 flex flex-col items-center justify-center text-muted-foreground">
      <FileText className="w-10 h-10 mb-3 opacity-40" />
      <p className="text-sm font-medium">Not enough data available</p>
      <p className="text-xs mt-1">
        Top posts will appear here once there's enough activity.
      </p>
    </div>
  );
}
