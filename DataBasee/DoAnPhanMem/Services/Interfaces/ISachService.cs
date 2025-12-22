using DoAnPhanMem.DTO;
using System.Threading.Tasks;


namespace DoAnPhanMem.Services.Interfaces
{
    public interface ISachService
    {
        // Hàm lấy danh sách sách hiển thị lên UI
        Task<List<SachViewDto>> GetDanhSachSachAsync();
        Task<bool> CreateSachAsync(SachCreateDto request);
        Task<bool> UpdateSachAsync(SachUpdateDto request);
    }
}
