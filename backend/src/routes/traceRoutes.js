import express from "express";
import { listTraces, getModelStats, getEvaluations, exportTraces, getTrace } from "../controllers/traceController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, listTraces);
router.get("/stats", protect, getModelStats); // must be above /:traceId
router.get("/evaluations", protect, getEvaluations);
router.get("/export", protect, exportTraces);
router.get("/:traceId", protect, getTrace);

export default router;
