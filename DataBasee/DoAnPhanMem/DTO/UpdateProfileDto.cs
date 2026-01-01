using System.ComponentModel.DataAnnotations;

namespace DoAnPhanMem.DTO
{
    public class UpdateProfileDto
    {
        [StringLength(100)]
        public string SoDienThoai { get; set; } = string.Empty;

        [StringLength(200)]
        public string DiaChi { get; set; } = string.Empty;

        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;

        // Avatar is not supported per demo.md
    }
}
