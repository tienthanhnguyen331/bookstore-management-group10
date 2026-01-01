namespace DoAnPhanMem.DTO
{
    public class SachCreateDto
    {
        public string TenSach { get; set; }
        public string TenTacGia { get; set; }  // Nhập tên (VD: Nguyễn Nhật Ánh)
        public string TenTheLoai { get; set; } // Nhập tên (VD: Truyện dài)
        public decimal DonGia { get; set; }
        public int SoLuongTon { get; set; }
    }
}
