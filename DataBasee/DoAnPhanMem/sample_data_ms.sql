BEGIN TRANSACTION;
GO

-- 1. TAI_KHOAN
INSERT INTO [TAI_KHOAN] ([TenDangNhap], [MatKhau]) VALUES
(N'admin', N'admin123'),
(N'staff01', N'password123'),
(N'staff02', N'password123'),
(N'staff03', N'password123'),
(N'manager01', N'securepass'),
(N'staff04', N'pass2024'),
(N'staff05', N'bookstore'),
(N'accounting01', N'money123'),
(N'warehouse01', N'stock123'),
(N'admin_backup', N'admin_redundant');

-- 2. NHAN_VIEN
INSERT INTO [NHAN_VIEN] ([MaNV], [HoTen], [DiaChi], [SDT], [Email], [ChucVu], [TenDangNhap]) VALUES
(N'NV001', N'Nguyen Van Quan Ly', N'123 Le Loi, HCM', N'0901000001', N'quanly@bookstore.com', N'Quan Ly', N'admin'),
(N'NV002', N'Tran Thi Nhan Vien', N'456 Nguyen Hue, HCM', N'0901000002', N'nhanvien1@bookstore.com', N'Nhan Vien Ban Hang', N'staff01'),
(N'NV003', N'Le Van Ban', N'789 Tran Hung Dao, HCM', N'0901000003', N'nhanvien2@bookstore.com', N'Nhan Vien Ban Hang', N'staff02'),
(N'NV004', N'Pham Thi Thu Ngan', N'321 Hai Ba Trung, HCM', N'0901000004', N'thungan@bookstore.com', N'Thu Ngan', N'staff03'),
(N'NV005', N'Hoang Van Kho', N'654 Dien Bien Phu, HCM', N'0901000005', N'kho@bookstore.com', N'Thu Kho', N'warehouse01'),
(N'NV006', N'Vu Thi Ke Toan', N'987 Vo Van Kiet, HCM', N'0901000006', N'ketoan@bookstore.com', N'Ke Toan', N'accounting01'),
(N'NV007', N'Dang Van G', N'147 Ly Tu Trong, HCM', N'0901000007', N'nhanvieng@bookstore.com', N'Nhan Vien', N'staff04'),
(N'NV008', N'Bui Thi H', N'258 Pasteurs, HCM', N'0901000008', N'nhanvienh@bookstore.com', N'Nhan Vien', N'staff05'),
(N'NV009', N'Do Van I', N'369 Cach Mang Thang 8, HCM', N'0901000009', N'quanly2@bookstore.com', N'Quan Ly', N'manager01'),
(N'NV010', N'Ngo Thi K', N'159 Nguyen Trai, HCM', N'0901000010', N'adminbk@bookstore.com', N'Quan Ly', N'admin_backup');

-- 3. KHACH_HANG
INSERT INTO [KHACH_HANG] ([MaKH], [HoTen], [DiaChi], [SDT], [Email], [CongNo]) VALUES
(N'KH001', N'Nguyen Van A', N'12 Nguyen Van Troi', N'0912000001', N'nguyenvana@gmail.com', 0),
(N'KH002', N'Tran Thi B', N'34 Le Duan', N'0912000002', N'tranthib@gmail.com', 50000),
(N'KH003', N'Le Van C', N'56 Pasteur', N'0912000003', N'levanc@gmail.com', 0),
(N'KH004', N'Pham Thi D', N'78 Hai Ba Trung', N'0912000004', N'phamthid@gmail.com', 120000),
(N'KH005', N'Hoang Van E', N'90 Dien Bien Phu', N'0912000005', N'hoangvane@gmail.com', 0),
(N'KH006', N'Phan Thi F', N'11 Vo Thi Sau', N'0912000006', N'phanthif@gmail.com', 0),
(N'KH007', N'Vu Van G', N'22 Dinh Tien Hoang', N'0912000007', N'vuvang@gmail.com', 200000),
(N'KH008', N'Dang Thi H', N'33 Ly Tu Trong', N'0912000008', N'dangthih@gmail.com', 0),
(N'KH009', N'Bui Van I', N'44 Nam Ky Khoi Nghia', N'0912000009', N'buivani@gmail.com', 15000),
(N'KH010', N'Do Thi K', N'55 Nguyen Thi Minh Khai', N'0912000010', N'dothik@gmail.com', 0);

-- 4. THE_LOAI
INSERT INTO [THE_LOAI] ([MaTL], [TenTL]) VALUES
(N'TL001', N'Tieu Thuyet'),
(N'TL002', N'Khoa Hoc Vien Tuong'),
(N'TL003', N'Kinh Te'),
(N'TL004', N'Tam Ly Hoc'),
(N'TL005', N'Lich Su'),
(N'TL006', N'Van Hoc Nuoc Ngoai'),
(N'TL007', N'Truyen Tranh'),
(N'TL008', N'Ky Nang Song'),
(N'TL009', N'Giao Khoa'),
(N'TL010', N'Cong Nghe Thong Tin');

-- 5. TAC_GIA
INSERT INTO [TAC_GIA] ([MaTG], [TenTG]) VALUES
(N'TG001', N'Nguyen Nhat Anh'),
(N'TG002', N'J.K. Rowling'),
(N'TG003', N'Haruki Murakami'),
(N'TG004', N'Dan Brown'),
(N'TG005', N'Agatha Christie'),
(N'TG006', N'Stephen King'),
(N'TG007', N'George R.R. Martin'),
(N'TG008', N'To Hoai'),
(N'TG009', N'Nam Cao'),
(N'TG010', N'Vu Trong Phung');

-- 6. SACH
INSERT INTO [SACH] ([MaSach], [TenSach], [SoLuongTon], [DonGia], [MaTL]) VALUES
(N'S001', N'Mat Biec', 50, 120000, N'TL001'),
(N'S002', N'Harry Potter va Hon Da Phu Thuy', 30, 250000, N'TL006'),
(N'S003', N'Rung Na Uy', 20, 180000, N'TL006'),
(N'S004', N'Mat Ma Da Vinci', 40, 220000, N'TL001'),
(N'S005', N'Muoi Nguoi Da Den Nho', 25, 150000, N'TL001'),
(N'S006', N'IT', 15, 300000, N'TL002'),
(N'S007', N'Tro Choi Vuong Quyen', 35, 280000, N'TL002'),
(N'S008', N'De Men Phieu Luu Ky', 100, 80000, N'TL001'),
(N'S009', N'Chi Pheo', 60, 95000, N'TL001'),
(N'S010', N'So Do', 45, 110000, N'TL001');

-- 7. SACH_TAC_GIA
INSERT INTO [SACH_TAC_GIA] ([MaSach], [MaTG]) VALUES
(N'S001', N'TG001'),
(N'S002', N'TG002'),
(N'S003', N'TG003'),
(N'S004', N'TG004'),
(N'S005', N'TG005'),
(N'S006', N'TG006'),
(N'S007', N'TG007'),
(N'S008', N'TG008'),
(N'S009', N'TG009'),
(N'S010', N'TG010');

-- 8. QUY_DINH
INSERT INTO [QUY_DINH] ([TenQuyDinh], [GiaTri], [MaNV]) VALUES
(N'SoLuongNhapToiThieu', N'150', N'NV001'),
(N'LuongTonToiDaTruocKhiNhap', N'300', N'NV001'),
(N'SoTienNoToiDa', N'20000', N'NV001'),
(N'DonGiaBanToiThieu', N'110%', N'NV001'),
(N'ChoPhepThuVuotSoTienNo', N'0', N'NV001'),
(N'ApDungQuyDinh4', N'1', N'NV002'),
(N'ThoiGianBaoHanh', N'12 thang', N'NV001'),
(N'Vat', N'10', N'NV006'),
(N'KhuyenMaiThanhVien', N'5', N'NV001'),
(N'SoSachMuonToiDa', N'5', N'NV001');

-- 9. HOA_DON
INSERT INTO [HOA_DON] ([MaHoaDon], [MaNV], [MaKH]) VALUES
(N'HD001', N'NV002', N'KH001'),
(N'HD002', N'NV003', N'KH002'),
(N'HD003', N'NV002', N'KH003'),
(N'HD004', N'NV004', N'KH004'),
(N'HD005', N'NV002', N'KH005'),
(N'HD006', N'NV003', N'KH006'),
(N'HD007', N'NV004', N'KH007'),
(N'HD008', N'NV002', N'KH008'),
(N'HD009', N'NV003', N'KH009'),
(N'HD010', N'NV004', N'KH010');

-- 10. CHI_TIET_HOA_DON
INSERT INTO [CHI_TIET_HOA_DON] ([MaHoaDon], [MaSach], [SoLuong], [DonGiaBan], [NgayLapHoaDon]) VALUES
(N'HD001', N'S001', 1, 120000, N'2025-12-01 10:00:00'),
(N'HD002', N'S002', 2, 250000, N'2025-12-02 11:30:00'),
(N'HD003', N'S003', 1, 180000, N'2025-12-03 09:15:00'),
(N'HD004', N'S004', 1, 220000, N'2025-12-04 14:20:00'),
(N'HD005', N'S005', 3, 150000, N'2025-12-05 16:45:00'),
(N'HD006', N'S006', 1, 300000, N'2025-12-06 08:30:00'),
(N'HD007', N'S007', 2, 280000, N'2025-12-07 10:10:00'),
(N'HD008', N'S008', 4, 80000, N'2025-12-08 19:00:00'),
(N'HD009', N'S009', 1, 95000, N'2025-12-09 13:40:00'),
(N'HD010', N'S010', 2, 110000, N'2025-12-10 15:55:00');

-- 11. PHIEU_NHAP_SACH
INSERT INTO [PHIEU_NHAP_SACH] ([MaPhieu], [MaNV]) VALUES
(N'PN001', N'NV005'),
(N'PN002', N'NV005'),
(N'PN003', N'NV005'),
(N'PN004', N'NV005'),
(N'PN005', N'NV005'),
(N'PN006', N'NV005'),
(N'PN007', N'NV005'),
(N'PN008', N'NV005'),
(N'PN009', N'NV005'),
(N'PN010', N'NV005');

-- 12. CHI_TIET_PHIEU_NHAP
INSERT INTO [CHI_TIET_PHIEU_NHAP] ([MaPhieu], [MaSach], [NgayNhap], [SoLuongNhap], [Gia]) VALUES
(N'PN001', N'S001', N'2025-12-01 08:00:00', 50, 80000),
(N'PN002', N'S002', N'2025-12-01 09:00:00', 40, 180000),
(N'PN003', N'S003', N'2025-12-02 08:30:00', 30, 120000),
(N'PN004', N'S004', N'2025-12-03 14:00:00', 50, 150000),
(N'PN005', N'S005', N'2025-12-04 10:00:00', 60, 100000),
(N'PN006', N'S006', N'2025-12-05 11:00:00', 20, 200000),
(N'PN007', N'S007', N'2025-12-06 15:30:00', 40, 210000),
(N'PN008', N'S008', N'2025-12-07 09:45:00', 100, 50000),
(N'PN009', N'S009', N'2025-12-08 13:15:00', 80, 60000),
(N'PN010', N'S010', N'2025-12-09 16:00:00', 60, 75000);

-- 13. PHIEU_THU_TIEN
INSERT INTO [PHIEU_THU_TIEN] ([MaPhieu], [NgayThuTien], [SoTienThu], [MaNV], [MaKH]) VALUES
(N'PT001', N'2025-12-05 10:00:00', 120000, N'NV004', N'KH001'),
(N'PT002', N'2025-12-06 10:00:00', 200000, N'NV004', N'KH002'),
(N'PT003', N'2025-12-07 10:00:00', 180000, N'NV004', N'KH003'),
(N'PT004', N'2025-12-08 10:00:00', 220000, N'NV004', N'KH004'),
(N'PT005', N'2025-12-09 10:00:00', 450000, N'NV004', N'KH005'),
(N'PT006', N'2025-12-10 10:00:00', 300000, N'NV004', N'KH006'),
(N'PT007', N'2025-12-11 10:00:00', 560000, N'NV004', N'KH007'),
(N'PT008', N'2025-12-12 10:00:00', 320000, N'NV004', N'KH008'),
(N'PT009', N'2025-12-13 10:00:00', 95000, N'NV004', N'KH009'),
(N'PT010', N'2025-12-14 10:00:00', 220000, N'NV004', N'KH010');

-- 14. BAO_CAO_CONG_NO
INSERT INTO [BAO_CAO_CONG_NO] ([MaBCCN], [Thang], [Nam], [NoDau], [NoPhatSinh], [TraNo], [NoCuoi], [MaKH]) VALUES
(N'BCCN001', 12, 2025, 0, 120000, 120000, 0, N'KH001'),
(N'BCCN002', 12, 2025, 0, 500000, 200000, 300000, N'KH002'),
(N'BCCN003', 12, 2025, 10000, 180000, 180000, 10000, N'KH003'),
(N'BCCN004', 12, 2025, 20000, 220000, 220000, 20000, N'KH004'),
(N'BCCN005', 12, 2025, 0, 450000, 450000, 0, N'KH005'),
(N'BCCN006', 12, 2025, 50000, 300000, 300000, 50000, N'KH006'),
(N'BCCN007', 12, 2025, 0, 560000, 560000, 0, N'KH007'),
(N'BCCN008', 12, 2025, 15000, 320000, 320000, 15000, N'KH008'),
(N'BCCN009', 12, 2025, 0, 95000, 95000, 0, N'KH009'),
(N'BCCN010', 12, 2025, 100000, 220000, 220000, 100000, N'KH010');

-- 15. BAO_CAO_TON
INSERT INTO [BAO_CAO_TON] ([MaBCT], [MaSach], [Thang], [Nam], [TonDau], [PhatSinh], [DaBan], [TonCuoi]) VALUES
(N'BCT001', N'S001', 12, 2025, 0, 50, 1, 49),
(N'BCT002', N'S002', 12, 2025, 0, 30, 2, 28),
(N'BCT003', N'S003', 12, 2025, 0, 20, 1, 19),
(N'BCT004', N'S004', 12, 2025, 0, 40, 1, 39),
(N'BCT005', N'S005', 12, 2025, 0, 25, 3, 22),
(N'BCT006', N'S006', 12, 2025, 0, 15, 1, 14),
(N'BCT007', N'S007', 12, 2025, 0, 35, 2, 33),
(N'BCT008', N'S008', 12, 2025, 0, 100, 4, 96),
(N'BCT009', N'S009', 12, 2025, 0, 60, 1, 59),
(N'BCT010', N'S010', 12, 2025, 0, 45, 2, 43);

COMMIT;
GO
