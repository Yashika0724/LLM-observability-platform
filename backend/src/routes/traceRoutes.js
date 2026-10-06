import express from "express";
import { listTraces, getTrace } from "../controllers/traceController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, listTraces);
router.get("/:traceId", protect, getTrace);

export default router;
