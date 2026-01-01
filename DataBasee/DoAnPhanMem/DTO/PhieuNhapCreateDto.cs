using System.ComponentModel.DataAnnotations;

namespace DoAnPhanMem.DTO
{
    // 1. Thông tin chung của phiếu (Phần Header)
    public class PhieuNhapCreateDto
    {
        public DateTime NgayNhap { get; set; } = DateTime.Now;

        // Đây là cái danh sách chứa tất cả các dòng sách bạn chọn ở giao diện
        public List<ChiTietNhapItemDto> DanhSachSach { get; set; }
    }

    // 2. Thông tin chi tiết từng dòng (Phần Body)
    public class ChiTietNhapItemDto
    {
        [Required]
        public string MaSach { get; set; }     // Quan trọng nhất: Để biết nhập cuốn nào

        [Range(1, int.MaxValue, ErrorMessage = "Số lượng phải lớn hơn 0")]
        public int SoLuong { get; set; }       // Số lượng nhập

        [Range(0, double.MaxValue, ErrorMessage = "Đơn giá không được âm")]
        public decimal DonGiaNhap { get; set; } // Giá nhập vào
    }
}