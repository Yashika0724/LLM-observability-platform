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

// Sum of the costs we know; null if none of the traces has a known cost
export function totalCostUsd(traces) {
  const known = traces.filter((t) => t.cost !== null);
  if (traces.length > 0 && known.length === 0) return null;
  return known.reduce((acc, t) => acc + t.cost, 0);
}

// null cost = model is not in the backend's price table
export function formatCost(cost) {
  return cost === null ? "–" : `$${cost.toFixed(4)}`;
}

export function errorRate(traces) {
  if (traces.length === 0) return "0%";
  const errors = traces.filter((t) => t.status === "error").length;
  return `${Math.round((errors / traces.length) * 100)}%`;
}
