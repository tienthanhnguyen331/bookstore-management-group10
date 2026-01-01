using Microsoft.AspNetCore.Mvc;
using DoAnPhanMem.DTO;
using DoAnPhanMem.Services.Interfaces;

namespace DoAnPhanMem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PhieuThuTienController : ControllerBase
    {
        private readonly IPhieuThuTienService _service;

        public PhieuThuTienController(IPhieuThuTienService service)
        {
            _service = service;
        }

        // API tra cuu khach hang de thu tien theo SDT
        // GET: api/PhieuThuTien/TraCuuKhachHang?sdt=0123456789
        [HttpGet("TraCuuKhachHang")]
        public async Task<IActionResult> TraCuuKhachHang([FromQuery] string? sdt)
        {
            var result = await _service.TraCuuKhachHangAsync(sdt);
            return Ok(result);
        }

        // API lap phieu thu tien
        // POST: api/PhieuThuTien/LapPhieu
        [HttpPost("LapPhieu")]
        public async Task<IActionResult> LapPhieuThuTien([FromBody] LapPhieuThuTienDto dto)
        {
            try
            {
                var result = await _service.LapPhieuThuTienAsync(dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // API lay danh sach phieu thu tien
        // GET: api/PhieuThuTien
        [HttpGet]
        public async Task<IActionResult> GetAllPhieuThuTien()
        {
            var danhSach = await _service.GetAllPhieuThuTienAsync();
            return Ok(danhSach);
        }

        // API lay phieu thu tien theo ma
        // GET: api/PhieuThuTien/{maPhieu}
        [HttpGet("{maPhieu}")]
        public async Task<IActionResult> GetPhieuThuTienById(string maPhieu)
        {
            var phieu = await _service.GetPhieuThuTienByIdAsync(maPhieu);

            if (phieu == null)
            {
                return NotFound(new { message = $"Khong tim thay phieu thu tien co ma: {maPhieu}" });
            }

            return Ok(phieu);
        }

        // API lay danh sach phieu thu tien theo thang/nam
        // GET: api/PhieuThuTien/TheoThang?thang=12&nam=2025
        [HttpGet("TheoThang")]
        public async Task<IActionResult> GetPhieuThuTienTheoThang([FromQuery] int thang, [FromQuery] int nam)
        {
            var danhSach = await _service.GetPhieuThuTienTheoThangAsync(thang, nam);
            return Ok(danhSach);
        }

        // API lay danh sach khach hang dang no
        // GET: api/PhieuThuTien/KhachHangDangNo
        [HttpGet("KhachHangDangNo")]
        public async Task<IActionResult> GetKhachHangDangNo()
        {
            var danhSach = await _service.GetKhachHangDangNoAsync();
            return Ok(danhSach);
        }

        // API cap nhat phieu thu tien
        // PUT: api/PhieuThuTien/CapNhat
        [HttpPut("CapNhat")]
        public async Task<IActionResult> UpdatePhieuThuTien([FromBody] UpdatePhieuThuTienDto dto)
        {
            try
            {
                var result = await _service.UpdatePhieuThuTienAsync(dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
