using System.ComponentModel.DataAnnotations;

namespace DoAnPhanMem.DTO
{
    // DTO tra cuu khach hang theo so dien thoai
    public class TraCuuKhachHangDto
    {
        public string? SDT { get; set; }
    }

    // Response tra ve thong tin khach hang
    public class KhachHangResponseDto
    {
        public string MaKH { get; set; } = string.Empty;
        public string HoTen { get; set; } = string.Empty;
        public string SDT { get; set; } = string.Empty;
        public decimal CongNo { get; set; }
        public decimal GioiHanNo { get; set; }
        public bool IsKhachVangLai { get; set; }
        public string? Message { get; set; }
    }

    // DTO thong tin sach de hien thi trong dropdown
    public class SachResponseDto
    {
        public string MaSach { get; set; } = string.Empty;
        public string TenSach { get; set; } = string.Empty;
        public string TenTheLoai { get; set; } = string.Empty;
        public decimal DonGia { get; set; }
        public int SoLuongTon { get; set; }
        public string DisplayText => $"{TenSach} - Gia: {DonGia:N0} - Kho: {SoLuongTon}";
    }

    // DTO chi tiet san pham trong hoa don
    public class ChiTietHoaDonDto
    {
        [Required(ErrorMessage = "Ma sach khong duoc de trong")]
        public string MaSach { get; set; } = string.Empty;

        [Required(ErrorMessage = "So luong khong duoc de trong")]
        [Range(1, int.MaxValue, ErrorMessage = "So luong phai lon hon 0")]
        public int SoLuong { get; set; }
    }

    // DTO lap hoa don
    public class LapHoaDonDto
    {
        public string? SDTKhachHang { get; set; }

        [Required(ErrorMessage = "Danh sach san pham khong duoc de trong")]
        public List<ChiTietHoaDonDto> DanhSachSanPham { get; set; } = new();
        public bool IsDebt { get; internal set; }
    }

    // Response sau khi lap hoa don thanh cong
    public class HoaDonResponseDto
    {
        public string MaHoaDon { get; set; } = string.Empty;
        public DateTime NgayLap { get; set; }
        public string TenKhachHang { get; set; } = string.Empty;
        public string SDTKhachHang { get; set; } = string.Empty;
        public bool IsKhachVangLai { get; set; }
        public List<ChiTietHoaDonResponseDto> DanhSachSanPham { get; set; } = new();
        public decimal TongTien { get; set; }
    }

    public class ChiTietHoaDonResponseDto
    {
        public int STT { get; set; }
        public string MaSach { get; set; } = string.Empty;
        public string TenSach { get; set; } = string.Empty;
        public string TheLoai { get; set; } = string.Empty;
        public int SoLuong { get; set; }
        public decimal DonGia { get; set; }
        public decimal ThanhTien { get; set; }
    }

    // DTO cap nhat chi tiet hoa don
    public class UpdateChiTietHoaDonDto
    {
        [Required(ErrorMessage = "Ma sach khong duoc de trong")]
        public string MaSach { get; set; } = string.Empty;

        [Required(ErrorMessage = "So luong khong duoc de trong")]
        [Range(1, int.MaxValue, ErrorMessage = "So luong phai lon hon 0")]
        public int SoLuong { get; set; }
    }

    // DTO cap nhat hoa don
    public class UpdateHoaDonDto
    {
        [Required(ErrorMessage = "Ma hoa don khong duoc de trong")]
        public string MaHoaDon { get; set; } = string.Empty;

        public string? SDTKhachHang { get; set; }

        [Required(ErrorMessage = "Danh sach san pham khong duoc de trong")]
        public List<UpdateChiTietHoaDonDto> DanhSachSanPham { get; set; } = new();
    }
}
