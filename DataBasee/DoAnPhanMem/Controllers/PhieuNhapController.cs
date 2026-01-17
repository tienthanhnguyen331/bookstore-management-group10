using Microsoft.AspNetCore.Mvc;

using DoAnPhanMem.Services.Interfaces;
using DoAnPhanMem.DTO;
using DoAnPhanMem.Services.Implementations;

namespace DoAnPhanMem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PhieuNhapController : ControllerBase
    {
        private readonly IPhieuNhapService _service;

        public PhieuNhapController(IPhieuNhapService service)
        {
            _service = service;
        }

        // POST: api/PhieuNhap/TaoPhieu
        [HttpPost("TaoPhieu")]
        public async Task<IActionResult> TaoPhieuNhap([FromBody] PhieuNhapCreateDto request)
        {
            try
            {
                // Kiểm tra xem có sách nào trong phiếu không
                if (request.DanhSachSach == null || request.DanhSachSach.Count == 0)
                {
                    return BadRequest("Vui lòng chọn ít nhất 1 cuốn sách để nhập.");
                }

                await _service.TaoPhieuNhapAsync(request);
                return Ok(new { message = "Lập phiếu nhập kho thành công!" });
            }
            catch (Exception ex)
            {
                // Trả về lỗi 400 kèm thông báo từ RuleService (VD: Vi phạm quy định nhập ít nhất 150 cuốn)
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}