using DoAnPhanMem.Data;
using Microsoft.EntityFrameworkCore;
using DoAnPhanMem.Services.Interfaces;
using DoAnPhanMem.Services.Implementations;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// --- 1. CẤU HÌNH DB ---
builder.Services.AddDbContext<DataContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// --- 2. CẤU HÌNH CORS (MỚI THÊM) ---
// Cho phép React (localhost:5173) gọi vào API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173") // Đổi port nếu React chạy port khác
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// --- 3. CẤU HÌNH CONTROLLERS & JSON ---
// (Đã gộp 2 phần AddControllers của bạn lại thành 1 để tránh lỗi)
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Giữ nguyên tên biến (không viết hoa/thường tự động)
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
        // Bỏ qua lỗi vòng lặp (Circular Reference)
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

// --- 4. CẤU HÌNH JWT ---
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

// --- 5. SWAGGER & SERVICES ---
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<IRuleService, RuleService>();
builder.Services.AddScoped<IQuyDinhService, QuyDinhService>();
builder.Services.AddScoped<ISachService, SachService>();
builder.Services.AddScoped<IPhieuNhapService, PhieuNhapService>();
builder.Services.AddScoped<IAuthService, DoAnPhanMem.Services.Implementations.AuthService>();
builder.Services.AddScoped<IKhachHangService, KhachHangService>();
builder.Services.AddScoped<IBaoCaoCongNoService, BaoCaoCongNoService>();
builder.Services.AddScoped<IBaoCaoTonService, BaoCaoTonService>();
builder.Services.AddScoped<ISaleService, SaleService>();
builder.Services.AddScoped<IPhieuThuTienService, PhieuThuTienService>();
builder.Services.AddScoped<IHoaDonService, HoaDonService>();

var app = builder.Build();

// --- 6. HTTP PIPELINE ---
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// ---> KÍCH HOẠT CORS TẠI ĐÂY (MỚI THÊM) <---
// Phải đặt TRƯỚC Authentication/Authorization
app.UseCors("AllowReactApp"); 

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();