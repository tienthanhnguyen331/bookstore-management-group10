using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DoAnPhanMem.Services.Interfaces;

namespace DoAnPhanMem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly IBaoCaoTonService _stockService;
        private readonly IBaoCaoCongNoService _debtService;

        public ReportsController(IBaoCaoTonService stockService, IBaoCaoCongNoService debtService)
        {
            _stockService = stockService;
            _debtService = debtService;
        }

        // POST: api/Reports/stock
        // Body: { "month": 12, "year": 2025 }
        [HttpPost("stock")]
        public async Task<IActionResult> PostStockReport([FromBody] DoAnPhanMem.DTO.ReportsRequestDto req)
        {
            if (req == null) return BadRequest();
            if (req.Month < 1 || req.Month > 12) return BadRequest("Invalid month");

            var list = await _stockService.GetStockReportAsync(req.Month, req.Year);
            return Ok(list);
        }

        // POST: api/Reports/debt
        // Body: { "month": 12, "year": 2025 }
        [HttpPost("debt")]
        public async Task<IActionResult> PostDebtReport([FromBody] DoAnPhanMem.DTO.ReportsRequestDto req)
        {
            if (req == null) return BadRequest();
            if (req.Month < 1 || req.Month > 12) return BadRequest("Invalid month");

            var list = await _debtService.GetDebtReportAsync(req.Month, req.Year);
            return Ok(list);
        }
    }
}
