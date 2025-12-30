-- Full seed data for testing sales + debt + inventory reports
-- Run this in the target database (SSMS, Azure Data Studio, or sqlcmd)

SET NOCOUNT ON;

-- 1) TAI_KHOAN
IF NOT EXISTS (SELECT 1 FROM TAI_KHOAN WHERE TenDangNhap = 'admin')
BEGIN
    INSERT INTO TAI_KHOAN (TenDangNhap, MatKhau, LoaiTaiKhoan, TrangThai)
    VALUES ('admin', 'admin123', 'Admin', 'Active');
END

-- 2) NHAN_VIEN (references TenDangNhap)
IF NOT EXISTS (SELECT 1 FROM NHAN_VIEN WHERE MaNV = 'NV001')
BEGIN
    INSERT INTO NHAN_VIEN (MaNV, HoTen, DiaChi, SDT, Email, ChucVu, TenDangNhap)
    VALUES ('NV001', 'Nguyen Van A', 'Hanoi', '0912345678', 'nv.a@example.com', 'Thu Ngan', 'admin');
END

-- 3) THE_LOAI
IF NOT EXISTS (SELECT 1 FROM THE_LOAI WHERE MaTL = 'TL-TEST')
BEGIN
    INSERT INTO THE_LOAI (MaTL, TenTL) VALUES ('TL-TEST', 'Thể loại test');
END

-- 4) SACH (multiple books)
IF NOT EXISTS (SELECT 1 FROM SACH WHERE MaSach = 'TEST-S001')
BEGIN
    INSERT INTO SACH (MaSach, TenSach, SoLuongTon, MaTL)
    VALUES ('TEST-S001', 'Sách Test 001', 20, 'TL-TEST');
END

IF NOT EXISTS (SELECT 1 FROM SACH WHERE MaSach = 'TEST-S002')
BEGIN
    INSERT INTO SACH (MaSach, TenSach, SoLuongTon, MaTL)
    VALUES ('TEST-S002', 'Sách Test 002', 50, 'TL-TEST');
END

-- 5) KHACH_HANG
IF NOT EXISTS (SELECT 1 FROM KHACH_HANG WHERE MaKH = 'KH-TEST1')
BEGIN
    INSERT INTO KHACH_HANG (MaKH, HoTen, DiaChi, SDT, Email, CongNo)
    VALUES ('KH-TEST1', 'Khách Test 1', 'Hanoi', '0987654321', 'kh.test1@example.com', 0);
END

-- 6) QUY_DINH (rules used by RuleService)
-- Model `QUY_DINH` uses `TenQuyDinh` as the primary key.
IF NOT EXISTS (SELECT 1 FROM QUY_DINH WHERE TenQuyDinh = 'QD2_NoToiDa')
BEGIN
    INSERT INTO QUY_DINH (TenQuyDinh, GiaTri, TrangThai)
    VALUES ('QD2_NoToiDa', '10000000', 1);
END

IF NOT EXISTS (SELECT 1 FROM QUY_DINH WHERE TenQuyDinh = 'QD2_TonToiThieuSauBan')
BEGIN
    INSERT INTO QUY_DINH (TenQuyDinh, GiaTri, TrangThai)
    VALUES ('QD2_TonToiThieuSauBan', '0', 1);
END

IF NOT EXISTS (SELECT 1 FROM QUY_DINH WHERE TenQuyDinh = 'QD1_NhapToiThieu')
BEGIN
    INSERT INTO QUY_DINH (TenQuyDinh, GiaTri, TrangThai)
    VALUES ('QD1_NhapToiThieu', '1', 1);
END

IF NOT EXISTS (SELECT 1 FROM QUY_DINH WHERE TenQuyDinh = 'QD1_TonToiDaTruocNhap')
BEGIN
    INSERT INTO QUY_DINH (TenQuyDinh, GiaTri, TrangThai)
    VALUES ('QD1_TonToiDaTruocNhap', '1000000', 1);
END

-- 7) Optional: clear existing BAO_CAO_CONG_NO / BAO_CAO_TON rows for the test customer/book (uncomment if needed)
-- DELETE FROM BAO_CAO_CONG_NO WHERE MaKH = 'KH-TEST1';
-- DELETE FROM BAO_CAO_TON WHERE MaSach IN ('TEST-S001','TEST-S002');

PRINT 'Seed SQL ready. Execute this script in your database context.';
