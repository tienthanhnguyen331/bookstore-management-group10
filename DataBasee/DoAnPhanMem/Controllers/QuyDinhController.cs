using Microsoft.AspNetCore.Mvc;
using DoAnPhanMem.Services.Interfaces;
using DoAnPhanMem.DTO;

namespace DoAnPhanMem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuyDinhController : ControllerBase
    {
        private readonly IQuyDinhService _quyDinhService;

        public QuyDinhController(IQuyDinhService quyDinhService)
        {
            _quyDinhService = quyDinhService;
        }

        // GET: api/QuyDinh
        [HttpGet]
        public async Task<IActionResult> GetAllRules()
        {
            // Gọi Service để lấy cục JSON đẹp
            var data = await _quyDinhService.GetQuyDinhHienTaiAsync();
            return Ok(data);
        }

        // PUT: api/QuyDinh/CapNhat (Giữ nguyên)
        [HttpPut("CapNhat")]
        public async Task<IActionResult> UpdateQuyDinh([FromBody] QuyDinhUpdateDto request)
        {
            var result = await _quyDinhService.UpdateQuyDinhAsync(request);
            if (result) return Ok(new { message = "Cập nhật thành công!" });
            return StatusCode(500, new { message = "Lỗi hệ thống." });
        }
    }
}