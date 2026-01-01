
using DoAnPhanMem.Data;
using Microsoft.EntityFrameworkCore;
using DoAnPhanMem.Services.Interfaces;
using DoAnPhanMem.Services.Implementations;

﻿
using DoAnPhanMem.Services;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
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
builder.Services.AddSwaggerGen(option =>
{
    option.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "BookStore API", Version = "v1" });

    // Cấu hình để nhập Token (Chỉ cần Paste, không cần gõ Bearer)
    option.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        // 👇 Dòng mô tả này để nhắc bạn nhớ chỉ dán token thôi
        Description = "Chỉ cần dán chuỗi Token vào ô bên dưới (Không cần gõ 'Bearer')",
        Name = "Authorization",

        // 👇 QUAN TRỌNG: 2 dòng này giúp Swagger tự điền chữ 'Bearer' cho bạn
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "bearer",

        BearerFormat = "JWT"
    });

    option.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[]{}
        }
    });
});

builder.Services.AddScoped<IRuleService, RuleService>();
builder.Services.AddScoped<IQuyDinhService, QuyDinhService>();
builder.Services.AddScoped<ISachService, SachService>();

builder.Services.AddScoped<IPhieuNhapService, PhieuNhapService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IKhachHangService, KhachHangService>();
builder.Services.AddScoped<IBaoCaoCongNoService, BaoCaoCongNoService>();
builder.Services.AddScoped<IBaoCaoTonService, BaoCaoTonService>();

builder.Services.AddScoped<DoAnPhanMem.Services.Interfaces.IPhieuNhapService, DoAnPhanMem.Services.Implementations.PhieuNhapService>();
builder.Services.AddScoped<IPhieuThuTienService, PhieuThuTienService>();


builder.Services.AddScoped<ISaleService, SaleService>();

builder.Services.AddScoped<IAdminService, AdminService>();
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