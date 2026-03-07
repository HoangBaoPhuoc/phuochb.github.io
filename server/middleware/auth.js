import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  console.log("🔐 Auth check - Token exists:", !!token);

  if (!token) {
    console.log("❌ No token provided");
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token verified, user:", payload.username);

    // Validate JWT structure bảo mật
    if (!payload.jti || !payload.sessionId) {
      console.log("❌ Invalid token structure - missing jti or sessionId");
      return res.status(401).json({ message: "Invalid token structure" });
    }

    if (payload.tokenType !== "access") {
      console.log("❌ Invalid token type:", payload.tokenType);
      return res.status(401).json({ message: "Invalid token type" });
    }

    // Optional: Warning nếu IP thay đổi (không block vì user có thể đổi network)
    const currentIp =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
    if (
      payload.ip &&
      currentIp !== payload.ip &&
      process.env.LOG_SECURITY === "true"
    ) {
      console.warn(
        `⚠️  IP changed for user ${payload.username}: ${payload.ip} → ${currentIp}`,
      );
    }

    req.user = payload;
    return next();
  } catch (error) {
    console.log("❌ Token verification failed:", error.message);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};
