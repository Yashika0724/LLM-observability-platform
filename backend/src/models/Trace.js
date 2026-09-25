import mongoose from "mongoose";

const spanSchema = new mongoose.Schema(
  {
    spanId: { type: String, required: true },
    parentSpanId: { type: String, default: null },
    name: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    durationMs: { type: Number, required: true },
    status: { type: String, enum: ["success", "error"], default: "success" },
    attributes: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

const traceSchema = new mongoose.Schema(
  {
    traceId: { type: String, required: true, unique: true },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },
    userId: { type: String, default: null },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    durationMs: { type: Number, required: true },
    status: { type: String, enum: ["success", "error"], default: "success" },
    error: { type: String, default: null },
    model: { type: String, default: null },
    input: { type: String, default: null },
    output: { type: String, default: null },
    tokenUsage: {
      prompt: { type: Number, default: 0 },
      completion: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    },
    cost: { type: Number, default: 0 },
    spans: [spanSchema],
    evaluation: {
      score: { type: Number, default: null },
      rationale: { type: String, default: null },
    },
  },
  { timestamps: true }
);

traceSchema.index({ application: 1, createdAt: -1 });

const Trace = mongoose.model("Trace", traceSchema);

export default Trace;
