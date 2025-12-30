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

        /// <summary>
        /// Cập nhật báo cáo tồn
        /// </summary>
        /// <param name="maSach">Mã sách</param>
        /// <param name="amount">Số lượng thay đổi (Luôn là số dương)</param>
        /// <param name="isBanHang">True nếu là Bán hàng, False nếu là Nhập kho</param>
        /// <param name="at">Thời gian</param>
        public async Task UpdateInventoryReportAsync(string maSach, int amount, bool isBanHang, DateTime? at = null)
        {
            var when = at ?? DateTime.Now;
            var thang = when.Month;
            var nam = when.Year;

            // 1. Tìm báo cáo của tháng này
            var report = await _context.BAO_CAO_TON
                .FirstOrDefaultAsync(r => r.MaSach == maSach && r.Thang == thang && r.Nam == nam);

            if (report == null)
            {
                // --- TRƯỜNG HỢP CHƯA CÓ BÁO CÁO THÁNG NÀY (TẠO MỚI) ---

                // Tìm báo cáo gần nhất trước đó để lấy Tồn Cuối làm Tồn Đầu tháng này
                var prev = await _context.BAO_CAO_TON
                    .Where(r => r.MaSach == maSach && (r.Nam < nam || (r.Nam == nam && r.Thang < thang)))
                    .OrderByDescending(r => r.Nam).ThenByDescending(r => r.Thang)
                    .FirstOrDefaultAsync();

                int tonDau;
                if (prev != null)
                {
                    tonDau = prev.TonCuoi;
                }
                else
                {
                    // Nếu không có báo cáo cũ, tính Tồn Đầu dựa trên Tồn Kho Thực Tế hiện tại trong bảng SACH
                    var sach = await _context.SACH.AsNoTracking().FirstOrDefaultAsync(s => s.MaSach == maSach);
                    if (sach == null) throw new InvalidOperationException($"Sách {maSach} không tồn tại");

                    // Logic hồi quy: 
                    // Vì transaction nhập/bán đã chạy rồi (đã cộng/trừ vào kho tổng), nên muốn tìm Tồn Đầu ta phải làm ngược lại.
                    if (isBanHang)
                    {
                        // Nếu vừa Bán xong thì Tồn Đầu = Tồn Hiện Tại + Số Lượng Bán
                        tonDau = sach.SoLuongTon + amount;
                    }
                    else
                    {
                        // Nếu vừa Nhập xong thì Tồn Đầu = Tồn Hiện Tại - Số Lượng Nhập
                        tonDau = sach.SoLuongTon - amount;
                    }
                }

                // Khởi tạo các giá trị
                int phatSinh = isBanHang ? 0 : amount; // Nếu nhập thì cộng vào Phát Sinh
                int daBan = isBanHang ? amount : 0;    // Nếu bán thì cộng vào Đã Bán

                // Tính Tồn Cuối theo công thức chuẩn
                int tonCuoi = tonDau + phatSinh - daBan;

                // Tạo Entity mới
                var newReport = new BAO_CAO_TON
                {
                    // Logic sinh mã BCT (như bạn đã làm)
                    MaBCT = $"BCT_{thang}_{maSach}", // Hoặc dùng logic Guid cũ của bạn nếu muốn
                    MaSach = maSach,
                    Thang = thang,
                    Nam = nam,

                    TonDau = tonDau,
                    PhatSinh = phatSinh,
                    DaBan = daBan, // <--- Cột Mới
                    TonCuoi = tonCuoi
                };

                _context.BAO_CAO_TON.Add(newReport);
            }
            else
            {
                // --- TRƯỜNG HỢP ĐÃ CÓ BÁO CÁO (CẬP NHẬT) ---

                if (isBanHang)
                {
                    report.DaBan += amount; // Cộng dồn vào Đã Bán
                }
                else
                {
                    report.PhatSinh += amount; // Cộng dồn vào Phát Sinh
                }

                // Tính lại Tồn Cuối
                report.TonCuoi = report.TonDau + report.PhatSinh - report.DaBan;

                _context.BAO_CAO_TON.Update(report);
            }

            await _context.SaveChangesAsync();
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
                    DaBan = r.DaBan, // <--- Lấy thêm cột Đã Bán ra DTO
                    TonCuoi = r.TonCuoi
                })
                .ToListAsync();

            return list;
        }
    }
}