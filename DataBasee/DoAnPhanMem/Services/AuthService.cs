
using DoAnPhanMem.Data;
using DoAnPhanMem.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

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
           /* new Claim(ClaimTypes.Role, user.LoaiTaiKhoan)*/
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
}