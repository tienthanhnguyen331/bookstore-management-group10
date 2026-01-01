/*using DoAnPhanMem.Data;
using DoAnPhanMem.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;

public class AuthService : IAuthService
{
    private readonly DataContext _context;
    private readonly IConfiguration _config;

    public AuthService(DataContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    public async Task<string> Login(string username, string password)
    {
        var user = await _context.TAI_KHOAN.FirstOrDefaultAsync(x => x.TenDangNhap == username);

        if (user == null)
            throw new Exception("Sai tài khoản");

        if (!BCrypt.Net.BCrypt.Verify(password, user.MatKhau))
            throw new Exception("Sai mật khẩu");

        return GenerateJwt(user);
    }

    private string GenerateJwt(TAI_KHOAN user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.Name, user.TenDangNhap),
            new Claim(ClaimTypes.Role, user.LoaiTaiKhoan)
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Key"])
        );

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(2),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}*/

using DoAnPhanMem.Data;
using DoAnPhanMem.Models;
using DoAnPhanMem.Services.Interfaces; // Đảm bảo đúng namespace Interface của bạn
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using BCrypt.Net; // Thư viện mã hóa mật khẩu

namespace DoAnPhanMem.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly DataContext _context;
        private readonly IConfiguration _config;

        public AuthService(DataContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<string> Login(string username, string password)
        {
            // 1. Tìm tài khoản trong bảng TAI_KHOAN
            var account = await _context.TAI_KHOAN.FirstOrDefaultAsync(x => x.TenDangNhap == username);

            if (account == null)
                throw new Exception("Tài khoản không tồn tại");

            // 2. Kiểm tra mật khẩu (So sánh mật khẩu nhập vào với Hash trong DB)
            if (!BCrypt.Net.BCrypt.Verify(password, account.MatKhau))
                throw new Exception("Sai mật khẩu");

            // 3. 🔥 LẤY CHỨC VỤ TỪ BẢNG NHÂN VIÊN 🔥
            // Vì bảng TAI_KHOAN không có cột quyền, ta phải sang bảng NHAN_VIEN để lấy
            var nhanVien = await _context.NHAN_VIEN.FirstOrDefaultAsync(x => x.TenDangNhap == username);

            // Nếu tìm thấy nhân viên thì lấy ChucVu, nếu không (ví dụ acc admin nhập tay) thì gán mặc định "NhanVien"
            string role = nhanVien != null ? nhanVien.ChucVu : "NhanVien";

            // 4. Tạo Token với quyền vừa lấy được
            return GenerateJwt(account.TenDangNhap, role);
        }

        private string GenerateJwt(string username, string role)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.Role, role) // <--- QUAN TRỌNG: Dòng này giúp [Authorize(Roles="Admin")] hoạt động
            };

            // Lấy Secret Key từ appsettings.json
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
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
