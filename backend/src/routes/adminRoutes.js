import express from "express";
import { getPlatformStats, listUsers, updateUserRole } from "../controllers/adminController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(protect, authorize("admin")); // every route below is admin-only

router.get("/stats", getPlatformStats);
router.get("/users", listUsers);
router.patch("/users/:id/role", updateUserRole);

export default router;
