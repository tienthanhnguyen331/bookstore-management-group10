

using DoAnPhanMem.DTO;
using System.Threading.Tasks;

namespace DoAnPhanMem.Services.Interfaces
{
    public interface IAuthService
    {
        // Trả về DTO chứa Token + Role + IsFirstLogin
        Task<LoginResponseDto> Login(string username, string password);

        // Hàm đổi mật khẩu
        Task<bool> ChangePassword(string username, string oldPassword, string newPassword);
    }
}