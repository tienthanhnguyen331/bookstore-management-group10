

using DoAnPhanMem.DTO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DoAnPhanMem.Services.Interfaces
{
    public interface IHoaDonService
    {
        // Lấy danh sách sách (Dùng tên của Origin để khớp Controller)
        Task<List<SachResponseDto>> GetDanhSachSachAsync();

        // Tra cứu khách (Dùng tham số nullable string? của Origin)
        Task<KhachHangResponseDto> TraCuuKhachHangAsync(string? sdt);

        // Nghiệp vụ chính
        Task<HoaDonResponseDto> LapHoaDonAsync(LapHoaDonDto dto);

        Task<HoaDonResponseDto> UpdateHoaDonAsync(UpdateHoaDonDto dto);

        // Tra cứu danh sách (QUAN TRỌNG: Phải trả về DTO như nhánh HEAD, không trả về Model)
        Task<List<HoaDonResponseDto>> GetAllHoaDonAsync();

        Task<HoaDonResponseDto?> GetHoaDonByIdAsync(string maHoaDon);
    }
}