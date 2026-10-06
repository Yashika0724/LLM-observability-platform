import express from "express";
import { ingestTraces } from "../controllers/ingestController.js";
import { requireApiKey } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/traces",
  express.raw({ type: "application/x-protobuf", limit: "5mb" }),
  requireApiKey,
  ingestTraces
);

export default router;
