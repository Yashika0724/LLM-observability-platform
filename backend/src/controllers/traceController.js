import Application from "../models/Application.js";
import Trace from "../models/Trace.js";

// User's own app ids
async function getUserApplicationIds(userId) {
  const applications = await Application.find({ owner: userId }).select("_id");
  return applications.map((application) => application._id);
}

export async function listTraces(req, res) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const { status, model, q } = req.query;

  const applicationIds = await getUserApplicationIds(req.user.id);
  const baseFilter = { application: { $in: applicationIds }, model: { $ne: null } };
  const filter = { ...baseFilter };
  if (status) filter.status = status;
  if (model) filter.model = model;
  if (q) {
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // treat search text as plain text, not regex
    filter.input = { $regex: escaped, $options: "i" };
  }

  const traces = await Trace.find(filter)
    .select("-spans") // smaller response
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit) // pagination
    .limit(limit);
  const total = await Trace.countDocuments(filter);
  const models = await Trace.distinct("model", baseFilter); // for the model filter dropdown
  console.log(`[dashboard] sending ${traces.length} of ${total} traces (page ${page})`);

  res.json({ traces, total, page, limit, models });
}

// One row per model, busiest first
export async function getModelStats(req, res) {
  const applicationIds = await getUserApplicationIds(req.user.id);

  const stats = await Trace.aggregate([
    { $match: { application: { $in: applicationIds }, model: { $ne: null } } },
    { $sort: { createdAt: 1 } },
    {
      $group: {
        _id: "$model",
        calls: { $sum: 1 },
        errors: { $sum: { $cond: [{ $eq: ["$status", "error"] }, 1, 0] } },
        avgLatencyMs: { $avg: "$durationMs" },
        totalTokens: { $sum: "$tokenUsage.total" },
        totalCost: { $sum: "$cost" }, // $sum skips unknown (null) costs
        pricedCalls: { $sum: { $cond: [{ $eq: ["$cost", null] }, 0, 1] } },
        recentLatencies: { $lastN: { input: "$durationMs", n: 10 } }, // for the small chart
      },
    },
    { $sort: { calls: -1 } },
    { $limit: 3 },
  ]);

  res.json(stats);
}

// Quality scores from the evaluation service
export async function getEvaluations(req, res) {
  const applicationIds = await getUserApplicationIds(req.user.id);
  const evaluated = { application: { $in: applicationIds }, "evaluation.score": { $ne: null } };

  const scores = await Trace.aggregate([
    { $match: evaluated },
    { $group: { _id: "$evaluation.score", count: { $sum: 1 } } },
  ]);
  const recent = await Trace.find(evaluated)
    .select("traceId input model evaluation createdAt")
    .sort({ createdAt: -1 })
    .limit(20);

  // scoreCounts[0] = how many got 1/5, ..., scoreCounts[4] = how many got 5/5
  const scoreCounts = [0, 0, 0, 0, 0];
  for (const { _id, count } of scores) scoreCounts[_id - 1] = count;

  const total = scoreCounts.reduce((sum, n) => sum + n, 0);
  const scoreSum = scoreCounts.reduce((sum, n, i) => sum + n * (i + 1), 0);
  const averageScore = total ? Number((scoreSum / total).toFixed(2)) : null;

  res.json({ total, averageScore, scoreCounts, recent });
}

// Daily cost and average quality score for the last 14 days
export async function getTrends(req, res) {
  const applicationIds = await getUserApplicationIds(req.user.id);
  const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

  const days = await Trace.aggregate([
    { $match: { application: { $in: applicationIds }, model: { $ne: null }, createdAt: { $gte: since } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        cost: { $sum: "$cost" },
        pricedTraces: { $sum: { $cond: [{ $eq: ["$cost", null] }, 0, 1] } },
        avgScore: { $avg: "$evaluation.score" }, // $avg skips traces not yet evaluated
      },
    },
    // No known cost that day -> null, so the chart shows a gap instead of $0
    { $set: { cost: { $cond: [{ $gt: ["$pricedTraces", 0] }, "$cost", null] } } },
    { $sort: { _id: 1 } },
  ]);

  res.json(days);
}

// Wrap in quotes so commas and quotes inside text don't break the CSV
function csvCell(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

export async function exportTraces(req, res) {
  const applicationIds = await getUserApplicationIds(req.user.id);
  const traces = await Trace.find({ application: { $in: applicationIds }, model: { $ne: null } })
    .select("-spans")
    .sort({ createdAt: -1 });

  const header = "time,model,prompt,status,latency_ms,tokens,cost_usd,quality_score";
  const rows = traces.map((t) =>
    [
      t.createdAt.toISOString(),
      t.model,
      t.input,
      t.status,
      t.durationMs,
      t.tokenUsage.total,
      t.cost,
      t.evaluation?.score,
    ]
      .map(csvCell)
      .join(",")
  );

  res.attachment("traces.csv"); // tells the browser to download it
  res.type("text/csv");
  res.send([header, ...rows].join("\n"));
}

export async function getTrace(req, res) {
  const applicationIds = await getUserApplicationIds(req.user.id);
  // Must belong to user's app
  const trace = await Trace.findOne({
    traceId: req.params.traceId,
    application: { $in: applicationIds },
  });

  if (!trace) {
    return res.status(404).json({ error: "Trace not found" });
  }

  res.json(trace);
}
