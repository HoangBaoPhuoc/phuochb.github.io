# MongoDB Auth Setup

## Tổng quan

Dự án đã chuyển sang xác thực bằng backend Express + MongoDB.

- Trang public: `/`, `/portfolio`
- Trang cần đăng nhập: `/restricted`
- Trang đăng nhập: `/secret`

## Cấu hình môi trường

Chỉnh file `.env`:

- `MONGODB_URI`: chuỗi kết nối MongoDB
- `JWT_SECRET`: khóa bí mật ký JWT
- `JWT_EXPIRES_IN`: thời hạn token
- `PORT`: cổng backend
- `FRONTEND_ORIGIN`: origin frontend
- `VITE_API_BASE_URL`: URL API cho frontend
- `ADMIN_USERNAME`: tài khoản seed ban đầu
- `ADMIN_PASSWORD`: mật khẩu seed ban đầu

## Chạy hệ thống

1. Đảm bảo MongoDB đang chạy
2. Cài package: `npm install`
3. Chạy cả backend + frontend: `npm run dev:full`

## API xác thực

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (Bearer token)

## Lưu ý

- Tài khoản/mật khẩu được lưu trong MongoDB (mật khẩu hash bằng bcrypt)
- Nếu có `ADMIN_USERNAME` và `ADMIN_PASSWORD`, server sẽ tự tạo tài khoản này khi chạy lần đầu
