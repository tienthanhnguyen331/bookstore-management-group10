using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DoAnPhanMem.Migrations
{
    public partial class update_database : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DaBan",
                table: "BAO_CAO_TON",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "TraNo",
                table: "BAO_CAO_CONG_NO",
                type: "decimal(18,0)",
                nullable: false,
                defaultValue: 0m);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DaBan",
                table: "BAO_CAO_TON");

            migrationBuilder.DropColumn(
                name: "TraNo",
                table: "BAO_CAO_CONG_NO");
        }
    }
}
