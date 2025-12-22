using System.ComponentModel.DataAnnotations;

namespace DoAnPhanMem.DTO
{
    // DTO lap phieu thu tien
    public class LapPhieuThuTienDto
    {
        [Required(ErrorMessage = "So dien thoai khach hang khong duoc de trong")]
        public string SDTKhachHang { get; set; } = string.Empty;

        [Required(ErrorMessage = "So tien thu khong duoc de trong")]
        [Range(1, double.MaxValue, ErrorMessage = "So tien thu phai lon hon 0")]
        public decimal SoTienThu { get; set; }
    }

    // Response thong tin khach hang de thu tien
    public class KhachHangThuTienResponseDto
    {
        public string MaKH { get; set; } = string.Empty;
        public string HoTen { get; set; } = string.Empty;
        public string SDT { get; set; } = string.Empty;
        public decimal CongNo { get; set; }
        public bool IsFound { get; set; }
        public string? Message { get; set; }
    }

    // Response sau khi lap phieu thu tien
    public class PhieuThuTienResponseDto
    {
        public string MaPhieu { get; set; } = string.Empty;
        public DateTime NgayThuTien { get; set; }
        public string MaKH { get; set; } = string.Empty;
        public string TenKhachHang { get; set; } = string.Empty;
        public string SDT { get; set; } = string.Empty;
        public decimal SoTienThu { get; set; }
        public decimal CongNoTruoc { get; set; }
        public decimal CongNoSau { get; set; }
    }

    // Response danh sach phieu thu tien
    public class DanhSachPhieuThuResponseDto
    {
        public string MaPhieu { get; set; } = string.Empty;
        public DateTime NgayThuTien { get; set; }
        public string TenKhachHang { get; set; } = string.Empty;
        public string SDT { get; set; } = string.Empty;
        public decimal SoTienThu { get; set; }
    }

    // DTO cap nhat phieu thu tien
    public class UpdatePhieuThuTienDto
    {
        [Required(ErrorMessage = "Ma phieu khong duoc de trong")]
        public string MaPhieu { get; set; } = string.Empty;

        [Required(ErrorMessage = "So tien thu khong duoc de trong")]
        [Range(1, double.MaxValue, ErrorMessage = "So tien thu phai lon hon 0")]
        public decimal SoTienThu { get; set; }

        public DateTime? NgayThuTien { get; set; }
    }
}
