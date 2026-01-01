using Microsoft.AspNetCore.Mvc;
using DoAnPhanMem.DTO;
using DoAnPhanMem.Services.Interfaces;

namespace DoAnPhanMem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
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
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var result = await _authService.ChangePassword(dto.Username, dto.OldPassword, dto.NewPassword);
                
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
    }
}

