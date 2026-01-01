using DoAnPhanMem.DTO;
using System.Threading.Tasks;

namespace DoAnPhanMem.Services.Interfaces
{
    public interface IPhieuNhapService
    {
        // Khai báo hàm tạo phiếu nhập (nhận vào DTO, trả về True/False)
        Task<bool> TaoPhieuNhapAsync(PhieuNhapCreateDto request);
    }
}