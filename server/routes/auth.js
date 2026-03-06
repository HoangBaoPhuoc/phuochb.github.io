import { Router } from "express";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ username, passwordHash });

    return res.status(201).json({ message: "Account created successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to create account", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Tạo JWT với payload bảo mật
    const jti = randomUUID(); // Unique JWT ID
    const sessionId = randomUUID(); // Session tracking ID
    const issuedAt = Math.floor(Date.now() / 1000); // Unix timestamp

    // Metadata bảo mật
    const clientIp =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
    const userAgent = req.headers["user-agent"] || "unknown";

    const payload = {
      // User identity
      userId: user._id.toString(),
      username: user.username,

      // Token metadata
      jti, // Unique identifier cho token này
      sessionId, // Session identifier
      tokenType: "access", // Token type

      // Security metadata
      iat: issuedAt, // Issued at timestamp
      ip: clientIp.substring(0, 45), // Lưu IP (giới hạn độ dài)
      ua: userAgent.substring(0, 100), // User agent (giới hạn độ dài)
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    });

    return res.json({
      token,
      user: { username: user.username },
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Login failed", error: error.message });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  return res.json({ user: { username: req.user.username } });
});

// Debug endpoint: Xem full JWT payload (để kiểm tra bảo mật)
router.get("/debug-token", requireAuth, async (req, res) => {
  const expiresAt = new Date(req.user.exp * 1000);
  const issuedAt = new Date(req.user.iat * 1000);
  const now = new Date();
  const timeLeft = Math.floor((expiresAt - now) / 1000 / 60); // phút còn lại

  return res.json({
    tokenInfo: {
      jti: req.user.jti,
      sessionId: req.user.sessionId,
      tokenType: req.user.tokenType,
      username: req.user.username,
      userId: req.user.userId,
    },
    timestamps: {
      issuedAt: issuedAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      timeLeftMinutes: timeLeft > 0 ? timeLeft : 0,
      isExpired: now > expiresAt,
    },
    securityMetadata: {
      originalIp: req.user.ip,
      currentIp:
        req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown",
      ipChanged:
        req.user.ip !==
        (req.headers["x-forwarded-for"] ||
          req.socket.remoteAddress ||
          "unknown"),
      userAgent: req.user.ua,
    },
  });
});

export default router;
