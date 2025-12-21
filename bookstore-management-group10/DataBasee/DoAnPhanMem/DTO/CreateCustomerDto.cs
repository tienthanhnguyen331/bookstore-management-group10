using System.ComponentModel.DataAnnotations;

namespace DoAnPhanMem.DTO
{
    public class CreateCustomerDto
    {
        // Server sẽ tự sinh `MaKH` (KH1, KH2, ...). Client chỉ cần gửi thông tin cơ bản.
        [Required]
        [StringLength(100)]
        public string HoTen { get; set; } = null!;

        [EmailAddress]
        [StringLength(100)]
        public string? Email { get; set; }

        [StringLength(200)]
        public string? DiaChi { get; set; }

        [StringLength(100)]
        public string? SDT { get; set; }
    }
}
