# Tài liệu Quy định Nghiệp vụ

Tài liệu này mô tả các quy định nghiệp vụ (Business Rules) được triển khai trong Hệ thống Quản lý Nhà sách. Các quy định này có thể cấu hình thông qua API và được thực thi trong các hoạt động như nhập sách, bán sách và thu tiền.

## 1. Tổng quan

Các quy định được lưu trữ trong bảng `QUY_DINH` dưới dạng cặp khóa-giá trị (key-value).
- **Khóa (`TenQuyDinh`)**: Chuỗi định danh duy nhất cho quy định (ví dụ: `QD1_NhapToiThieu`).
- **Giá trị (`GiaTri`)**: Giá trị của quy định, được lưu dưới dạng chuỗi (sẽ được chuyển đổi sang `int`, `decimal`, hoặc `bool` khi sử dụng).

Hệ thống sử dụng `RuleService` để thực thi các quy định này và `QuyDinhService` để quản lý (lấy/cập nhật) chúng.

## 2. Danh sách Quy định

Các quy định sau đây hiện đang được triển khai:

| Mã Quy định | Khóa (`TenQuyDinh`) | Mô tả | Kiểu dữ liệu | Logic Thực thi |
| :--- | :--- | :--- | :--- | :--- |
| **QD1** | `QD1_NhapToiThieu` | Số lượng nhập tối thiểu | `int` | Khi nhập sách, số lượng nhập phải ít nhất bằng giá trị này. |
| **QD1** | `QD1_TonToiDaTruocNhap` | Tồn kho tối đa trước khi nhập | `int` | Chỉ được nhập sách nếu lượng tồn kho hiện tại **nhỏ hơn** giá trị này. |
| **QD2** | `QD2_NoToiDa` | Nợ tối đa của khách hàng | `decimal` | Khách hàng không thể mua sách nếu nợ hiện tại vượt quá giá trị này. |
| **QD2** | `QD2_TonToiThieuSauBan` | Tồn kho tối thiểu sau bán | `int` | Sau khi bán, lượng tồn kho còn lại của sách phải ít nhất bằng giá trị này. |
| **QD4** | `QD4_KiemTraTienThu` | Kiểm tra số tiền thu | `bool` (0/1) | Nếu bật (`1`), số tiền thu được không được vượt quá số nợ hiện tại của khách hàng. |

## 3. Chi tiết Triển khai

### 3.1. Rule Service (`RuleService.cs`)
Service này chịu trách nhiệm **kiểm tra** các quy định trong quá trình hoạt động nghiệp vụ. Nó lấy giá trị quy định hiện tại từ cơ sở dữ liệu và ném ra ngoại lệ (exception) nếu quy định bị vi phạm.

*   **`CheckRule_NhapSach(int soLuongNhap, int tonKhoHienTai)`**:
    *   Kiểm tra `QD1_NhapToiThieu`: Báo lỗi nếu `soLuongNhap < MinImportQuantity`.
    *   Kiểm tra `QD1_TonToiDaTruocNhap`: Báo lỗi nếu `tonKhoHienTai >= MaxStockBeforeImport`.

*   **`CheckRule_BanSach(decimal noHienTai, int tonKhoSauBan)`**:
    *   Kiểm tra `QD2_NoToiDa`: Báo lỗi nếu `noHienTai > MaxDebt`.
    *   Kiểm tra `QD2_TonToiThieuSauBan`: Báo lỗi nếu `tonKhoSauBan < MinStockAfterSale`.

*   **`CheckRule_ThuTien(decimal soTienThu, decimal noHienTai)`**:
    *   Kiểm tra `QD4_KiemTraTienThu`: Nếu đang bật, báo lỗi nếu `soTienThu > noHienTai`.

### 3.2. Regulation Service (`QuyDinhService.cs`)
Service này chịu trách nhiệm **quản lý** cấu hình các quy định.

*   **`GetQuyDinhHienTaiAsync()`**: Lấy tất cả quy định và ánh xạ chúng sang `QuyDinhUpdateDto` cho frontend.
*   **`UpdateQuyDinhAsync(QuyDinhUpdateDto request)`**: Cập nhật giá trị các quy định trong cơ sở dữ liệu. Sử dụng transaction để đảm bảo tất cả cập nhật được thực hiện đồng bộ.

## 4. Các API liên quan

### 4.1. API Cấu hình (`QuyDinhController`)
*   `GET /api/QuyDinh`: Trả về cấu hình hiện tại của tất cả quy định.
*   `PUT /api/QuyDinh/CapNhat`: Cập nhật cấu hình quy định (yêu cầu quyền Admin).

### 4.2. API Nghiệp vụ (Thực thi quy định)
*   **Nhập sách (`PhieuNhapController`)**: Gọi `_ruleService.CheckRule_NhapSach` trước khi tạo phiếu nhập.
*   **Bán sách (`SaleService` / `SalesController`)**: Gọi `_ruleService.CheckRule_BanSach` trong quá trình bán hàng.
*   **Thu tiền (`PhieuThuTienController`)**: Gọi `_ruleService.CheckRule_ThuTien` trước khi ghi nhận phiếu thu.

## 5. Chính sách Phân quyền (Authorization)

Dựa trên cấu trúc ứng dụng frontend (`App.jsx`), hệ thống thực thi Kiểm soát Truy cập dựa trên Vai trò (RBAC). Các API backend phải tuân thủ các quy tắc này để đảm bảo bảo mật.

### 5.1. Vai trò (Roles)
*   **Admin**: Toàn quyền truy cập vào tất cả tính năng hệ thống, bao gồm các báo cáo nhạy cảm và cài đặt cấu hình.
*   **NhanVien** (Nhân viên): Truy cập vào các tính năng nghiệp vụ (Bán hàng, Kho, Sách, Khách hàng) nhưng bị hạn chế truy cập cấu hình hệ thống và báo cáo cấp cao.

### 5.2. Ánh xạ Route & API

| Tính năng | Route Frontend | Vai trò cho phép | Controller Backend | Attribute Yêu cầu |
| :--- | :--- | :--- | :--- | :--- |
| **Dashboard** | `/dashboard` | Admin, NhanVien | `ReportsController` (Thống kê) | `[Authorize]` |
| **Quản lý Sách** | `/book` | Admin, NhanVien | `SachController` | `[Authorize]` |
| **Bán hàng** | `/sale` | Admin, NhanVien | `SalesController` | `[Authorize]` |
| **Kho (Nhập sách)** | `/inventory` | Admin, NhanVien | `PhieuNhapController` | `[Authorize]` |
| **Công nợ Khách hàng** | `/finance` | Admin, NhanVien | `PhieuThuTienController` | `[Authorize]` |
| **Danh sách Khách hàng** | `/customer` | Admin, NhanVien | `KhachHangController` | `[Authorize]` |
| **Báo cáo** | `/report` | **Chỉ Admin** | `ReportsController` (Full) | `[Authorize(Roles = "Admin")]` |
| **Cài đặt (Quy định)** | `/setting` | **Chỉ Admin** | `QuyDinhController` | `[Authorize(Roles = "Admin")]` (cho cập nhật) |
| **Quản lý Người dùng**| N/A | **Chỉ Admin** | `AdminController` | `[Authorize(Roles = "Admin")]` |

> **Lưu ý:** Hiện tại, một số controller backend có thể chưa được áp dụng attribute `[Authorize]`. Cần đồng bộ hóa để thực thi đầy đủ mô hình bảo mật.
