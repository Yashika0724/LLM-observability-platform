import { createClient } from "redis";

let redis;

export async function connectQueue() {
  redis = createClient({ url: process.env.REDIS_URL });
  await redis.connect();
  console.log("Connected to Redis");
}

// The evaluation service picks jobs from this list
export async function addEvalJob(traceId) {
  await redis.lPush("eval_jobs", traceId);
}
