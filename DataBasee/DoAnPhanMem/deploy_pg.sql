CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

START TRANSACTION;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260117063952_InitialCreate_PG') THEN
    CREATE TABLE "KHACH_HANG" (
        "MaKH" character varying(100) NOT NULL,
        "HoTen" character varying(100) NOT NULL,
        "DiaChi" character varying(100) NOT NULL,
        "SDT" character varying(100) NOT NULL,
        "Email" character varying(100) NOT NULL,
        "CongNo" numeric(18,0) NOT NULL DEFAULT 0.0,
        CONSTRAINT "PK_KHACH_HANG" PRIMARY KEY ("MaKH")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260117063952_InitialCreate_PG') THEN
    CREATE TABLE "TAC_GIA" (
        "MaTG" character varying(100) NOT NULL,
        "TenTG" character varying(100) NOT NULL,
        CONSTRAINT "PK_TAC_GIA" PRIMARY KEY ("MaTG")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260117063952_InitialCreate_PG') THEN
    CREATE TABLE "TAI_KHOAN" (
        "TenDangNhap" character varying(100) NOT NULL,
        "MatKhau" character varying(100) NOT NULL,
        CONSTRAINT "PK_TAI_KHOAN" PRIMARY KEY ("TenDangNhap")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260117063952_InitialCreate_PG') THEN
    CREATE TABLE "THE_LOAI" (
        "MaTL" character varying(100) NOT NULL,
        "TenTL" character varying(100) NOT NULL,
        CONSTRAINT "PK_THE_LOAI" PRIMARY KEY ("MaTL")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260117063952_InitialCreate_PG') THEN
    CREATE TABLE "BAO_CAO_CONG_NO" (
        "MaBCCN" character varying(100) NOT NULL,
        "Thang" integer NOT NULL,
        "Nam" integer NOT NULL,
        "NoDau" numeric(18,0) NOT NULL,
        "NoPhatSinh" numeric(18,0) NOT NULL,
        "TraNo" numeric(18,0) NOT NULL,
        "NoCuoi" numeric(18,0) NOT NULL,
        "MaKH" character varying(100) NOT NULL,
        CONSTRAINT "PK_BAO_CAO_CONG_NO" PRIMARY KEY ("MaBCCN"),
        CONSTRAINT "FK_BAO_CAO_CONG_NO_KHACH_HANG_MaKH" FOREIGN KEY ("MaKH") REFERENCES "KHACH_HANG" ("MaKH") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260117063952_InitialCreate_PG') THEN
    CREATE TABLE "NHAN_VIEN" (
        "MaNV" character varying(100) NOT NULL,
        "HoTen" character varying(100) NOT NULL,
        "DiaChi" character varying(100),
        "SDT" character varying(100),
        "Email" character varying(100),
        "ChucVu" character varying(100) NOT NULL,
        "TenDangNhap" character varying(100) NOT NULL,
        CONSTRAINT "PK_NHAN_VIEN" PRIMARY KEY ("MaNV"),
        CONSTRAINT "FK_NHAN_VIEN_TAI_KHOAN_TenDangNhap" FOREIGN KEY ("TenDangNhap") REFERENCES "TAI_KHOAN" ("TenDangNhap") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260117063952_InitialCreate_PG') THEN
    CREATE TABLE "SACH" (
        "MaSach" character varying(100) NOT NULL,
        "TenSach" character varying(100) NOT NULL,
        "SoLuongTon" integer NOT NULL DEFAULT 0,
        "DonGia" numeric(18,0) NOT NULL,
        "MaTL" character varying(100) NOT NULL,
        CONSTRAINT "PK_SACH" PRIMARY KEY ("MaSach"),
        CONSTRAINT "CK_SACH_SoLuongTon_Valid" CHECK ("SoLuongTon" >= 0),
        CONSTRAINT "FK_SACH_THE_LOAI_MaTL" FOREIGN KEY ("MaTL") REFERENCES "THE_LOAI" ("MaTL") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260117063952_InitialCreate_PG') THEN
    CREATE TABLE "HOA_DON" (
        "MaHoaDon" character varying(100) NOT NULL,
        "MaNV" character varying(100),
        "MaKH" character varying(100),
        CONSTRAINT "PK_HOA_DON" PRIMARY KEY ("MaHoaDon"),
        CONSTRAINT "FK_HOA_DON_KHACH_HANG_MaKH" FOREIGN KEY ("MaKH") REFERENCES "KHACH_HANG" ("MaKH") ON DELETE RESTRICT,
        CONSTRAINT "FK_HOA_DON_NHAN_VIEN_MaNV" FOREIGN KEY ("MaNV") REFERENCES "NHAN_VIEN" ("MaNV") ON DELETE RESTRICT
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260117063952_InitialCreate_PG') THEN
    CREATE TABLE "PHIEU_NHAP_SACH" (
        "MaPhieu" character varying(100) NOT NULL,
        "MaNV" character varying(100) NOT NULL,
        CONSTRAINT "PK_PHIEU_NHAP_SACH" PRIMARY KEY ("MaPhieu"),
        CONSTRAINT "FK_PHIEU_NHAP_SACH_NHAN_VIEN_MaNV" FOREIGN KEY ("MaNV") REFERENCES "NHAN_VIEN" ("MaNV") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260117063952_InitialCreate_PG') THEN
    CREATE TABLE "PHIEU_THU_TIEN" (
        "MaPhieu" character varying(100) NOT NULL,
        "NgayThuTien" timestamp with time zone NOT NULL,
        "SoTienThu" numeric(18,0) NOT NULL,
        "MaNV" character varying(100),
        "MaKH" character varying(100) NOT NULL,
        CONSTRAINT "PK_PHIEU_THU_TIEN" PRIMARY KEY ("MaPhieu"),
        CONSTRAINT "CK_PTT_SoTien" CHECK ("SoTienThu" > 0),
        CONSTRAINT "FK_PHIEU_THU_TIEN_KHACH_HANG_MaKH" FOREIGN KEY ("MaKH") REFERENCES "KHACH_HANG" ("MaKH") ON DELETE RESTRICT,
        CONSTRAINT "FK_PHIEU_THU_TIEN_NHAN_VIEN_MaNV" FOREIGN KEY ("MaNV") REFERENCES "NHAN_VIEN" ("MaNV") ON DELETE RESTRICT
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260117063952_InitialCreate_PG') THEN
    CREATE TABLE "QUY_DINH" (
        "TenQuyDinh" character varying(100) NOT NULL,
        "GiaTri" character varying(100) NOT NULL,
        "MaNV" character varying(100) NOT NULL,
        CONSTRAINT "PK_QUY_DINH" PRIMARY KEY ("TenQuyDinh"),
        CONSTRAINT "FK_QUY_DINH_NHAN_VIEN_MaNV" FOREIGN KEY ("MaNV") REFERENCES "NHAN_VIEN" ("MaNV") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260117063952_InitialCreate_PG') THEN
    CREATE TABLE "BAO_CAO_TON" (
        "MaBCT" character varying(100) NOT NULL,
        "MaSach" character varying(100) NOT NULL,
        "Thang" integer NOT NULL,
        "Nam" integer NOT NULL,
        "TonDau" integer NOT NULL,
        "PhatSinh" integer NOT NULL,
        "DaBan" integer NOT NULL,
        "TonCuoi" integer NOT NULL,
        CONSTRAINT "PK_BAO_CAO_TON" PRIMARY KEY ("MaBCT"),
        CONSTRAINT "FK_BAO_CAO_TON_SACH_MaSach" FOREIGN KEY ("MaSach") REFERENCES "SACH" ("MaSach") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260117063952_InitialCreate_PG') THEN
    CREATE TABLE "SACH_TAC_GIA" (
        "MaSach" character varying(100) NOT NULL,
        "MaTG" character varying(100) NOT NULL,
        CONSTRAINT "PK_SACH_TAC_GIA" PRIMARY KEY ("MaSach", "MaTG"),
        CONSTRAINT "FK_SACH_TAC_GIA_SACH_MaSach" FOREIGN KEY ("MaSach") REFERENCES "SACH" ("MaSach") ON DELETE CASCADE,
        CONSTRAINT "FK_SACH_TAC_GIA_TAC_GIA_MaTG" FOREIGN KEY ("MaTG") REFERENCES "TAC_GIA" ("MaTG") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260117063952_InitialCreate_PG') THEN
    CREATE TABLE "CHI_TIET_HOA_DON" (
        "MaHoaDon" character varying(100) NOT NULL,
        "MaSach" character varying(100) NOT NULL,
        "SoLuong" integer NOT NULL,
        "DonGiaBan" numeric(18,0) NOT NULL,
        "NgayLapHoaDon" timestamp with time zone NOT NULL,
        CONSTRAINT "PK_CHI_TIET_HOA_DON" PRIMARY KEY ("MaHoaDon", "MaSach"),
        CONSTRAINT "CK_CTHD_SoLuong" CHECK ("SoLuong" > 0),
        CONSTRAINT "FK_CHI_TIET_HOA_DON_HOA_DON_MaHoaDon" FOREIGN KEY ("MaHoaDon") REFERENCES "HOA_DON" ("MaHoaDon") ON DELETE CASCADE,
        CONSTRAINT "FK_CHI_TIET_HOA_DON_SACH_MaSach" FOREIGN KEY ("MaSach") REFERENCES "SACH" ("MaSach") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260117063952_InitialCreate_PG') THEN
    CREATE TABLE "CHI_TIET_PHIEU_NHAP" (
        "MaPhieu" character varying(100) NOT NULL,
        "MaSach" character varying(100) NOT NULL,
        "NgayNhap" timestamp with time zone NOT NULL,
        "SoLuongNhap" integer NOT NULL,
        "Gia" numeric(18,0) NOT NULL,
        CONSTRAINT "PK_CHI_TIET_PHIEU_NHAP" PRIMARY KEY ("MaPhieu", "MaSach"),
        CONSTRAINT "CK_CTPN_SoLuong" CHECK ("SoLuongNhap" > 0),
        CONSTRAINT "FK_CHI_TIET_PHIEU_NHAP_PHIEU_NHAP_SACH_MaPhieu" FOREIGN KEY ("MaPhieu") REFERENCES "PHIEU_NHAP_SACH" ("MaPhieu") ON DELETE CASCADE,
        CONSTRAINT "FK_CHI_TIET_PHIEU_NHAP_SACH_MaSach" FOREIGN KEY ("MaSach") REFERENCES "SACH" ("MaSach") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260117063952_InitialCreate_PG') THEN
    CREATE INDEX "IX_BAO_CAO_CONG_NO_MaKH" ON "BAO_CAO_CONG_NO" ("MaKH");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260117063952_InitialCreate_PG') THEN
    CREATE INDEX "IX_BAO_CAO_TON_MaSach" ON "BAO_CAO_TON" ("MaSach");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260117063952_InitialCreate_PG') THEN
    CREATE INDEX "IX_CHI_TIET_HOA_DON_MaSach" ON "CHI_TIET_HOA_DON" ("MaSach");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260117063952_InitialCreate_PG') THEN
    CREATE INDEX "IX_CHI_TIET_PHIEU_NHAP_MaSach" ON "CHI_TIET_PHIEU_NHAP" ("MaSach");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260117063952_InitialCreate_PG') THEN
    CREATE INDEX "IX_HOA_DON_MaKH" ON "HOA_DON" ("MaKH");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260117063952_InitialCreate_PG') THEN
    CREATE INDEX "IX_HOA_DON_MaNV" ON "HOA_DON" ("MaNV");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260117063952_InitialCreate_PG') THEN
    CREATE UNIQUE INDEX "IX_NHAN_VIEN_TenDangNhap" ON "NHAN_VIEN" ("TenDangNhap");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260117063952_InitialCreate_PG') THEN
    CREATE INDEX "IX_PHIEU_NHAP_SACH_MaNV" ON "PHIEU_NHAP_SACH" ("MaNV");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260117063952_InitialCreate_PG') THEN
    CREATE INDEX "IX_PHIEU_THU_TIEN_MaKH" ON "PHIEU_THU_TIEN" ("MaKH");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260117063952_InitialCreate_PG') THEN
    CREATE INDEX "IX_PHIEU_THU_TIEN_MaNV" ON "PHIEU_THU_TIEN" ("MaNV");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260117063952_InitialCreate_PG') THEN
    CREATE INDEX "IX_QUY_DINH_MaNV" ON "QUY_DINH" ("MaNV");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260117063952_InitialCreate_PG') THEN
    CREATE INDEX "IX_SACH_MaTL" ON "SACH" ("MaTL");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260117063952_InitialCreate_PG') THEN
    CREATE INDEX "IX_SACH_TAC_GIA_MaTG" ON "SACH_TAC_GIA" ("MaTG");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260117063952_InitialCreate_PG') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260117063952_InitialCreate_PG', '9.0.1');
    END IF;
END $EF$;
COMMIT;

