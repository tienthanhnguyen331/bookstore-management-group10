using System.Threading.Tasks;
using DoAnPhanMem.DTO;

namespace DoAnPhanMem.Services.Interfaces
{
    public interface ISaleService
    {
        Task<(string MaHoaDon, decimal Total)> CreateSaleAsync(CompleteSaleDto dto);
        Task<DoAnPhanMem.DTO.InvoiceDto?> GetInvoiceAsync(string maHoaDon);
    }
}
