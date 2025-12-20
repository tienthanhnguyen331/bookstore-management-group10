
﻿using DoAnPhanMem.Data;
using Microsoft.EntityFrameworkCore;
using DoAnPhanMem.Services.Interfaces;
using DoAnPhanMem.Services.Implementations;


using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;


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

builder.Services.AddScoped<IAuthService, AuthService>();

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
