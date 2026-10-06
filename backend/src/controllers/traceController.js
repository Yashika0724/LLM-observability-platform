import Application from "../models/Application.js";
import Trace from "../models/Trace.js";

async function getUserApplicationIds(userId) {
  const applications = await Application.find({ owner: userId }).select("_id");
  return applications.map((application) => application._id);
}

export async function listTraces(req, res) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const applicationIds = await getUserApplicationIds(req.user.id);
  const filter = { application: { $in: applicationIds }, model: { $ne: null } };

  const traces = await Trace.find(filter)
    .select("-spans")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  const total = await Trace.countDocuments(filter);

  res.json({ traces, total, page, limit });
}

export async function getTrace(req, res) {
  const applicationIds = await getUserApplicationIds(req.user.id);
  const trace = await Trace.findOne({
    traceId: req.params.traceId,
    application: { $in: applicationIds },
  });

  if (!trace) {
    return res.status(404).json({ error: "Trace not found" });
  }

  res.json(trace);
}
