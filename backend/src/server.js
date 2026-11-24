import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";
import { connectQueue } from "./utils/queue.js";

dotenv.config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

// Connect DB first, then start server
async function start() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");
  await connectQueue();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();
