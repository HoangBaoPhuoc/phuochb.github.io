import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import authRoutes from "./routes/auth.js";
import letterRoutes from "./routes/letter.js";
import contentRoutes from "./routes/content.js";
import User from "./models/User.js";

const app = express();
const PORT = process.env.PORT || 4000;

const extraOrigins = (process.env.FRONTEND_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://phuochb.id.vn",
  "https://phuochb.github.io",
  ...extraOrigins,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/letter", letterRoutes);
app.use("/api/content", contentRoutes);

const ensureAdminAccount = async () => {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUsername || !adminPassword) {
    return;
  }

  const existingAdmin = await User.findOne({ username: adminUsername });
  if (existingAdmin) {
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await User.create({ username: adminUsername, passwordHash });
  console.log(`Seeded admin account: ${adminUsername}`);
};

const start = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not configured");
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    await ensureAdminAccount();
    app.listen(PORT, () => {
      console.log(`Auth API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

start();
