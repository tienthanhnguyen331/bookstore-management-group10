using DoAnPhanMem.DTO;

using DoAnPhanMem.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace DoAnPhanMem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuyDinh : ControllerBase
    {
        private readonly IQuyDinhService _quyDinhService;

        public QuyDinh(IQuyDinhService quyDinhService)
        {
            _quyDinhService = quyDinhService;
        }

        [HttpPut("CapNhat")]
        public async Task<IActionResult> UpdateQuyDinh([FromBody] QuyDinhUpdateDto request)
        {
            var result = await _quyDinhService.UpdateQuyDinhAsync(request);
            if (result) return Ok("Cập nhật thành công");
            return StatusCode(500, "Lỗi cập nhật");
        }
    }
}