import Application from "../models/Application.js";
import { generateApiKey, hashApiKey } from "../utils/apiKey.js";

export async function createApplication(req, res) {
  const { name } = req.body;

  const rawKey = generateApiKey();
  const application = await Application.create({
    name,
    owner: req.user.id,
    keyHash: hashApiKey(rawKey),
    keyPreview: rawKey.slice(-4),
  });

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
