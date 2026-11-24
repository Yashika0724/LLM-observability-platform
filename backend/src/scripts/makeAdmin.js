// Usage: npm run make-admin -- someone@example.com
// The first admin has to be created from the terminal, since only admins can change roles.
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";

dotenv.config();

const email = process.argv[2];
await mongoose.connect(process.env.MONGODB_URI);

const user = await User.findOneAndUpdate({ email }, { role: "admin" }, { new: true });
console.log(user ? `${user.email} is now an admin` : `No user with email ${email}`);

await mongoose.disconnect();
