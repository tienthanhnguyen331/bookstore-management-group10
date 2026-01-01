using System.ComponentModel.DataAnnotations;

namespace DoAnPhanMem.DTO
{
    public class EmployeeCreateDto
    {
        [Required(ErrorMessage = "Tên đăng nhập không được để trống")]
        public string TenDangNhap { get; set; }

        [Required(ErrorMessage = "Họ tên không được để trống")]
        public string HoTen { get; set; }

        // Mật khẩu có thể null, nếu null sẽ tự set là "1"
        public string? MatKhau { get; set; }

        public string ChucVu { get; set; }
    }
}