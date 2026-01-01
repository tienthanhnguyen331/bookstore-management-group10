using System;
using System.Linq;
using System.Threading.Tasks;
using DoAnPhanMem.Data;
using DoAnPhanMem.DTO;
using DoAnPhanMem.Services.Interfaces;
using DoAnPhanMem.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using DoAnPhanMem.DTO;

namespace DoAnPhanMem.Services.Implementations
{
    public class BaoCaoCongNoService : IBaoCaoCongNoService
    {
        private readonly DataContext _context;

        public BaoCaoCongNoService(DataContext context)
        {
            _context = context;
        }

        public async Task<BAO_CAO_CONG_NO> RecordDebtAsync(CreateDebtDto dto)
        {
            var when = dto.At ?? DateTime.Now; // sử dụng thời gian hiện tại nếu không có
            var thang = when.Month; // lấy tháng/năm từ ngày
            var nam = when.Year;// lấy tháng/năm từ ngày

            //tim khách hàng theo sdt
            var kh = await _context.KHACH_HANG.FirstOrDefaultAsync(k => k.SDT == dto.SDT);
            if (kh == null) // không tìm thấy khách hàng
            {
                throw new InvalidOperationException("Khách hàng không tồn tại"); // ném lỗi
            }

            var maKH = kh.MaKH;// lấy mã khách hàng

            // tìm báo cáo cho cùng tháng/năm
            var report = await _context.BAO_CAO_CONG_NO // báo cáo công nợ
                .FirstOrDefaultAsync(r => r.MaKH == maKH && r.Thang == thang && r.Nam == nam); // tìm báo cáo theo mã khách hàng, tháng, năm

            if (report == null) // nếu chưa có báo cáo cho tháng/năm này
            {
                // tìm báo cáo trước đó để lấy số dư đầu kỳ
                var prev = await _context.BAO_CAO_CONG_NO
                    .Where(r => r.MaKH == maKH && (r.Nam < nam || (r.Nam == nam && r.Thang < thang)))
                    .OrderByDescending(r => r.Nam).ThenByDescending(r => r.Thang)
                    .FirstOrDefaultAsync();

                var noDau = prev?.NoCuoi ?? 0m; // số dư đầu kỳ (nếu không có báo cáo trước thì là 0)
                var noPhatSinh = dto.Amount; // số phát sinh trong kỳ
                var noCuoi = noDau + noPhatSinh; // số dư cuối kỳ

                // Tạo mã báo cáo công nợ theo dạng tuần tự: BCCN{n}
                // Lấy tất cả mã hiện có bắt đầu bằng "BCCN" và tìm số lớn nhất, sau đó +1
                var existingCodes = await _context.BAO_CAO_CONG_NO
                    .Where(r => r.MaBCCN.StartsWith("BCCN"))
                    .Select(r => r.MaBCCN)
                    .ToListAsync();

                int maxSeq = 0;
                var regex = new System.Text.RegularExpressions.Regex("^BCCN(\\d+)$");
                foreach (var code in existingCodes)
                {
                    var m = regex.Match(code);
                    if (m.Success && int.TryParse(m.Groups[1].Value, out var v))
                    {
                        if (v > maxSeq) maxSeq = v;
                    }
                }

                int nextSeq = maxSeq + 1;
                string candidate = $"BCCN{nextSeq}";
                // đảm bảo không trùng (trong trường hợp race) — tăng dần nếu cần
                while (await _context.BAO_CAO_CONG_NO.AnyAsync(r => r.MaBCCN == candidate))
                {
                    nextSeq++;
                    candidate = $"BCCN{nextSeq}";
                }

                var newReport = new BAO_CAO_CONG_NO // tạo báo cáo mới
                {
                    MaBCCN = candidate,
                    MaKH = maKH,
                    Thang = thang,
                    Nam = nam,
                    NoDau = noDau,
                    NoPhatSinh = noPhatSinh,
                    TraNo = 0,
                    NoCuoi = noCuoi
                };

                _context.BAO_CAO_CONG_NO.Add(newReport); // thêm vào context
                await _context.SaveChangesAsync(); // lưu thay đổi vào database
                return newReport;
            }
            else
            {
                report.NoPhatSinh += dto.Amount; // cập nhật số phát sinh
                report.NoCuoi = report.NoDau + report.NoPhatSinh - report.TraNo; // cập nhật số dư cuối kỳ
                _context.BAO_CAO_CONG_NO.Update(report); // cập nhật báo cáo
                await _context.SaveChangesAsync();// lưu thay đổi vào database
                return report;//  trả về báo cáo đã cập nhật
            }
        }

        public async Task<List<DebtReportDto>> GetDebtReportAsync(int month, int year)
        {
            var list = await _context.BAO_CAO_CONG_NO
                .AsNoTracking()
                .Where(r => r.Thang == month && r.Nam == year)
                .Include(r => r.KhachHang)
                .Select(r => new DebtReportDto
                {
                    MaBCCN = r.MaBCCN,
                    MaKH = r.MaKH,
                    HoTen = r.KhachHang != null ? r.KhachHang.HoTen : null,
                    SDT = r.KhachHang != null ? r.KhachHang.SDT : null,
                    NoDau = r.NoDau,
                    NoPhatSinh = r.NoPhatSinh,
                    TraNo = r.TraNo,
                    NoCuoi = r.NoCuoi
                })
                .ToListAsync();

            return list;
        }
    }
}
