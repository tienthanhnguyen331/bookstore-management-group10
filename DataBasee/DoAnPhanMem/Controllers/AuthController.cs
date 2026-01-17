using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using DoAnPhanMem.DTO;
using DoAnPhanMem.Services.Interfaces;
using Microsoft.Extensions.Caching.Memory;
using DoAnPhanMem.Services;
using DoAnPhanMem.Data;
using Microsoft.EntityFrameworkCore;

namespace DoAnPhanMem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly DataContext _context;
        private readonly IMemoryCache _cache;
        private readonly IEmailService _emailService;

        public AuthController(
            IAuthService authService,
            DataContext context,
            IMemoryCache cache,
            IEmailService emailService)
        {
            _authService = authService;
            _context = context;
            _cache = cache;
            _emailService = emailService;
        }

        // POST: api/Auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var result = await _authService.Login(dto.Username, dto.Password);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // POST: api/Auth/change-password
        [HttpPost("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                // Lấy username từ token thay vì client gửi lên
                var username = User.Identity?.Name ?? User.FindFirst(ClaimTypes.Name)?.Value;
                if (string.IsNullOrEmpty(username))
                    return Unauthorized(new { message = "Không tìm thấy thông tin người dùng trong token" });

                var result = await _authService.ChangePassword(username, dto.OldPassword, dto.NewPassword);
                
                if (result)
                    return Ok(new { message = "Đổi mật khẩu thành công" });
                
                return BadRequest(new { message = "Đổi mật khẩu thất bại" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // GET: api/Auth/generate-hash?password=1
        // DEVELOPMENT ONLY - Helper ?? generate password hash
        [HttpGet("generate-hash")]
        public IActionResult GenerateHash([FromQuery] string password)
        {
            if (string.IsNullOrEmpty(password))
                return BadRequest(new { message = "Password không được để trống" });

            var hash = BCrypt.Net.BCrypt.HashPassword(password);
            
            return Ok(new 
            { 
                password = password,
                hash = hash,
                verify = BCrypt.Net.BCrypt.Verify(password, hash),
                sqlScript = $"UPDATE TAI_KHOAN SET MatKhau = '{hash}' WHERE TenDangNhap = 'admin';"
            });
        }

        // DTOs cho tính năng này
        public class ForgotPasswordDto { public string Email { get; set; } }
        public class ResetPasswordDto { public string Email { get; set; } public string Otp { get; set; } public string NewPassword { get; set; } }

        [HttpPost("forgot-password")]
        [AllowAnonymous]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
        {
            // 1. Kiểm tra email có tồn tại trong hệ thống (bảng NHAN_VIEN)
            var nhanVien = await _context.NHAN_VIEN.FirstOrDefaultAsync(nv => nv.Email == dto.Email);
            if (nhanVien == null)
            {
                return BadRequest("Email không tồn tại trong hệ thống.");
            }

            // 2. Sinh mã OTP ngẫu nhiên (6 số)
            var otp = new Random().Next(100000, 999999).ToString();

            // 3. Lưu OTP vào Memory Cache (Hết hạn sau 5 phút)
            // Key là "OTP_" + Email để tránh trùng lặp
            _cache.Set("OTP_" + dto.Email, otp, TimeSpan.FromMinutes(5));

            // 4. Gửi Email
            var subject = "Mã xác thực Quên mật khẩu - BookStore";
            var body = $@"
                <h3>Yêu cầu đặt lại mật khẩu</h3>
                <p>Mã OTP của bạn là: <b style='font-size: 20px; color: blue;'>{otp}</b></p>
                <p>Mã này sẽ hết hạn sau 5 phút.</p>
                <p>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>";

            try 
            {
                await _emailService.SendEmailAsync(dto.Email, subject, body);
                return Ok(new { message = "Mã OTP đã được gửi. Vui lòng kiểm tra email." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Lỗi gửi email: " + ex.Message);
            }
        }

        [HttpPost("reset-password-otp")]
        [AllowAnonymous]
        public async Task<IActionResult> ResetPasswordWithOtp([FromBody] ResetPasswordDto dto)
        {
            // 1. Lấy OTP từ Cache
            if (!_cache.TryGetValue("OTP_" + dto.Email, out string cachedOtp))
            {
                return BadRequest("Mã OTP đã hết hạn hoặc không tồn tại.");
            }

            // 2. So sánh OTP
            if (cachedOtp != dto.Otp)
            {
                return BadRequest("Mã OTP không chính xác.");
            }

            // 3. Tìm tài khoản để đổi mật khẩu
            var nhanVien = await _context.NHAN_VIEN.FirstOrDefaultAsync(nv => nv.Email == dto.Email);
            if (nhanVien == null) return BadRequest("Lỗi dữ liệu nhân viên.");

            var taiKhoan = await _context.TAI_KHOAN.FirstOrDefaultAsync(t => t.TenDangNhap == nhanVien.TenDangNhap);
            if (taiKhoan == null) return BadRequest("Nhân viên này chưa có tài khoản.");

            // 4. Cập nhật mật khẩu mới
            taiKhoan.MatKhau = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            await _context.SaveChangesAsync();

            // 5. Xóa OTP khỏi Cache để không dùng lại được
            _cache.Remove("OTP_" + dto.Email);

            return Ok(new { message = "Đổi mật khẩu thành công. Vui lòng đăng nhập lại." });
        }
    }
}

