using System;
using System.Linq;
using System.Threading.Tasks;
using DoAnPhanMem.Data;
using DoAnPhanMem.Models;
using DoAnPhanMem.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using DoAnPhanMem.DTO;

namespace DoAnPhanMem.Services.Implementations
{
    public class BaoCaoTonService : IBaoCaoTonService
    {
        private readonly DataContext _context;

        public BaoCaoTonService(DataContext context)
        {
            _context = context;
        }

        public async Task UpdateInventoryReportAsync(string maSach, int delta, DateTime? at = null)
        {
            var when = at ?? DateTime.Now;
            var thang = when.Month;
            var nam = when.Year;

            var report = await _context.BAO_CAO_TON
                .FirstOrDefaultAsync(r => r.MaSach == maSach && r.Thang == thang && r.Nam == nam);

            if (report == null)
            {
                // lấy báo cáo trước đó để lấy TonDau
                var prev = await _context.BAO_CAO_TON
                    .Where(r => r.MaSach == maSach && (r.Nam < nam || (r.Nam == nam && r.Thang < thang)))
                    .OrderByDescending(r => r.Nam).ThenByDescending(r => r.Thang)
                    .FirstOrDefaultAsync();

                int tonDau;
                if (prev != null) tonDau = prev.TonCuoi;
                else
                {
                    // nếu không có báo cáo trước, tính TonDau dựa trên tồn hiện tại trước khi áp delta
                    var sach = await _context.SACH.AsNoTracking().FirstOrDefaultAsync(s => s.MaSach == maSach);
                    if (sach == null) throw new InvalidOperationException($"Sách {maSach} không tồn tại");
                    // Lưu ý: trước khi gọi service, stock đã được cập nhật; do đó tonDau = currentStock - delta
                    tonDau = sach.SoLuongTon - delta;
                }

                var phatSinh = delta;
                var tonCuoi = tonDau + phatSinh;

                var newReport = new BAO_CAO_TON
                {
                    MaBCT = $"BCT-{DateTime.Now:yyyyMMddHHmmss}-{Guid.NewGuid().ToString("N").Substring(0, 6)}",
                    MaSach = maSach,
                    Thang = thang,
                    Nam = nam,
                    
                    TonDau = tonDau,
                    PhatSinh = phatSinh,
                    TonCuoi = tonCuoi
                };

                _context.BAO_CAO_TON.Add(newReport);
                await _context.SaveChangesAsync();
            }
            else
            {
                report.PhatSinh += delta;
                report.TonCuoi = report.TonDau + report.PhatSinh;
                _context.BAO_CAO_TON.Update(report);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<StockReportDto>> GetStockReportAsync(int month, int year)
        {
            var list = await _context.BAO_CAO_TON
                .AsNoTracking()
                .Where(r => r.Thang == month && r.Nam == year)
                .Include(r => r.Sach)
                .Select(r => new StockReportDto
                {
                    MaBCT = r.MaBCT,
                    MaSach = r.MaSach,
                    TenSach = r.Sach != null ? r.Sach.TenSach : null,
                    TonDau = r.TonDau,
                    PhatSinh = r.PhatSinh,
                    DaBan = r.DaBan,
                    TonCuoi = r.TonCuoi
                })
                .ToListAsync();

            return list;
        }
    }
}
