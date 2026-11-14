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
        totalCost: { $sum: "$cost" },
        recentLatencies: { $lastN: { input: "$durationMs", n: 10 } }, // for the small chart
      },
    },
    { $sort: { calls: -1 } },
    { $limit: 3 },
  ]);

  res.json(stats);
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
