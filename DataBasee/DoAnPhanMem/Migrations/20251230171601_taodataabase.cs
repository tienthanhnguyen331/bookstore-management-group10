using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DoAnPhanMem.Migrations
{
    public partial class taodataabase : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "KHACH_HANG",
                columns: table => new
                {
                    MaKH = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    HoTen = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DiaChi = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    SDT = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    CongNo = table.Column<decimal>(type: "decimal(18,0)", nullable: false, defaultValue: 0m)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KHACH_HANG", x => x.MaKH);
                });

            migrationBuilder.CreateTable(
                name: "TAC_GIA",
                columns: table => new
                {
                    MaTG = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    TenTG = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TAC_GIA", x => x.MaTG);
                });

            migrationBuilder.CreateTable(
                name: "TAI_KHOAN",
                columns: table => new
                {
                    TenDangNhap = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    MatKhau = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TAI_KHOAN", x => x.TenDangNhap);
                });

            migrationBuilder.CreateTable(
                name: "THE_LOAI",
                columns: table => new
                {
                    MaTL = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    TenTL = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_THE_LOAI", x => x.MaTL);
                });

            migrationBuilder.CreateTable(
                name: "BAO_CAO_CONG_NO",
                columns: table => new
                {
                    MaBCCN = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Thang = table.Column<int>(type: "int", maxLength: 100, nullable: false),
                    Nam = table.Column<int>(type: "int", nullable: false),
                    NoDau = table.Column<decimal>(type: "decimal(18,0)", nullable: false),
                    NoPhatSinh = table.Column<decimal>(type: "decimal(18,0)", nullable: false),
                    TraNo = table.Column<decimal>(type: "decimal(18,0)", nullable: false),
                    NoCuoi = table.Column<decimal>(type: "decimal(18,0)", nullable: false),
                    MaKH = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BAO_CAO_CONG_NO", x => x.MaBCCN);
                    table.ForeignKey(
                        name: "FK_BAO_CAO_CONG_NO_KHACH_HANG_MaKH",
                        column: x => x.MaKH,
                        principalTable: "KHACH_HANG",
                        principalColumn: "MaKH",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "NHAN_VIEN",
                columns: table => new
                {
                    MaNV = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    HoTen = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DiaChi = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    SDT = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ChucVu = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    TenDangNhap = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NHAN_VIEN", x => x.MaNV);
                    table.ForeignKey(
                        name: "FK_NHAN_VIEN_TAI_KHOAN_TenDangNhap",
                        column: x => x.TenDangNhap,
                        principalTable: "TAI_KHOAN",
                        principalColumn: "TenDangNhap",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SACH",
                columns: table => new
                {
                    MaSach = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    TenSach = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    SoLuongTon = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    DonGia = table.Column<decimal>(type: "decimal(18,0)", nullable: false),
                    MaTL = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SACH", x => x.MaSach);
                    table.CheckConstraint("CK_SACH_SoLuongTon_Valid", "SoLuongTon >= 0");
                    table.ForeignKey(
                        name: "FK_SACH_THE_LOAI_MaTL",
                        column: x => x.MaTL,
                        principalTable: "THE_LOAI",
                        principalColumn: "MaTL",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HOA_DON",
                columns: table => new
                {
                    MaHoaDon = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    MaNV = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    MaKH = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HOA_DON", x => x.MaHoaDon);
                    table.ForeignKey(
                        name: "FK_HOA_DON_KHACH_HANG_MaKH",
                        column: x => x.MaKH,
                        principalTable: "KHACH_HANG",
                        principalColumn: "MaKH",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_HOA_DON_NHAN_VIEN_MaNV",
                        column: x => x.MaNV,
                        principalTable: "NHAN_VIEN",
                        principalColumn: "MaNV",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PHIEU_NHAP_SACH",
                columns: table => new
                {
                    MaPhieu = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    MaNV = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PHIEU_NHAP_SACH", x => x.MaPhieu);
                    table.ForeignKey(
                        name: "FK_PHIEU_NHAP_SACH_NHAN_VIEN_MaNV",
                        column: x => x.MaNV,
                        principalTable: "NHAN_VIEN",
                        principalColumn: "MaNV",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PHIEU_THU_TIEN",
                columns: table => new
                {
                    MaPhieu = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    NgayThuTien = table.Column<DateTime>(type: "datetime2", nullable: false),
                    SoTienThu = table.Column<decimal>(type: "decimal(18,0)", nullable: false),
                    MaNV = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    MaKH = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PHIEU_THU_TIEN", x => x.MaPhieu);
                    table.CheckConstraint("CK_PHIEU_THU_TIEN_CK_PTT_SoTien", "SoTienThu > 0");
                    table.ForeignKey(
                        name: "FK_PHIEU_THU_TIEN_KHACH_HANG_MaKH",
                        column: x => x.MaKH,
                        principalTable: "KHACH_HANG",
                        principalColumn: "MaKH",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PHIEU_THU_TIEN_NHAN_VIEN_MaNV",
                        column: x => x.MaNV,
                        principalTable: "NHAN_VIEN",
                        principalColumn: "MaNV",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "QUY_DINH",
                columns: table => new
                {
                    TenQuyDinh = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    GiaTri = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    MaNV = table.Column<string>(type: "nvarchar(100)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QUY_DINH", x => x.TenQuyDinh);
                    table.ForeignKey(
                        name: "FK_QUY_DINH_NHAN_VIEN_MaNV",
                        column: x => x.MaNV,
                        principalTable: "NHAN_VIEN",
                        principalColumn: "MaNV",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BAO_CAO_TON",
                columns: table => new
                {
                    MaBCT = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    MaSach = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Thang = table.Column<int>(type: "int", maxLength: 100, nullable: false),
                    Nam = table.Column<int>(type: "int", nullable: false),
                    TonDau = table.Column<int>(type: "int", nullable: false),
                    PhatSinh = table.Column<int>(type: "int", nullable: false),
                    DaBan = table.Column<int>(type: "int", nullable: false),
                    TonCuoi = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BAO_CAO_TON", x => x.MaBCT);
                    table.ForeignKey(
                        name: "FK_BAO_CAO_TON_SACH_MaSach",
                        column: x => x.MaSach,
                        principalTable: "SACH",
                        principalColumn: "MaSach",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SACH_TAC_GIA",
                columns: table => new
                {
                    MaSach = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    MaTG = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SACH_TAC_GIA", x => new { x.MaSach, x.MaTG });
                    table.ForeignKey(
                        name: "FK_SACH_TAC_GIA_SACH_MaSach",
                        column: x => x.MaSach,
                        principalTable: "SACH",
                        principalColumn: "MaSach",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SACH_TAC_GIA_TAC_GIA_MaTG",
                        column: x => x.MaTG,
                        principalTable: "TAC_GIA",
                        principalColumn: "MaTG",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CHI_TIET_HOA_DON",
                columns: table => new
                {
                    MaHoaDon = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    MaSach = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    SoLuong = table.Column<int>(type: "int", nullable: false),
                    DonGiaBan = table.Column<decimal>(type: "decimal(18,0)", nullable: false),
                    NgayLapHoaDon = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CHI_TIET_HOA_DON", x => new { x.MaHoaDon, x.MaSach });
                    table.CheckConstraint("CK_CHI_TIET_HOA_DON_CK_CTHD_SoLuong", "SoLuong > 0");
                    table.ForeignKey(
                        name: "FK_CHI_TIET_HOA_DON_HOA_DON_MaHoaDon",
                        column: x => x.MaHoaDon,
                        principalTable: "HOA_DON",
                        principalColumn: "MaHoaDon",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CHI_TIET_HOA_DON_SACH_MaSach",
                        column: x => x.MaSach,
                        principalTable: "SACH",
                        principalColumn: "MaSach",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CHI_TIET_PHIEU_NHAP",
                columns: table => new
                {
                    MaPhieu = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    MaSach = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    NgayNhap = table.Column<DateTime>(type: "datetime2", nullable: false),
                    SoLuongNhap = table.Column<int>(type: "int", nullable: false),
                    Gia = table.Column<decimal>(type: "decimal(18,0)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CHI_TIET_PHIEU_NHAP", x => new { x.MaPhieu, x.MaSach });
                    table.CheckConstraint("CK_CHI_TIET_PHIEU_NHAP_CK_CTPN_SoLuong", "SoLuongNhap > 0");
                    table.ForeignKey(
                        name: "FK_CHI_TIET_PHIEU_NHAP_PHIEU_NHAP_SACH_MaPhieu",
                        column: x => x.MaPhieu,
                        principalTable: "PHIEU_NHAP_SACH",
                        principalColumn: "MaPhieu",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CHI_TIET_PHIEU_NHAP_SACH_MaSach",
                        column: x => x.MaSach,
                        principalTable: "SACH",
                        principalColumn: "MaSach",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BAO_CAO_CONG_NO_MaKH",
                table: "BAO_CAO_CONG_NO",
                column: "MaKH");

            migrationBuilder.CreateIndex(
                name: "IX_BAO_CAO_TON_MaSach",
                table: "BAO_CAO_TON",
                column: "MaSach");

            migrationBuilder.CreateIndex(
                name: "IX_CHI_TIET_HOA_DON_MaSach",
                table: "CHI_TIET_HOA_DON",
                column: "MaSach");

            migrationBuilder.CreateIndex(
                name: "IX_CHI_TIET_PHIEU_NHAP_MaSach",
                table: "CHI_TIET_PHIEU_NHAP",
                column: "MaSach");

            migrationBuilder.CreateIndex(
                name: "IX_HOA_DON_MaKH",
                table: "HOA_DON",
                column: "MaKH");

            migrationBuilder.CreateIndex(
                name: "IX_HOA_DON_MaNV",
                table: "HOA_DON",
                column: "MaNV");

            migrationBuilder.CreateIndex(
                name: "IX_NHAN_VIEN_TenDangNhap",
                table: "NHAN_VIEN",
                column: "TenDangNhap",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PHIEU_NHAP_SACH_MaNV",
                table: "PHIEU_NHAP_SACH",
                column: "MaNV");

            migrationBuilder.CreateIndex(
                name: "IX_PHIEU_THU_TIEN_MaKH",
                table: "PHIEU_THU_TIEN",
                column: "MaKH");

            migrationBuilder.CreateIndex(
                name: "IX_PHIEU_THU_TIEN_MaNV",
                table: "PHIEU_THU_TIEN",
                column: "MaNV");

            migrationBuilder.CreateIndex(
                name: "IX_QUY_DINH_MaNV",
                table: "QUY_DINH",
                column: "MaNV");

            migrationBuilder.CreateIndex(
                name: "IX_SACH_MaTL",
                table: "SACH",
                column: "MaTL");

            migrationBuilder.CreateIndex(
                name: "IX_SACH_TAC_GIA_MaTG",
                table: "SACH_TAC_GIA",
                column: "MaTG");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BAO_CAO_CONG_NO");

            migrationBuilder.DropTable(
                name: "BAO_CAO_TON");

            migrationBuilder.DropTable(
                name: "CHI_TIET_HOA_DON");

            migrationBuilder.DropTable(
                name: "CHI_TIET_PHIEU_NHAP");

            migrationBuilder.DropTable(
                name: "PHIEU_THU_TIEN");

            migrationBuilder.DropTable(
                name: "QUY_DINH");

            migrationBuilder.DropTable(
                name: "SACH_TAC_GIA");

            migrationBuilder.DropTable(
                name: "HOA_DON");

            migrationBuilder.DropTable(
                name: "PHIEU_NHAP_SACH");

            migrationBuilder.DropTable(
                name: "SACH");

            migrationBuilder.DropTable(
                name: "TAC_GIA");

            migrationBuilder.DropTable(
                name: "KHACH_HANG");

            migrationBuilder.DropTable(
                name: "NHAN_VIEN");

            migrationBuilder.DropTable(
                name: "THE_LOAI");

            migrationBuilder.DropTable(
                name: "TAI_KHOAN");
        }
    }
}
