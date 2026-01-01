
using System.Threading.Tasks;

using System.Linq;
using Microsoft.EntityFrameworkCore;
using DoAnPhanMem.DTO;
using DoAnPhanMem.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace DoAnPhanMem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SalesController : ControllerBase
    {
        private readonly ISaleService _saleService;
        private readonly IBaoCaoCongNoService _debtService;
        private readonly IBaoCaoTonService _stockReportService;
        private readonly Data.DataContext _context;

        public SalesController(ISaleService saleService, IBaoCaoCongNoService debtService, IBaoCaoTonService stockReportService, Data.DataContext context)
        {
            _saleService = saleService;
            _debtService = debtService;
            _stockReportService = stockReportService;
            _context = context;
        }


        // POST: api/Sales/pay
        // Thanh toán ngay: tạo hóa đơn + chi tiết + cập nhật tồn kho (KHÔNG tạo báo cáo công nợ)
        [HttpPost("pay")]
        public async Task<IActionResult> PaySale([FromBody] CompleteSaleDto dto)
        {
            using var tx = await _context.Database.BeginTransactionAsync();
            try
            {
                var (maHoaDon, total) = await _saleService.CreateSaleAsync(dto);


                if (dto.Items != null)
                {
                    foreach (var item in dto.Items)
                    {
                        await _stockReportService.UpdateInventoryReportAsync(item.MaSach, -item.SoLuong, true, dto.At);
                    }
                }


                await tx.CommitAsync();
                return CreatedAtAction(nameof(GetInvoice), new { maHoaDon = maHoaDon }, new { MaHoaDon = maHoaDon, Total = total });
            }
            catch (System.Exception ex)
            {
                await tx.RollbackAsync();
                var inner = ex.InnerException?.Message;
                return BadRequest(new { error = ex.Message, inner = inner, stack = ex.StackTrace });
            }
        }

        // POST: api/Sales/credit
        // Ghi sổ nợ: tạo hóa đơn + chi tiết + cập nhật tồn kho + tạo báo cáo công nợ
        [HttpPost("credit")]
        public async Task<IActionResult> CreditSale([FromBody] CompleteSaleDto dto)
        {
            using var tx = await _context.Database.BeginTransactionAsync();
            try
            {
                var (maHoaDon, total) = await _saleService.CreateSaleAsync(dto);


                if (dto.Items != null)
                {
                    foreach (var item in dto.Items)
                    {
                        await _stockReportService.UpdateInventoryReportAsync(item.MaSach, -item.SoLuong,true, dto.At);
                    }
                }

                if (!string.IsNullOrWhiteSpace(dto.SDT) && total > 0)
                {
                    await _debtService.RecordDebtAsync(new CreateDebtDto { SDT = dto.SDT, Amount = total, At = dto.At });
                }


                await tx.CommitAsync();
                return CreatedAtAction(nameof(GetInvoice), new { maHoaDon = maHoaDon }, new { MaHoaDon = maHoaDon, Total = total });
            }
            catch (System.Exception ex)
            {
                await tx.RollbackAsync();
                var inner = ex.InnerException?.Message;
                return BadRequest(new { error = ex.Message, inner = inner, stack = ex.StackTrace });
            }
        }

        [HttpGet("{maHoaDon}")]
        public async Task<IActionResult> GetInvoice(string maHoaDon)
        {
            var dto = await _saleService.GetInvoiceAsync(maHoaDon);
            if (dto == null) return NotFound();
            return Ok(dto);
        }
    }

}

