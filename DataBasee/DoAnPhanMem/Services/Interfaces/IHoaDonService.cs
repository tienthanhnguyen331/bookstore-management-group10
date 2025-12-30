using DoAnPhanMem.DTO;

namespace DoAnPhanMem.Services
{
    public interface IHoaDonService
    {
        // Lấy dữ liệu hỗ trợ
        Task<List<SachResponseDto>> GetDanhSachSachBanAsync();
        Task<KhachHangResponseDto> TraCuuKhachHangAsync(string sdt);

        // Nghiệp vụ chính
        Task<HoaDonResponseDto> LapHoaDonAsync(LapHoaDonDto dto);
        Task<HoaDonResponseDto> UpdateHoaDonAsync(UpdateHoaDonDto dto);

        // Tra cứu danh sách
        Task<List<HoaDonResponseDto>> GetAllHoaDonAsync();
        Task<HoaDonResponseDto?> GetHoaDonByIdAsync(string maHoaDon);
    }
}