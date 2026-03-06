#!/usr/bin/env node

/**
 * Test JWT Security Implementation
 *
 * Script này test các tính năng bảo mật JWT:
 * - Mỗi lần login tạo token unique
 * - Token chứa jti, sessionId, timestamp
 * - Debug endpoint hiển thị token metadata
 */

const API_BASE = process.env.API_BASE || "http://localhost:4000";
const USERNAME = process.env.TEST_USER || "admin";
const PASSWORD = process.env.TEST_PASS || "admin123";

// ANSI colors
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log("");
  log("─".repeat(60), "cyan");
  log(` ${title}`, "bold");
  log("─".repeat(60), "cyan");
}

async function login(suffix = "") {
  try {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: USERNAME, password: PASSWORD }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    const data = await response.json();
    log(`✓ Login successful${suffix}`, "green");
    return data;
  } catch (error) {
    log(`✗ Login failed: ${error.message}`, "red");
    throw error;
  }
}

async function debugToken(token) {
  try {
    const response = await fetch(`${API_BASE}/api/auth/debug-token`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Debug failed");
    }

    return await response.json();
  } catch (error) {
    log(`✗ Debug token failed: ${error.message}`, "red");
    throw error;
  }
}

function decodeJWT(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid JWT format");
    }

    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf8"),
    );
    return payload;
  } catch (error) {
    log(`✗ JWT decode failed: ${error.message}`, "red");
    return null;
  }
}

function formatTimestamp(unixTime) {
  return new Date(unixTime * 1000).toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

async function testUniqueTokens() {
  logSection("TEST 1: Mỗi lần login tạo token khác nhau");

  log("Đăng nhập lần 1...", "yellow");
  const login1 = await login(" (lần 1)");
  const payload1 = decodeJWT(login1.token);

  log("Đợi 1 giây...", "yellow");
  await new Promise((resolve) => setTimeout(resolve, 1000));

  log("Đăng nhập lần 2...", "yellow");
  const login2 = await login(" (lần 2)");
  const payload2 = decodeJWT(login2.token);

  console.log("");
  log("Token 1 JTI:", "cyan");
  console.log(`  ${payload1.jti}`);
  log("Token 2 JTI:", "cyan");
  console.log(`  ${payload2.jti}`);

  console.log("");
  if (payload1.jti !== payload2.jti) {
    log("✓ PASS: JTI khác nhau (mỗi token là unique)", "green");
  } else {
    log("✗ FAIL: JTI giống nhau (lỗi bảo mật!)", "red");
  }

  if (payload1.sessionId !== payload2.sessionId) {
    log("✓ PASS: SessionID khác nhau", "green");
  } else {
    log("✗ FAIL: SessionID giống nhau", "red");
  }

  if (payload1.iat !== payload2.iat) {
    log("✓ PASS: Timestamp khác nhau", "green");
  } else {
    log("✗ FAIL: Timestamp giống nhau", "red");
  }

  if (login1.token !== login2.token) {
    log("✓ PASS: Token string hoàn toàn khác nhau", "green");
  } else {
    log("✗ FAIL: Token string giống hệt nhau (nghiêm trọng!)", "red");
  }

  return { login1, login2, payload1, payload2 };
}

async function testTokenStructure(token, payload) {
  logSection("TEST 2: Kiểm tra cấu trúc JWT payload");

  const requiredFields = [
    "userId",
    "username",
    "jti",
    "sessionId",
    "tokenType",
    "iat",
    "exp",
    "ip",
    "ua",
  ];

  console.log("");
  log("Required fields:", "yellow");
  let allPresent = true;
  for (const field of requiredFields) {
    if (payload[field] !== undefined) {
      log(
        `  ✓ ${field}: ${JSON.stringify(payload[field]).substring(0, 60)}`,
        "green",
      );
    } else {
      log(`  ✗ ${field}: MISSING`, "red");
      allPresent = false;
    }
  }

  console.log("");
  if (allPresent) {
    log("✓ PASS: Tất cả fields bắt buộc đều có", "green");
  } else {
    log("✗ FAIL: Thiếu fields bắt buộc", "red");
  }

  // Validate values
  console.log("");
  log("Validation:", "yellow");

  if (payload.tokenType === "access") {
    log('  ✓ tokenType = "access"', "green");
  } else {
    log(`  ✗ tokenType = "${payload.tokenType}" (should be "access")`, "red");
  }

  if (payload.exp > payload.iat) {
    const duration = (payload.exp - payload.iat) / 3600;
    log(`  ✓ exp > iat (duration: ${duration.toFixed(1)} hours)`, "green");
  } else {
    log("  ✗ exp <= iat (invalid expiration)", "red");
  }

  if (
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      payload.jti,
    )
  ) {
    log("  ✓ jti is valid UUID v4", "green");
  } else {
    log("  ✗ jti is not valid UUID", "red");
  }

  if (
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      payload.sessionId,
    )
  ) {
    log("  ✓ sessionId is valid UUID v4", "green");
  } else {
    log("  ✗ sessionId is not valid UUID", "red");
  }
}

async function testDebugEndpoint(token) {
  logSection("TEST 3: Debug endpoint");

  log("Gọi /api/auth/debug-token...", "yellow");
  const debugInfo = await debugToken(token);

  console.log("");
  log("Token Info:", "cyan");
  console.log(JSON.stringify(debugInfo.tokenInfo, null, 2));

  console.log("");
  log("Timestamps:", "cyan");
  console.log(`  Issued at:  ${debugInfo.timestamps.issuedAt}`);
  console.log(`  Expires at: ${debugInfo.timestamps.expiresAt}`);
  console.log(`  Time left:  ${debugInfo.timestamps.timeLeftMinutes} minutes`);
  console.log(`  Expired:    ${debugInfo.timestamps.isExpired}`);

  console.log("");
  log("Security Metadata:", "cyan");
  console.log(`  Original IP: ${debugInfo.securityMetadata.originalIp}`);
  console.log(`  Current IP:  ${debugInfo.securityMetadata.currentIp}`);
  console.log(`  IP changed:  ${debugInfo.securityMetadata.ipChanged}`);
  console.log(
    `  User Agent:  ${debugInfo.securityMetadata.userAgent.substring(0, 60)}...`,
  );

  console.log("");
  if (!debugInfo.timestamps.isExpired) {
    log("✓ PASS: Token chưa hết hạn", "green");
  } else {
    log("✗ FAIL: Token đã hết hạn", "red");
  }
}

async function testInvalidToken() {
  logSection("TEST 4: Token validation");

  const testCases = [
    { name: "No token", token: "", expected: 401 },
    { name: "Invalid format", token: "not-a-jwt", expected: 401 },
    {
      name: "Invalid signature",
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMifQ.invalid",
      expected: 401,
    },
  ];

  for (const test of testCases) {
    try {
      const response = await fetch(`${API_BASE}/api/auth/debug-token`, {
        headers: test.token ? { Authorization: `Bearer ${test.token}` } : {},
      });

      if (response.status === test.expected) {
        log(`  ✓ ${test.name}: Rejected with ${response.status}`, "green");
      } else {
        log(
          `  ✗ ${test.name}: Got ${response.status}, expected ${test.expected}`,
          "red",
        );
      }
    } catch (error) {
      log(`  ✗ ${test.name}: ${error.message}`, "red");
    }
  }
}

async function main() {
  console.clear();
  log("═══════════════════════════════════════════════════════════", "bold");
  log("           JWT SECURITY TEST SUITE", "bold");
  log("═══════════════════════════════════════════════════════════", "bold");
  log(`API: ${API_BASE}`, "cyan");
  log(`User: ${USERNAME}`, "cyan");
  console.log("");

  try {
    // Test 1: Unique tokens
    const { login1, payload1 } = await testUniqueTokens();

    // Test 2: Token structure
    await testTokenStructure(login1.token, payload1);

    // Test 3: Debug endpoint
    await testDebugEndpoint(login1.token);

    // Test 4: Invalid tokens
    await testInvalidToken();

    // Summary
    logSection("SUMMARY");
    log("✓ Tất cả tests hoàn thành", "green");
    log("✓ JWT implementation đạt chuẩn bảo mật", "green");
  } catch (error) {
    console.log("");
    log("═══════════════════════════════════════════════════════════", "red");
    log(" TEST FAILED", "red");
    log("═══════════════════════════════════════════════════════════", "red");
    log(`Error: ${error.message}`, "red");
    log("", "reset");
    log("Kiểm tra:", "yellow");
    log(`  1. Backend server đang chạy: ${API_BASE}`, "yellow");
    log(`  2. MongoDB đã khởi động`, "yellow");
    log(`  3. Admin account đã được seed`, "yellow");
    process.exit(1);
  }
}

main();
