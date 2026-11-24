import jwt from "jsonwebtoken";
import Application from "../models/Application.js";
import { hashApiKey } from "../utils/apiKey.js";

// Users: verify JWT
export function protect(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// Apps: verify API key
export async function requireApiKey(req, res, next) {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey) {
    return res.status(401).json({ error: "No API key provided" });
  }

  // Look up by hash (raw keys aren't stored)
  const application = await Application.findOne({ keyHash: hashApiKey(apiKey) });
  if (!application) {
    return res.status(401).json({ error: "Invalid API key" });
  }

  console.log(`[ingest] API key OK -> app "${application.name}"`);
  req.application = application;
  next();
}

// RBAC: allow only given roles
export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}
