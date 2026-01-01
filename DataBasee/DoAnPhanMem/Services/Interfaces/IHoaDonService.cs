using DoAnPhanMem.DTO;
using DoAnPhanMem.Models;

namespace DoAnPhanMem.Services.Interfaces
{
    public interface IHoaDonService
    {
        Task<List<SachResponseDto>> GetDanhSachSachAsync();
        Task<KhachHangResponseDto> TraCuuKhachHangAsync(string? sdt);
        Task<HoaDonResponseDto> LapHoaDonAsync(LapHoaDonDto dto);
        Task<List<HOA_DON>> GetAllHoaDonAsync();
        Task<HoaDonResponseDto?> GetHoaDonByIdAsync(string maHoaDon);
        Task<HoaDonResponseDto> UpdateHoaDonAsync(UpdateHoaDonDto dto);
    }
}
