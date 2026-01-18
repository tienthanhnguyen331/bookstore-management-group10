START TRANSACTION;

-- 1. TAI_KHOAN
INSERT INTO "TAI_KHOAN" ("TenDangNhap", "MatKhau") VALUES
('admin', 'admin123'),
('staff01', 'password123'),
('staff02', 'password123'),
('staff03', 'password123'),
('manager01', 'securepass'),
('staff04', 'pass2024'),
('staff05', 'bookstore'),
('accounting01', 'money123'),
('warehouse01', 'stock123'),
('admin_backup', 'admin_redundant');

-- 2. NHAN_VIEN
INSERT INTO "NHAN_VIEN" ("MaNV", "HoTen", "DiaChi", "SDT", "Email", "ChucVu", "TenDangNhap") VALUES
('NV001', 'Nguyen Van Quan Ly', '123 Le Loi, HCM', '0901000001', 'quanly@bookstore.com', 'Quan Ly', 'admin'),
('NV002', 'Tran Thi Nhan Vien', '456 Nguyen Hue, HCM', '0901000002', 'nhanvien1@bookstore.com', 'Nhan Vien Ban Hang', 'staff01'),
('NV003', 'Le Van Ban', '789 Tran Hung Dao, HCM', '0901000003', 'nhanvien2@bookstore.com', 'Nhan Vien Ban Hang', 'staff02'),
('NV004', 'Pham Thi Thu Ngan', '321 Hai Ba Trung, HCM', '0901000004', 'thungan@bookstore.com', 'Thu Ngan', 'staff03'),
('NV005', 'Hoang Van Kho', '654 Dien Bien Phu, HCM', '0901000005', 'kho@bookstore.com', 'Thu Kho', 'warehouse01'),
('NV006', 'Vu Thi Ke Toan', '987 Vo Van Kiet, HCM', '0901000006', 'ketoan@bookstore.com', 'Ke Toan', 'accounting01'),
('NV007', 'Dang Van G', '147 Ly Tu Trong, HCM', '0901000007', 'nhanvieng@bookstore.com', 'Nhan Vien', 'staff04'),
('NV008', 'Bui Thi H', '258 Pasteurs, HCM', '0901000008', 'nhanvienh@bookstore.com', 'Nhan Vien', 'staff05'),
('NV009', 'Do Van I', '369 Cach Mang Thang 8, HCM', '0901000009', 'quanly2@bookstore.com', 'Quan Ly', 'manager01'),
('NV010', 'Ngo Thi K', '159 Nguyen Trai, HCM', '0901000010', 'adminbk@bookstore.com', 'Quan Ly', 'admin_backup');

-- 3. KHACH_HANG
INSERT INTO "KHACH_HANG" ("MaKH", "HoTen", "DiaChi", "SDT", "Email", "CongNo") VALUES
('KH001', 'Nguyen Van A', '12 Nguyen Van Troi', '0912000001', 'nguyenvana@gmail.com', 0),
('KH002', 'Tran Thi B', '34 Le Duan', '0912000002', 'tranthib@gmail.com', 50000),
('KH003', 'Le Van C', '56 Pasteur', '0912000003', 'levanc@gmail.com', 0),
('KH004', 'Pham Thi D', '78 Hai Ba Trung', '0912000004', 'phamthid@gmail.com', 120000),
('KH005', 'Hoang Van E', '90 Dien Bien Phu', '0912000005', 'hoangvane@gmail.com', 0),
('KH006', 'Phan Thi F', '11 Vo Thi Sau', '0912000006', 'phanthif@gmail.com', 0),
('KH007', 'Vu Van G', '22 Dinh Tien Hoang', '0912000007', 'vuvang@gmail.com', 200000),
('KH008', 'Dang Thi H', '33 Ly Tu Trong', '0912000008', 'dangthih@gmail.com', 0),
('KH009', 'Bui Van I', '44 Nam Ky Khoi Nghia', '0912000009', 'buivani@gmail.com', 15000),
('KH010', 'Do Thi K', '55 Nguyen Thi Minh Khai', '0912000010', 'dothik@gmail.com', 0);

-- 4. THE_LOAI
INSERT INTO "THE_LOAI" ("MaTL", "TenTL") VALUES
('TL001', 'Tieu Thuyet'),
('TL002', 'Khoa Hoc Vien Tuong'),
('TL003', 'Kinh Te'),
('TL004', 'Tam Ly Hoc'),
('TL005', 'Lich Su'),
('TL006', 'Van Hoc Nuoc Ngoai'),
('TL007', 'Truyen Tranh'),
('TL008', 'Ky Nang Song'),
('TL009', 'Giao Khoa'),
('TL010', 'Cong Nghe Thong Tin');

-- 5. TAC_GIA
INSERT INTO "TAC_GIA" ("MaTG", "TenTG") VALUES
('TG001', 'Nguyen Nhat Anh'),
('TG002', 'J.K. Rowling'),
('TG003', 'Haruki Murakami'),
('TG004', 'Dan Brown'),
('TG005', 'Agatha Christie'),
('TG006', 'Stephen King'),
('TG007', 'George R.R. Martin'),
('TG008', 'To Hoai'),
('TG009', 'Nam Cao'),
('TG010', 'Vu Trong Phung');

-- 6. SACH
INSERT INTO "SACH" ("MaSach", "TenSach", "SoLuongTon", "DonGia", "MaTL") VALUES
('S001', 'Mat Biec', 50, 120000, 'TL001'),
('S002', 'Harry Potter va Hon Da Phu Thuy', 30, 250000, 'TL006'),
('S003', 'Rung Na Uy', 20, 180000, 'TL006'),
('S004', 'Mat Ma Da Vinci', 40, 220000, 'TL001'),
('S005', 'Muoi Nguoi Da Den Nho', 25, 150000, 'TL001'),
('S006', 'IT', 15, 300000, 'TL002'),
('S007', 'Tro Choi Vuong Quyen', 35, 280000, 'TL002'),
('S008', 'De Men Phieu Luu Ky', 100, 80000, 'TL001'),
('S009', 'Chi Pheo', 60, 95000, 'TL001'),
('S010', 'So Do', 45, 110000, 'TL001');

-- 7. SACH_TAC_GIA
INSERT INTO "SACH_TAC_GIA" ("MaSach", "MaTG") VALUES
('S001', 'TG001'),
('S002', 'TG002'),
('S003', 'TG003'),
('S004', 'TG004'),
('S005', 'TG005'),
('S006', 'TG006'),
('S007', 'TG007'),
('S008', 'TG008'),
('S009', 'TG009'),
('S010', 'TG010');

-- 8. QUY_DINH
INSERT INTO "QUY_DINH" ("TenQuyDinh", "GiaTri", "MaNV") VALUES
('SoLuongNhapToiThieu', '150', 'NV001'),
('LuongTonToiDaTruocKhiNhap', '300', 'NV001'),
('SoTienNoToiDa', '20000', 'NV001'),
('DonGiaBanToiThieu', '110%', 'NV001'),
('ChoPhepThuVuotSoTienNo', '0', 'NV001'),
('ApDungQuyDinh4', '1', 'NV002'),
('ThoiGianBaoHanh', '12 thang', 'NV001'),
('Vat', '10', 'NV006'),
('KhuyenMaiThanhVien', '5', 'NV001'),
('SoSachMuonToiDa', '5', 'NV001');

-- 9. HOA_DON
INSERT INTO "HOA_DON" ("MaHoaDon", "MaNV", "MaKH") VALUES
('HD001', 'NV002', 'KH001'),
('HD002', 'NV003', 'KH002'),
('HD003', 'NV002', 'KH003'),
('HD004', 'NV004', 'KH004'),
('HD005', 'NV002', 'KH005'),
('HD006', 'NV003', 'KH006'),
('HD007', 'NV004', 'KH007'),
('HD008', 'NV002', 'KH008'),
('HD009', 'NV003', 'KH009'),
('HD010', 'NV004', 'KH010');

-- 10. CHI_TIET_HOA_DON
INSERT INTO "CHI_TIET_HOA_DON" ("MaHoaDon", "MaSach", "SoLuong", "DonGiaBan", "NgayLapHoaDon") VALUES
('HD001', 'S001', 1, 120000, '2025-12-01 10:00:00+07'),
('HD002', 'S002', 2, 250000, '2025-12-02 11:30:00+07'),
('HD003', 'S003', 1, 180000, '2025-12-03 09:15:00+07'),
('HD004', 'S004', 1, 220000, '2025-12-04 14:20:00+07'),
('HD005', 'S005', 3, 150000, '2025-12-05 16:45:00+07'),
('HD006', 'S006', 1, 300000, '2025-12-06 08:30:00+07'),
('HD007', 'S007', 2, 280000, '2025-12-07 10:10:00+07'),
('HD008', 'S008', 4, 80000, '2025-12-08 19:00:00+07'),
('HD009', 'S009', 1, 95000, '2025-12-09 13:40:00+07'),
('HD010', 'S010', 2, 110000, '2025-12-10 15:55:00+07');

-- 11. PHIEU_NHAP_SACH
INSERT INTO "PHIEU_NHAP_SACH" ("MaPhieu", "MaNV") VALUES
('PN001', 'NV005'),
('PN002', 'NV005'),
('PN003', 'NV005'),
('PN004', 'NV005'),
('PN005', 'NV005'),
('PN006', 'NV005'),
('PN007', 'NV005'),
('PN008', 'NV005'),
('PN009', 'NV005'),
('PN010', 'NV005');

-- 12. CHI_TIET_PHIEU_NHAP
INSERT INTO "CHI_TIET_PHIEU_NHAP" ("MaPhieu", "MaSach", "NgayNhap", "SoLuongNhap", "Gia") VALUES
('PN001', 'S001', '2025-12-01 08:00:00+07', 50, 80000),
('PN002', 'S002', '2025-12-01 09:00:00+07', 40, 180000),
('PN003', 'S003', '2025-12-02 08:30:00+07', 30, 120000),
('PN004', 'S004', '2025-12-03 14:00:00+07', 50, 150000),
('PN005', 'S005', '2025-12-04 10:00:00+07', 60, 100000),
('PN006', 'S006', '2025-12-05 11:00:00+07', 20, 200000),
('PN007', 'S007', '2025-12-06 15:30:00+07', 40, 210000),
('PN008', 'S008', '2025-12-07 09:45:00+07', 100, 50000),
('PN009', 'S009', '2025-12-08 13:15:00+07', 80, 60000),
('PN010', 'S010', '2025-12-09 16:00:00+07', 60, 75000);

-- 13. PHIEU_THU_TIEN
INSERT INTO "PHIEU_THU_TIEN" ("MaPhieu", "NgayThuTien", "SoTienThu", "MaNV", "MaKH") VALUES
('PT001', '2025-12-05 10:00:00+07', 120000, 'NV004', 'KH001'),
('PT002', '2025-12-06 10:00:00+07', 200000, 'NV004', 'KH002'),
('PT003', '2025-12-07 10:00:00+07', 180000, 'NV004', 'KH003'),
('PT004', '2025-12-08 10:00:00+07', 220000, 'NV004', 'KH004'),
('PT005', '2025-12-09 10:00:00+07', 450000, 'NV004', 'KH005'),
('PT006', '2025-12-10 10:00:00+07', 300000, 'NV004', 'KH006'),
('PT007', '2025-12-11 10:00:00+07', 560000, 'NV004', 'KH007'),
('PT008', '2025-12-12 10:00:00+07', 320000, 'NV004', 'KH008'),
('PT009', '2025-12-13 10:00:00+07', 95000, 'NV004', 'KH009'),
('PT010', '2025-12-14 10:00:00+07', 220000, 'NV004', 'KH010');

-- 14. BAO_CAO_CONG_NO
INSERT INTO "BAO_CAO_CONG_NO" ("MaBCCN", "Thang", "Nam", "NoDau", "NoPhatSinh", "TraNo", "NoCuoi", "MaKH") VALUES
('BCCN001', 12, 2025, 0, 120000, 120000, 0, 'KH001'),
('BCCN002', 12, 2025, 0, 500000, 200000, 300000, 'KH002'),
('BCCN003', 12, 2025, 10000, 180000, 180000, 10000, 'KH003'),
('BCCN004', 12, 2025, 20000, 220000, 220000, 20000, 'KH004'),
('BCCN005', 12, 2025, 0, 450000, 450000, 0, 'KH005'),
('BCCN006', 12, 2025, 50000, 300000, 300000, 50000, 'KH006'),
('BCCN007', 12, 2025, 0, 560000, 560000, 0, 'KH007'),
('BCCN008', 12, 2025, 15000, 320000, 320000, 15000, 'KH008'),
('BCCN009', 12, 2025, 0, 95000, 95000, 0, 'KH009'),
('BCCN010', 12, 2025, 100000, 220000, 220000, 100000, 'KH010');

-- 15. BAO_CAO_TON
INSERT INTO "BAO_CAO_TON" ("MaBCT", "MaSach", "Thang", "Nam", "TonDau", "PhatSinh", "DaBan", "TonCuoi") VALUES
('BCT001', 'S001', 12, 2025, 0, 50, 1, 49),
('BCT002', 'S002', 12, 2025, 0, 30, 2, 28),
('BCT003', 'S003', 12, 2025, 0, 20, 1, 19),
('BCT004', 'S004', 12, 2025, 0, 40, 1, 39),
('BCT005', 'S005', 12, 2025, 0, 25, 3, 22),
('BCT006', 'S006', 12, 2025, 0, 15, 1, 14),
('BCT007', 'S007', 12, 2025, 0, 35, 2, 33),
('BCT008', 'S008', 12, 2025, 0, 100, 4, 96),
('BCT009', 'S009', 12, 2025, 0, 60, 1, 59),
('BCT010', 'S010', 12, 2025, 0, 45, 2, 43);

COMMIT;
