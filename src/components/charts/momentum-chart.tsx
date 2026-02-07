import { format, parseISO } from "date-fns";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { EmptyMomentumChart } from "../emptystate/chart/EmptyMomentumChart";

interface MomentumChartProps {
  data: {
    date: string;
    impressions: number;
    engagements: number;
    er: number;
  }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground mb-2">{label}</p>
        {payload.map((item: any, index: number) => (
          <p key={index} className="text-sm text-muted-foreground">
            <span className="font-medium" style={{ color: item.color }}>
              {item.name}:
            </span>{" "}
            {item.value.toLocaleString()}
            {item.name === "ER" ? "%" : ""}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function MomentumChart({ data }: MomentumChartProps) {
  const hasData = data && data.length > 0;

  const chartData = hasData
    ? data.map((d) => ({
        ...d,
        date: format(parseISO(d.date), "MMM d"),
      }))
    : [];

  return (
    <div
      className="chart-card animate-fade-in"
      style={{ animationDelay: "200ms" }}
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-1">
          Daily Momentum
        </h3>
        <p className="text-sm text-muted-foreground">
          Impressions, engagements, and engagement rate over the week
        </p>
      </div>

      {!hasData ? (
        <EmptyMomentumChart />
      ) : (
        <>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="impressionsGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="hsl(var(--chart-primary))"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="100%"
                      stopColor="hsl(var(--chart-primary))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  yAxisId="left"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="impressions"
                  stroke="hsl(var(--chart-primary))"
                  strokeWidth={2}
                  fill="url(#impressionsGradient)"
                  name="Impressions"
                />
                <Bar
                  yAxisId="right"
                  dataKey="engagements"
                  fill="hsl(var(--chart-secondary))"
                  radius={[4, 4, 0, 0]}
                  name="Engagements"
                  barSize={24}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="engagementRate"
                  stroke="hsl(var(--chart-accent))"
                  strokeWidth={2}
                  dot={{
                    fill: "hsl(var(--chart-accent))",
                    strokeWidth: 0,
                    r: 4,
                  }}
                  name="ER"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-chart-primary" />
              <span className="text-xs text-muted-foreground">Impressions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-chart-secondary" />
              <span className="text-xs text-muted-foreground">Engagements</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-chart-accent" />
              <span className="text-xs text-muted-foreground">ER %</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
