export const calculateGrowth = <T extends { metric_date: string }>(
  data: T[],
  key: keyof T,
  referenceDate: Date,
) => {
  const current = data
    .filter((d) => new Date(d.metric_date) >= referenceDate)
    .reduce((acc, curr) => acc + (Number(curr[key]) || 0), 0);

  const previous = data
    .filter((d) => new Date(d.metric_date) < referenceDate)
    .reduce((acc, curr) => acc + (Number(curr[key]) || 0), 0);

  const growth = previous > 0 ? ((current - previous) / previous) * 100 : 0;

  return {
    total: current,
    previous: previous,
    percentageChange: growth.toFixed(2),
    isPositive: growth >= 0,
  };
};
