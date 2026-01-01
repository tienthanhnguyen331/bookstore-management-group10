using DoAnPhanMem.Data;
using DoAnPhanMem.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace DoAnPhanMem.Controllers
{
    [Route("api/profile")]
    [ApiController]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly DataContext _context;

        public ProfileController(DataContext context)
        {
            _context = context;
        }

        // GET: api/profile
        [HttpGet]
        public async Task<IActionResult> GetMyProfile()
        {
            var username = User.Identity?.Name ?? User.FindFirst(ClaimTypes.Name)?.Value;
            if (string.IsNullOrEmpty(username))
                return Unauthorized(new { message = "Không tìm thấy thông tin người dùng trong token" });

            var tk = await _context.TAI_KHOAN.Include(t => t.NhanVien).FirstOrDefaultAsync(t => t.TenDangNhap == username);
            if (tk == null || tk.NhanVien == null)
                return NotFound(new { message = "Không tìm thấy thông tin nhân viên" });

            var nv = tk.NhanVien;

            var result = new ProfileDto
            {
                MaNV = nv.MaNV,
                HoTen = nv.HoTen,
                TenDangNhap = tk.TenDangNhap,
                ChucVu = nv.ChucVu ?? "NhanVien",
                SoDienThoai = nv.SDT ?? string.Empty,
                DiaChi = nv.DiaChi ?? string.Empty,
                Email = nv.Email ?? string.Empty
            };

            return Ok(result);
        }

        // PUT: api/profile
        [HttpPut]
        public async Task<IActionResult> UpdateMyProfile([FromBody] UpdateProfileDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var username = User.Identity?.Name ?? User.FindFirst(ClaimTypes.Name)?.Value;
            if (string.IsNullOrEmpty(username))
                return Unauthorized(new { message = "Không tìm thấy thông tin người dùng trong token" });

            var tk = await _context.TAI_KHOAN.Include(t => t.NhanVien).FirstOrDefaultAsync(t => t.TenDangNhap == username);
            if (tk == null || tk.NhanVien == null)
                return NotFound(new { message = "Không tìm thấy thông tin nhân viên" });

            var nv = tk.NhanVien;

            // Chỉ cho phép cập nhật các trường cho phép theo demo.md
            if (!string.IsNullOrWhiteSpace(dto.SoDienThoai)) nv.SDT = dto.SoDienThoai;
            if (!string.IsNullOrWhiteSpace(dto.DiaChi)) nv.DiaChi = dto.DiaChi;
            if (!string.IsNullOrWhiteSpace(dto.Email)) nv.Email = dto.Email;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật thông tin thành công" });
        }
    }
}
