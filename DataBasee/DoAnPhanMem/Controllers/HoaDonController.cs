using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DoAnPhanMem.Data;
using DoAnPhanMem.Models;
using DoAnPhanMem.DTO;

namespace DoAnPhanMem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HoaDonController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IRuleService _ruleService;

        public HoaDonController(DataContext context, IRuleService ruleService)
        {
            _context = context;
            _ruleService = ruleService;
        }

        // API tra cuu khach hang theo so dien thoai
        // GET: api/HoaDon/TraCuuKhachHang?sdt=0123456789
        [HttpGet("TraCuuKhachHang")]
        public async Task<IActionResult> TraCuuKhachHang([FromQuery] string sdt)
        {
            if (string.IsNullOrWhiteSpace(sdt))
            {
                // Khach vang lai
                return Ok(new KhachHangResponseDto
                {
                    MaKH = "KH_VANGLAI",
                    HoTen = "Khach vang lai",
                    SDT = "",
                    CongNo = 0,
                    IsKhachVangLai = true
                });
            }

            var khachHang = await _context.KHACH_HANG
                .FirstOrDefaultAsync(kh => kh.SDT == sdt);

            if (khachHang == null)
            {
                // Khong tim thay -> Khach vang lai
                return Ok(new KhachHangResponseDto
                {
                    MaKH = "KH_VANGLAI",
                    HoTen = "Khach vang lai",
                    SDT = sdt,
                    CongNo = 0,
                    IsKhachVangLai = true
                });
            }

            return Ok(new KhachHangResponseDto
            {
                MaKH = khachHang.MaKH,
                HoTen = khachHang.HoTen,
                SDT = khachHang.SDT,
                CongNo = khachHang.CongNo,
                IsKhachVangLai = false
            });
        }

        // API lap hoa don
        // POST: api/HoaDon/LapHoaDon
        [HttpPost("LapHoaDon")]
        public async Task<IActionResult> LapHoaDon([FromBody] LapHoaDonDto dto)
        {
            if (dto.DanhSachSanPham == null || dto.DanhSachSanPham.Count == 0)
            {
                return BadRequest(new { message = "Danh sach san pham khong duoc de trong" });
            }

            // Tim khach hang theo SDT
            KHACH_HANG? khachHang = null;
            bool isKhachVangLai = true;

            if (!string.IsNullOrWhiteSpace(dto.SDTKhachHang))
            {
                khachHang = await _context.KHACH_HANG
                    .FirstOrDefaultAsync(kh => kh.SDT == dto.SDTKhachHang);

                if (khachHang != null)
                {
                    isKhachVangLai = false;

                    // Kiem tra quy dinh QD2: No toi da
                    try
                    {
                        _ruleService.CheckRule_BanSach(khachHang.CongNo, int.MaxValue);
                    }
                    catch (Exception ex)
                    {
                        return BadRequest(new { message = ex.Message });
                    }
                }
            }

            // Tao ma hoa don
            var maHoaDon = "HD" + DateTime.Now.ToString("yyyyMMddHHmmss");
            var ngayLap = DateTime.Now;

            // Tao hoa don
            var hoaDon = new HOA_DON
            {
                MaHoaDon = maHoaDon,
                MaKH = isKhachVangLai ? null : khachHang!.MaKH,
                MaNV = null // Co the lay tu JWT token neu can
            };

            _context.HOA_DON.Add(hoaDon);

            var chiTietResponses = new List<ChiTietHoaDonResponseDto>();
            decimal tongTien = 0;
            int stt = 0;

            foreach (var item in dto.DanhSachSanPham)
            {
                // Lay thong tin sach
                var sach = await _context.SACH
                    .Include(s => s.TheLoai)
                    .FirstOrDefaultAsync(s => s.MaSach == item.MaSach);

                if (sach == null)
                {
                    return BadRequest(new { message = $"Khong tim thay sach co ma: {item.MaSach}" });
                }

                // Kiem tra ton kho
                int tonSauBan = sach.SoLuongTon - item.SoLuong;

                if (tonSauBan < 0)
                {
                    return BadRequest(new { message = $"Sach '{sach.TenSach}' khong du so luong ton. Hien con: {sach.SoLuongTon}" });
                }

                // Kiem tra quy dinh QD2: Ton toi thieu sau khi ban
                try
                {
                    _ruleService.CheckRule_BanSach(0, tonSauBan);
                }
                catch (Exception ex)
                {
                    return BadRequest(new { message = $"Sach '{sach.TenSach}': {ex.Message}" });
                }

                // Tinh don gia ban (co the lay tu bang gia hoac tinh theo quy dinh)
                decimal donGiaBan = 100000; // Gia mac dinh, co the thay doi theo nghiep vu

                // Tao chi tiet hoa don
                var chiTiet = new CHI_TIET_HOA_DON
                {
                    MaHoaDon = maHoaDon,
                    MaSach = item.MaSach,
                    SoLuong = item.SoLuong,
                    DonGiaBan = donGiaBan,
                    NgayLapHoaDon = ngayLap
                };

                _context.CHI_TIET_HOA_DON.Add(chiTiet);

                // Cap nhat ton kho
                sach.SoLuongTon = tonSauBan;

                // Tinh thanh tien
                decimal thanhTien = donGiaBan * item.SoLuong;
                tongTien += thanhTien;

                stt++;
                chiTietResponses.Add(new ChiTietHoaDonResponseDto
                {
                    STT = stt,
                    MaSach = sach.MaSach,
                    TenSach = sach.TenSach,
                    TheLoai = sach.TheLoai?.MaTL ?? "",
                    SoLuong = item.SoLuong,
                    DonGia = donGiaBan,
                    ThanhTien = thanhTien
                });
            }

            // Cap nhat cong no cho khach hang (neu khong phai khach vang lai)
            if (!isKhachVangLai && khachHang != null)
            {
                khachHang.CongNo += tongTien;
            }

            await _context.SaveChangesAsync();

            return Ok(new HoaDonResponseDto
            {
                MaHoaDon = maHoaDon,
                NgayLap = ngayLap,
                TenKhachHang = isKhachVangLai ? "Khach vang lai" : khachHang!.HoTen,
                SDTKhachHang = dto.SDTKhachHang ?? "",
                DanhSachSanPham = chiTietResponses,
                TongTien = tongTien
            });
        }

        // API lay danh sach hoa don
        // GET: api/HoaDon
        [HttpGet]
        public async Task<IActionResult> GetAllHoaDon()
        {
            var hoaDons = await _context.HOA_DON
                .Include(hd => hd.KhachHang)
                .Include(hd => hd.ChiTietHoaDon)
                .ToListAsync();

            return Ok(hoaDons);
        }

        // API lay chi tiet hoa don theo ma
        // GET: api/HoaDon/{maHoaDon}
        [HttpGet("{maHoaDon}")]
        public async Task<IActionResult> GetHoaDonById(string maHoaDon)
        {
            var hoaDon = await _context.HOA_DON
                .Include(hd => hd.KhachHang)
                .Include(hd => hd.ChiTietHoaDon)
                    .ThenInclude(ct => ct.Sach)
                        .ThenInclude(s => s.TheLoai)
                .FirstOrDefaultAsync(hd => hd.MaHoaDon == maHoaDon);

            if (hoaDon == null)
            {
                return NotFound(new { message = $"Khong tim thay hoa don co ma: {maHoaDon}" });
            }

            var chiTietResponses = hoaDon.ChiTietHoaDon.Select((ct, index) => new ChiTietHoaDonResponseDto
            {
                STT = index + 1,
                MaSach = ct.MaSach,
                TenSach = ct.Sach?.TenSach ?? "",
                TheLoai = ct.Sach?.TheLoai?.MaTL ?? "",
                SoLuong = ct.SoLuong,
                DonGia = ct.DonGiaBan,
                ThanhTien = ct.DonGiaBan * ct.SoLuong
            }).ToList();

            return Ok(new HoaDonResponseDto
            {
                MaHoaDon = hoaDon.MaHoaDon,
                NgayLap = hoaDon.ChiTietHoaDon.FirstOrDefault()?.NgayLapHoaDon ?? DateTime.Now,
                TenKhachHang = hoaDon.KhachHang?.HoTen ?? "Khach vang lai",
                SDTKhachHang = hoaDon.KhachHang?.SDT ?? "",
                DanhSachSanPham = chiTietResponses,
                TongTien = chiTietResponses.Sum(ct => ct.ThanhTien)
            });
        }
    }
}
