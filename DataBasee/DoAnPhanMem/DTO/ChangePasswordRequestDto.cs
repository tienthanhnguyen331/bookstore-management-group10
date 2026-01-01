using System.ComponentModel.DataAnnotations;

namespace DoAnPhanMem.DTO
{
    public class ChangePasswordRequestDto
    {
        [Required(ErrorMessage = "Mật khẩu cũ không được để trống")]
        public string OldPassword { get; set; } = string.Empty;

        [Required(ErrorMessage = "Mật khẩu mới không được để trống")]
        [MinLength(6, ErrorMessage = "Mật khẩu phải có ít nhất 6 kí tự")]
        public string NewPassword { get; set; } = string.Empty;
    }
}
