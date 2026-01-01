using System.ComponentModel.DataAnnotations;

namespace DoAnPhanMem.DTO
{
    public class UpdateCustomerDto
    {
        [Required]
        public string HoTen { get; set; }
        [Required]
        public string DiaChi { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string SDT { get; set; }


    }
}
