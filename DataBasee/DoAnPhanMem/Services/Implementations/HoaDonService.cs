using Microsoft.EntityFrameworkCore;
using DoAnPhanMem.Data;
using DoAnPhanMem.Models;
using DoAnPhanMem.DTO;
using DoAnPhanMem.Services.Interfaces;

namespace DoAnPhanMem.Services
{
    public class HoaDonService : IHoaDonService
    {
        private readonly DataContext _context;
        private readonly IRuleService _ruleService;

        public HoaDonService(DataContext context, IRuleService ruleService)
        {
            _context = context;
            _ruleService = ruleService;
        }

        public async Task<List<SachResponseDto>> GetDanhSachSachBanAsync()
        {
            return await _context.SACH
                .Include(s => s.TheLoai)
                .Where(s => s.SoLuongTon > 0)
                .Select(s => new SachResponseDto
                {
                    MaSach = s.MaSach,
                    TenSach = s.TenSach,
                    TenTheLoai = s.TheLoai != null ? s.TheLoai.TenTL : "",
                    DonGia = s.DonGia,
                    SoLuongTon = s.SoLuongTon
                }).ToListAsync();
        }

        public async Task<KhachHangResponseDto> TraCuuKhachHangAsync(string sdt)
        {
            decimal gioiHanNo = _ruleService.GetDecimalRule("QD2_NoToiDa");
            var defaultResponse = new KhachHangResponseDto
            {
                MaKH = "",
                HoTen = "Khach vang lai",
                SDT = sdt ?? "",
                CongNo = 0,
                GioiHanNo = gioiHanNo,
                IsKhachVangLai = true,
                Message = "Khong tim thay khach hang"
            };

            if (string.IsNullOrWhiteSpace(sdt)) return defaultResponse;

            var khachHang = await _context.KHACH_HANG.FirstOrDefaultAsync(kh => kh.SDT == sdt);
            if (khachHang == null) return defaultResponse;

            return new KhachHangResponseDto
            {
                MaKH = khachHang.MaKH,
                HoTen = khachHang.HoTen,
                SDT = khachHang.SDT,
                CongNo = khachHang.CongNo,
                GioiHanNo = gioiHanNo,
                IsKhachVangLai = false,
                Message = null
            };
        }

        // --- LOGIC LẬP HÓA ĐƠN ---
        public async Task<HoaDonResponseDto> LapHoaDonAsync(LapHoaDonDto dto)
        {
            if (dto.DanhSachSanPham == null || dto.DanhSachSanPham.Count == 0)
                throw new ArgumentException("Danh sach san pham khong duoc de trong");

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // 1. Xử lý khách hàng
                KHACH_HANG? khachHang = null;
                bool isKhachVangLai = true;

                if (!string.IsNullOrWhiteSpace(dto.SDTKhachHang))
                {
                    khachHang = await _context.KHACH_HANG.FirstOrDefaultAsync(kh => kh.SDT == dto.SDTKhachHang);
                    if (khachHang != null) isKhachVangLai = false;
                }

                if (dto.IsDebt && isKhachVangLai)
                    throw new InvalidOperationException("Khach vang lai khong duoc phep ghi no!");

                // 2. Tạo hóa đơn Header
                var maHoaDon = "HD" + DateTime.UtcNow.AddHours(7).ToString("yyyyMMddHHmmss");
                var ngayLap = DateTime.UtcNow.AddHours(7);
                var nhanVien = await _context.NHAN_VIEN.FirstOrDefaultAsync(); // Demo lấy NV đầu tiên

                var hoaDon = new HOA_DON
                {
                    MaHoaDon = maHoaDon,
                    MaKH = isKhachVangLai ? "KH00" : khachHang!.MaKH,
                    MaNV = nhanVien?.MaNV
                };
                _context.HOA_DON.Add(hoaDon);
                await _context.SaveChangesAsync();

                // 3. Xử lý chi tiết & Kho & Báo cáo Tồn
                decimal tongTien = 0;
                var chiTietResponses = new List<ChiTietHoaDonResponseDto>();
                int stt = 0;

                foreach (var item in dto.DanhSachSanPham)
                {
                    var sach = await _context.SACH.Include(s => s.TheLoai).FirstOrDefaultAsync(s => s.MaSach == item.MaSach);
                    if (sach == null) throw new KeyNotFoundException($"Khong tim thay sach: {item.MaSach}");

                    // Check Tồn kho
                    if (sach.SoLuongTon < item.SoLuong)
                        throw new InvalidOperationException($"Sach '{sach.TenSach}' khong du ton kho (Con: {sach.SoLuongTon})");

                    // Check Rule Tồn tối thiểu sau bán
                    int tonSauBan = sach.SoLuongTon - item.SoLuong;
                    _ruleService.CheckRule_BanSach(0, tonSauBan);

                    // Trừ kho
                    int tonDau = sach.SoLuongTon;
                    sach.SoLuongTon = tonSauBan;

                    // Tạo chi tiết
                    var chiTiet = new CHI_TIET_HOA_DON
                    {
                        MaHoaDon = maHoaDon,
                        MaSach = item.MaSach,
                        SoLuong = item.SoLuong,
                        DonGiaBan = sach.DonGia,
                        NgayLapHoaDon = ngayLap
                    };
                    _context.CHI_TIET_HOA_DON.Add(chiTiet);

                    // Cập nhật Báo Cáo Tồn
                    await UpdateBaoCaoTon(sach.MaSach, ngayLap, tonDau, item.SoLuong, tonSauBan);

                    // Tính tiền
                    decimal thanhTien = sach.DonGia * item.SoLuong;
                    tongTien += thanhTien;

                    stt++;
                    chiTietResponses.Add(new ChiTietHoaDonResponseDto
                    {
                        STT = stt,
                        MaSach = sach.MaSach,
                        TenSach = sach.TenSach,
                        TheLoai = sach.TheLoai?.TenTL ?? "",
                        SoLuong = item.SoLuong,
                        DonGia = sach.DonGia,
                        ThanhTien = thanhTien
                    });
                }

                // 4. Xử lý Công nợ & Báo Cáo Công Nợ
                if (!isKhachVangLai && dto.IsDebt)
                {
                    decimal noDau = khachHang!.CongNo;
                    decimal noMoi = noDau + tongTien;

                    // Check Rule Nợ tối đa
                    _ruleService.CheckRule_BanSach(noMoi, int.MaxValue);

                    khachHang.CongNo = noMoi;

                    // Cập nhật Báo Cáo Công Nợ
                    await UpdateBaoCaoCongNo(khachHang.MaKH, ngayLap, noDau, tongTien, noMoi);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return new HoaDonResponseDto
                {
                    MaHoaDon = maHoaDon,
                    NgayLap = ngayLap,
                    TenKhachHang = isKhachVangLai ? "Khach vang lai" : khachHang!.HoTen,
                    SDTKhachHang = dto.SDTKhachHang ?? "",
                    IsKhachVangLai = isKhachVangLai,
                    DanhSachSanPham = chiTietResponses,
                    TongTien = tongTien
                };
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        // --- LOGIC CẬP NHẬT HÓA ĐƠN ---
        public async Task<HoaDonResponseDto> UpdateHoaDonAsync(UpdateHoaDonDto dto)
        {
            if (dto.DanhSachSanPham == null || dto.DanhSachSanPham.Count == 0)
                throw new ArgumentException("Danh sach san pham rong");

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var hoaDon = await _context.HOA_DON
                    .Include(hd => hd.KhachHang)
                    .Include(hd => hd.ChiTietHoaDon).ThenInclude(ct => ct.Sach)
                    .FirstOrDefaultAsync(hd => hd.MaHoaDon == dto.MaHoaDon);

                if (hoaDon == null) throw new KeyNotFoundException("Khong tim thay hoa don");

                // A. HOÀN TÁC DỮ LIỆU CŨ
                // 1. Hoàn kho & Báo cáo tồn
                foreach (var ctCu in hoaDon.ChiTietHoaDon)
                {
                    if (ctCu.Sach != null)
                    {
                        int tonDauRevert = ctCu.Sach.SoLuongTon;
                        ctCu.Sach.SoLuongTon += ctCu.SoLuong; // Cộng lại kho
                        int tonCuoiRevert = ctCu.Sach.SoLuongTon;

                        // Update đã bán trong báo cáo tồn (bằng cách cộng số âm hoặc trừ đi)
                        // Ở đây ta gọi hàm update với DaBan = -SoLuong (nghĩa là hủy bán)
                        await UpdateBaoCaoTon(ctCu.MaSach, hoaDon.ChiTietHoaDon.First().NgayLapHoaDon, tonDauRevert, -ctCu.SoLuong, tonCuoiRevert);
                    }
                }

                // 2. Hoàn công nợ (Nếu hóa đơn cũ có ghi nợ - Logic này cần check kỹ cờ IsDebt cũ, ở đây giả định luôn hoàn nợ nếu có KH)
                if (hoaDon.KhachHang != null)
                {
                    decimal tongTienCu = hoaDon.ChiTietHoaDon.Sum(ct => ct.DonGiaBan * ct.SoLuong);
                    decimal noDauRevert = hoaDon.KhachHang.CongNo;
                    hoaDon.KhachHang.CongNo -= tongTienCu;
                    decimal noCuoiRevert = hoaDon.KhachHang.CongNo;

                    await UpdateBaoCaoCongNo(hoaDon.MaKH, DateTime.UtcNow, noDauRevert, -tongTienCu, noCuoiRevert);
                }

                // 3. Xóa chi tiết cũ
                _context.CHI_TIET_HOA_DON.RemoveRange(hoaDon.ChiTietHoaDon);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return new HoaDonResponseDto { MaHoaDon = dto.MaHoaDon };
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        // --- CÁC HÀM GET DỮ LIỆU ---
        public async Task<List<HoaDonResponseDto>> GetAllHoaDonAsync()
        {
            var hoaDons = await _context.HOA_DON
                .Include(hd => hd.KhachHang)
                .Include(hd => hd.ChiTietHoaDon)
                .ToListAsync();

            return hoaDons.Select(hd => new HoaDonResponseDto
            {
                MaHoaDon = hd.MaHoaDon,
                NgayLap = hd.ChiTietHoaDon.FirstOrDefault()?.NgayLapHoaDon ?? DateTime.MinValue,
                TenKhachHang = hd.KhachHang?.HoTen ?? "Khach vang lai",
                TongTien = hd.ChiTietHoaDon.Sum(ct => ct.DonGiaBan * ct.SoLuong)
            }).ToList();
        }

        public async Task<HoaDonResponseDto?> GetHoaDonByIdAsync(string maHoaDon)
        {
            var hoaDon = await _context.HOA_DON
                .Include(hd => hd.KhachHang)
                .Include(hd => hd.ChiTietHoaDon).ThenInclude(ct => ct.Sach).ThenInclude(s => s.TheLoai)
                .FirstOrDefaultAsync(hd => hd.MaHoaDon == maHoaDon);

            if (hoaDon == null) return null;

            var details = hoaDon.ChiTietHoaDon.Select((ct, index) => new ChiTietHoaDonResponseDto
            {
                STT = index + 1,
                MaSach = ct.MaSach,
                TenSach = ct.Sach?.TenSach ?? "",
                TheLoai = ct.Sach?.TheLoai?.TenTL ?? "",
                SoLuong = ct.SoLuong,
                DonGia = ct.DonGiaBan,
                ThanhTien = ct.DonGiaBan * ct.SoLuong
            }).ToList();

            return new HoaDonResponseDto
            {
                MaHoaDon = hoaDon.MaHoaDon,
                NgayLap = hoaDon.ChiTietHoaDon.FirstOrDefault()?.NgayLapHoaDon ?? DateTime.MinValue,
                TenKhachHang = hoaDon.KhachHang?.HoTen ?? "Khach vang lai",
                SDTKhachHang = hoaDon.KhachHang?.SDT ?? "",
                IsKhachVangLai = hoaDon.KhachHang == null,
                DanhSachSanPham = details,
                TongTien = details.Sum(d => d.ThanhTien)
            };
        }

        // --- PRIVATE HELPER (QUAN TRỌNG: Tái sử dụng logic báo cáo) ---
        private async Task UpdateBaoCaoTon(string maSach, DateTime ngay, int tonDau, int soLuongBan, int tonCuoi)
        {
            var thang = ngay.Month; var nam = ngay.Year;
            var bct = await _context.BAO_CAO_TON.FirstOrDefaultAsync(b => b.MaSach == maSach && b.Thang == thang && b.Nam == nam);
            if (bct == null)
            {
                _context.BAO_CAO_TON.Add(new BAO_CAO_TON
                {
                    MaBCT = $"BCT_{thang}_{nam}_{maSach}_{Guid.NewGuid()}",
                    Thang = thang,
                    Nam = nam,
                    MaSach = maSach,
                    TonDau = tonDau,
                    PhatSinh = 0,
                    DaBan = soLuongBan,
                    TonCuoi = tonCuoi
                });
            }
            else
            {
                bct.DaBan += soLuongBan;
                bct.TonCuoi = tonCuoi;
            }
        }

        private async Task UpdateBaoCaoCongNo(string maKH, DateTime ngay, decimal noDau, decimal phatSinhNo, decimal noCuoi)
        {
            var thang = ngay.Month; var nam = ngay.Year;
            var bcn = await _context.BAO_CAO_CONG_NO.FirstOrDefaultAsync(b => b.MaKH == maKH && b.Thang == thang && b.Nam == nam);
            if (bcn == null)
            {
                _context.BAO_CAO_CONG_NO.Add(new BAO_CAO_CONG_NO
                {
                    MaBCCN = $"BCCN_{thang}_{nam}_{maKH}_{Guid.NewGuid()}",
                    Thang = thang,
                    Nam = nam,
                    MaKH = maKH,
                    NoDau = noDau,
                    NoPhatSinh = phatSinhNo,
                    NoCuoi = noCuoi
                });
            }
            else
            {
                bcn.NoPhatSinh += phatSinhNo;
                bcn.NoCuoi = noCuoi;
            }
        }
    }
}