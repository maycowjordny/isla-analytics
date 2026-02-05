import { format, parseISO } from "date-fns";
import { Users } from "lucide-react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface FollowerChartProps {
  data: { date: string; newFollowers: number; totalFollowers: number }[];
  totalFollowers: number;
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
            {item.name === "Cumulative"
              ? item.value.toLocaleString()
              : `+${item.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function FollowerChart({ data, totalFollowers }: FollowerChartProps) {
  const startFollowers =
    totalFollowers - data.reduce((sum, d) => sum + d.newFollowers, 0);

  let cumulative = startFollowers;

  const chartData = data.map((d) => {
    cumulative += d.newFollowers;
    return {
      ...d,
      date: format(parseISO(d.date), "MMM d"),
      cumulative,
    };
  });

  return (
    <div
      className="chart-card animate-fade-in "
      style={{ animationDelay: "300ms" }}
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Follower Growth
          </h3>
          <p className="text-sm text-muted-foreground">
            Daily new followers and cumulative total
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary">
          <Users className="w-4 h-4" />
          <span className="text-sm font-semibold">
            {data
              .reduce((sum, d) => sum + d.totalFollowers, 0)
              .toLocaleString()}
          </span>
        </div>
      </div>

      <div className="h-90">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
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
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={["dataMin - 20", "dataMax + 20"]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              yAxisId="left"
              dataKey="newFollowers"
              fill="hsl(var(--chart-primary))"
              radius={[4, 4, 0, 0]}
              name="New Followers"
              barSize={32}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="cumulative"
              stroke="hsl(var(--chart-secondary))"
              strokeWidth={2}
              dot={{
                fill: "hsl(var(--chart-secondary))",
                strokeWidth: 0,
                r: 3,
              }}
              name="Cumulative"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
