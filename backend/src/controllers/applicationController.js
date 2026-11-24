import Application from "../models/Application.js";
import { generateApiKey, hashApiKey } from "../utils/apiKey.js";

export async function createApplication(req, res) {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "App name is required" });
  }

  const rawKey = generateApiKey();
  const application = await Application.create({
    name,
    owner: req.user.id,
    keyHash: hashApiKey(rawKey), // store hash only
    keyPreview: rawKey.slice(-4),
  });

  // Raw key shown only once
  res.status(201).json({
    id: application._id,
    name: application.name,
    apiKey: rawKey,
  });
}

export async function listApplications(req, res) {
  const applications = await Application.find({ owner: req.user.id }).select(
    "name keyPreview createdAt"
  );
  res.json(applications);
}
