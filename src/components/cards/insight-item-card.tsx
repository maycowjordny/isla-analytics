import { Loader2 } from "lucide-react";

type InsightItemProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  loading?: boolean;
};

export function InsightItem({
  icon,
  title,
  description,
  loading,
}: InsightItemProps) {
  return (
    <div className="flex gap-4 py-6 first:pt-0 last:pb-0 border-b last:border-0 border-slate-100">
      <div className="shrink-0 w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 border border-slate-100">
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : icon}
      </div>
      <div className="space-y-1">
        <h4 className="font-semibold text-slate-900 text-sm">{title}</h4>
        <p className="text-slate-500 text-sm leading-relaxed">
          {loading ? "Analyzing your data..." : description}
        </p>
      </div>
    </div>
  );
}
