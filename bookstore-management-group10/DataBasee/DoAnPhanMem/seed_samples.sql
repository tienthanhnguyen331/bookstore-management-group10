-- Sample seed data for testing sales + debt recording
-- Adjust database/schema name or run in the correct database context

-- 1) TAI_KHOAN
IF NOT EXISTS (SELECT 1 FROM TAI_KHOAN WHERE TenDangNhap = 'admin')
BEGIN
    INSERT INTO TAI_KHOAN (TenDangNhap, MatKhau, LoaiTaiKhoan, TrangThai)
    VALUES ('admin', 'admin123', 'Admin', 'Active')
END

-- 2) NHAN_VIEN referencing TenDangNhap
IF NOT EXISTS (SELECT 1 FROM NHAN_VIEN WHERE MaNV = 'NV001')
BEGIN
    INSERT INTO NHAN_VIEN (MaNV, HoTen, DiaChi, SDT, Email, ChucVu, TenDangNhap)
    VALUES ('NV001', 'Nguyen Van A', 'Hanoi', '0912345678', 'nv.a@example.com', 'Thu Ngân', 'admin')
END

-- 3) THE_LOAI
IF NOT EXISTS (SELECT 1 FROM THE_LOAI WHERE MaTL = 'TL-TEST')
BEGIN
    INSERT INTO THE_LOAI (MaTL, TenTL) VALUES ('TL-TEST', 'Thể loại test')
END

-- 4) SACH (book)
IF NOT EXISTS (SELECT 1 FROM SACH WHERE MaSach = 'TEST-S001')
BEGIN
    INSERT INTO SACH (MaSach, TenSach, SoLuongTon, MaTL)
    VALUES ('TEST-S001', 'Sách Test 001', 10, 'TL-TEST')
END

-- 5) KHACH_HANG
IF NOT EXISTS (SELECT 1 FROM KHACH_HANG WHERE MaKH = 'KH-TEST1')
BEGIN
    INSERT INTO KHACH_HANG (MaKH, HoTen, DiaChi, SDT, Email, CongNo)
    VALUES ('KH-TEST1', 'Khách Test', 'Hanoi', '0987654321', 'kh.test@example.com', 0)
END

PRINT 'Seed complete. Run in the target database.'
