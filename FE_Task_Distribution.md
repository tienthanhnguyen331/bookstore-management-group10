# Kế hoạch Phân chia Công việc Team Frontend (3 Devs)

Dựa trên tài liệu `demo.md` và cấu trúc dự án hiện tại, dưới đây là bảng phân công công việc chi tiết để chuyển đổi từ Mock Data sang API thực tế.

## 👥 Tổng quan Phân quyền

| Thành viên | Vai trò (Role) | Trọng tâm (Focus) | Các file chính phụ trách |
| :--- | :--- | :--- | :--- |
| **Dev 1** | **Core & Auth** | Xây dựng nền tảng, xử lý đăng nhập, bảo mật luồng đi. | `api.js`, `AuthContext.jsx`, `LoginPage.jsx`, `ProtectedRoute.jsx` |
| **Dev 2** | **Admin Features** | Xây dựng chức năng quản lý nghiệp vụ (CRUD). | `EmployeeManager.jsx` (List, Create, Edit, Delete) |
| **Dev 3** | **User Features** | Xây dựng tiện ích người dùng và giao diện Dashboard. | `ForgotPasswordPage.jsx`, `UserProfile.jsx`, `DashboardPage.jsx` |

---

## 📝 Chi tiết Nhiệm vụ

### 👤 Dev 1: Core Authentication & Routing
*Người đặt nền móng kết nối Backend và bảo mật ứng dụng.*

1.  **Cấu hình API Client (`services/api.js`)**:
    *   Thiết lập Axios Interceptor: Tự động đính kèm `Token` từ localStorage vào Header request.
    *   Xử lý lỗi toàn cục: Tự động logout nếu gặp lỗi `401 Unauthorized`.
2.  **Quản lý State (`context/AuthContext.jsx`)**:
    *   Triển khai logic `login`: Gọi API `/auth/login`, lưu Token & User Info.
    *   Triển khai logic `logout`: Xóa dữ liệu phiên làm việc.
    *   Duy trì trạng thái đăng nhập khi F5 trang (Load từ localStorage).
3.  **Bảo vệ Route (`components/ProtectedRoute.jsx` & `App.jsx`)**:
    *   Kiểm tra quyền truy cập dựa trên `Role` (Admin vs NhanVien).
    *   Điều hướng (Redirect) về trang Login nếu chưa đăng nhập.

### 🛠️ Dev 2: Employee Management (Admin)
*Người xây dựng chức năng quản lý dữ liệu nhân sự.*

1.  **Hiển thị danh sách (`pages/EmployeeManager.jsx`)**:
    *   Gọi API `GET /api/employees`.
    *   Hiển thị bảng dữ liệu: Mã NV, Họ tên, SĐT, Email, Chức vụ, Username.
2.  **Thao tác dữ liệu (CRUD)**:
    *   **Tạo mới:** Form Modal gọi API `POST /api/employees/create`. Validate email/sdt.
    *   **Cập nhật:** Form sửa thông tin gọi API `PUT`.
    *   **Xóa:** Gọi API `DELETE`.
    *   **Reset Mật khẩu:** Gọi API `POST /api/employees/reset-password/{maNV}` để cấp lại mật khẩu mặc định.

### 🔐 Dev 3: User Utilities & UX
*Người chăm chút trải nghiệm người dùng cuối.*

1.  **Quên mật khẩu (`pages/ForgotPasswordPage.jsx`)**:
    *   Nâng cấp từ Mock Data sang API thật.
    *   **Bước 1:** Form nhập Email -> Gọi `POST /auth/forgot-password`.
    *   **Bước 2:** Form nhập OTP & Pass mới -> Gọi `POST /auth/reset-password-otp`.
2.  **User Profile (`components/UserProfile.jsx`)**:
    *   Hiển thị tên và chức vụ người dùng trên thanh Header.
    *   Xử lý sự kiện Đăng xuất (gọi hàm từ `AuthContext`).
3.  **Dashboard & Thông tin cá nhân (`pages/DashboardPage.jsx`)**:
    *   Trang chủ sau khi đăng nhập (đóng vai trò là trang Profile).
    *   Hiển thị thông tin nhân viên (gọi API `GET /api/profile`)

---

## 💡 Lưu ý chung cho Team
*   **Thứ tự ưu tiên:** Dev 1 cần hoàn thành `AuthContext` và `api.js` trước để Dev 2 và Dev 3 có thể tích hợp API (cần Token xác thực).
*   **Đồng bộ:** Thống nhất `baseURL` trong `api.js` trỏ về Backend (ví dụ: `http://localhost:5051/api`).
*   **Git Workflow:** Mỗi Dev nên làm trên một branch riêng (ví dụ: `feature/auth`, `feature/employee-crud`, `feature/dashboard`) và merge vào `main` sau khi test xong.
