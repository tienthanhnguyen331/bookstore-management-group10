# ĐẶC TẢ USE CASE CHI TIẾT (DỰ ÁN BOOKSTORE)

Tài liệu này mô tả chi tiết các Use Case của hệ thống Quản lý Nhà sách, tuân thủ các quy định nghiệp vụ (QD1, QD2, QD4) đã được cài đặt trong Backend.

## Sơ đồ Use Case Tổng quát

```mermaid
useCaseDiagram
    actor "Admin" as Admin
    actor "Nhân viên Bán hàng" as NVBH
    actor "Thủ kho" as TK

    package "Hệ thống Quản lý Nhà sách" {
        usecase "Đăng nhập (U001)" as U1
        usecase "Đổi mật khẩu (U002)" as U2
        usecase "Quên mật khẩu (U003)" as U3
        usecase "Cập nhật hồ sơ (U004)" as U4
        
        usecase "Tra cứu sách (U005)" as U5
        usecase "Lập phiếu nhập sách (U006)" as U6
        usecase "Thêm mới đầu sách (U007)" as U7
        
        usecase "Tra cứu khách hàng (U008)" as U8
        usecase "Lập hóa đơn bán sách (U009)" as U9
        usecase "Lập phiếu thu tiền (U010)" as U10
        
        usecase "Xem báo cáo tồn (U011)" as U11
        usecase "Xem báo cáo công nợ (U012)" as U12
        usecase "Thay đổi quy định (U013)" as U13
    }

    Admin --> U1
    Admin --> U2
    Admin --> U3
    Admin --> U4
    Admin --> U5
    Admin --> U6
    Admin --> U7
    Admin --> U8
    Admin --> U9
    Admin --> U10
    Admin --> U11
    Admin --> U12
    Admin --> U13

    NVBH --> U1
    NVBH --> U2
    NVBH --> U3
    NVBH --> U4
    NVBH --> U5
    NVBH --> U8
    NVBH --> U9
    NVBH --> U10
    NVBH --> U12

    TK --> U1
    TK --> U2
    TK --> U3
    TK --> U4
    TK --> U5
    TK --> U6
    TK --> U7
    TK --> U11
```

---

## 1. NHÓM QUẢN TRỊ & TÀI KHOẢN

### Đặc tả Use Case: Đăng nhập hệ thống
| **Use case ID** | **U001** |
| :--- | :--- |
| **Tên Use Case** | **Đăng nhập hệ thống** |
| **Tóm tắt** | Là người dùng hệ thống (Admin, Nhân viên), tôi muốn đăng nhập bằng tài khoản được cấp để truy cập các chức năng nội bộ. |
| **Tác nhân** | Admin, Nhân viên (Bán hàng, Thủ kho) |
| **Điều kiện tiên quyết** | Tài khoản đã được tạo sẵn trong cơ sở dữ liệu. |
| **Kết quả** | 1. Người dùng nhận được Token xác thực (JWT).<br>2. Hệ thống chuyển hướng người dùng vào trang Dashboard tương ứng với quyền hạn. |
| **Kịch bản chính** | 1. Người dùng truy cập vào trang Đăng nhập.<br>2. Người dùng nhập Tên đăng nhập và Mật khẩu.<br>3. Người dùng nhấn nút "Đăng nhập".<br>4. **Hệ thống kiểm tra xác thực:** Đối chiếu thông tin với CSDL.<br>5. Nếu hợp lệ, hệ thống tạo JWT Token chứa thông tin định danh và quyền hạn.<br>6. Hệ thống thông báo "Đăng nhập thành công" và chuyển hướng. |

### Đặc tả Use Case: Đổi mật khẩu
| **Use case ID** | **U002** |
| :--- | :--- |
| **Tên Use Case** | **Đổi mật khẩu** |
| **Tóm tắt** | Là người dùng đã đăng nhập, tôi muốn thay đổi mật khẩu để bảo vệ tài khoản cá nhân. |
| **Tác nhân** | Admin, Nhân viên |
| **Điều kiện tiên quyết** | Người dùng đã đăng nhập thành công vào hệ thống. |
| **Kết quả** | Mật khẩu mới được cập nhật vào cơ sở dữ liệu (dưới dạng mã hóa). |
| **Kịch bản chính** | 1. Người dùng chọn chức năng "Đổi mật khẩu".<br>2. Hệ thống hiển thị form yêu cầu nhập: Mật khẩu cũ, Mật khẩu mới.<br>3. Người dùng nhập thông tin và nhấn "Lưu".<br>4. **Hệ thống kiểm tra:** Xác thực mật khẩu cũ có khớp không.<br>5. Nếu khớp, hệ thống mã hóa mật khẩu mới (BCrypt) và cập nhật vào CSDL.<br>6. Hệ thống thông báo "Đổi mật khẩu thành công". |

### Đặc tả Use Case: Quên mật khẩu (OTP)
| **Use case ID** | **U003** |
| :--- | :--- |
| **Tên Use Case** | **Quên mật khẩu (Qua Email)** |
| **Tóm tắt** | Là người dùng quên mật khẩu, tôi muốn lấy lại quyền truy cập thông qua mã xác thực (OTP) gửi về email. |
| **Tác nhân** | Admin, Nhân viên |
| **Điều kiện tiên quyết** | Email của nhân viên đã được đăng ký chính xác trong hệ thống. |
| **Kết quả** | Mật khẩu được đặt lại theo ý người dùng. |
| **Kịch bản chính** | 1. Người dùng chọn "Quên mật khẩu" tại màn hình đăng nhập.<br>2. Người dùng nhập Email và nhấn "Gửi OTP".<br>3. **Hệ thống kiểm tra:** Email có tồn tại trong bảng NHAN_VIEN không.<br>4. Nếu có, hệ thống sinh mã OTP, lưu vào Cache (5 phút) và gửi Email cho người dùng.<br>5. Người dùng nhập mã OTP nhận được và Mật khẩu mới.<br>6. **Hệ thống kiểm tra:** OTP có khớp và còn hạn không.<br>7. Nếu đúng, hệ thống cập nhật mật khẩu mới và xóa OTP.<br>8. Hệ thống thông báo thành công và yêu cầu đăng nhập lại. |

### Đặc tả Use Case: Cập nhật hồ sơ cá nhân
| **Use case ID** | **U004** |
| :--- | :--- |
| **Tên Use Case** | **Cập nhật hồ sơ cá nhân** |
| **Tóm tắt** | Là nhân viên, tôi muốn cập nhật thông tin liên hệ (SĐT, Email, Địa chỉ) của mình. |
| **Tác nhân** | Admin, Nhân viên |
| **Điều kiện tiên quyết** | Đã đăng nhập. |
| **Kết quả** | Thông tin cá nhân được cập nhật. |
| **Kịch bản chính** | 1. Người dùng vào trang "Hồ sơ cá nhân".<br>2. Hệ thống hiển thị thông tin hiện tại.<br>3. Người dùng chỉnh sửa SĐT, Email hoặc Địa chỉ và nhấn "Lưu".<br>4. **Hệ thống kiểm tra trùng lặp:** Kiểm tra xem SĐT hoặc Email mới có trùng với nhân viên khác không.<br>5. Nếu không trùng, hệ thống lưu thay đổi vào CSDL.<br>6. Hệ thống thông báo "Cập nhật thành công". |

---

## 2. NHÓM QUẢN LÝ SÁCH & KHO

### Đặc tả Use Case: Tra cứu sách
| **Use case ID** | **U005** |
| :--- | :--- |
| **Tên Use Case** | **Tra cứu danh sách sách** |
| **Tóm tắt** | Là nhân viên, tôi muốn tìm kiếm sách để xem thông tin giá bán và số lượng tồn kho. |
| **Tác nhân** | Admin, Nhân viên (Bán hàng, Thủ kho) |
| **Điều kiện tiên quyết** | Đã đăng nhập. |
| **Kết quả** | Hiển thị danh sách sách thỏa mãn điều kiện tìm kiếm. |
| **Kịch bản chính** | 1. Người dùng vào trang "Quản lý Sách".<br>2. Hệ thống hiển thị danh sách tất cả sách.<br>3. Người dùng nhập từ khóa (Tên sách, Mã sách) hoặc lọc theo Thể loại.<br>4. Hệ thống truy vấn và trả về kết quả tương ứng (kèm Tồn kho, Đơn giá). |

### Đặc tả Use Case: Lập phiếu nhập sách
| **Use case ID** | **U006** |
| :--- | :--- |
| **Tên Use Case** | **Lập phiếu nhập sách** |
| **Tóm tắt** | Là thủ kho, tôi muốn nhập thêm số lượng cho các đầu sách để bổ sung kho hàng. |
| **Tác nhân** | Thủ kho, Admin |
| **Điều kiện tiên quyết** | Sách đã có trong danh mục. Tuân thủ quy định nhập (QD1). |
| **Kết quả** | 1. Phiếu nhập được tạo.<br>2. Số lượng tồn kho tăng lên.<br>3. Báo cáo tồn được cập nhật. |
| **Kịch bản chính** | 1. Thủ kho chọn chức năng "Nhập sách".<br>2. Thủ kho chọn sách cần nhập, nhập số lượng và đơn giá nhập.<br>3. **Hệ thống kiểm tra Quy định 1 (QD1):**<br>   - Số lượng nhập phải $\ge$ 150.<br>   - Số lượng tồn hiện tại của sách phải $<$ 300.<br>4. Nếu thỏa mãn, hệ thống cho phép thêm vào phiếu nhập.<br>5. Thủ kho xác nhận "Lưu phiếu nhập".<br>6. Hệ thống lưu phiếu, cộng dồn số lượng tồn kho và cập nhật Báo cáo tồn tháng.<br>7. Hệ thống thông báo "Nhập hàng thành công". |

### Đặc tả Use Case: Thêm mới đầu sách
| **Use case ID** | **U007** |
| :--- | :--- |
| **Tên Use Case** | **Thêm mới đầu sách** |
| **Tóm tắt** | Là thủ kho, tôi muốn thêm một đầu sách hoàn toàn mới (chưa có trong hệ thống) để bắt đầu kinh doanh. |
| **Tác nhân** | Thủ kho, Admin |
| **Điều kiện tiên quyết** | Đã đăng nhập. |
| **Kết quả** | Sách mới được tạo. Thể loại/Tác giả mới được tạo (nếu chưa có). |
| **Kịch bản chính** | 1. Thủ kho chọn "Thêm sách mới".<br>2. Nhập: Tên sách, Thể loại, Tác giả, Đơn giá, Số lượng tồn ban đầu (thường là 0).<br>3. Thủ kho nhấn "Lưu".<br>4. **Hệ thống xử lý tự động:**<br>   - Kiểm tra Thể loại/Tác giả: Nếu chưa có thì tự tạo mới và sinh mã.<br>   - Sinh mã Sách mới (Tự động tăng: S001 -> S002...).<br>5. Hệ thống lưu sách mới vào CSDL.<br>6. Hệ thống thông báo "Thêm sách thành công". |

---

## 3. NHÓM BÁN HÀNG & CÔNG NỢ

### Đặc tả Use Case: Tra cứu khách hàng
| **Use case ID** | **U008** |
| :--- | :--- |
| **Tên Use Case** | **Tra cứu khách hàng** |
| **Tóm tắt** | Là nhân viên bán hàng, tôi muốn tìm thông tin khách hàng qua số điện thoại để biết họ là khách quen hay khách mới và số nợ hiện tại. |
| **Tác nhân** | Nhân viên Bán hàng, Admin |
| **Điều kiện tiên quyết** | Đã đăng nhập. |
| **Kết quả** | Hiển thị tên khách hàng và số tiền đang nợ. |
| **Kịch bản chính** | 1. Tại màn hình Bán hàng hoặc Thu tiền, nhân viên nhập Số điện thoại khách.<br>2. Hệ thống tìm kiếm trong CSDL.<br>3. Nếu thấy: Hiển thị Tên khách hàng và Số nợ hiện tại.<br>4. Nếu không thấy: Hiển thị thông báo "Khách vãng lai" hoặc gợi ý tạo mới. |

### Đặc tả Use Case: Lập hóa đơn bán sách
| **Use case ID** | **U009** |
| :--- | :--- |
| **Tên Use Case** | **Lập hóa đơn bán sách** |
| **Tóm tắt** | Là nhân viên bán hàng, tôi muốn tạo hóa đơn bán sách cho khách, ghi nhận các đầu sách họ mua, tính tổng tiền và trừ kho. |
| **Tác nhân** | Nhân viên Bán hàng, Admin |
| **Điều kiện tiên quyết** | 1. Đã đăng nhập.<br>2. Sách và Khách hàng đã có dữ liệu (hoặc Khách vãng lai). |
| **Kết quả** | 1. Hóa đơn được lưu.<br>2. Tồn kho giảm.<br>3. Công nợ khách tăng (nếu mua nợ).<br>4. Báo cáo tồn/công nợ được cập nhật. |
| **Kịch bản chính** | 1. Nhân viên chọn chức năng "Lập hóa đơn".<br>2. Hệ thống hiển thị giao diện với ngày lập mặc định là hiện tại.<br>3. Nhân viên nhập SĐT để tìm khách hàng.<br>4. **Hệ thống kiểm tra Quy định công nợ (QD2):** Nếu khách đang nợ $>$ 20.000đ, hệ thống cảnh báo và chặn bán nợ (chỉ được bán tiền mặt).<br>5. Nhân viên chọn sách và nhập số lượng mua.<br>6. **Hệ thống kiểm tra Quy định tồn kho (QD2):** Với mỗi sách, kiểm tra: (Tồn kho hiện tại - Số lượng bán). Nếu kết quả $<$ 20, hệ thống báo lỗi và không cho phép bán.<br>7. Hệ thống tự động lấy đơn giá và tính thành tiền.<br>8. Nhân viên nhấn "Thanh toán".<br>9. Hệ thống lưu hóa đơn, trừ kho, cộng nợ (nếu có), cập nhật các Báo cáo.<br>10. Hệ thống thông báo "Lập hóa đơn thành công". |

### Đặc tả Use Case: Lập phiếu thu tiền
| **Use case ID** | **U010** |
| :--- | :--- |
| **Tên Use Case** | **Lập phiếu thu tiền** |
| **Tóm tắt** | Là nhân viên, tôi muốn lập phiếu thu tiền từ khách hàng đang nợ để giảm trừ công nợ cho họ. |
| **Tác nhân** | Nhân viên Bán hàng, Admin |
| **Điều kiện tiên quyết** | Khách hàng phải có nợ trong hệ thống. |
| **Kết quả** | 1. Phiếu thu được tạo.<br>2. Công nợ khách hàng giảm xuống.<br>3. Báo cáo công nợ được cập nhật. |
| **Kịch bản chính** | 1. Nhân viên chọn chức năng "Thu tiền".<br>2. Nhập SĐT khách hàng để tra cứu nợ.<br>3. Nhập "Số tiền thu".<br>4. **Hệ thống kiểm tra Quy định 4 (QD4):** Số tiền thu không được vượt quá số tiền khách đang nợ.<br>5. Nếu hợp lệ, nhân viên nhấn "Lưu phiếu thu".<br>6. Hệ thống lưu phiếu, trừ nợ của khách hàng và cập nhật Báo cáo công nợ.<br>7. Hệ thống thông báo "Thu tiền thành công". |

---

## 4. NHÓM BÁO CÁO & CÀI ĐẶT

### Đặc tả Use Case: Xem báo cáo tồn
| **Use case ID** | **U011** |
| :--- | :--- |
| **Tên Use Case** | **Xem báo cáo tồn kho** |
| **Tóm tắt** | Là quản lý, tôi muốn xem biến động tồn kho của các đầu sách trong tháng để nắm bắt tình hình kinh doanh. |
| **Tác nhân** | Admin, Thủ kho |
| **Điều kiện tiên quyết** | Có dữ liệu nhập/xuất trong tháng. |
| **Kết quả** | Hiển thị bảng báo cáo: Tồn đầu, Phát sinh nhập/xuất, Tồn cuối. |
| **Kịch bản chính** | 1. Người dùng vào trang "Báo cáo".<br>2. Chọn tab "Báo cáo tồn" và chọn Tháng/Năm.<br>3. Hệ thống truy vấn dữ liệu từ bảng BAO_CAO_TON.<br>4. Hiển thị danh sách chi tiết từng đầu sách. |

### Đặc tả Use Case: Xem báo cáo công nợ
| **Use case ID** | **U012** |
| :--- | :--- |
| **Tên Use Case** | **Xem báo cáo công nợ** |
| **Tóm tắt** | Là quản lý, tôi muốn xem tình hình nợ của khách hàng trong tháng. |
| **Tác nhân** | Admin, Bán hàng |
| **Điều kiện tiên quyết** | Có dữ liệu bán nợ/thu tiền trong tháng. |
| **Kết quả** | Hiển thị bảng báo cáo: Nợ đầu, Phát sinh nợ, Trả nợ, Nợ cuối. |
| **Kịch bản chính** | 1. Người dùng vào trang "Báo cáo".<br>2. Chọn tab "Báo cáo công nợ" và chọn Tháng/Năm.<br>3. Hệ thống truy vấn dữ liệu từ bảng BAO_CAO_CONG_NO.<br>4. Hiển thị danh sách chi tiết từng khách hàng. |

### Đặc tả Use Case: Thay đổi quy định
| **Use case ID** | **U013** |
| :--- | :--- |
| **Tên Use Case** | **Thay đổi quy định** |
| **Tóm tắt** | Là Admin, tôi muốn thay đổi các tham số quy định (như số lượng nhập tối thiểu, nợ tối đa...) để phù hợp với chính sách kinh doanh từng thời điểm. |
| **Tác nhân** | Admin (Chỉ Admin) |
| **Điều kiện tiên quyết** | Đăng nhập với quyền Admin. |
| **Kết quả** | Các quy định mới được áp dụng ngay lập tức. |
| **Kịch bản chính** | 1. Admin vào trang "Cài đặt quy định".<br>2. Hệ thống hiển thị danh sách các quy định hiện hành (QD1, QD2, QD4).<br>3. Admin chọn quy định cần sửa và nhập giá trị mới.<br>4. Admin nhấn "Cập nhật".<br>5. Hệ thống lưu giá trị mới vào CSDL.<br>6. Hệ thống thông báo "Cập nhật quy định thành công". |
