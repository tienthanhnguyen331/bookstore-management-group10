using System.Threading.Tasks;
using DoAnPhanMem.DTO;

namespace DoAnPhanMem.Services.Interfaces
{
    public interface IAdminService
    {
        Task<bool> CreateEmployeeAsync(EmployeeCreateDto request);
    }
}