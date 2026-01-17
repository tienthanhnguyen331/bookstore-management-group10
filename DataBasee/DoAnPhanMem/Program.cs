

using DoAnPhanMem.Data;
using DoAnPhanMem.Services.Implementations;
using DoAnPhanMem.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// --- 1. CẤU HÌNH DB ---
builder.Services.AddDbContext<DataContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// --- 2. CẤU HÌNH CORS ---
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// --- 3. CẤU HÌNH CONTROLLERS & JSON ---
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
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

// --- 5. SWAGGER (Dùng cấu hình tiện lợi của HEAD) ---
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(option =>
{
    option.SwaggerDoc("v1", new OpenApiInfo { Title = "BookStore API", Version = "v1" });

    // Cấu hình để nhập Token (Chỉ cần Paste, không cần gõ Bearer)
    option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Chỉ cần dán chuỗi Token vào ô bên dưới (Không cần gõ 'Bearer')",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });

    option.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[]{}
        }
    });
});

// --- 6. ĐĂNG KÝ SERVICES (Merge đầy đủ) ---

// Các Service cơ bản
builder.Services.AddScoped<IRuleService, RuleService>();
builder.Services.AddScoped<IQuyDinhService, QuyDinhService>();
builder.Services.AddScoped<ISachService, SachService>();
builder.Services.AddScoped<IKhachHangService, KhachHangService>();

// Các Service nghiệp vụ
builder.Services.AddScoped<IPhieuNhapService, PhieuNhapService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IBaoCaoCongNoService, BaoCaoCongNoService>();
builder.Services.AddScoped<IBaoCaoTonService, BaoCaoTonService>();
builder.Services.AddScoped<ISaleService, SaleService>();

// Service quan trọng vừa merge
builder.Services.AddScoped<IPhieuThuTienService, PhieuThuTienService>();
builder.Services.AddScoped<IHoaDonService, HoaDonService>(); // Có cái này thì HoaDonController mới chạy được
builder.Services.AddScoped<IAdminService, AdminService>();   // Có cái này thì AdminController mới chạy được

// Đăng ký Memory Cache
builder.Services.AddMemoryCache();

// Đăng ký Email Service
builder.Services.AddScoped<DoAnPhanMem.Services.IEmailService, DoAnPhanMem.Services.EmailService>();

var app = builder.Build();

// --- 7. HTTP PIPELINE ---
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();