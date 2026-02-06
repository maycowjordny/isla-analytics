import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";

interface KPICardProps {
  label: string;
  value: string | number;
  delta?: number;
  deltaLabel?: string;
  suffix?: string;
  icon?: React.ReactNode;
  delay?: number;
  description?: string;
}

export function KPICard({
  label,
  value,
  delta,
  deltaLabel = "vs last week",
  suffix,
  icon,
  delay = 0,
}: KPICardProps) {
  const isPositive = delta !== undefined && delta > 0;
  const isNegative = delta !== undefined && delta < 0;
  const isNeutral = delta === 0;

  return (
    <>
      <div
        className="kpi-card animate-fade-in cursor-pointer hover:border-primary/30 transition-colors"
        style={{ animationDelay: `${delay}ms` }}
      >
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-3">
            <span className="metric-label">{label}</span>
            {icon && <div className="text-muted-foreground">{icon}</div>}
          </div>

          <div className="flex items-baseline gap-1">
            <span className="metric-value">{value}</span>
            {suffix && (
              <span className="text-lg text-muted-foreground">{suffix}</span>
            )}
          </div>

          {delta !== undefined && (
            <div className="flex items-center gap-1.5 mt-3">
              <div
                className={cn(
                  "flex items-center gap-0.5 text-sm font-medium",
                  isPositive && "delta-positive",
                  isNegative && "delta-negative",
                  isNeutral && "text-muted-foreground",
                )}
              >
                {isPositive && <ArrowUp className="w-3.5 h-3.5" />}
                {isNegative && <ArrowDown className="w-3.5 h-3.5" />}
                {isNeutral && <Minus className="w-3.5 h-3.5" />}
                <span>
                  {isPositive ? "+" : ""}
                  {delta}
                  {typeof delta === "number" && delta % 1 !== 0 ? "pp" : "%"}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {deltaLabel}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
