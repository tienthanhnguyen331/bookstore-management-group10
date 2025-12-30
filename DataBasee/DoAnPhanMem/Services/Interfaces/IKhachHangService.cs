using System.Collections.Generic;
using System.Threading.Tasks;
using DoAnPhanMem.DTO;

namespace DoAnPhanMem.Services.Interfaces
{
    public interface IKhachHangService
    {
        Task<List<CustomerDto>> GetAllAsync();
        Task<DoAnPhanMem.DTO.CustomerDetailDto?> GetByIdAsync(string id);
        Task<CustomerDto> CreateAsync(DoAnPhanMem.DTO.CreateCustomerDto dto);
        Task<CustomerDetailDto?> GetByPhoneAsync(string sdt);
    }
}
