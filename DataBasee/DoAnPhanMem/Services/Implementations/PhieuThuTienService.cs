using Microsoft.EntityFrameworkCore;
using DoAnPhanMem.Data;
using DoAnPhanMem.Models;
using DoAnPhanMem.DTO;
using DoAnPhanMem.Services.Interfaces;

namespace DoAnPhanMem.Services.Implementations
{
    public class PhieuThuTienService : IPhieuThuTienService
    {
        private readonly DataContext _context;
        private readonly IRuleService _ruleService;

        public PhieuThuTienService(DataContext context, IRuleService ruleService)
        {
            _context = context;
            _ruleService = ruleService;
        }

        public async Task<KhachHangThuTienResponseDto> TraCuuKhachHangAsync(string? sdt)
        {
            if (string.IsNullOrWhiteSpace(sdt))
            {
                return new KhachHangThuTienResponseDto
                {
                    MaKH = "",
                    HoTen = "",
                    SDT = "",
                    CongNo = 0,
                    IsFound = false,
                    Message = "Vui long nhap so dien thoai khach hang"
                };
            }

            var khachHang = await _context.KHACH_HANG
                .FirstOrDefaultAsync(kh => kh.SDT == sdt);

            if (khachHang == null)
            {
                return new KhachHangThuTienResponseDto
                {
                    MaKH = "",
                    HoTen = "",
                    SDT = sdt,
                    CongNo = 0,
                    IsFound = false,
                    Message = "Khong tim thay khach hang trong he thong"
                };
            }

            return new KhachHangThuTienResponseDto
            {
                MaKH = khachHang.MaKH,
                HoTen = khachHang.HoTen,
                SDT = khachHang.SDT,
                CongNo = khachHang.CongNo,
                IsFound = true,
                Message = khachHang.CongNo > 0 ? null : "Khach hang khong co cong no"
            };
        }

        public async Task<PhieuThuTienResponseDto> LapPhieuThuTienAsync(LapPhieuThuTienDto dto)
        {
            var khachHang = await _context.KHACH_HANG
                .FirstOrDefaultAsync(kh => kh.SDT == dto.SDTKhachHang);

            var rule = await _context.QUY_DINH.FirstOrDefaultAsync(r => r.TenQuyDinh == "QD4_KiemTraTienThu");
            bool isCheckDebtRuleEnabled = (rule != null && rule.GiaTri == "1");

            if (khachHang == null)
            {
                throw new Exception("Khong tim thay khach hang voi so dien thoai nay");
            }

            if (khachHang.CongNo <= 0)
            {
                throw new Exception("Khach hang khong co cong no de thu");
            }

            if (isCheckDebtRuleEnabled)
            {
                _ruleService.CheckRule_ThuTien(dto.SoTienThu, khachHang.CongNo);
            }

            decimal congNoTruoc = khachHang.CongNo;

            var maPhieu = "PTT" + DateTime.UtcNow.ToString("yyyyMMddHHmmss");
            var ngayThuTien = DateTime.UtcNow;

            var nhanVien = await _context.NHAN_VIEN.FirstOrDefaultAsync();

            var phieuThuTien = new PHIEU_THU_TIEN
            {
                MaPhieu = maPhieu,
                NgayThuTien = ngayThuTien,
                SoTienThu = dto.SoTienThu,
                MaKH = khachHang.MaKH,
                MaNV = nhanVien?.MaNV
            };

            _context.PHIEU_THU_TIEN.Add(phieuThuTien);

            khachHang.CongNo -= dto.SoTienThu;

            var thang = ngayThuTien.Month;
            var nam = ngayThuTien.Year;

            var baoCaoCongNo = await _context.BAO_CAO_CONG_NO
                .FirstOrDefaultAsync(bc => bc.MaKH == khachHang.MaKH && bc.Thang == thang && bc.Nam == nam);

            if (baoCaoCongNo != null)
            {
                baoCaoCongNo.TraNo += dto.SoTienThu;
                baoCaoCongNo.NoCuoi -= dto.SoTienThu;
            }
            else
            {
                var baoCaoCu = await _context.BAO_CAO_CONG_NO
                    .Where(b => b.MaKH == khachHang.MaKH && (b.Nam < nam || (b.Nam == nam && b.Thang < thang)))
                    .OrderByDescending(b => b.Nam)
                    .ThenByDescending(b => b.Thang)
                    .FirstOrDefaultAsync();

                decimal noDauChuan = baoCaoCu != null ? baoCaoCu.NoCuoi : congNoTruoc;

                var baoCaoMoi = new BAO_CAO_CONG_NO
                {
                    MaBCCN = "BCCN" + maPhieu,
                    Thang = thang,
                    Nam = nam,
                    MaKH = khachHang.MaKH,
                    NoDau = noDauChuan,
                    NoPhatSinh = 0,
                    TraNo = dto.SoTienThu,
                    NoCuoi = noDauChuan - dto.SoTienThu
                };
                _context.BAO_CAO_CONG_NO.Add(baoCaoMoi);
            }

            await _context.SaveChangesAsync();

            return new PhieuThuTienResponseDto
            {
                MaPhieu = maPhieu,
                NgayThuTien = ngayThuTien,
                MaKH = khachHang.MaKH,
                TenKhachHang = khachHang.HoTen,
                SDT = khachHang.SDT,
                SoTienThu = dto.SoTienThu,
                CongNoTruoc = congNoTruoc,
                CongNoSau = khachHang.CongNo
            };
        }

        public async Task<List<DanhSachPhieuThuResponseDto>> GetAllPhieuThuTienAsync()
        {
            return await _context.PHIEU_THU_TIEN
                .Include(p => p.KhachHang)
                .OrderByDescending(p => p.NgayThuTien)
                .Select(p => new DanhSachPhieuThuResponseDto
                {
                    MaPhieu = p.MaPhieu,
                    NgayThuTien = p.NgayThuTien,
                    TenKhachHang = p.KhachHang != null ? p.KhachHang.HoTen : "",
                    SDT = p.KhachHang != null ? p.KhachHang.SDT : "",
                    SoTienThu = p.SoTienThu
                })
                .ToListAsync();
        }

        public async Task<PhieuThuTienResponseDto?> GetPhieuThuTienByIdAsync(string maPhieu)
        {
            var phieu = await _context.PHIEU_THU_TIEN
                .Include(p => p.KhachHang)
                .FirstOrDefaultAsync(p => p.MaPhieu == maPhieu);

            if (phieu == null)
            {
                return null;
            }

            return new PhieuThuTienResponseDto
            {
                MaPhieu = phieu.MaPhieu,
                NgayThuTien = phieu.NgayThuTien,
                MaKH = phieu.MaKH,
                TenKhachHang = phieu.KhachHang?.HoTen ?? "",
                SDT = phieu.KhachHang?.SDT ?? "",
                SoTienThu = phieu.SoTienThu,
                CongNoTruoc = 0,
                CongNoSau = phieu.KhachHang?.CongNo ?? 0
            };
        }

        public async Task<List<DanhSachPhieuThuResponseDto>> GetPhieuThuTienTheoThangAsync(int thang, int nam)
        {
            return await _context.PHIEU_THU_TIEN
                .Include(p => p.KhachHang)
                .Where(p => p.NgayThuTien.Month == thang && p.NgayThuTien.Year == nam)
                .OrderByDescending(p => p.NgayThuTien)
                .Select(p => new DanhSachPhieuThuResponseDto
                {
                    MaPhieu = p.MaPhieu,
                    NgayThuTien = p.NgayThuTien,
                    TenKhachHang = p.KhachHang != null ? p.KhachHang.HoTen : "",
                    SDT = p.KhachHang != null ? p.KhachHang.SDT : "",
                    SoTienThu = p.SoTienThu
                })
                .ToListAsync();
        }

        public async Task<List<KhachHangThuTienResponseDto>> GetKhachHangDangNoAsync()
        {
            return await _context.KHACH_HANG
                .Where(kh => kh.CongNo > 0)
                .OrderByDescending(kh => kh.CongNo)
                .Select(kh => new KhachHangThuTienResponseDto
                {
                    MaKH = kh.MaKH,
                    HoTen = kh.HoTen,
                    SDT = kh.SDT,
                    CongNo = kh.CongNo,
                    IsFound = true,
                    Message = null
                })
                .ToListAsync();
        }

        public async Task<PhieuThuTienResponseDto> UpdatePhieuThuTienAsync(UpdatePhieuThuTienDto dto)
        {
            var phieu = await _context.PHIEU_THU_TIEN
                .Include(p => p.KhachHang)
                .FirstOrDefaultAsync(p => p.MaPhieu == dto.MaPhieu);

            if (phieu == null)
            {
                throw new Exception($"Khong tim thay phieu thu tien co ma: {dto.MaPhieu}");
            }

            if (phieu.KhachHang == null)
            {
                throw new Exception("Khong tim thay thong tin khach hang cua phieu thu");
            }

            decimal soTienCu = phieu.SoTienThu;
            decimal soTienMoi = dto.SoTienThu;

            decimal chenhLechNo = soTienCu - soTienMoi;

            decimal congNoMoi = phieu.KhachHang.CongNo + chenhLechNo;

            if (congNoMoi < 0)
            {
                throw new Exception($"So tien thu vuot qua cong no. Cong no hien tai sau khi hoan: {phieu.KhachHang.CongNo + soTienCu}");
            }

            decimal congNoTruoc = phieu.KhachHang.CongNo;
            phieu.KhachHang.CongNo = congNoMoi;

            DateTime ngayHieuLuc = phieu.NgayThuTien;

            phieu.SoTienThu = soTienMoi;
            if (dto.NgayThuTien.HasValue)
            {
                phieu.NgayThuTien = dto.NgayThuTien.Value;
                ngayHieuLuc = dto.NgayThuTien.Value;
            }

            var baoCao = await _context.BAO_CAO_CONG_NO
                .FirstOrDefaultAsync(bc => bc.MaKH == phieu.MaKH && bc.Thang == ngayHieuLuc.Month && bc.Nam == ngayHieuLuc.Year);

            if (baoCao != null)
            {
                baoCao.NoPhatSinh += chenhLechNo;
                baoCao.NoCuoi += chenhLechNo;
            }

            await _context.SaveChangesAsync();

            return new PhieuThuTienResponseDto
            {
                MaPhieu = phieu.MaPhieu,
                NgayThuTien = phieu.NgayThuTien,
                MaKH = phieu.MaKH,
                TenKhachHang = phieu.KhachHang.HoTen,
                SDT = phieu.KhachHang.SDT,
                SoTienThu = phieu.SoTienThu,
                CongNoTruoc = congNoTruoc,
                CongNoSau = phieu.KhachHang.CongNo
            };
        }
    }
}
