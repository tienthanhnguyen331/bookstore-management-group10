namespace DoAnPhanMem.DTO
{
    public class NhanVienResponseDto
    {
        public string MaNV { get; set; }
        public string HoTen { get; set; }
        public string Username { get; set; } // Map từ TenDangNhap
        public string SDT { get; set; }
        public string Email { get; set; }
        public string ChucVu { get; set; }
    }
}