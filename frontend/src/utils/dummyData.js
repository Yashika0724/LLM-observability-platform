// Placeholder per-model summary stats for the top model cards.
export const modelStats = [
  {
    name: "gpt-4o-mini",
    metricLabel: "Avg Latency",
    metricValue: "483 ms",
    trend: "-6.2%",
    trendDirection: "down",
    color: "#818cf8",
    sparkline: [520, 505, 495, 470, 460, 483],
  },
  {
    name: "gpt-4o",
    metricLabel: "Avg Cost / call",
    metricValue: "$0.011",
    trend: "+3.4%",
    trendDirection: "up",
    color: "#f472b6",
    sparkline: [0.008, 0.009, 0.0095, 0.010, 0.0105, 0.011],
  },
  {
    name: "All Models",
    metricLabel: "Error Rate",
    metricValue: "16.6%",
    trend: "-2.1%",
    trendDirection: "down",
    color: "#34d399",
    sparkline: [22, 20, 19, 18, 17, 16.6],
  },
];
