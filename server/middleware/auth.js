import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Validate JWT structure bảo mật
    if (!payload.jti || !payload.sessionId) {
      return res.status(401).json({ message: "Invalid token structure" });
    }

    if (payload.tokenType !== "access") {
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
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};
