import User from "../models/User.js";
import Application from "../models/Application.js";
import Trace from "../models/Trace.js";

// Platform-wide numbers (all users, not just one)
export async function getPlatformStats(req, res) {
  const [users, applications, traces, cost] = await Promise.all([
    User.countDocuments(),
    Application.countDocuments(),
    Trace.countDocuments({ model: { $ne: null } }),
    Trace.aggregate([{ $group: { _id: null, total: { $sum: "$cost" } } }]),
  ]);

  res.json({ users, applications, traces, totalCost: cost[0]?.total ?? 0 });
}

export async function listUsers(req, res) {
  const users = await User.find().select("name email role createdAt").sort({ createdAt: -1 });
  res.json(users);
}

export async function updateUserRole(req, res) {
  const { role } = req.body;
  if (!["developer", "admin"].includes(role)) {
    return res.status(400).json({ error: "Role must be developer or admin" });
  }
  // Stops an admin from removing their own access by mistake
  if (req.params.id === req.user.id) {
    return res.status(400).json({ error: "You cannot change your own role" });
  }

  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select(
    "name email role createdAt"
  );
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(user);
}
