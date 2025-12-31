using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DoAnPhanMem.Data;
using DoAnPhanMem.Models;
using DoAnPhanMem.DTO;

namespace DoAnPhanMem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PhieuThuTienController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IRuleService _ruleService;

        public PhieuThuTienController(DataContext context, IRuleService ruleService)
        {
            _context = context;
            _ruleService = ruleService;
        }

        // API tra cuu khach hang de thu tien theo SDT
        // GET: api/PhieuThuTien/TraCuuKhachHang?sdt=0123456789
        [HttpGet("TraCuuKhachHang")]
        public async Task<IActionResult> TraCuuKhachHang([FromQuery] string? sdt)
        {
            if (string.IsNullOrWhiteSpace(sdt))
            {
                return Ok(new KhachHangThuTienResponseDto
                {
                    MaKH = "",
                    HoTen = "",
                    SDT = "",
                    CongNo = 0,
                    IsFound = false,
                    Message = "Vui long nhap so dien thoai khach hang"
                });
            }

            var khachHang = await _context.KHACH_HANG
                .FirstOrDefaultAsync(kh => kh.SDT == sdt);

            if (khachHang == null)
            {
                return Ok(new KhachHangThuTienResponseDto
                {
                    MaKH = "",
                    HoTen = "",
                    SDT = sdt,
                    CongNo = 0,
                    IsFound = false,
                    Message = "Khong tim thay khach hang trong he thong"
                });
            }

            return Ok(new KhachHangThuTienResponseDto
            {
                MaKH = khachHang.MaKH,
                HoTen = khachHang.HoTen,
                SDT = khachHang.SDT,
                CongNo = khachHang.CongNo,
                IsFound = true,
                Message = khachHang.CongNo > 0 ? null : "Khach hang khong co cong no"
            });
        }

        // API lap phieu thu tien
        // POST: api/PhieuThuTien/LapPhieu
        [HttpPost("LapPhieu")]
        public async Task<IActionResult> LapPhieuThuTien([FromBody] LapPhieuThuTienDto dto)
        {
            // Tim khach hang theo SDT
            var khachHang = await _context.KHACH_HANG
                .FirstOrDefaultAsync(kh => kh.SDT == dto.SDTKhachHang);

            if (khachHang == null)
            {
                return BadRequest(new { message = "Khong tim thay khach hang voi so dien thoai nay" });
            }

            // Kiem tra khach hang co no khong
            if (khachHang.CongNo <= 0)
            {
                return BadRequest(new { message = "Khach hang khong co cong no de thu" });
            }

            // Kiem tra QD4: So tien thu khong vuot qua so no hien tai
            try
            {
                _ruleService.CheckRule_ThuTien(dto.SoTienThu, khachHang.CongNo);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }

            // Luu cong no truoc khi thu
            decimal congNoTruoc = khachHang.CongNo;

            // Tao ma phieu thu tien
            var maPhieu = "PTT" + DateTime.UtcNow.ToString("yyyyMMddHHmmss");
            var ngayThuTien = DateTime.UtcNow;

            // Lay nhan vien dau tien lam mac dinh (co the lay tu JWT token sau)
            var nhanVien = await _context.NHAN_VIEN.FirstOrDefaultAsync();

            // Tao phieu thu tien
            var phieuThuTien = new PHIEU_THU_TIEN
            {
                MaPhieu = maPhieu,
                NgayThuTien = ngayThuTien,
                SoTienThu = dto.SoTienThu,
                MaKH = khachHang.MaKH,
                MaNV = nhanVien?.MaNV // Co the lay tu JWT token neu can
            };

            _context.PHIEU_THU_TIEN.Add(phieuThuTien);

            // Cap nhat cong no khach hang
            khachHang.CongNo -= dto.SoTienThu;

            // CAP NHAT BAO CAO CONG NO (BCCN)
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
                // Tìm báo cáo tháng trước để lấy NoCuoi làm NoDau
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

            return Ok(new PhieuThuTienResponseDto
            {
                MaPhieu = maPhieu,
                NgayThuTien = ngayThuTien,
                MaKH = khachHang.MaKH,
                TenKhachHang = khachHang.HoTen,
                SDT = khachHang.SDT,
                SoTienThu = dto.SoTienThu,
                CongNoTruoc = congNoTruoc,
                CongNoSau = khachHang.CongNo
            });
        }

        // API lay danh sach phieu thu tien
        // GET: api/PhieuThuTien
        [HttpGet]
        public async Task<IActionResult> GetAllPhieuThuTien()
        {
            var danhSach = await _context.PHIEU_THU_TIEN
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

            return Ok(danhSach);
        }

        // API lay phieu thu tien theo ma
        // GET: api/PhieuThuTien/{maPhieu}
        [HttpGet("{maPhieu}")]
        public async Task<IActionResult> GetPhieuThuTienById(string maPhieu)
        {
            var phieu = await _context.PHIEU_THU_TIEN
                .Include(p => p.KhachHang)
                .FirstOrDefaultAsync(p => p.MaPhieu == maPhieu);

            if (phieu == null)
            {
                return NotFound(new { message = $"Khong tim thay phieu thu tien co ma: {maPhieu}" });
            }

            return Ok(new PhieuThuTienResponseDto
            {
                MaPhieu = phieu.MaPhieu,
                NgayThuTien = phieu.NgayThuTien,
                MaKH = phieu.MaKH,
                TenKhachHang = phieu.KhachHang?.HoTen ?? "",
                SDT = phieu.KhachHang?.SDT ?? "",
                SoTienThu = phieu.SoTienThu,
                CongNoTruoc = 0, // Khong luu gia tri nay trong DB
                CongNoSau = phieu.KhachHang?.CongNo ?? 0
            });
        }

        // API lay danh sach phieu thu tien theo thang/nam
        // GET: api/PhieuThuTien/TheoThang?thang=12&nam=2025
        [HttpGet("TheoThang")]
        public async Task<IActionResult> GetPhieuThuTienTheoThang([FromQuery] int thang, [FromQuery] int nam)
        {
            var danhSach = await _context.PHIEU_THU_TIEN
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

            return Ok(danhSach);
        }

        // API lay danh sach khach hang dang no
        // GET: api/PhieuThuTien/KhachHangDangNo
        [HttpGet("KhachHangDangNo")]
        public async Task<IActionResult> GetKhachHangDangNo()
        {
            var danhSach = await _context.KHACH_HANG
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

            return Ok(danhSach);
        }

        // API cap nhat phieu thu tien
        // PUT: api/PhieuThuTien/CapNhat
        [HttpPut("CapNhat")]
        public async Task<IActionResult> UpdatePhieuThuTien([FromBody] UpdatePhieuThuTienDto dto)
        {
            var phieu = await _context.PHIEU_THU_TIEN
                .Include(p => p.KhachHang)
                .FirstOrDefaultAsync(p => p.MaPhieu == dto.MaPhieu);

            if (phieu == null)
            {
                return NotFound(new { message = $"Khong tim thay phieu thu tien co ma: {dto.MaPhieu}" });
            }

            if (phieu.KhachHang == null)
            {
                return BadRequest(new { message = "Khong tim thay thong tin khach hang cua phieu thu" });
            }

            // Tinh so tien chenh lech
            decimal soTienCu = phieu.SoTienThu;
            decimal soTienMoi = dto.SoTienThu;

            // Tinh cong no moi (cong no hien tai + chenh lech nguoc lai)
            // Neu thu nhieu hon -> cong no giam, thu it hon -> cong no tang
            decimal chenhLechNo = soTienCu - soTienMoi;

            decimal congNoMoi = phieu.KhachHang.CongNo + chenhLechNo;

            // Kiem tra cong no moi khong am
            if (congNoMoi < 0)
            {
                return BadRequest(new { message = $"So tien thu vuot qua cong no. Cong no hien tai sau khi hoan: {phieu.KhachHang.CongNo + soTienCu}" });
            }

            // Luu cong no truoc khi cap nhat
            decimal congNoTruoc = phieu.KhachHang.CongNo;
            phieu.KhachHang.CongNo = congNoMoi;

            DateTime ngayHieuLuc = phieu.NgayThuTien;

            // Cap nhat phieu thu tien
            phieu.SoTienThu = soTienMoi;
            if (dto.NgayThuTien.HasValue)
            {
                phieu.NgayThuTien = dto.NgayThuTien.Value;
                // Cap nhat lai thang nam neu ngay thay doi de tim bao cao dung
                ngayHieuLuc = dto.NgayThuTien.Value;
            }

            // CAP NHAT BAO CAO CONG NO
            var baoCao = await _context.BAO_CAO_CONG_NO
                .FirstOrDefaultAsync(bc => bc.MaKH == phieu.MaKH && bc.Thang == ngayHieuLuc.Month && bc.Nam == ngayHieuLuc.Year);

            if (baoCao != null)
            {
                // Cong vao NoCuoi phan chenh lech
                baoCao.NoPhatSinh += chenhLechNo;
                baoCao.NoCuoi += chenhLechNo;
            }

            await _context.SaveChangesAsync();

            return Ok(new PhieuThuTienResponseDto
            {
                MaPhieu = phieu.MaPhieu,
                NgayThuTien = phieu.NgayThuTien,
                MaKH = phieu.MaKH,
                TenKhachHang = phieu.KhachHang.HoTen,
                SDT = phieu.KhachHang.SDT,
                SoTienThu = phieu.SoTienThu,
                CongNoTruoc = congNoTruoc,
                CongNoSau = phieu.KhachHang.CongNo
            });
        }
    }
}
