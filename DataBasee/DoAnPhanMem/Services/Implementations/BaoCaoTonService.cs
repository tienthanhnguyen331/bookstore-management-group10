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

        public async Task UpdateInventoryReportAsync(string maSach, int delta, DateTime? at = null) // Hàm cập nhật báo cáo tồn kho
        {
            var when = at ?? DateTime.Now; // sử dụng thời gian hiện tại nếu không có
            var thang = when.Month; // lấy tháng/năm từ ngày
            var nam = when.Year; // lấy tháng/năm từ ngày

            var report = await _context.BAO_CAO_TON 
                .FirstOrDefaultAsync(r => r.MaSach == maSach && r.Thang == thang && r.Nam == nam); // tìm báo cáo theo mã sách, tháng, năm

            if (report == null) // nếu chưa có báo cáo cho tháng/năm này --> Tạo 1 bao cáo mới(Mã báo cáo mới)
            {
                // lấy báo cáo trước đó để lấy TonDau 
                var prev = await _context.BAO_CAO_TON // tìm báo cáo tồn trước đó
                    .Where(r => r.MaSach == maSach && (r.Nam < nam || (r.Nam == nam && r.Thang < thang))) // lọc theo mã sách và thời gian trước đó
                    .OrderByDescending(r => r.Nam).ThenByDescending(r => r.Thang) // sắp xếp giảm dần theo năm, tháng
                    .FirstOrDefaultAsync(); // lấy báo cáo gần nhất

                int tonDau; // số tồn đầu kỳ
                if (prev != null) tonDau = prev.TonCuoi; // nếu có báo cáo trước, lấy TonCuoi của báo cáo đó làm TonDau
                
                
                else // nếu không có báo cáo trước (Sách này ch từng đc tạo báo cáo tồn), tính TonDau dựa trên tồn hiện tại trước khi áp delta 
                {
                    
                    var sach = await _context.SACH.AsNoTracking().FirstOrDefaultAsync(s => s.MaSach == maSach); // tìm sách theo mã
                    if (sach == null) throw new InvalidOperationException($"Sách {maSach} không tồn tại"); // ném lỗi nếu không tìm thấy sách
                    // Lưu ý: trước khi gọi service, stock đã được cập nhật; do đó tonDau = currentStock - delta
                    tonDau = sach.SoLuongTon - delta; // tính tồn đầu kỳ
                }
                // Ở API bán hàng, ta chỉ cập nhật `DaBan` (số lượng đã bán).
                // Không chạm `PhatSinh` ở đây; nhập kho (phát sinh) do API khác xử lý.
                var phatSinh = 0;
                var daBan = Math.Abs(delta);
                var tonCuoi = tonDau + phatSinh - daBan;
                //sau khi có đủ thông tin thì tạo báo cáo mới

                    var newReport = new BAO_CAO_TON // tạo báo cáo mới
                    {
                        MaBCT = $"BCT-{when:yyyyMMddHHmmss}-{Guid.NewGuid().ToString("N").Substring(0,6)}", // mã báo cáo theo định dạng BCT-yyyymmddHHMMSS-xxxxxx
                    MaSach = maSach,
                    Thang = thang, // tháng của báo cáo (hiện tại)
                    Nam = nam, // năm của báo cáo (hiện tại)
                    TonDau = tonDau, // tồn đầu kỳ
                    PhatSinh = phatSinh, // phát sinh (không cập nhật từ bán hàng)
                    DaBan = daBan,
                    TonCuoi = tonCuoi // tồn cuối kỳ
                };

                _context.BAO_CAO_TON.Add(newReport);
                await _context.SaveChangesAsync();
            }
            else // nếu đã có báo cáo cho tháng/năm này (k tạo báo cáo mới mà chỉ cập nhật)
            {
                // Bán hàng: cập nhật DaBan; nhập kho (PhatSinh) được xử lý bởi API nhập kho riêng
                report.DaBan += Math.Abs(delta);
                report.TonCuoi = report.TonDau + report.PhatSinh - report.DaBan; // cập nhật tồn cuối
                _context.BAO_CAO_TON.Update(report); // đánh dấu là đã thay đổi
                await _context.SaveChangesAsync(); // lưu thay đổi
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
                    TonCuoi = r.TonCuoi
                })
                .ToListAsync();

            return list;
        }
    }
}
