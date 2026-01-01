namespace DoAnPhanMem.DTO
{
    public class SachUpdateDto
    {
        public string MaSach { get; set; } // Bắt buộc phải có để biết đang sửa cuốn nào
        public string TenSach { get; set; }
        public string TenTacGia { get; set; }  // Tên tác giả mới (hoặc giữ nguyên cũ)
        public string TenTheLoai { get; set; } // Tên thể loại mới (hoặc giữ nguyên cũ)
        public decimal DonGia { get; set; }
        // Modal của bạn không thấy có Tồn kho, nhưng nếu cần update thì thêm vào
        // public int SoLuongTon { get; set; }
    }
}
