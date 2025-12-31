using DoAnPhanMem.Data;
using DoAnPhanMem.Services;
using DoAnPhanMem.Services.Implementations;
using DoAnPhanMem.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<DataContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Dòng này nghĩa là: "Đừng tự ý đổi tên biến của tôi, hãy giữ nguyên gốc"
        options.JsonSerializerOptions.PropertyNamingPolicy = null;

        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });


// Configure JWT Authentication
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

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IRuleService, RuleService>();

builder.Services.AddScoped<DoAnPhanMem.Services.Interfaces.IQuyDinhService, DoAnPhanMem.Services.Implementations.QuyDinhService>();
builder.Services.AddScoped<ISachService, SachService>();
builder.Services.AddScoped<DoAnPhanMem.Services.Interfaces.IPhieuNhapService, DoAnPhanMem.Services.Implementations.PhieuNhapService>();
builder.Services.AddScoped<IPhieuThuTienService, PhieuThuTienService>();

builder.Services.AddScoped<IAuthService, AuthService>();
//đăng ký dịch vụ KhachHangService
builder.Services.AddScoped<IKhachHangService, KhachHangService>();
//đăng ký dịch vụ Báo cáo công nợ
builder.Services.AddScoped<IBaoCaoCongNoService, BaoCaoCongNoService>();
//đăng ký dịch vụ Báo cáo tồn kho
builder.Services.AddScoped<IBaoCaoTonService, BaoCaoTonService>();
//đăng ký dịch vụ SaleService
builder.Services.AddScoped<ISaleService, SaleService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();


app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
