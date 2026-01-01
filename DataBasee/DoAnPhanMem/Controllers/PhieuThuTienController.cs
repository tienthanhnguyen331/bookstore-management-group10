using DoAnPhanMem.Data;
using DoAnPhanMem.DTO;
using DoAnPhanMem.Services;
using DoAnPhanMem.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DoAnPhanMem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PhieuThuTienController : ControllerBase
    {
        private readonly IPhieuThuTienService _phieuThuService;
        private readonly DataContext _context;

        public PhieuThuTienController(IPhieuThuTienService phieuThuService, DataContext context)
        {
            _phieuThuService = phieuThuService;
            _context = context;
        }

        // GET: api/PhieuThuTien/TraCuuKhachHang?sdt=0123456789
        [HttpGet("TraCuuKhachHang")]
        public async Task<IActionResult> TraCuuKhachHang([FromQuery] string? sdt)
        {
            var result = await _phieuThuService.TraCuuKhachHangAsync(sdt);
            return Ok(result);
        }

        // POST: api/PhieuThuTien/LapPhieu
        [HttpPost("LapPhieu")]
        public async Task<IActionResult> LapPhieuThuTien([FromBody] LapPhieuThuTienDto dto)
        {
            // SỬA Ở ĐÂY: Dùng Service hoàn toàn, xóa bỏ logic thủ công
            try
            {
                var result = await _phieuThuService.LapPhieuThuTienAsync(dto);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // GET: api/PhieuThuTien
        [HttpGet]
        public async Task<IActionResult> GetAllPhieuThuTien()
        {
            var result = await _phieuThuService.GetAllPhieuThuTienAsync();
            return Ok(result);
        }

        // GET: api/PhieuThuTien/TheoThang?thang=12&nam=2025
        [HttpGet("TheoThang")]
        public async Task<IActionResult> GetPhieuThuTienTheoThang([FromQuery] int thang, [FromQuery] int nam)
        {
            var result = await _phieuThuService.GetPhieuThuTienTheoThangAsync(thang, nam);
            return Ok(result);
        }

        // GET: api/PhieuThuTien/KhachHangDangNo
        [HttpGet("KhachHangDangNo")]
        public async Task<IActionResult> GetKhachHangDangNo()
        {
            // Logic này có thể chuyển vào Service sau này nếu muốn
            var result = await _phieuThuService.GetKhachHangDangNoAsync();
            return Ok(result);
        }

        // PUT: api/PhieuThuTien/CapNhat
        [HttpPut("CapNhat")]
        public async Task<IActionResult> UpdatePhieuThuTien([FromBody] UpdatePhieuThuTienDto dto)
        {
            // Lưu ý: Phần Update này hiện tại bạn đang viết thủ công trong Controller.
            // Nếu Service chưa có hàm Update, bạn có thể giữ nguyên logic cũ.
            // Tuy nhiên, tốt nhất là nên chuyển logic Update vào Service tương tự như LapPhieu.

            // ... (Giữ nguyên code Update của bạn hoặc chuyển vào Service)
            // Tạm thời giữ nguyên logic Update thủ công của bạn để tránh lỗi nếu Service chưa có hàm này.
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
            decimal chenhLechNo = soTienCu - soTienMoi;
            decimal congNoMoi = phieu.KhachHang.CongNo + chenhLechNo;

            if (congNoMoi < 0)
            {
                return BadRequest(new { message = $"So tien thu vuot qua cong no. Cong no hien tai sau khi hoan: {phieu.KhachHang.CongNo + soTienCu}" });
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

            // CAP NHAT BAO CAO CONG NO
            var baoCao = await _context.BAO_CAO_CONG_NO
                .FirstOrDefaultAsync(bc => bc.MaKH == phieu.MaKH && bc.Thang == ngayHieuLuc.Month && bc.Nam == ngayHieuLuc.Year);

            if (baoCao != null)
            {
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