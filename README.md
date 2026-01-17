# 📚 Bookstore Management System (Group 10)

Dự án quản lý nhà sách gồm Frontend (ReactJS + Vite) và Backend (.NET Core API).

## 🛠 Yêu cầu hệ thống (Prerequisites)

Trước khi bắt đầu, hãy đảm bảo máy bạn đã cài đặt:

1.  **Node.js** (v18 trở lên): [Tải tại đây](https://nodejs.org/)
2.  **.NET SDK 9.0**: [Tải tại đây](https://dotnet.microsoft.com/en-us/download/dotnet/9.0)
3.  **SQL Server** (Express hoặc Developer): [Tải tại đây](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
4.  **Visual Studio Code**: [Tải tại đây](https://code.visualstudio.com/)

---

## 🚀 Hướng dẫn cài đặt (Setup Guide)

### 1. Clone dự án
```bash
git clone https://github.com/tienthanhnguyen331/bookstore-management-group10.git
cd bookstore-management-group10
```

### 2. Cấu hình Database (SQL Server)
1.  Mở **SQL Server Management Studio (SSMS)**.
2.  Chạy file script tạo database: `database/script_create_db.sql`.
3.  (Tùy chọn) Chạy file `database/seed_data.sql` để thêm dữ liệu mẫu.
4.  **Quan trọng**: Cập nhật chuỗi kết nối (Connection String) trong Backend.
    *   Mở file: `DataBasee/DoAnPhanMem/appsettings.json`
    *   Tìm dòng `"DefaultConnection"` và sửa lại cho đúng với máy của bạn:
    ```json
    "DefaultConnection": "Data Source=.;Initial Catalog=DoAnPhanMem;Integrated Security=True;Connect Timeout=30;Encrypt=False;Trust Server Certificate=True;Application Intent=ReadWrite;Multi Subnet Failover=False"
    ```
    *   *Lưu ý*: `Data Source=.` hoặc `Data Source=LOCALHOST` thường dùng được. Nếu bạn dùng SQL Express, hãy đổi thành `Data Source=.\SQLEXPRESS`.

### 3. Cài đặt Frontend
Mở terminal tại thư mục gốc và chạy:
```bash
cd client
npm install
```

### 4. Cài đặt Backend
Mở terminal mới (hoặc quay lại thư mục gốc) và chạy:
```bash
dotnet restore DataBasee/DoAnPhanMem/DoAnPhanMem.csproj
dotnet build DataBasee/DoAnPhanMem/DoAnPhanMem.csproj
```

---

## ▶️ Cách chạy dự án (How to Run)

### Cách 1: Dùng VS Code Tasks (Khuyên dùng)
Dự án đã được cấu hình sẵn để chạy cả Frontend và Backend cùng lúc.
1.  Trong VS Code, nhấn `Ctrl + Shift + P` (hoặc `Cmd + Shift + P` trên Mac).
2.  Gõ **"Tasks: Run Task"** và chọn.
3.  Chọn **"Run Full Stack"**.

### Cách 2: Chạy thủ công bằng Terminal

**Terminal 1 (Backend):**
```bash
cd DataBasee/DoAnPhanMem
dotnet watch run
```
*Backend sẽ chạy tại: `http://localhost:5051`*

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```
*Frontend sẽ chạy tại: `http://localhost:5173`*

---

## 🌐 Truy cập từ thiết bị khác (LAN)
Để truy cập web từ điện thoại hoặc máy khác trong cùng mạng WiFi:
1.  Tìm địa chỉ IP của máy bạn (ví dụ: `192.168.1.10` hoặc `172.20.10.2`).
2.  Cập nhật file `client/src/services/api.js`:
    ```javascript
    baseURL: "http://YOUR_IP_ADDRESS:5051/api"
    ```
3.  Chạy lại dự án.
4.  Trên thiết bị khác, truy cập: `http://YOUR_IP_ADDRESS:5173`.

---

## ⚠️ Các lỗi thường gặp

1.  **Lỗi kết nối Database**:
    *   Kiểm tra lại `appsettings.json`.
    *   Đảm bảo SQL Server Service đang chạy (Services -> SQL Server).

2.  **Lỗi CORS**:
    *   Backend đã được cấu hình để cho phép mọi origin (`AllowAnyOrigin`). Nếu vẫn lỗi, kiểm tra lại file `Program.cs`.

3.  **Lỗi phiên bản .NET**:
    *   Dự án dùng .NET 9.0. Nếu máy bạn dùng bản cũ hơn, hãy cài đặt .NET 9.0 SDK hoặc sửa file `.csproj` về phiên bản tương ứng (không khuyến khích).
