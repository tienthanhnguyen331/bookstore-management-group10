# Danh sách Đặc tả Use Case (Dựa trên Backend hiện tại)

Dưới đây là danh sách các Use Case được tổng hợp từ mã nguồn Backend (Controllers & Services) của dự án Bookstore.

## 1. Nhóm Quản trị hệ thống & Tài khoản

### 4.2.1. Đặc tả Use Case 1: Đăng nhập
| Use case ID | U001 |
| :--- | :--- |
| **Tên Use Case** | Đăng nhập hệ thống |
| **Tóm tắt** | Người dùng đăng nhập vào hệ thống để thực hiện các chức năng theo phân quyền. |
| **Tác nhân** | Admin, Nhân viên (Bán hàng, Thủ kho) |
| **Điều kiện tiên quyết** | Tài khoản đã được tạo trong hệ thống. |
| **Kết quả** | Nhận được Token (JWT) để truy cập các API bảo mật. |
| **Kịch bản chính** | 1. Người dùng nhập Tên đăng nhập và Mật khẩu.<br>2. Hệ thống kiểm tra thông tin.<br>3. Hệ thống trả về Token và thông tin Role. |
| **Kịch bản phụ** | 3a. Sai tên đăng nhập hoặc mật khẩu: Hệ thống báo lỗi. |
| **Ràng buộc phi chức năng** | Mật khẩu được mã hóa (BCrypt). Token có thời hạn. |

### 4.2.2. Đặc tả Use Case 2: Đổi mật khẩu
| Use case ID | U002 |
| :--- | :--- |
| **Tên Use Case** | Đổi mật khẩu |
| **Tóm tắt** | Người dùng thay đổi mật khẩu hiện tại của mình. |
| **Tác nhân** | Admin, Nhân viên |
| **Điều kiện tiên quyết** | Đã đăng nhập thành công. |
| **Kết quả** | Mật khẩu trong Database được cập nhật mới. |
| **Kịch bản chính** | 1. Người dùng nhập Mật khẩu cũ và Mật khẩu mới.<br>2. Hệ thống xác thực mật khẩu cũ.<br>3. Hệ thống cập nhật mật khẩu mới. |
| **Kịch bản phụ** | 2a. Mật khẩu cũ không đúng: Báo lỗi.<br>3a. Mật khẩu mới không đủ độ mạnh (nếu có rule): Báo lỗi. |
| **Ràng buộc phi chức năng** | Bảo mật, mã hóa một chiều. |

### 4.2.3. Đặc tả Use Case 3: Quên mật khẩu (OTP)
| Use case ID | U003 |
| :--- | :--- |
| **Tên Use Case** | Quên mật khẩu (Khôi phục qua Email) |
| **Tóm tắt** | Người dùng yêu cầu cấp lại mật khẩu khi bị quên thông qua mã OTP gửi về Email. |
| **Tác nhân** | Admin, Nhân viên |
| **Điều kiện tiên quyết** | Email của nhân viên đã được đăng ký trong hệ thống. |
| **Kết quả** | Mật khẩu được đặt lại theo ý người dùng. |
| **Kịch bản chính** | 1. Người dùng nhập Email.<br>2. Hệ thống gửi mã OTP về Email.<br>3. Người dùng nhập OTP và Mật khẩu mới.<br>4. Hệ thống xác thực và cập nhật mật khẩu. |
| **Kịch bản phụ** | 1a. Email không tồn tại: Báo lỗi.<br>3a. OTP sai hoặc hết hạn: Báo lỗi. |
| **Ràng buộc phi chức năng** | OTP hết hạn sau 5 phút. Gửi mail qua SMTP. |

### 4.2.4. Đặc tả Use Case 4: Quản lý hồ sơ cá nhân
| Use case ID | U004 |
| :--- | :--- |
| **Tên Use Case** | Xem và Cập nhật hồ sơ cá nhân |
| **Tóm tắt** | Nhân viên tự xem và cập nhật thông tin liên hệ của mình. |
| **Tác nhân** | Admin, Nhân viên |
| **Điều kiện tiên quyết** | Đã đăng nhập. |
| **Kết quả** | Thông tin (SĐT, Email, Địa chỉ) được cập nhật. |
| **Kịch bản chính** | 1. Người dùng yêu cầu xem/sửa thông tin.<br>2. Hệ thống hiển thị thông tin hiện tại.<br>3. Người dùng nhập thông tin mới.<br>4. Hệ thống kiểm tra trùng lặp (SĐT, Email) và lưu lại. |
| **Kịch bản phụ** | 4a. SĐT hoặc Email trùng với nhân viên khác: Báo lỗi. |
| **Ràng buộc phi chức năng** | Không được sửa Mã NV, Chức vụ. |

---

## 2. Nhóm Quản lý Nghiệp vụ (Sách & Kho)

### 4.2.5. Đặc tả Use Case 5: Tra cứu sách
| Use case ID | U005 |
| :--- | :--- |
| **Tên Use Case** | Tra cứu danh sách sách |
| **Tóm tắt** | Xem danh sách sách, tìm kiếm theo tên, thể loại, tác giả. |
| **Tác nhân** | Admin, Nhân viên Bán hàng, Thủ kho |
| **Điều kiện tiên quyết** | Đã đăng nhập. |
| **Kết quả** | Hiển thị danh sách sách kèm số lượng tồn, đơn giá. |
| **Kịch bản chính** | 1. Người dùng truy cập trang danh sách sách.<br>2. Hệ thống hiển thị danh sách sách (kèm Tên, Thể loại, Tác giả, Tồn kho). |
| **Kịch bản phụ** | Không có dữ liệu: Hiển thị danh sách rỗng. |
| **Ràng buộc phi chức năng** | Tốc độ tải nhanh. |

### 4.2.6. Đặc tả Use Case 6: Nhập sách (Lập phiếu nhập)
| Use case ID | U006 |
| :--- | :--- |
| **Tên Use Case** | Lập phiếu nhập sách |
| **Tóm tắt** | Thủ kho nhập thêm sách vào kho (sách mới hoặc sách cũ). |
| **Tác nhân** | Thủ kho, Admin |
| **Điều kiện tiên quyết** | Sách phải tồn tại trong danh mục (hoặc tạo mới). Tuân thủ quy định nhập. |
| **Kết quả** | Tăng số lượng tồn kho, tạo phiếu nhập, cập nhật báo cáo tồn. |
| **Kịch bản chính** | 1. Người dùng chọn sách và nhập số lượng, đơn giá nhập.<br>2. Hệ thống kiểm tra Quy định (Nhập tối thiểu, Tồn tối đa trước nhập).<br>3. Hệ thống lưu phiếu nhập và cập nhật kho. |
| **Kịch bản phụ** | 2a. Vi phạm quy định (VD: Nhập ít hơn 150 cuốn): Báo lỗi và chặn nhập. |
| **Ràng buộc phi chức năng** | Đảm bảo tính nhất quán dữ liệu (Transaction). |

### 4.2.7. Đặc tả Use Case 7: Thêm mới đầu sách
| Use case ID | U007 |
| :--- | :--- |
| **Tên Use Case** | Thêm mới đầu sách |
| **Tóm tắt** | Tạo thông tin cho một đầu sách hoàn toàn mới chưa có trong hệ thống. |
| **Tác nhân** | Thủ kho, Admin |
| **Điều kiện tiên quyết** | Không trùng mã sách (hệ thống tự sinh). |
| **Kết quả** | Sách mới được thêm vào CSDL. |
| **Kịch bản chính** | 1. Nhập tên sách, thể loại, tác giả, đơn giá.<br>2. Hệ thống tự động tạo/tìm Thể loại và Tác giả.<br>3. Hệ thống sinh mã Sách và lưu lại. |
| **Kịch bản phụ** | 1a. Thiếu thông tin bắt buộc: Báo lỗi. |
| **Ràng buộc phi chức năng** | Tự động sinh mã (Auto-increment logic). |

---

## 3. Nhóm Nghiệp vụ Bán hàng & Công nợ

### 4.2.8. Đặc tả Use Case 8: Tra cứu khách hàng
| Use case ID | U008 |
| :--- | :--- |
| **Tên Use Case** | Tra cứu khách hàng |
| **Tóm tắt** | Tìm kiếm thông tin khách hàng và công nợ hiện tại qua Số điện thoại. |
| **Tác nhân** | Nhân viên Bán hàng, Admin |
| **Điều kiện tiên quyết** | Đã đăng nhập. |
| **Kết quả** | Hiển thị tên, số nợ hiện tại của khách. |
| **Kịch bản chính** | 1. Nhập số điện thoại khách hàng.<br>2. Hệ thống trả về thông tin khách và số tiền đang nợ. |
| **Kịch bản phụ** | 2a. Không tìm thấy: Trả về thông tin mặc định (Khách vãng lai) hoặc gợi ý tạo mới. |
| **Ràng buộc phi chức năng** | Phản hồi tức thì. |

### 4.2.9. Đặc tả Use Case 9: Lập hóa đơn bán sách
| Use case ID | U009 |
| :--- | :--- |
| **Tên Use Case** | Lập hóa đơn bán sách |
| **Tóm tắt** | Ghi nhận giao dịch bán sách cho khách hàng. |
| **Tác nhân** | Nhân viên Bán hàng, Admin |
| **Điều kiện tiên quyết** | Sách đủ tồn kho. Khách hàng không nợ quá quy định (nếu mua nợ). |
| **Kết quả** | Giảm tồn kho, tăng công nợ khách (nếu có), tạo hóa đơn. |
| **Kịch bản chính** | 1. Chọn khách hàng và danh sách sách cần mua.<br>2. Hệ thống kiểm tra Tồn kho và Quy định (Nợ tối đa, Tồn tối thiểu sau bán).<br>3. Hệ thống tính tiền, lưu hóa đơn, trừ kho, cập nhật nợ. |
| **Kịch bản phụ** | 2a. Khách nợ quá 20.000đ: Chặn bán nợ.<br>2b. Sách tồn kho sau bán < 20: Chặn bán. |
| **Ràng buộc phi chức năng** | Transaction đảm bảo dữ liệu Kho và Nợ khớp nhau. |

### 4.2.10. Đặc tả Use Case 10: Lập phiếu thu tiền
| Use case ID | U010 |
| :--- | :--- |
| **Tên Use Case** | Lập phiếu thu tiền |
| **Tóm tắt** | Thu tiền nợ từ khách hàng. |
| **Tác nhân** | Nhân viên Bán hàng, Admin |
| **Điều kiện tiên quyết** | Khách hàng có nợ. Số tiền thu không vượt quá số nợ. |
| **Kết quả** | Giảm nợ của khách hàng, tạo phiếu thu. |
| **Kịch bản chính** | 1. Chọn khách hàng và nhập số tiền thu.<br>2. Hệ thống kiểm tra Quy định (Tiền thu <= Tiền nợ).<br>3. Hệ thống lưu phiếu thu và trừ nợ khách hàng. |
| **Kịch bản phụ** | 2a. Thu nhiều hơn nợ: Báo lỗi. |
| **Ràng buộc phi chức năng** | Chính xác về tiền tệ. |

---

## 4. Nhóm Báo cáo & Cài đặt

### 4.2.11. Đặc tả Use Case 11: Xem báo cáo tồn
| Use case ID | U011 |
| :--- | :--- |
| **Tên Use Case** | Xem báo cáo tồn kho |
| **Tóm tắt** | Xem biến động tồn kho (Tồn đầu, Phát sinh, Tồn cuối) theo tháng. |
| **Tác nhân** | Admin, Thủ kho |
| **Điều kiện tiên quyết** | Có dữ liệu nhập/bán trong tháng. |
| **Kết quả** | Hiển thị bảng báo cáo tồn. |
| **Kịch bản chính** | 1. Chọn tháng/năm.<br>2. Hệ thống truy xuất dữ liệu từ bảng BAO_CAO_TON và hiển thị. |
| **Kịch bản phụ** | Không có dữ liệu: Báo cáo rỗng. |
| **Ràng buộc phi chức năng** | Dữ liệu phải khớp với thực tế nhập/xuất. |

### 4.2.12. Đặc tả Use Case 12: Xem báo cáo công nợ
| Use case ID | U012 |
| :--- | :--- |
| **Tên Use Case** | Xem báo cáo công nợ |
| **Tóm tắt** | Xem biến động công nợ khách hàng (Nợ đầu, Phát sinh, Trả, Nợ cuối) theo tháng. |
| **Tác nhân** | Admin, Bán hàng |
| **Điều kiện tiên quyết** | Có dữ liệu bán nợ/thu tiền trong tháng. |
| **Kết quả** | Hiển thị bảng báo cáo công nợ. |
| **Kịch bản chính** | 1. Chọn tháng/năm.<br>2. Hệ thống truy xuất dữ liệu từ bảng BAO_CAO_CONG_NO và hiển thị. |
| **Kịch bản phụ** | Không có dữ liệu: Báo cáo rỗng. |
| **Ràng buộc phi chức năng** | Chính xác. |

### 4.2.13. Đặc tả Use Case 13: Thay đổi quy định
| Use case ID | U013 |
| :--- | :--- |
| **Tên Use Case** | Thay đổi quy định |
| **Tóm tắt** | Cập nhật các tham số quy định của hệ thống (Số lượng nhập tối thiểu, Tồn tối đa, v.v.). |
| **Tác nhân** | Admin (Chỉ Admin) |
| **Điều kiện tiên quyết** | Đăng nhập quyền Admin. |
| **Kết quả** | Các quy định mới được áp dụng ngay lập tức cho các giao dịch sau đó. |
| **Kịch bản chính** | 1. Admin xem danh sách quy định.<br>2. Admin nhập giá trị mới và lưu.<br>3. Hệ thống cập nhật vào CSDL. |
| **Kịch bản phụ** | 2a. Nhập giá trị không hợp lệ (âm): Báo lỗi. |
| **Ràng buộc phi chức năng** | Áp dụng toàn hệ thống. |
