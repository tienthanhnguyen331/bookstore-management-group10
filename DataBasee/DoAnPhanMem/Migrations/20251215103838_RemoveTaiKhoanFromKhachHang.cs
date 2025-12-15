using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DoAnPhanMem.Migrations
{
    /// <inheritdoc />
    public partial class RemoveTaiKhoanFromKhachHang : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_KHACH_HANG_TAI_KHOAN_TenDangNhap",
                table: "KHACH_HANG");

            migrationBuilder.DropIndex(
                name: "IX_KHACH_HANG_TenDangNhap",
                table: "KHACH_HANG");

            migrationBuilder.DropColumn(
                name: "TenDangNhap",
                table: "KHACH_HANG");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TenDangNhap",
                table: "KHACH_HANG",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_KHACH_HANG_TenDangNhap",
                table: "KHACH_HANG",
                column: "TenDangNhap",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_KHACH_HANG_TAI_KHOAN_TenDangNhap",
                table: "KHACH_HANG",
                column: "TenDangNhap",
                principalTable: "TAI_KHOAN",
                principalColumn: "TenDangNhap",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
