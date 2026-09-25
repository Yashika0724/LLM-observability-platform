import express from "express";
import { createApplication, listApplications } from "../controllers/applicationController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createApplication);
router.get("/", protect, listApplications);

export default router;
