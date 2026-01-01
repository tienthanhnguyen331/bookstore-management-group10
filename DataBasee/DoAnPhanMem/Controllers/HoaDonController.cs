
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DoAnPhanMem.Data;
using DoAnPhanMem.Models;
using DoAnPhanMem.DTO;
using DoAnPhanMem.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using DoAnPhanMem.Services;

namespace DoAnPhanMem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Bảo vệ Controller này, yêu cầu đăng nhập
    public class HoaDonController : ControllerBase
    {
        private readonly IHoaDonService _service;

        // Inject Service thay vì gọi trực tiếp DB Context
        public HoaDonController(IHoaDonService service)
        {
            _service = service;
        }

        // API lay danh sach sach de hien thi trong dropdown
        // GET: api/HoaDon/DanhSachSach
        [HttpGet("DanhSachSach")]
        public async Task<IActionResult> GetDanhSachSach()
        {
            var danhSachSach = await _service.GetDanhSachSachAsync();
            return Ok(danhSachSach);
        }

        // API tra cuu khach hang theo so dien thoai
        // GET: api/HoaDon/TraCuuKhachHang?sdt=0123456789
        [HttpGet("TraCuuKhachHang")]
        public async Task<IActionResult> TraCuuKhachHang([FromQuery] string? sdt)
        {
            var result = await _service.TraCuuKhachHangAsync(sdt);
            return Ok(result);
        }

        // API lap hoa don
        // POST: api/HoaDon/LapHoaDon
        [HttpPost("LapHoaDon")]
        public async Task<IActionResult> LapHoaDon([FromBody] LapHoaDonDto dto)
        {
            try
            {
                var result = await _service.LapHoaDonAsync(dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                // Trả về lỗi 400 kèm thông báo từ Service (VD: Hết hàng, Nợ quá mức...)
                return BadRequest(new { message = ex.Message });
            }
        }

        // API lay danh sach hoa don
        // GET: api/HoaDon
        [HttpGet]
        public async Task<IActionResult> GetAllHoaDon()
        {
            var hoaDons = await _service.GetAllHoaDonAsync();
            return Ok(hoaDons);
        }

        // API lay chi tiet hoa don theo ma
        // GET: api/HoaDon/{maHoaDon}
        [HttpGet("{maHoaDon}")]
        public async Task<IActionResult> GetHoaDonById(string maHoaDon)
        {
            var hoaDon = await _service.GetHoaDonByIdAsync(maHoaDon);

            if (hoaDon == null)
            {
                return NotFound(new { message = $"Khong tim thay hoa don co ma: {maHoaDon}" });
            }
            return Ok(hoaDon);
        }

        // API cap nhat hoa don
        // PUT: api/HoaDon/CapNhat
        [HttpPut("CapNhat")]
        public async Task<IActionResult> UpdateHoaDon([FromBody] UpdateHoaDonDto dto)
        {
            try
            {
                var result = await _service.UpdateHoaDonAsync(dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
