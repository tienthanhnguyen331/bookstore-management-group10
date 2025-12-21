using DoAnPhanMem.Data;
using Microsoft.EntityFrameworkCore;
using DoAnPhanMem.Services.Implementations;
using DoAnPhanMem.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);


// Add services to the container.
builder.Services.AddDbContext<DataContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});



builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//Đăng ký dịch vụ RuleService
//Đăng ký dịch vụ RuleService
builder.Services.AddScoped<IRuleService, RuleService>();
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

// Apply pending EF Core migrations at startup (creates database if missing)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<DataContext>();
    db.Database.Migrate();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
