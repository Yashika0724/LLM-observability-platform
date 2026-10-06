export function totalTraces(traces) {
  return traces.length;
}

export function avgLatencyMs(traces) {
  if (traces.length === 0) return 0;
  const sum = traces.reduce((acc, t) => acc + t.durationMs, 0);
  return Math.round(sum / traces.length);
}

export function totalTokens(traces) {
  return traces.reduce((acc, t) => acc + t.tokenUsage.total, 0);
}

export function totalCostUsd(traces) {
  const sum = traces.reduce((acc, t) => acc + t.cost, 0);
  return sum.toFixed(4);
}

export function errorRate(traces) {
  if (traces.length === 0) return "0%";
  const errors = traces.filter((t) => t.status === "error").length;
  return `${Math.round((errors / traces.length) * 100)}%`;
}
