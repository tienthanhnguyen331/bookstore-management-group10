using DoAnPhanMem.DTO;

namespace DoAnPhanMem.Services
{
    public interface IPhieuThuTienService
    {
        // Tra cứu
        Task<KhachHangThuTienResponseDto> TraCuuKhachHangAsync(string sdt);

        // Nghiệp vụ chính
        Task<PhieuThuTienResponseDto> LapPhieuThuTienAsync(LapPhieuThuTienDto dto);

        // Lấy dữ liệu
        Task<List<DanhSachPhieuThuResponseDto>> GetAllPhieuThuTienAsync();
        Task<List<DanhSachPhieuThuResponseDto>> GetPhieuThuTienTheoThangAsync(int thang, int nam);
        Task<List<KhachHangThuTienResponseDto>> GetKhachHangDangNoAsync();
    }
}