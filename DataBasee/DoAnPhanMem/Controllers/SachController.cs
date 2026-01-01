using Microsoft.AspNetCore.Mvc;
using DoAnPhanMem.Services.Interfaces;
using DoAnPhanMem.DTO;

namespace DoAnPhanMem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SachController : ControllerBase
    {
        private readonly ISachService _sachService;

        // Tiêm Service vào Controller
        public SachController(ISachService sachService)
        {
            _sachService = sachService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            // Controller không cần biết logic lấy ở đâu, chỉ cần gọi Service
            var result = await _sachService.GetDanhSachSachAsync();
            return Ok(result);
        }

        // API Thêm Sách
        // POST: api/Sach
        [HttpPost("ThemSach")]
        public async Task<IActionResult> CreateSach([FromBody] SachCreateDto request)
        {
            // 1. Validate dữ liệu cơ bản
            if (string.IsNullOrEmpty(request.TenSach))
            {
                return BadRequest("Tên sách không được để trống");
            }
            if (string.IsNullOrEmpty(request.TenTheLoai))
            {
                return BadRequest("Vui lòng chọn Thể loại");
            }

            // 2. Gọi Service xử lý
            var result = await _sachService.CreateSachAsync(request);

            if (result)
            {
                return Ok(new { message = "Thêm sách thành công!" });
            }
            else
            {
                return StatusCode(500, new { message = "Thêm thất bại. Vui lòng kiểm tra lại thông tin (Tác giả/Thể loại)." });
            }
        }


        // API Cập nhật sách
        // PUT: api/Sach/CapNhat
        [HttpPut("CapNhat")]
        public async Task<IActionResult> UpdateSach([FromBody] SachUpdateDto request)
        {
            // Kiểm tra mã sách có gửi lên không
            if (string.IsNullOrEmpty(request.MaSach))
            {
                return BadRequest("Lỗi: Không xác định được sách cần sửa (Thiếu MaSach).");
            }

            var result = await _sachService.UpdateSachAsync(request);

            if (result)
            {
                return Ok(new { message = "Cập nhật sách thành công!" });
            }
            else
            {
                return StatusCode(500, new { message = "Cập nhật thất bại. Có thể không tìm thấy sách." });
            }
        }
    }


   
}