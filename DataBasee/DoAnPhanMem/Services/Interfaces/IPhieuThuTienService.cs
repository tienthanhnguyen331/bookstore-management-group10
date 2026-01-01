
using DoAnPhanMem.DTO;

namespace DoAnPhanMem.Services.Interfaces
{
    public interface IPhieuThuTienService
    {
        Task<KhachHangThuTienResponseDto> TraCuuKhachHangAsync(string? sdt);
        Task<PhieuThuTienResponseDto> LapPhieuThuTienAsync(LapPhieuThuTienDto dto);
        Task<List<DanhSachPhieuThuResponseDto>> GetAllPhieuThuTienAsync();
        Task<PhieuThuTienResponseDto?> GetPhieuThuTienByIdAsync(string maPhieu);
        Task<List<DanhSachPhieuThuResponseDto>> GetPhieuThuTienTheoThangAsync(int thang, int nam);
        Task<List<KhachHangThuTienResponseDto>> GetKhachHangDangNoAsync();
        Task<PhieuThuTienResponseDto> UpdatePhieuThuTienAsync(UpdatePhieuThuTienDto dto);
    }
}

