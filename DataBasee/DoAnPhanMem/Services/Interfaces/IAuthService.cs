using DoAnPhanMem.DTO;

namespace DoAnPhanMem.Services.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResponseDto> Login(string username, string password);
        Task<bool> ChangePassword(string username, string oldPassword, string newPassword);
    }
}
