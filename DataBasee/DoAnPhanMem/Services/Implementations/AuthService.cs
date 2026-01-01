
using DoAnPhanMem.Data;
using DoAnPhanMem.Models;
using DoAnPhanMem.DTO;
using DoAnPhanMem.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace DoAnPhanMem.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly DataContext _context;
        private readonly IConfiguration _config;
        private const string DEFAULT_PASSWORD = "1"; // Mật khẩu mặc định

        public AuthService(DataContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<LoginResponseDto> Login(string username, string password)
        {
            // Tìm tài khoản
            var taiKhoan = await _context.TAI_KHOAN
                .Include(tk => tk.NhanVien)
                .FirstOrDefaultAsync(x => x.TenDangNhap == username);

            if (taiKhoan == null)
                throw new Exception("Sai tài khoản");

            // Kiểm tra mật khẩu
            if (!BCrypt.Net.BCrypt.Verify(password, taiKhoan.MatKhau))
                throw new Exception("Sai mật khẩu");

            // Kiểm tra xem có phải là mật khẩu mặc định không
            bool isFirstLogin = BCrypt.Net.BCrypt.Verify(DEFAULT_PASSWORD, taiKhoan.MatKhau);

            // Lấy thông tin nhân viên
            var nhanVien = taiKhoan.NhanVien;
            if (nhanVien == null)
                throw new Exception("Không tìm thấy thông tin nhân viên");

            // Tạo JWT token
            string token = GenerateJwt(taiKhoan, nhanVien);

            // Trả về response
            return new LoginResponseDto
            {
                Token = token,
                Role = nhanVien.ChucVu ?? "NhanVien", // Admin hoặc NhanVien
                IsFirstLogin = isFirstLogin,
                FullName = nhanVien.HoTen,
                MaNV = nhanVien.MaNV
            };
        }

        public async Task<bool> ChangePassword(string username, string oldPassword, string newPassword)
        {
            var taiKhoan = await _context.TAI_KHOAN
                .FirstOrDefaultAsync(x => x.TenDangNhap == username);

            if (taiKhoan == null)
                throw new Exception("Không tìm thấy tài khoản");

            // Kiểm tra mật khẩu cũ
            if (!BCrypt.Net.BCrypt.Verify(oldPassword, taiKhoan.MatKhau))
                throw new Exception("Mật khẩu cũ không đúng");

            // Mã hóa và cập nhật mật khẩu mới
            taiKhoan.MatKhau = BCrypt.Net.BCrypt.HashPassword(newPassword);
            
            await _context.SaveChangesAsync();
            
            return true;
        }

        private string GenerateJwt(TAI_KHOAN taiKhoan, NHAN_VIEN nhanVien)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, taiKhoan.TenDangNhap),
                new Claim(ClaimTypes.Role, nhanVien.ChucVu ?? "NhanVien"),
                new Claim("MaNV", nhanVien.MaNV),
                new Claim("FullName", nhanVien.HoTen)
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["Jwt:Key"]!)
            );

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(8),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}