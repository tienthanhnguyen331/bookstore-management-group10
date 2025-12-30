using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DoAnPhanMem.DTO;

namespace DoAnPhanMem.Services.Interfaces
{
    public interface IBaoCaoTonService
    {
        /// <summary>
        /// Cập nhật báo cáo tồn kho cho một cuốn sách theo delta (ví dụ bán ra: delta = -soLuong).
        /// </summary>
        /*Task UpdateInventoryReportAsync(string maSach, int delta, DateTime? at = null);*/
        Task UpdateInventoryReportAsync(string maSach, int amount, bool isBanHang, DateTime? at = null);

        /// <summary>
        /// Lấy danh sách báo cáo tồn theo tháng/năm dưới dạng DTO cho UI.
        /// </summary>
        Task<List<StockReportDto>> GetStockReportAsync(int month, int year);
    }
}