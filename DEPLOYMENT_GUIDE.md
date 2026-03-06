# 🚀 Hướng dẫn Deploy Production

## Kiến trúc

- **Frontend**: GitHub Pages (static files)
- **Backend**: Render.com (Node.js API)
- **Database**: MongoDB Atlas (đã setup)

---

## 📋 Bước 1: Deploy Backend lên Render

### 1.1. Tạo tài khoản Render

1. Truy cập https://render.com
2. Sign up với GitHub account
3. Authorize Render truy cập repository `phuochb.github.io`

### 1.2. Tạo Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect repository: `phuochb.github.io`
3. Cấu hình:
   - **Name**: `phuochb-api` (hoặc tên bất kỳ)
   - **Region**: Singapore (gần Việt Nam nhất)
   - **Branch**: `main`
   - **Root Directory**: để trống
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server/index.js`
   - **Instance Type**: `Free`

### 1.3. Set Environment Variables

Trong phần **Environment**, thêm các biến sau:

| Key               | Value                                                                                                                 |
| ----------------- | --------------------------------------------------------------------------------------------------------------------- |
| `MONGODB_URI`     | `mongodb+srv://phuocab191_db_user:IrYQUXe7peoBqDg2@phuochbcluster.wnxiltq.mongodb.net/loginDB?appName=PhuochbCluster` |
| `JWT_SECRET`      | `your-super-secret-production-key-2026-abc123` (tạo random string)                                                    |
| `JWT_EXPIRES_IN`  | `1d`                                                                                                                  |
| `PORT`            | `4000`                                                                                                                |
| `FRONTEND_ORIGIN` | `https://phuochb.github.io`                                                                                           |
| `ADMIN_USERNAME`  | `admin` (hoặc username bạn muốn)                                                                                      |
| `ADMIN_PASSWORD`  | `admin123` (hoặc password bạn muốn)                                                                                   |

### 1.4. Deploy

1. Click **"Create Web Service"**
2. Đợi build (~2-3 phút)
3. Sau khi deploy xong, bạn sẽ có URL: `https://phuochb-api.onrender.com`

### 1.5. Test Backend

Mở browser, truy cập:

```
https://phuochb-api.onrender.com/health
```

Bạn sẽ thấy:

```json
{ "status": "ok", "timestamp": "..." }
```

---

## 📋 Bước 2: Setup GitHub Actions cho Frontend

### 2.1. Tạo GitHub Secret

1. Vào repository trên GitHub: `https://github.com/phuochb/phuochb.github.io`
2. Settings → Secrets and variables → Actions
3. Click **"New repository secret"**
4. Tạo secret:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://phuochb-api.onrender.com` (URL backend từ bước 1.4)

### 2.2. Tạo GitHub Actions Workflow

File `.github/workflows/deploy.yml` sẽ tự động build và deploy lên GitHub Pages.

---

## 📋 Bước 3: Update CORS trên Backend (nếu cần)

Nếu gặp lỗi CORS sau khi deploy, đảm bảo `FRONTEND_ORIGIN` trong Render environment variables là:

```
https://phuochb.github.io
```

Backend đã cấu hình cho phép origin này trong `server/index.js`.

---

## 🧪 Test Production

### Test Backend API

```bash
# Health check
curl https://phuochb-api.onrender.com/health

# Login test
curl -X POST https://phuochb-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Test Frontend

1. Truy cập: `https://phuochb.github.io`
2. Click vào icon khóa → Login page
3. Đăng nhập với admin credentials
4. Nếu thành công → chuyển tới `/restricted` page

---

## 🔒 Bảo mật Production

### 1. Thay đổi JWT_SECRET

Tạo random string mạnh:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Đổi Admin Password

Update `ADMIN_PASSWORD` trong Render environment variables với password mạnh.

### 3. MongoDB Network Access

Trong MongoDB Atlas:

- Database Access: Đảm bảo user có quyền `readWrite`
- Network Access: Thêm `0.0.0.0/0` (cho phép mọi IP) hoặc IP của Render

---

## 📝 Lưu ý

- **File .env**: CHỈ dùng cho local development, đã có trong .gitignore
- **Free tier Render**: Server sleep sau 15 phút không dùng, lần đầu gọi API sẽ chậm ~30s
- **GitHub Pages**: Chỉ serve static files, không chạy được Node.js
- **MongoDB Atlas Free**: 512MB storage, đủ cho vài nghìn users

---

## ❓ Troubleshooting

### Backend deploy failed

- Check Build Logs trên Render
- Đảm bảo `node server/index.js` chạy được local
- Verify MongoDB connection string format đúng

### CORS errors

- Kiểm tra `FRONTEND_ORIGIN` trong Render env vars
- Mở DevTools → Console để xem error details

### Login không hoạt động

- Kiểm tra `VITE_API_BASE_URL` trong GitHub Secrets
- Verify backend URL đúng và trả về response
- Check Network tab trong DevTools
