using System.Threading.Tasks;
using DoAnPhanMem.DTO;

namespace DoAnPhanMem.Services.Interfaces
{
    public interface IAdminService
    {
        // Hàm tạo nhân viên mới, trả về true nếu thành công
        Task<bool> CreateEmployeeAsync(EmployeeCreateDto request);
        Task<List<NhanVienResponseDto>> GetAllNhanVienAsync();
    }
}