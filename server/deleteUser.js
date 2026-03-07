import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
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

async function deleteUser() {
  try {
    console.log("🔐 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Hiển thị tất cả users hiện có
    const users = await User.find({}, "username createdAt");
    console.log("\n📋 Existing users:");
    if (users.length === 0) {
      console.log("  (No users found)");
      process.exit(0);
    }

    users.forEach((user, index) => {
      console.log(
        `${index + 1}. ${user.username} (created: ${user.createdAt})`,
      );
    });

    console.log("\n=== DELETE USER ===\n");

    const username = await question("Enter username to delete: ");

    const user = await User.findOne({ username });
    if (!user) {
      console.log("❌ User not found!");
      process.exit(1);
    }

    const confirm = await question(
      `⚠️  Are you sure you want to delete user '${username}'? (yes/no): `,
    );

    if (confirm.toLowerCase() !== "yes") {
      console.log("❌ Deletion cancelled");
      process.exit(0);
    }

    // Xóa user
    await User.deleteOne({ username });

    console.log(`\n✅ User '${username}' deleted successfully!`);
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    rl.close();
    await mongoose.disconnect();
    process.exit(0);
  }
}

deleteUser();
