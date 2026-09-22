// Placeholder demo data only — Week 2 replaces this with traces fetched
// from the backend tracing API and stored in MongoDB.
export const dummyTraces = [
  { id: 1, prompt: "Summarize this support ticket", model: "gpt-4o-mini", tokens: 320, latencyMs: 640, costUsd: 0.0021, status: "success", timestamp: "2026-09-15 10:02" },
  { id: 2, prompt: "Generate SQL from natural language", model: "gpt-4o", tokens: 512, latencyMs: 980, costUsd: 0.0087, status: "success", timestamp: "2026-09-15 10:05" },
  { id: 3, prompt: "Classify sentiment of review", model: "gpt-4o-mini", tokens: 180, latencyMs: 410, costUsd: 0.0009, status: "success", timestamp: "2026-09-15 10:09" },
  { id: 4, prompt: "Extract entities from contract clause", model: "gpt-4o", tokens: 764, latencyMs: 1240, costUsd: 0.0132, status: "error", timestamp: "2026-09-15 10:12" },
  { id: 5, prompt: "Draft follow-up email", model: "gpt-4o-mini", tokens: 275, latencyMs: 530, costUsd: 0.0016, status: "success", timestamp: "2026-09-15 10:18" },
  { id: 6, prompt: "Translate product description", model: "gpt-4o-mini", tokens: 210, latencyMs: 470, costUsd: 0.0012, status: "success", timestamp: "2026-09-15 10:22" },
];

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
