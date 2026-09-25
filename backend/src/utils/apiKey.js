import crypto from "crypto";

export function generateApiKey() {
  return "obs_" + crypto.randomBytes(24).toString("hex");
}

export function hashApiKey(key) {
  return crypto.createHash("sha256").update(key).digest("hex");
}
