using System.Collections.Generic;
using System.Threading.Tasks;
using DoAnPhanMem.DTO;
using DoAnPhanMem.Models;

namespace DoAnPhanMem.Services.Interfaces
{
    public interface IBaoCaoCongNoService
    {
        Task<BAO_CAO_CONG_NO> RecordDebtAsync(CreateDebtDto dto);

        /// <summary>
        /// Lấy danh sách báo cáo công nợ cho tháng/năm dưới dạng DTO.
        /// </summary>
        Task<List<DebtReportDto>> GetDebtReportAsync(int month, int year);
    }
}
