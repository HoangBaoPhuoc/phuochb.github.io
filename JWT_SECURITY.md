# 🔐 JWT Security Implementation

## Tổng quan

Hệ thống JWT đã được nâng cấp với bảo mật cao:

- **Unique Token**: Mỗi lần đăng nhập tạo token khác nhau hoàn toàn
- **Session Tracking**: Theo dõi sessions với unique IDs
- **Security Metadata**: Lưu IP, User Agent cho phát hiện bất thường
- **Token Expiration**: Tự động hết hạn sau thời gian cấu hình

---

## JWT Payload Structure

Mỗi token chứa các thông tin sau:

```json
{
  // User Identity
  "userId": "507f1f77bcf86cd799439011",
  "username": "admin",

  // Token Metadata (UNIQUE cho mỗi token)
  "jti": "f47ac10b-58cc-4372-a567-0e02b2c3d479", // JWT ID (UUID)
  "sessionId": "a8b9c0d1-1234-5678-9abc-def012345678", // Session ID (UUID)
  "tokenType": "access", // Token type

  // Security Metadata
  "iat": 1709824800, // Issued At (Unix timestamp)
  "exp": 1709911200, // Expires At (Unix timestamp)
  "ip": "203.162.10.123", // IP address khi tạo token
  "ua": "Mozilla/5.0 (Windows NT 10.0..." // User Agent
}
```

### Giải thích các fields:

| Field       | Mô tả                            | Ví dụ                        |
| ----------- | -------------------------------- | ---------------------------- |
| `userId`    | MongoDB ObjectId của user        | `"507f1f77bcf86cd799439011"` |
| `username`  | Tên đăng nhập                    | `"admin"`                    |
| `jti`       | JWT ID - unique cho MỖI token    | UUID v4 random               |
| `sessionId` | Session tracking ID              | UUID v4 random               |
| `tokenType` | Loại token (access/refresh)      | `"access"`                   |
| `iat`       | Thời điểm tạo token (Unix time)  | `1709824800`                 |
| `exp`       | Thời điểm hết hạn (Unix time)    | `1709911200`                 |
| `ip`        | IP address khi đăng nhập         | `"203.162.10.123"`           |
| `ua`        | User Agent (browser/device info) | Truncated to 100 chars       |

---

## Tính năng bảo mật

### 1. **Unique Token ID** (`jti`)

- Mỗi lần login tạo UUID mới → token KHÔNG BAO GIỜ trùng
- Ngăn chặn token replay attacks
- Cho phép revoke token cụ thể (nếu cần)

### 2. **Session Tracking** (`sessionId`)

- Theo dõi sessions riêng biệt
- Có thể logout tất cả sessions khác
- Future: Implement "logout all devices"

### 3. **IP Address Tracking** (`ip`)

- Lưu IP khi đăng nhập
- Warning nếu IP thay đổi (không block)
- Phát hiện suspicious login từ location khác

### 4. **User Agent Tracking** (`ua`)

- Lưu browser/device info
- Phát hiện token bị đánh cắp dùng từ device khác
- Hỗ trợ forensics khi có security incident

### 5. **Token Expiration**

- Tự động hết hạn theo `JWT_EXPIRES_IN` (.env)
- Default: 1 ngày
- Backend trả về thời gian expire trong response

---

## API Endpoints

### 🔓 Login - Tạo token mới

```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "admin"
  },
  "expiresIn": "1d"
}
```

### 🔍 Debug Token - Xem thông tin token

```bash
GET /api/auth/debug-token
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**

```json
{
  "tokenInfo": {
    "jti": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "sessionId": "a8b9c0d1-1234-5678-9abc-def012345678",
    "tokenType": "access",
    "username": "admin",
    "userId": "507f1f77bcf86cd799439011"
  },
  "timestamps": {
    "issuedAt": "2026-03-07T10:00:00.000Z",
    "expiresAt": "2026-03-08T10:00:00.000Z",
    "timeLeftMinutes": 1380,
    "isExpired": false
  },
  "securityMetadata": {
    "originalIp": "127.0.0.1",
    "currentIp": "127.0.0.1",
    "ipChanged": false,
    "userAgent": "Mozilla/5.0..."
  }
}
```

---

## Security Validation

### Token verification steps (middleware):

1. ✅ **Kiểm tra Bearer token** có trong header
2. ✅ **Verify signature** với JWT_SECRET
3. ✅ **Kiểm tra expiration** - reject nếu hết hạn
4. ✅ **Validate structure** - phải có `jti`, `sessionId`
5. ✅ **Check token type** - phải là `"access"`
6. ⚠️ **IP change warning** - log nếu IP khác (không block)

### Error responses:

| Error                 | HTTP Code | Message                     |
| --------------------- | --------- | --------------------------- |
| No token              | 401       | `"Unauthorized"`            |
| Invalid signature     | 401       | `"Invalid token"`           |
| Expired               | 401       | `"Token expired"`           |
| Missing jti/sessionId | 401       | `"Invalid token structure"` |
| Wrong token type      | 401       | `"Invalid token type"`      |

---

## Ví dụ Test

### 1. Test đăng nhập 2 lần → 2 token khác nhau

```bash
# Login lần 1
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  | jq -r '.token' > token1.txt

# Đợi 1 giây
sleep 1

# Login lần 2
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  | jq -r '.token' > token2.txt

# So sánh
diff token1.txt token2.txt
# Output: tokens are different!
```

### 2. Xem chi tiết token

```bash
TOKEN="<your-token-here>"

curl http://localhost:4000/api/auth/debug-token \
  -H "Authorization: Bearer $TOKEN" \
  | jq
```

### 3. Decode JWT payload (client-side)

```javascript
// In browser console hoặc Node.js
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
const payload = JSON.parse(atob(token.split(".")[1]));
console.log(payload);
```

---

## Environment Variables

```bash
# JWT secret - phải là string dài và random
JWT_SECRET=your-super-secret-production-key-2026-abc123

# Thời gian hết hạn token
# Format: <number><unit> - d=days, h=hours, m=minutes
# Examples: 1d, 12h, 30m, 7d
JWT_EXPIRES_IN=1d

# Bật security logging (optional)
LOG_SECURITY=true
```

### Tạo JWT_SECRET an toàn:

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# PowerShell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

---

## Best Practices

### ✅ Nên làm:

- Đổi `JWT_SECRET` thành random string mạnh trong production
- Set `JWT_EXPIRES_IN` phù hợp (1d cho web app, 7d cho mobile)
- Bật `LOG_SECURITY=true` để monitor IP changes
- Revoke tokens khi user logout (future implementation)
- Implement refresh token cho UX tốt hơn

### ❌ Không nên:

- Commit `JWT_SECRET` vào Git
- Set expiration quá dài (>7d) cho access token
- Lưu token trong localStorage nếu site có XSS risk
- Share token giữa users
- Reuse `JWT_SECRET` cho nhiều projects

---

## Roadmap

Future enhancements:

- [ ] **Token Blacklist** - Revoke tokens trước expiration
- [ ] **Refresh Tokens** - Long-lived tokens cho re-authentication
- [ ] **Multi-device Management** - Xem và logout từng device
- [ ] **Suspicious Activity Detection** - Block nếu IP/UA change đột ngột
- [ ] **Rate Limiting** - Giới hạn số lần login/token refresh
- [ ] **2FA Integration** - Two-factor authentication

---

## Troubleshooting

### Token bị reject với "Invalid token structure"

- Token được tạo từ code cũ (trước khi thêm jti/sessionId)
- Solution: Login lại để lấy token mới

### "Token expired" sau vài giây

- Kiểm tra `JWT_EXPIRES_IN` trong .env
- Server time có thể sai → check system clock

### IP change warning spam

- Bình thường nếu dùng mobile/laptop đổi wifi
- Tắt bằng `LOG_SECURITY=false` nếu không cần

### Debug token show ipChanged=true

- User đổi network (wifi → 4G)
- VPN/Proxy đang active
- Không ảnh hưởng authentication (chỉ warning)
