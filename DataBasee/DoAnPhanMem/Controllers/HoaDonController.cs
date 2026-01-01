using Microsoft.AspNetCore.Mvc;
using DoAnPhanMem.DTO;
using DoAnPhanMem.Services.Interfaces;

namespace DoAnPhanMem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HoaDonController : ControllerBase
    {
        private readonly IHoaDonService _service;

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
