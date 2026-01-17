IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20260101151616_TaoDatabase')
BEGIN
    CREATE TABLE [KHACH_HANG] (
        [MaKH] nvarchar(100) NOT NULL,
        [HoTen] nvarchar(100) NOT NULL,
        [DiaChi] nvarchar(100) NOT NULL,
        [SDT] nvarchar(100) NOT NULL,
        [Email] nvarchar(100) NOT NULL,
        [CongNo] decimal(18,0) NOT NULL DEFAULT 0.0,
        CONSTRAINT [PK_KHACH_HANG] PRIMARY KEY ([MaKH])
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20260101151616_TaoDatabase')
BEGIN
    CREATE TABLE [TAC_GIA] (
        [MaTG] nvarchar(100) NOT NULL,
        [TenTG] nvarchar(100) NOT NULL,
        CONSTRAINT [PK_TAC_GIA] PRIMARY KEY ([MaTG])
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20260101151616_TaoDatabase')
BEGIN
    CREATE TABLE [TAI_KHOAN] (
        [TenDangNhap] nvarchar(100) NOT NULL,
        [MatKhau] nvarchar(100) NOT NULL,
        CONSTRAINT [PK_TAI_KHOAN] PRIMARY KEY ([TenDangNhap])
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20260101151616_TaoDatabase')
BEGIN
    CREATE TABLE [THE_LOAI] (
        [MaTL] nvarchar(100) NOT NULL,
        [TenTL] nvarchar(100) NOT NULL,
        CONSTRAINT [PK_THE_LOAI] PRIMARY KEY ([MaTL])
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20260101151616_TaoDatabase')
BEGIN
    CREATE TABLE [BAO_CAO_CONG_NO] (
        [MaBCCN] nvarchar(100) NOT NULL,
        [Thang] int NOT NULL,
        [Nam] int NOT NULL,
        [NoDau] decimal(18,0) NOT NULL,
        [NoPhatSinh] decimal(18,0) NOT NULL,
        [TraNo] decimal(18,0) NOT NULL,
        [NoCuoi] decimal(18,0) NOT NULL,
        [MaKH] nvarchar(100) NOT NULL,
        CONSTRAINT [PK_BAO_CAO_CONG_NO] PRIMARY KEY ([MaBCCN]),
        CONSTRAINT [FK_BAO_CAO_CONG_NO_KHACH_HANG_MaKH] FOREIGN KEY ([MaKH]) REFERENCES [KHACH_HANG] ([MaKH]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20260101151616_TaoDatabase')
BEGIN
    CREATE TABLE [NHAN_VIEN] (
        [MaNV] nvarchar(100) NOT NULL,
        [HoTen] nvarchar(100) NOT NULL,
        [DiaChi] nvarchar(100) NOT NULL,
        [SDT] nvarchar(100) NOT NULL,
        [Email] nvarchar(100) NOT NULL,
        [ChucVu] nvarchar(100) NOT NULL,
        [TenDangNhap] nvarchar(100) NOT NULL,
        CONSTRAINT [PK_NHAN_VIEN] PRIMARY KEY ([MaNV]),
        CONSTRAINT [FK_NHAN_VIEN_TAI_KHOAN_TenDangNhap] FOREIGN KEY ([TenDangNhap]) REFERENCES [TAI_KHOAN] ([TenDangNhap]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20260101151616_TaoDatabase')
BEGIN
    CREATE TABLE [SACH] (
        [MaSach] nvarchar(100) NOT NULL,
        [TenSach] nvarchar(100) NOT NULL,
        [SoLuongTon] int NOT NULL DEFAULT 0,
        [DonGia] decimal(18,0) NOT NULL,
        [MaTL] nvarchar(100) NOT NULL,
        CONSTRAINT [PK_SACH] PRIMARY KEY ([MaSach]),
        CONSTRAINT [CK_SACH_SoLuongTon_Valid] CHECK (SoLuongTon >= 0),
        CONSTRAINT [FK_SACH_THE_LOAI_MaTL] FOREIGN KEY ([MaTL]) REFERENCES [THE_LOAI] ([MaTL]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20260101151616_TaoDatabase')
BEGIN
    CREATE TABLE [HOA_DON] (
        [MaHoaDon] nvarchar(100) NOT NULL,
        [MaNV] nvarchar(100) NULL,
        [MaKH] nvarchar(100) NULL,
        CONSTRAINT [PK_HOA_DON] PRIMARY KEY ([MaHoaDon]),
        CONSTRAINT [FK_HOA_DON_KHACH_HANG_MaKH] FOREIGN KEY ([MaKH]) REFERENCES [KHACH_HANG] ([MaKH]) ON DELETE NO ACTION,
        CONSTRAINT [FK_HOA_DON_NHAN_VIEN_MaNV] FOREIGN KEY ([MaNV]) REFERENCES [NHAN_VIEN] ([MaNV]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20260101151616_TaoDatabase')
BEGIN
    CREATE TABLE [PHIEU_NHAP_SACH] (
        [MaPhieu] nvarchar(100) NOT NULL,
        [MaNV] nvarchar(100) NOT NULL,
        CONSTRAINT [PK_PHIEU_NHAP_SACH] PRIMARY KEY ([MaPhieu]),
        CONSTRAINT [FK_PHIEU_NHAP_SACH_NHAN_VIEN_MaNV] FOREIGN KEY ([MaNV]) REFERENCES [NHAN_VIEN] ([MaNV]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20260101151616_TaoDatabase')
BEGIN
    CREATE TABLE [PHIEU_THU_TIEN] (
        [MaPhieu] nvarchar(100) NOT NULL,
        [NgayThuTien] datetime2 NOT NULL,
        [SoTienThu] decimal(18,0) NOT NULL,
        [MaNV] nvarchar(100) NULL,
        [MaKH] nvarchar(100) NOT NULL,
        CONSTRAINT [PK_PHIEU_THU_TIEN] PRIMARY KEY ([MaPhieu]),
        CONSTRAINT [CK_PHIEU_THU_TIEN_CK_PTT_SoTien] CHECK (SoTienThu > 0),
        CONSTRAINT [FK_PHIEU_THU_TIEN_KHACH_HANG_MaKH] FOREIGN KEY ([MaKH]) REFERENCES [KHACH_HANG] ([MaKH]) ON DELETE NO ACTION,
        CONSTRAINT [FK_PHIEU_THU_TIEN_NHAN_VIEN_MaNV] FOREIGN KEY ([MaNV]) REFERENCES [NHAN_VIEN] ([MaNV]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20260101151616_TaoDatabase')
BEGIN
    CREATE TABLE [QUY_DINH] (
        [TenQuyDinh] nvarchar(100) NOT NULL,
        [GiaTri] nvarchar(100) NOT NULL,
        [MaNV] nvarchar(100) NOT NULL,
        CONSTRAINT [PK_QUY_DINH] PRIMARY KEY ([TenQuyDinh]),
        CONSTRAINT [FK_QUY_DINH_NHAN_VIEN_MaNV] FOREIGN KEY ([MaNV]) REFERENCES [NHAN_VIEN] ([MaNV]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20260101151616_TaoDatabase')
BEGIN
    CREATE TABLE [BAO_CAO_TON] (
        [MaBCT] nvarchar(100) NOT NULL,
        [MaSach] nvarchar(100) NOT NULL,
        [Thang] int NOT NULL,
        [Nam] int NOT NULL,
        [TonDau] int NOT NULL,
        [PhatSinh] int NOT NULL,
        [DaBan] int NOT NULL,
        [TonCuoi] int NOT NULL,
        CONSTRAINT [PK_BAO_CAO_TON] PRIMARY KEY ([MaBCT]),
        CONSTRAINT [FK_BAO_CAO_TON_SACH_MaSach] FOREIGN KEY ([MaSach]) REFERENCES [SACH] ([MaSach]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20260101151616_TaoDatabase')
BEGIN
    CREATE TABLE [SACH_TAC_GIA] (
        [MaSach] nvarchar(100) NOT NULL,
        [MaTG] nvarchar(100) NOT NULL,
        CONSTRAINT [PK_SACH_TAC_GIA] PRIMARY KEY ([MaSach], [MaTG]),
        CONSTRAINT [FK_SACH_TAC_GIA_SACH_MaSach] FOREIGN KEY ([MaSach]) REFERENCES [SACH] ([MaSach]) ON DELETE CASCADE,
        CONSTRAINT [FK_SACH_TAC_GIA_TAC_GIA_MaTG] FOREIGN KEY ([MaTG]) REFERENCES [TAC_GIA] ([MaTG]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20260101151616_TaoDatabase')
BEGIN
    CREATE TABLE [CHI_TIET_HOA_DON] (
        [MaHoaDon] nvarchar(100) NOT NULL,
        [MaSach] nvarchar(100) NOT NULL,
        [SoLuong] int NOT NULL,
        [DonGiaBan] decimal(18,0) NOT NULL,
        [NgayLapHoaDon] datetime2 NOT NULL,
        CONSTRAINT [PK_CHI_TIET_HOA_DON] PRIMARY KEY ([MaHoaDon], [MaSach]),
        CONSTRAINT [CK_CHI_TIET_HOA_DON_CK_CTHD_SoLuong] CHECK (SoLuong > 0),
        CONSTRAINT [FK_CHI_TIET_HOA_DON_HOA_DON_MaHoaDon] FOREIGN KEY ([MaHoaDon]) REFERENCES [HOA_DON] ([MaHoaDon]) ON DELETE CASCADE,
        CONSTRAINT [FK_CHI_TIET_HOA_DON_SACH_MaSach] FOREIGN KEY ([MaSach]) REFERENCES [SACH] ([MaSach]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20260101151616_TaoDatabase')
BEGIN
    CREATE TABLE [CHI_TIET_PHIEU_NHAP] (
        [MaPhieu] nvarchar(100) NOT NULL,
        [MaSach] nvarchar(100) NOT NULL,
        [NgayNhap] datetime2 NOT NULL,
        [SoLuongNhap] int NOT NULL,
        [Gia] decimal(18,0) NOT NULL,
        CONSTRAINT [PK_CHI_TIET_PHIEU_NHAP] PRIMARY KEY ([MaPhieu], [MaSach]),
        CONSTRAINT [CK_CHI_TIET_PHIEU_NHAP_CK_CTPN_SoLuong] CHECK (SoLuongNhap > 0),
        CONSTRAINT [FK_CHI_TIET_PHIEU_NHAP_PHIEU_NHAP_SACH_MaPhieu] FOREIGN KEY ([MaPhieu]) REFERENCES [PHIEU_NHAP_SACH] ([MaPhieu]) ON DELETE CASCADE,
        CONSTRAINT [FK_CHI_TIET_PHIEU_NHAP_SACH_MaSach] FOREIGN KEY ([MaSach]) REFERENCES [SACH] ([MaSach]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20260101151616_TaoDatabase')
BEGIN
    CREATE INDEX [IX_BAO_CAO_CONG_NO_MaKH] ON [BAO_CAO_CONG_NO] ([MaKH]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20260101151616_TaoDatabase')
BEGIN
    CREATE INDEX [IX_BAO_CAO_TON_MaSach] ON [BAO_CAO_TON] ([MaSach]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20260101151616_TaoDatabase')
BEGIN
    CREATE INDEX [IX_CHI_TIET_HOA_DON_MaSach] ON [CHI_TIET_HOA_DON] ([MaSach]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20260101151616_TaoDatabase')
BEGIN
    CREATE INDEX [IX_CHI_TIET_PHIEU_NHAP_MaSach] ON [CHI_TIET_PHIEU_NHAP] ([MaSach]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20260101151616_TaoDatabase')
BEGIN
    CREATE INDEX [IX_HOA_DON_MaKH] ON [HOA_DON] ([MaKH]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20260101151616_TaoDatabase')
BEGIN
    CREATE INDEX [IX_HOA_DON_MaNV] ON [HOA_DON] ([MaNV]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20260101151616_TaoDatabase')
BEGIN
    CREATE UNIQUE INDEX [IX_NHAN_VIEN_TenDangNhap] ON [NHAN_VIEN] ([TenDangNhap]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20260101151616_TaoDatabase')
BEGIN
    CREATE INDEX [IX_PHIEU_NHAP_SACH_MaNV] ON [PHIEU_NHAP_SACH] ([MaNV]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20260101151616_TaoDatabase')
BEGIN
    CREATE INDEX [IX_PHIEU_THU_TIEN_MaKH] ON [PHIEU_THU_TIEN] ([MaKH]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20260101151616_TaoDatabase')
BEGIN
    CREATE INDEX [IX_PHIEU_THU_TIEN_MaNV] ON [PHIEU_THU_TIEN] ([MaNV]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20260101151616_TaoDatabase')
BEGIN
    CREATE INDEX [IX_QUY_DINH_MaNV] ON [QUY_DINH] ([MaNV]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20260101151616_TaoDatabase')
BEGIN
    CREATE INDEX [IX_SACH_MaTL] ON [SACH] ([MaTL]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20260101151616_TaoDatabase')
BEGIN
    CREATE INDEX [IX_SACH_TAC_GIA_MaTG] ON [SACH_TAC_GIA] ([MaTG]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20260101151616_TaoDatabase')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260101151616_TaoDatabase', N'7.0.14');
END;
GO

COMMIT;
GO

