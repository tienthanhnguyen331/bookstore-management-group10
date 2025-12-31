using DoAnPhanMem.Data;
using DoAnPhanMem.DTO;
using DoAnPhanMem.Models;
using DoAnPhanMem.Services;
using DoAnPhanMem.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DoAnPhanMem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PhieuThuTienController : ControllerBase
    {
        private readonly IPhieuThuTienService _phieuThuService;
        private readonly DataContext _context; // Giữ lại để dùng cho hàm Update/GetById chưa có trong Service

        // Inject Service thay vì logic rời rạc
        public PhieuThuTienController(IPhieuThuTienService phieuThuService, DataContext context)
        {
            _phieuThuService = phieuThuService;
            _context = context;
        }

        // GET: api/PhieuThuTien/TraCuuKhachHang?sdt=0123456789
        [HttpGet("TraCuuKhachHang")]
        public async Task<IActionResult> TraCuuKhachHang([FromQuery] string? sdt)
        {
            // Logic đã được chuyển vào Service
            var result = await _phieuThuService.TraCuuKhachHangAsync(sdt);
            return Ok(result);
        }

        // POST: api/PhieuThuTien/LapPhieu
        [HttpPost("LapPhieu")]
        public async Task<IActionResult> LapPhieuThuTien([FromBody] LapPhieuThuTienDto dto)
        {
            try
            {
                // Gọi Service để xử lý nghiệp vụ (bao gồm cả check Rule và update báo cáo)
                var result = await _phieuThuService.LapPhieuThuTienAsync(dto);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                // Lỗi vi phạm quy định (VD: check số tiền thu > nợ)
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // GET: api/PhieuThuTien
        [HttpGet]
        public async Task<IActionResult> GetAllPhieuThuTien()
        {
            var result = await _phieuThuService.GetAllPhieuThuTienAsync();
            return Ok(result);
        }

        // GET: api/PhieuThuTien/TheoThang?thang=12&nam=2025
        [HttpGet("TheoThang")]
        public async Task<IActionResult> GetPhieuThuTienTheoThang([FromQuery] int thang, [FromQuery] int nam)
        {
            var result = await _phieuThuService.GetPhieuThuTienTheoThangAsync(thang, nam);
            return Ok(result);
        }

        // GET: api/PhieuThuTien/KhachHangDangNo
        [HttpGet("KhachHangDangNo")]
        public async Task<IActionResult> GetKhachHangDangNo()
        {
            var result = await _phieuThuService.GetKhachHangDangNoAsync();
            return Ok(result);
        }
    }
}