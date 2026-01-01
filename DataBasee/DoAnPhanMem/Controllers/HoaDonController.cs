using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DoAnPhanMem.Data;
using DoAnPhanMem.Models;
using DoAnPhanMem.DTO;
using DoAnPhanMem.Services.Interfaces;

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

        // API lay danh sach sach de hien thi trong dropdown
        // GET: api/HoaDon/DanhSachSach
        [HttpGet("DanhSachSach")]
        public async Task<IActionResult> GetDanhSachSach()
        {
            var danhSachSach = await _context.SACH
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

            return Ok(danhSachSach);
        }

        // API tra cuu khach hang theo so dien thoai
        // GET: api/HoaDon/TraCuuKhachHang?sdt=0123456789
        [HttpGet("TraCuuKhachHang")]
        public async Task<IActionResult> TraCuuKhachHang([FromQuery] string? sdt)
        {
            decimal gioiHanNo = _ruleService.GetDecimalRule("QD2_NoToiDa");

            if (string.IsNullOrWhiteSpace(sdt))
            {
                // Khach vang lai
                return Ok(new KhachHangResponseDto
                {
                    MaKH = "",
                    HoTen = "Khach vang lai",
                    SDT = "",
                    CongNo = 0,
                    GioiHanNo = gioiHanNo,
                    IsKhachVangLai = true,
                    Message = null
                });
            }

            var khachHang = await _context.KHACH_HANG
                .FirstOrDefaultAsync(kh => kh.SDT == sdt);

            if (khachHang == null)
            {
                // Khong tim thay -> Khach vang lai
                return Ok(new KhachHangResponseDto
                {
                    MaKH = "",
                    HoTen = "Khach vang lai",
                    SDT = sdt,
                    CongNo = 0,
                    GioiHanNo = gioiHanNo,
                    IsKhachVangLai = true,
                    Message = "Khong tim thay khach hang trong he thong"
                });
            }

            return Ok(new KhachHangResponseDto
            {
                MaKH = khachHang.MaKH,
                HoTen = khachHang.HoTen,
                SDT = khachHang.SDT,
                CongNo = khachHang.CongNo,
                GioiHanNo = gioiHanNo,
                IsKhachVangLai = false,
                Message = null
            });
        }

        // API lap hoa don
        // POST: api/HoaDon/LapHoaDon
        [HttpPost("LapHoaDon")]
        public async Task<IActionResult> LapHoaDon([FromBody] LapHoaDonDto dto)
        {
            // 1. Validate cơ bản
            if (dto.DanhSachSanPham == null || dto.DanhSachSanPham.Count == 0)
                return BadRequest(new { message = "Danh sach san pham khong duoc de trong" });

            // 2. Bắt đầu Transaction (An toàn dữ liệu tuyệt đối)
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // --- A. XỬ LÝ KHÁCH HÀNG ---
                KHACH_HANG? khachHang = null;
                bool isKhachVangLai = true;

                if (!string.IsNullOrWhiteSpace(dto.SDTKhachHang))
                {
                    khachHang = await _context.KHACH_HANG.FirstOrDefaultAsync(kh => kh.SDT == dto.SDTKhachHang);
                    if (khachHang != null) isKhachVangLai = false;
                }

                // Validate logic nợ
                if (dto.IsDebt && isKhachVangLai)
                {
                    return BadRequest(new { message = "Khach vang lai khong duoc phep ghi no!" });
                }

                // --- B. TẠO HÓA ĐƠN ---
                // [QUAN TRỌNG] Sử dụng ngày từ frontend nếu có, nếu không thì dùng ngày hiện tại
                var ngayLap = dto.At ?? DateTime.UtcNow.AddHours(7);
                var maHoaDon = $"HD-{ngayLap:yyyyMMddHHmmss}-{Guid.NewGuid().ToString("N").Substring(0, 6)}";
                var nhanVien = await _context.NHAN_VIEN.FirstOrDefaultAsync(); // Lấy tạm NV đầu tiên

                var hoaDon = new HOA_DON
                {
                    MaHoaDon = maHoaDon,
                    MaKH = isKhachVangLai ? "KH00": khachHang!.MaKH,
                    MaNV = nhanVien?.MaNV
                    // TongTien sẽ tính sau
                };
                _context.HOA_DON.Add(hoaDon);
                await _context.SaveChangesAsync(); // Lưu để có MaHoaDon dùng cho chi tiết

                decimal tongTien = 0;
                var chiTietResponses = new List<ChiTietHoaDonResponseDto>();
                int stt = 0;
                int thang = ngayLap.Month;
                int nam = ngayLap.Year;

                // --- C. XỬ LÝ SẢN PHẨM & KHO & BÁO CÁO TỒN ---
                foreach (var item in dto.DanhSachSanPham)
                {
                    var sach = await _context.SACH.Include(s => s.TheLoai).FirstOrDefaultAsync(s => s.MaSach == item.MaSach);
                    if (sach == null) throw new Exception($"Khong tim thay sach: {item.MaSach}");

                    // 1. Kiểm tra tồn kho
                    if (sach.SoLuongTon < item.SoLuong)
                        throw new Exception($"Sach '{sach.TenSach}' khong du ton kho (Con: {sach.SoLuongTon})");

                    // 2. Kiểm tra quy định tồn tối thiểu sau bán
                    int tonSauBan = sach.SoLuongTon - item.SoLuong;
                    try { _ruleService.CheckRule_BanSach(0, tonSauBan); }
                    catch (Exception ex) { throw new Exception($"Sach '{sach.TenSach}': {ex.Message}"); }

                    // 3. Cập nhật tồn kho
                    int tonDau = sach.SoLuongTon; // Lưu lại để ghi báo cáo nếu cần
                    sach.SoLuongTon = tonSauBan;

                    // 4. Tạo chi tiết hóa đơn
                    var chiTiet = new CHI_TIET_HOA_DON
                    {
                        MaHoaDon = maHoaDon,
                        MaSach = item.MaSach,
                        SoLuong = item.SoLuong,
                        DonGiaBan = sach.DonGia,
                        NgayLapHoaDon = ngayLap
                    };
                    _context.CHI_TIET_HOA_DON.Add(chiTiet);

                    // 5. CẬP NHẬT BÁO CÁO TỒN (BAO_CAO_TON)
                    // Logic: Tìm báo cáo tháng này. Nếu chưa có thì tạo mới. Nếu có rồi thì cộng dồn.
                    var baoCaoTon = await _context.BAO_CAO_TON
                        .FirstOrDefaultAsync(b => b.MaSach == sach.MaSach && b.Thang == thang && b.Nam == nam);

                    if (baoCaoTon == null)
                    {
                        // Chưa có báo cáo tháng này -> Tạo mới
                        // Tồn đầu của tháng này = Tồn cuối tháng trước (hoặc lấy tồn hiện tại + đã bán nếu là giao dịch đầu tiên)
                        // Để đơn giản cho Side A: Tồn đầu = Tồn hiện tại + Số lượng bán (Logic tương đối)
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

                // --- D. XỬ LÝ CÔNG NỢ & BÁO CÁO CÔNG NỢ ---
                // Chỉ xử lý nếu KHÔNG PHẢI khách vãng lai VÀ có chọn Ghi Nợ (IsDebt = true)
                if (!isKhachVangLai && dto.IsDebt)
                {
                    decimal noDau = khachHang!.CongNo;
                    decimal noMoi = noDau + tongTien;

                    // Kiểm tra quy định nợ tối đa
                    try { _ruleService.CheckRule_BanSach(noMoi, int.MaxValue); }
                    catch (Exception ex) { throw new Exception(ex.Message); }

                    // Cập nhật nợ khách
                    khachHang.CongNo = noMoi;

                    // CẬP NHẬT BÁO CÁO CÔNG NỢ (BAO_CAO_CONG_NO)
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
                // Lưu ý: Nếu trả tiền mặt (IsDebt = false), ta KHÔNG cộng nợ, KHÔNG cập nhật báo cáo nợ.

                await _context.SaveChangesAsync();
                await transaction.CommitAsync(); // Xác nhận giao dịch thành công

                return Ok(new HoaDonResponseDto
                {
                    MaHoaDon = maHoaDon,
                    NgayLap = ngayLap,
                    TenKhachHang = isKhachVangLai ? "Khach vang lai" : khachHang!.HoTen,
                    SDTKhachHang = dto.SDTKhachHang ?? "",
                    IsKhachVangLai = isKhachVangLai,
                    DanhSachSanPham = chiTietResponses,
                    TongTien = tongTien
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync(); // Hoàn tác tất cả nếu có lỗi
                // Lấy inner message cho rõ ràng
                var msg = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return BadRequest(new { message = msg });
            }
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
                TheLoai = ct.Sach?.TheLoai?.TenTL ?? "",
                SoLuong = ct.SoLuong,
                DonGia = ct.DonGiaBan,
                ThanhTien = ct.DonGiaBan * ct.SoLuong
            }).ToList();

            return Ok(new HoaDonResponseDto
            {
                MaHoaDon = hoaDon.MaHoaDon,
                NgayLap = hoaDon.ChiTietHoaDon.FirstOrDefault()?.NgayLapHoaDon ?? DateTime.UtcNow,
                TenKhachHang = hoaDon.KhachHang?.HoTen ?? "Khach vang lai",
                SDTKhachHang = hoaDon.KhachHang?.SDT ?? "",
                IsKhachVangLai = hoaDon.KhachHang == null,
                DanhSachSanPham = chiTietResponses,
                TongTien = chiTietResponses.Sum(ct => ct.ThanhTien)
            });
        }

        // API cap nhat hoa don
        // PUT: api/HoaDon/CapNhat
        [HttpPut("CapNhat")]
        public async Task<IActionResult> UpdateHoaDon([FromBody] UpdateHoaDonDto dto)
        {
            if (dto.DanhSachSanPham == null || dto.DanhSachSanPham.Count == 0)
            {
                return BadRequest(new { message = "Danh sach san pham khong duoc de trong" });
            }

            var hoaDon = await _context.HOA_DON
                .Include(hd => hd.KhachHang)
                .Include(hd => hd.ChiTietHoaDon)
                    .ThenInclude(ct => ct.Sach)
                .FirstOrDefaultAsync(hd => hd.MaHoaDon == dto.MaHoaDon);

            if (hoaDon == null)
            {
                return NotFound(new { message = $"Khong tim thay hoa don co ma: {dto.MaHoaDon}" });
            }

            // Tinh tong tien cu de hoan lai cong no
            decimal tongTienCu = hoaDon.ChiTietHoaDon.Sum(ct => ct.DonGiaBan * ct.SoLuong);

            // Hoan lai so luong ton kho cu
            foreach (var chiTietCu in hoaDon.ChiTietHoaDon)
            {
                if (chiTietCu.Sach != null)
                {
                    chiTietCu.Sach.SoLuongTon += chiTietCu.SoLuong;
                }
            }

            // Hoan lai cong no cu cho khach hang
            if (hoaDon.KhachHang != null)
            {
                hoaDon.KhachHang.CongNo -= tongTienCu;
            }

            // Xoa chi tiet hoa don cu
            _context.CHI_TIET_HOA_DON.RemoveRange(hoaDon.ChiTietHoaDon);

            // Xu ly khach hang moi (neu thay doi)
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

            // Tao chi tiet hoa don moi
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
                    return BadRequest(new { message = $"Khong tim thay sach co ma: {item.MaSach}" });
                }

                int tonSauBan = sach.SoLuongTon - item.SoLuong;

                if (tonSauBan < 0)
                {
                    return BadRequest(new { message = $"Sach '{sach.TenSach}' khong du so luong ton. Hien con: {sach.SoLuongTon}" });
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

            // Cap nhat cong no cho khach hang moi
            if (!isKhachVangLai && khachHangMoi != null)
            {
                khachHangMoi.CongNo += tongTienMoi;
            }

            await _context.SaveChangesAsync();

            return Ok(new HoaDonResponseDto
            {
                MaHoaDon = dto.MaHoaDon,
                NgayLap = ngayLap,
                TenKhachHang = isKhachVangLai ? "Khach vang lai" : khachHangMoi!.HoTen,
                SDTKhachHang = dto.SDTKhachHang ?? "",
                IsKhachVangLai = isKhachVangLai,
                DanhSachSanPham = chiTietResponses,
                TongTien = tongTienMoi
            });
        }
    }
}
