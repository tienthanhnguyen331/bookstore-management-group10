


using DoAnPhanMem.Data;
using DoAnPhanMem.DTO; // Nhớ đảm bảo đã có namespace này
using DoAnPhanMem.Models;
using DoAnPhanMem.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using BCrypt.Net;

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
            // 1. Tìm tài khoản và load luôn thông tin Nhân Viên đi kèm
            var taiKhoan = await _context.TAI_KHOAN
                .Include(tk => tk.NhanVien)
                .FirstOrDefaultAsync(x => x.TenDangNhap == username);

            if (taiKhoan == null)
                throw new Exception("Sai tài khoản");

            // 2. Kiểm tra mật khẩu
            if (!BCrypt.Net.BCrypt.Verify(password, taiKhoan.MatKhau))
                throw new Exception("Sai mật khẩu");

            // 3. Kiểm tra xem có phải là mật khẩu mặc định ("1") không?
            // Để Frontend biết mà bắt đổi mật khẩu
            bool isFirstLogin = BCrypt.Net.BCrypt.Verify(DEFAULT_PASSWORD, taiKhoan.MatKhau);

            // 4. Lấy thông tin nhân viên
            var nhanVien = taiKhoan.NhanVien;
            if (nhanVien == null)
                throw new Exception("Không tìm thấy thông tin nhân viên liên kết");

            // 5. Tạo JWT token
            string token = GenerateJwt(taiKhoan, nhanVien);

            // 6. Trả về Object đầy đủ cho Frontend
            return new LoginResponseDto
            {
                Token = token,
                Role = nhanVien.ChucVu ?? "NhanVien", // Fallback nếu null
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

            // // Kiểm tra mật khẩu cũ
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
                new Claim("FullName", nhanVien.HoTen ?? "")
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["Jwt:Key"]!)
            );

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(2), // Token sống trong 2 giờ
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}