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

            // ensure customer exists if SDT provided, otherwise create a guest customer
            string maKH = null;
            if (!string.IsNullOrWhiteSpace(dto.SDT)) // nếu có SDT thì tìm hoặc tạo khách hàng
            {
                var kh = await _context.KHACH_HANG.FirstOrDefaultAsync(k => k.SDT == dto.SDT); // tìm khách hàng theo SDT
                if (kh == null) // nếu không tìm thấy thì tạo khách vãng lai ,còn nếu tìm thấy thì không làm gì cả (khong tạo mới)
                {
                    // Generate MaKH using the same KH<number> rule as KhachHangService
                    var existingKeys = await _context.KHACH_HANG
                        .AsNoTracking()
                        .Where(k => k.MaKH.StartsWith("KH"))
                        .Select(k => k.MaKH)
                        .ToListAsync();

                    var numericKeys = existingKeys // lọc chỉ lấy phần số
                        .Where(k => System.Text.RegularExpressions.Regex.IsMatch(k, "^KH\\d+$")) // bắt đầu với KH theo sau là số
                        .ToList();

                    int max = 0;
                    foreach (var key in numericKeys)
                    {
                        var suffix = key.Substring(2);
                        if (int.TryParse(suffix, out var n))
                        {
                            if (n > max) max = n;
                        }
                    }

                    string newMa;
                    int attempt = max + 1;
                    do
                    {
                        newMa = "KH" + attempt;
                        var exists2 = await _context.KHACH_HANG.AnyAsync(x => x.MaKH == newMa);
                        if (!exists2) break;
                        attempt++;
                    } while (true);

                    kh = new KHACH_HANG
                    {
                        MaKH = newMa,
                        HoTen = "Khách vãng lai",
                        DiaChi = string.Empty,
                        SDT = dto.SDT,
                        Email = string.Empty,
                        CongNo = 0m
                    };
                    _context.KHACH_HANG.Add(kh);
                    await _context.SaveChangesAsync();
                }
                maKH = kh.MaKH;
            }


            string? maNVValue = null; // nếu MaNV không hợp lệ thì để null
            if (!string.IsNullOrWhiteSpace(dto.MaNV)) // kiểm tra MaNV có tồn tại không
            {
                var nv = await _context.NHAN_VIEN.FindAsync(dto.MaNV); // tìm nhân viên
                if (nv != null) maNVValue = dto.MaNV; // nếu tìm thấy thì gán
            }

            // tạo mã hóa đơn
            var maHoaDon = $"HD-{DateTime.Now:yyyyMMddHHmmss}-{Guid.NewGuid().ToString("N").Substring(0,6)}"; // định dạng HD-yyyymmddHHMMSS-xxxxxx

            var hoaDon = new HOA_DON
            { // tạo hóa đơn
                MaHoaDon = maHoaDon,
                MaNV = maNVValue,
                MaKH = maKH ?? string.Empty // nếu maKH null thì để chuỗi rỗng
            };
            _context.HOA_DON.Add(hoaDon); // thêm vào context

            decimal total = 0m; // tổng tiền của hóa đơn

            foreach (var item in dto.Items) // duyệt qua từng mục trong đơn hàng
            {
                var sach = await _context.SACH.FirstOrDefaultAsync(s => s.MaSach == item.MaSach); // tìm sách theo MaSach
                if (sach == null) throw new InvalidOperationException($"Sách {item.MaSach} không tồn tại"); // nếu không tìm thấy thì lỗi
                if (sach.SoLuongTon < item.SoLuong) throw new InvalidOperationException($"Tồn kho không đủ cho {item.MaSach}"); // nếu tồn kho không đủ thì lỗi

                sach.SoLuongTon -= item.SoLuong; // cập nhật tồn kho
                _context.SACH.Update(sach); // lưu thay đổi tồn kho, hàm Update đánh dấu entity là đã thay đổi 

                
                    var cthd = new CHI_TIET_HOA_DON // tạo chi tiết hóa đơn
                    {
                        MaHoaDon = maHoaDon,
                        MaSach = item.MaSach,
                        DonGiaBan = item.DonGia,
                        NgayLapHoaDon = dto.At ?? DateTime.Now,
                        SoLuong = item.SoLuong
                    };
                _context.CHI_TIET_HOA_DON.Add(cthd);

                total += item.DonGia * item.SoLuong;
            }

            await _context.SaveChangesAsync();

            return (maHoaDon, total);
        }

        public async Task<DoAnPhanMem.DTO.InvoiceDto?> GetInvoiceAsync(string maHoaDon)
        {
            var hd = await _context.HOA_DON.FindAsync(maHoaDon);
            if (hd == null) return null;

            var items = await _context.CHI_TIET_HOA_DON
                .Where(c => c.MaHoaDon == maHoaDon)
                .Join(_context.SACH, c => c.MaSach, s => s.MaSach, (c, s) => new { c, s })
                .Join(_context.THE_LOAI, cs => cs.s.MaTL, tl => tl.MaTL, (cs, tl) => new DoAnPhanMem.DTO.InvoiceItemDto {
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
