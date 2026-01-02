# Hướng dẫn Triển khai Tính năng Quên Mật khẩu (Gmail + IMemoryCache)

Tài liệu này hướng dẫn chi tiết cách triển khai tính năng "Quên mật khẩu" sử dụng dịch vụ gửi mail **Gmail (SMTP)** và lưu trữ mã OTP tạm thời trên **RAM (IMemoryCache)** để không phải sửa đổi cấu trúc Database.

---

## PHẦN 1: BACKEND (.NET API)

### 1. Cài đặt Thư viện
Mở terminal tại thư mục dự án Backend (`DoAnPhanMem`) và chạy lệnh sau để cài đặt thư viện gửi mail:

```bash
dotnet add package MailKit
dotnet add package MimeKit
```
*(Lưu ý: `IMemoryCache` đã có sẵn trong ASP.NET Core, không cần cài thêm)*

### 2. Cấu hình `appsettings.json`
Thêm section `EmailSettings` vào file `appsettings.json`. Sử dụng thông tin Gmail đã cấu hình App Password.

```json
{
  "Logging": { ... },
  "AllowedHosts": "*",
  "ConnectionStrings": { ... },
  // Thêm phần này
  "EmailSettings": {
    "SmtpServer": "smtp.gmail.com",
    "Port": 587,
    "SenderName": "BookStore Support",
    "SenderEmail": "nguyentienthanh7298@gmail.com", 
    "Username": "nguyentienthanh7298@gmail.com",
    "Password": "tssw vwqs toik cprl"
  },
  "Jwt": { ... }
}
```
*Lưu ý: Mật khẩu ở trên là Mật khẩu ứng dụng (App Password), không phải mật khẩu đăng nhập Gmail.*

### 3. Tạo Service Gửi Email

Tạo file `Services/IEmailService.cs`:
```csharp
using System.Threading.Tasks;

namespace DoAnPhanMem.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string message);
    }
}
```

Tạo file `Services/EmailService.cs`:
```csharp
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using MimeKit;
using System.Threading.Tasks;

namespace DoAnPhanMem.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string message)
        {
            var emailSettings = _config.GetSection("EmailSettings");

            var email = new MimeMessage();
            email.From.Add(new MailboxAddress(emailSettings["SenderName"], emailSettings["SenderEmail"]));
            email.To.Add(MailboxAddress.Parse(toEmail));
            email.Subject = subject;

            var builder = new BodyBuilder();
            builder.HtmlBody = message;
            email.Body = builder.ToMessageBody();

            using var smtp = new SmtpClient();
            try 
            {
                await smtp.ConnectAsync(emailSettings["SmtpServer"], int.Parse(emailSettings["Port"]), SecureSocketOptions.StartTls);
                await smtp.AuthenticateAsync(emailSettings["Username"], emailSettings["Password"]);
                await smtp.SendAsync(email);
            }
            finally
            {
                await smtp.DisconnectAsync(true);
            }
        }
    }
}
```

### 4. Đăng ký Service trong `Program.cs`

Mở file `Program.cs` và thêm dòng sau vào khu vực đăng ký services (trước `builder.Build()`):

```csharp
// Đăng ký Memory Cache
builder.Services.AddMemoryCache();

// Đăng ký Email Service
builder.Services.AddScoped<IEmailService, EmailService>();
```

### 5. Cập nhật `AuthController.cs`

Thêm logic xử lý Quên mật khẩu sử dụng `IMemoryCache`.

```csharp
using Microsoft.Extensions.Caching.Memory; // Thêm namespace này
using DoAnPhanMem.Services; // Thêm namespace service

// ...

public class AuthController : ControllerBase
{
    private readonly DataContext _context;
    private readonly IConfiguration _configuration;
    private readonly IMemoryCache _cache; // Inject Cache
    private readonly IEmailService _emailService; // Inject Email Service

    public AuthController(
        DataContext context, 
        IConfiguration configuration,
        IMemoryCache cache,
        IEmailService emailService)
    {
        _context = context;
        _configuration = configuration;
        _cache = cache;
        _emailService = emailService;
    }

    // ... Các API Login cũ giữ nguyên ...

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

        var taiKhoan = await _context.TAI_KHOAN.FirstOrDefaultAsync(t => t.MaNV == nhanVien.MaNV);
        if (taiKhoan == null) return BadRequest("Nhân viên này chưa có tài khoản.");

        // 4. Cập nhật mật khẩu mới
        taiKhoan.MatKhau = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        await _context.SaveChangesAsync();

        // 5. Xóa OTP khỏi Cache để không dùng lại được
        _cache.Remove("OTP_" + dto.Email);

        return Ok(new { message = "Đổi mật khẩu thành công. Vui lòng đăng nhập lại." });
    }
}
```

---

## PHẦN 2: FRONTEND (REACTJS)

### 1. Cập nhật `services/authService.js` (hoặc `api.js`)

Thêm các hàm gọi API mới:

```javascript
// services/authService.js
import api from './api';

export const forgotPassword = async (email) => {
    return await api.post('/auth/forgot-password', { email });
};

export const resetPasswordWithOtp = async (email, otp, newPassword) => {
    return await api.post('/auth/reset-password-otp', { email, otp, newPassword });
};
```

### 2. Tạo trang `pages/ForgotPasswordPage.jsx`

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword, resetPasswordWithOtp } from '../services/authService';
// Import Logo hoặc Component UI tùy dự án

const ForgotPasswordPage = () => {
    const [step, setStep] = useState(1); // 1: Nhập Email, 2: Nhập OTP
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Xử lý Gửi OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setIsLoading(true);
        try {
            await forgotPassword(email);
            setStep(2);
            setMessage(`Mã OTP đã được gửi đến ${email}.`);
        } catch (err) {
            setError(err.response?.data || 'Không thể gửi OTP. Kiểm tra lại email.');
        } finally {
            setIsLoading(false);
        }
    };

    // Xử lý Đổi mật khẩu
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await resetPasswordWithOtp(email, otp, newPassword);
            alert('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data || 'Đổi mật khẩu thất bại. Mã OTP sai hoặc hết hạn.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Quên mật khẩu
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {error && <div className="mb-4 p-2 bg-red-50 text-red-600 text-sm rounded">{error}</div>}
                    {message && <div className="mb-4 p-2 bg-green-50 text-green-600 text-sm rounded">{message}</div>}

                    {step === 1 ? (
                        <form onSubmit={handleSendOtp} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isLoading ? 'Đang gửi...' : 'Gửi mã OTP'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input type="email" value={email} disabled className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mã OTP</label>
                                <input
                                    type="text"
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mật khẩu mới</label>
                                <input
                                    type="password"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                            </button>
                        </form>
                    )}
                    
                    <div className="mt-6 text-center">
                        <a href="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                            Quay lại đăng nhập
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
```

### 3. Đăng ký Route trong `App.jsx`

```jsx
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

// ... trong <Routes>
<Route path="/forgot-password" element={<ForgotPasswordPage />} />
```
