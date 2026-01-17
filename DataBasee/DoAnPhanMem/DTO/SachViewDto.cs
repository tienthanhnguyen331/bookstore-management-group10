using Microsoft.AspNetCore.Mvc;

namespace DoAnPhanMem.DTO
{
    public class SachViewDto
    {
        public string MaSach { get; set; }
        public string TenSach { get; set; }
        public string TenTacGia { get; set; }  // Lấy tên thay vì Mã
        public string TenTheLoai { get; set; } // Lấy tên thay vì Mã
        public decimal DonGia { get; set; }
        public int SoLuongTon { get; set; }
    }
}
