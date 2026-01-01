

using System;
using System.Linq;
using System.Threading.Tasks;
using DoAnPhanMem.Data;
using DoAnPhanMem.DTO;
using DoAnPhanMem.Services.Interfaces;
using DoAnPhanMem.Models;
using Microsoft.EntityFrameworkCore;

namespace DoAnPhanMem.Services.Implementations
{
    public class SaleService : ISaleService
    {
        private readonly DataContext _context;

        public SaleService(DataContext context)
        {
            _context = context;
        }

        public async Task<(string MaHoaDon, decimal Total)> CreateSaleAsync(CompleteSaleDto dto)
        {
            if (dto.Items == null || !dto.Items.Any()) throw new ArgumentException("Danh sách sản phẩm rỗng");

            // =================================================================================
            // 1. CHỐT NGÀY HẠCH TOÁN (ACCOUNTING DATE)
            // =================================================================================
            // Dùng ngày Client gửi lên hoặc mặc định hiện tại. 
            // Ngày này sẽ được dùng cho cả Hóa đơn và Chi tiết.
            DateTime ngayHachToan = dto.At ?? DateTime.Now;

            // =================================================================================
            // 2. XỬ LÝ KHÁCH HÀNG (Logic từ HEAD - Chặt chẽ hơn)
            // =================================================================================
            KHACH_HANG kh = null;
            string maKH = null;

            if (!string.IsNullOrWhiteSpace(dto.SDT))
            {
                kh = await _context.KHACH_HANG.FirstOrDefaultAsync(k => k.SDT == dto.SDT);

                // Nếu chưa có khách hàng -> Tạo mới (Khách vãng lai)
                if (kh == null)
                {
                    // Nếu khách mới mà đòi ghi nợ ngay -> Chặn (Logic nghiệp vụ an toàn)
                    if (dto.IsDebt) throw new InvalidOperationException("Khách vãng lai (mới) không được phép ghi nợ!");

                    // Logic tự sinh mã KH (KH001, KH002...)
                    var existingKeys = await _context.KHACH_HANG.AsNoTracking()
                        .Where(k => k.MaKH.StartsWith("KH"))
                        .Select(k => k.MaKH).ToListAsync();

                    var numericKeys = existingKeys
                        .Where(k => System.Text.RegularExpressions.Regex.IsMatch(k, "^KH\\d+$")).ToList();

                    int max = 0;
                    foreach (var key in numericKeys)
                    {
                        if (int.TryParse(key.Substring(2), out var n) && n > max) max = n;
                    }

                    string newMa;
                    int attempt = max + 1;
                    do
                    {
                        newMa = "KH" + attempt;
                        if (!await _context.KHACH_HANG.AnyAsync(x => x.MaKH == newMa)) break;
                        attempt++;
                    } while (true);

                    kh = new KHACH_HANG
                    {
                        MaKH = newMa,
                        HoTen = "Khách vãng lai",
                        SDT = dto.SDT,
                        CongNo = 0m,
                        DiaChi = "",
                        Email = ""
                    };
                    _context.KHACH_HANG.Add(kh);
                    await _context.SaveChangesAsync();
                }
                maKH = kh.MaKH;
            }
            else
            {
                // Nếu mua nợ mà không có thông tin khách -> Chặn
                if (dto.IsDebt) throw new InvalidOperationException("Cần thông tin khách hàng để ghi nợ!");
            }

            // =================================================================================
            // 3. TẠO HÓA ĐƠN (HEADER)
            // =================================================================================
            var maHoaDon = $"HD-{ngayHachToan:yyyyMMddHHmmss}-{Guid.NewGuid().ToString("N").Substring(0, 6)}";

            var hoaDon = new HOA_DON
            {
                MaHoaDon = maHoaDon,
                MaNV = dto.MaNV,
                MaKH = maKH ?? "" // Nếu khách lẻ không lưu tên
            };
            _context.HOA_DON.Add(hoaDon);

            decimal total = 0m;

            // =================================================================================
            // 4. DUYỆT SẢN PHẨM -> CẬP NHẬT KHO (SACH) & TẠO CHI TIẾT
            // =================================================================================
            // Lưu ý: Không cập nhật Báo Cáo Tồn ở đây vì Controller đã gọi Service riêng rồi.

            foreach (var item in dto.Items)
            {
                var sach = await _context.SACH.FirstOrDefaultAsync(s => s.MaSach == item.MaSach);
                if (sach == null) throw new InvalidOperationException($"Sách {item.MaSach} không tồn tại");
                if (sach.SoLuongTon < item.SoLuong) throw new InvalidOperationException($"Tồn kho không đủ cho {item.MaSach}");

                // Trừ kho thực tế
                sach.SoLuongTon -= item.SoLuong;
                _context.SACH.Update(sach);

                var cthd = new CHI_TIET_HOA_DON
                {
                    MaHoaDon = maHoaDon,
                    MaSach = item.MaSach,
                    DonGiaBan = item.DonGia,
                    SoLuong = item.SoLuong,
                    // Lưu đúng ngày hạch toán
                    NgayLapHoaDon = ngayHachToan
                };
                _context.CHI_TIET_HOA_DON.Add(cthd);

                total += item.DonGia * item.SoLuong;
            }

            // Lưu thay đổi vào DB (Bao gồm Khách mới, Hóa đơn, Chi tiết, Cập nhật kho Sách)
            await _context.SaveChangesAsync();

            // Trả về kết quả để Controller tiếp tục xử lý Báo cáo & Công nợ
            return (maHoaDon, total);
        }

        public async Task<DoAnPhanMem.DTO.InvoiceDto?> GetInvoiceAsync(string maHoaDon)
        {
            var hd = await _context.HOA_DON.FindAsync(maHoaDon);
            if (hd == null) return null;

            var items = await _context.CHI_TIET_HOA_DON
                .Where(c => c.MaHoaDon == maHoaDon)
                .Join(_context.SACH, c => c.MaSach, s => s.MaSach, (c, s) => new { c, s })
                .Join(_context.THE_LOAI, cs => cs.s.MaTL, tl => tl.MaTL, (cs, tl) => new DoAnPhanMem.DTO.InvoiceItemDto
                {
                    MaSach = cs.s.MaSach,
                    TenSach = cs.s.TenSach,
                    TenTL = tl.TenTL,
                    SoLuong = cs.c.SoLuong,
                    DonGia = cs.c.DonGiaBan
                })
                .ToListAsync();

            var total = items.Sum(i => i.DonGia * i.SoLuong);

            var ngayLap = await _context.CHI_TIET_HOA_DON
                .Where(c => c.MaHoaDon == maHoaDon)
                .Select(c => c.NgayLapHoaDon)
                .FirstOrDefaultAsync();

            var dto = new DoAnPhanMem.DTO.InvoiceDto
            {
                MaHoaDon = maHoaDon,
                NgayLap = ngayLap == default ? System.DateTime.Now : ngayLap,
                Items = items,
                Total = total
            };

            return dto;
        }
    }

}