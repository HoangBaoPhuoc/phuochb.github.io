import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import readline from "readline";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env từ thư mục gốc
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

async function changePassword() {
  try {
    console.log("🔐 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Hiển thị tất cả users hiện có
    const users = await User.find({}, "username createdAt");
    console.log("\n📋 Existing users:");
    users.forEach((user, index) => {
      console.log(
        `${index + 1}. ${user.username} (created: ${user.createdAt})`,
      );
    });

    console.log("\n=== CHANGE PASSWORD ===\n");

    const username = await question("Enter username: ");

    const user = await User.findOne({ username });
    if (!user) {
      console.log("❌ User not found!");
      process.exit(1);
    }

    const newPassword = await question("Enter new password (min 6 chars): ");

    if (newPassword.length < 6) {
      console.log("❌ Password must be at least 6 characters!");
      process.exit(1);
    }

    const confirmPassword = await question("Confirm new password: ");

    if (newPassword !== confirmPassword) {
      console.log("❌ Passwords do not match!");
      process.exit(1);
    }

    // Hash mật khẩu mới
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Cập nhật
    await User.updateOne({ username }, { passwordHash });

    console.log("\n✅ Password changed successfully!");
    console.log(`👤 Username: ${username}`);
    console.log(`🔑 New password: ${newPassword}`);
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    rl.close();
    await mongoose.disconnect();
    process.exit(0);
  }
}

changePassword();
