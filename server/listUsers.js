import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import User from "./models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env từ thư mục gốc
dotenv.config({ path: path.join(__dirname, "..", ".env") });

async function listUsers() {
  try {
    console.log("🔐 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    const users = await User.find({}, "username createdAt updatedAt");

    console.log("=== ALL USERS ===\n");

    if (users.length === 0) {
      console.log("❌ No users found in database");
    } else {
      console.log(`Total users: ${users.length}\n`);
      users.forEach((user, index) => {
        console.log(`${index + 1}. 👤 ${user.username}`);
        console.log(`   Created: ${user.createdAt}`);
        console.log(`   Updated: ${user.updatedAt}`);
        console.log("");
      });
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

listUsers();
