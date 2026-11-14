import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import ingestRoutes from "./routes/ingestRoutes.js";
import traceRoutes from "./routes/traceRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev")); // request logs

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Dashboard routes (JWT)
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/traces", traceRoutes);
app.use("/api/admin", adminRoutes);

// Trace ingestion (API key)
app.use("/v1", ingestRoutes);

export default app;
