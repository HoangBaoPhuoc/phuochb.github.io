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

async function createAccount() {
  try {
    console.log("🔐 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Hiển thị tất cả users hiện có
    const users = await User.find({}, "username createdAt");
    console.log("\n📋 Existing users:");
    if (users.length === 0) {
      console.log("  (No users yet)");
    } else {
      users.forEach((user, index) => {
        console.log(
          `${index + 1}. ${user.username} (created: ${user.createdAt})`,
        );
      });
    }

    console.log("\n=== CREATE NEW ACCOUNT ===\n");

    const username = await question("Enter new username: ");

    // Kiểm tra username đã tồn tại
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log("❌ Username already exists!");
      process.exit(1);
    }

    const password = await question("Enter password (min 6 chars): ");

    if (password.length < 6) {
      console.log("❌ Password must be at least 6 characters!");
      process.exit(1);
    }

    const confirmPassword = await question("Confirm password: ");

    if (password !== confirmPassword) {
      console.log("❌ Passwords do not match!");
      process.exit(1);
    }

    // Hash mật khẩu
    const passwordHash = await bcrypt.hash(password, 10);

    // Tạo user mới
    await User.create({ username, passwordHash });

    console.log("\n✅ Account created successfully!");
    console.log(`👤 Username: ${username}`);
    console.log(`🔑 Password: ${password}`);
    console.log("\n🎉 You can now login with these credentials!");
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    rl.close();
    await mongoose.disconnect();
    process.exit(0);
  }
}

createAccount();
