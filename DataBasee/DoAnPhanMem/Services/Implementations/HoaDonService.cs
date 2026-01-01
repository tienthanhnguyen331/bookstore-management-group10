using Microsoft.EntityFrameworkCore;
using DoAnPhanMem.Data;
using DoAnPhanMem.Models;
using DoAnPhanMem.DTO;
using DoAnPhanMem.Services.Interfaces;

namespace DoAnPhanMem.Services.Implementations
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

        public async Task<List<SachResponseDto>> GetDanhSachSachAsync()
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
                })
                .ToListAsync();
        }

        public async Task<KhachHangResponseDto> TraCuuKhachHangAsync(string? sdt)
        {
            decimal gioiHanNo = _ruleService.GetDecimalRule("QD2_NoToiDa");

            if (string.IsNullOrWhiteSpace(sdt))
            {
                return new KhachHangResponseDto
                {
                    MaKH = "",
                    HoTen = "Khach vang lai",
                    SDT = "",
                    CongNo = 0,
                    GioiHanNo = gioiHanNo,
                    IsKhachVangLai = true,
                    Message = null
                };
            }

            var khachHang = await _context.KHACH_HANG
                .FirstOrDefaultAsync(kh => kh.SDT == sdt);

            if (khachHang == null)
            {
                return new KhachHangResponseDto
                {
                    MaKH = "",
                    HoTen = "Khach vang lai",
                    SDT = sdt,
                    CongNo = 0,
                    GioiHanNo = gioiHanNo,
                    IsKhachVangLai = true,
                    Message = "Khong tim thay khach hang trong he thong"
                };
            }

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

        public async Task<HoaDonResponseDto> LapHoaDonAsync(LapHoaDonDto dto)
        {
            if (dto.DanhSachSanPham == null || dto.DanhSachSanPham.Count == 0)
                throw new Exception("Danh sach san pham khong duoc de trong");

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                KHACH_HANG? khachHang = null;
                bool isKhachVangLai = true;

                if (!string.IsNullOrWhiteSpace(dto.SDTKhachHang))
                {
                    khachHang = await _context.KHACH_HANG.FirstOrDefaultAsync(kh => kh.SDT == dto.SDTKhachHang);
                    if (khachHang != null) isKhachVangLai = false;
                }

                if (dto.IsDebt && isKhachVangLai)
                {
                    throw new Exception("Khach vang lai khong duoc phep ghi no!");
                }

                var ngayLap = dto.At ?? DateTime.UtcNow.AddHours(7);
                var maHoaDon = $"HD-{ngayLap:yyyyMMddHHmmss}-{Guid.NewGuid().ToString("N").Substring(0, 6)}";
                var nhanVien = await _context.NHAN_VIEN.FirstOrDefaultAsync();

                var hoaDon = new HOA_DON
                {
                    MaHoaDon = maHoaDon,
                    MaKH = isKhachVangLai ? "KH00" : khachHang!.MaKH,
                    MaNV = nhanVien?.MaNV
                };
                _context.HOA_DON.Add(hoaDon);
                await _context.SaveChangesAsync();

                decimal tongTien = 0;
                var chiTietResponses = new List<ChiTietHoaDonResponseDto>();
                int stt = 0;
                int thang = ngayLap.Month;
                int nam = ngayLap.Year;

                foreach (var item in dto.DanhSachSanPham)
                {
                    var sach = await _context.SACH.Include(s => s.TheLoai).FirstOrDefaultAsync(s => s.MaSach == item.MaSach);
                    if (sach == null) throw new Exception($"Khong tim thay sach: {item.MaSach}");

                    if (sach.SoLuongTon < item.SoLuong)
                        throw new Exception($"Sach '{sach.TenSach}' khong du ton kho (Con: {sach.SoLuongTon})");

                    int tonSauBan = sach.SoLuongTon - item.SoLuong;
                    try { _ruleService.CheckRule_BanSach(0, tonSauBan); }
                    catch (Exception ex) { throw new Exception($"Sach '{sach.TenSach}': {ex.Message}"); }

                    int tonDau = sach.SoLuongTon;
                    sach.SoLuongTon = tonSauBan;

                    var chiTiet = new CHI_TIET_HOA_DON
                    {
                        MaHoaDon = maHoaDon,
                        MaSach = item.MaSach,
                        SoLuong = item.SoLuong,
                        DonGiaBan = sach.DonGia,
                        NgayLapHoaDon = ngayLap
                    };
                    _context.CHI_TIET_HOA_DON.Add(chiTiet);

                    var baoCaoTon = await _context.BAO_CAO_TON
                        .FirstOrDefaultAsync(b => b.MaSach == sach.MaSach && b.Thang == thang && b.Nam == nam);

                    if (baoCaoTon == null)
                    {
                        baoCaoTon = new BAO_CAO_TON
                        {
                            MaBCT = $"BCT_{thang}_{nam}_{sach.MaSach}",
                            Thang = thang,
                            Nam = nam,
                            MaSach = sach.MaSach,
                            TonDau = tonDau,
                            PhatSinh = 0,
                            DaBan = item.SoLuong,
                            TonCuoi = tonSauBan
                        };
                        _context.BAO_CAO_TON.Add(baoCaoTon);
                    }
                    else
                    {
                        baoCaoTon.DaBan += item.SoLuong;
                        baoCaoTon.TonCuoi -= item.SoLuong;
                    }

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

                if (!isKhachVangLai && dto.IsDebt)
                {
                    decimal noDau = khachHang!.CongNo;
                    decimal noMoi = noDau + tongTien;

                    try { _ruleService.CheckRule_BanSach(noMoi, int.MaxValue); }
                    catch (Exception ex) { throw new Exception(ex.Message); }

                    khachHang.CongNo = noMoi;

                    var baoCaoNo = await _context.BAO_CAO_CONG_NO
                        .FirstOrDefaultAsync(b => b.MaKH == khachHang.MaKH && b.Thang == thang && b.Nam == nam);

                    if (baoCaoNo == null)
                    {
                        baoCaoNo = new BAO_CAO_CONG_NO
                        {
                            MaBCCN = $"BCCN_{thang}_{nam}_{khachHang.MaKH}",
                            Thang = thang,
                            Nam = nam,
                            MaKH = khachHang.MaKH,
                            NoDau = noDau,
                            NoPhatSinh = tongTien,
                            TraNo = 0,
                            NoCuoi = noMoi
                        };
                        _context.BAO_CAO_CONG_NO.Add(baoCaoNo);
                    }
                    else
                    {
                        baoCaoNo.NoPhatSinh += tongTien;
                        baoCaoNo.NoCuoi += tongTien;
                    }
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
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                var msg = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                throw new Exception(msg);
            }
        }

        public async Task<List<HOA_DON>> GetAllHoaDonAsync()
        {
            return await _context.HOA_DON
                .Include(hd => hd.KhachHang)
                .Include(hd => hd.ChiTietHoaDon)
                .ToListAsync();
        }

        public async Task<HoaDonResponseDto?> GetHoaDonByIdAsync(string maHoaDon)
        {
            var hoaDon = await _context.HOA_DON
                .Include(hd => hd.KhachHang)
                .Include(hd => hd.ChiTietHoaDon)
                    .ThenInclude(ct => ct.Sach)
                        .ThenInclude(s => s.TheLoai)
                .FirstOrDefaultAsync(hd => hd.MaHoaDon == maHoaDon);

            if (hoaDon == null)
            {
                return null;
            }

            var chiTietResponses = hoaDon.ChiTietHoaDon.Select((ct, index) => new ChiTietHoaDonResponseDto
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
                NgayLap = hoaDon.ChiTietHoaDon.FirstOrDefault()?.NgayLapHoaDon ?? DateTime.UtcNow,
                TenKhachHang = hoaDon.KhachHang?.HoTen ?? "Khach vang lai",
                SDTKhachHang = hoaDon.KhachHang?.SDT ?? "",
                IsKhachVangLai = hoaDon.KhachHang == null,
                DanhSachSanPham = chiTietResponses,
                TongTien = chiTietResponses.Sum(ct => ct.ThanhTien)
            };
        }

        public async Task<HoaDonResponseDto> UpdateHoaDonAsync(UpdateHoaDonDto dto)
        {
            if (dto.DanhSachSanPham == null || dto.DanhSachSanPham.Count == 0)
            {
                throw new Exception("Danh sach san pham khong duoc de trong");
            }

            var hoaDon = await _context.HOA_DON
                .Include(hd => hd.KhachHang)
                .Include(hd => hd.ChiTietHoaDon)
                    .ThenInclude(ct => ct.Sach)
                .FirstOrDefaultAsync(hd => hd.MaHoaDon == dto.MaHoaDon);

            if (hoaDon == null)
            {
                throw new Exception($"Khong tim thay hoa don co ma: {dto.MaHoaDon}");
            }

            decimal tongTienCu = hoaDon.ChiTietHoaDon.Sum(ct => ct.DonGiaBan * ct.SoLuong);

            foreach (var chiTietCu in hoaDon.ChiTietHoaDon)
            {
                if (chiTietCu.Sach != null)
                {
                    chiTietCu.Sach.SoLuongTon += chiTietCu.SoLuong;
                }
            }

            if (hoaDon.KhachHang != null)
            {
                hoaDon.KhachHang.CongNo -= tongTienCu;
            }

            _context.CHI_TIET_HOA_DON.RemoveRange(hoaDon.ChiTietHoaDon);

            KHACH_HANG? khachHangMoi = null;
            bool isKhachVangLai = true;

            if (!string.IsNullOrWhiteSpace(dto.SDTKhachHang))
            {
                khachHangMoi = await _context.KHACH_HANG
                    .FirstOrDefaultAsync(kh => kh.SDT == dto.SDTKhachHang);

                if (khachHangMoi != null)
                {
                    isKhachVangLai = false;
                    hoaDon.MaKH = khachHangMoi.MaKH;
                }
                else
                {
                    hoaDon.MaKH = null;
                }
            }
            else
            {
                hoaDon.MaKH = null;
            }

            var chiTietResponses = new List<ChiTietHoaDonResponseDto>();
            decimal tongTienMoi = 0;
            int stt = 0;
            var ngayLap = DateTime.UtcNow;

            foreach (var item in dto.DanhSachSanPham)
            {
                var sach = await _context.SACH
                    .Include(s => s.TheLoai)
                    .FirstOrDefaultAsync(s => s.MaSach == item.MaSach);

                if (sach == null)
                {
                    throw new Exception($"Khong tim thay sach co ma: {item.MaSach}");
                }

                int tonSauBan = sach.SoLuongTon - item.SoLuong;

                if (tonSauBan < 0)
                {
                    throw new Exception($"Sach '{sach.TenSach}' khong du so luong ton. Hien con: {sach.SoLuongTon}");
                }

                decimal donGiaBan = sach.DonGia;

                var chiTietMoi = new CHI_TIET_HOA_DON
                {
                    MaHoaDon = dto.MaHoaDon,
                    MaSach = item.MaSach,
                    SoLuong = item.SoLuong,
                    DonGiaBan = donGiaBan,
                    NgayLapHoaDon = ngayLap
                };

                _context.CHI_TIET_HOA_DON.Add(chiTietMoi);

                sach.SoLuongTon = tonSauBan;

                decimal thanhTien = donGiaBan * item.SoLuong;
                tongTienMoi += thanhTien;

                stt++;
                chiTietResponses.Add(new ChiTietHoaDonResponseDto
                {
                    STT = stt,
                    MaSach = sach.MaSach,
                    TenSach = sach.TenSach,
                    TheLoai = sach.TheLoai?.TenTL ?? "",
                    SoLuong = item.SoLuong,
                    DonGia = donGiaBan,
                    ThanhTien = thanhTien
                });
            }

            if (!isKhachVangLai && khachHangMoi != null)
            {
                khachHangMoi.CongNo += tongTienMoi;
            }

            await _context.SaveChangesAsync();

            return new HoaDonResponseDto
            {
                MaHoaDon = dto.MaHoaDon,
                NgayLap = ngayLap,
                TenKhachHang = isKhachVangLai ? "Khach vang lai" : khachHangMoi!.HoTen,
                SDTKhachHang = dto.SDTKhachHang ?? "",
                IsKhachVangLai = isKhachVangLai,
                DanhSachSanPham = chiTietResponses,
                TongTien = tongTienMoi
            };
        }
    }
}
