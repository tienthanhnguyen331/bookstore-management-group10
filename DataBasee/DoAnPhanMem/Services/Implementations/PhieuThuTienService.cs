using Microsoft.EntityFrameworkCore;
using DoAnPhanMem.Data;
using DoAnPhanMem.Models;
using DoAnPhanMem.DTO;

namespace DoAnPhanMem.Services
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

        public async Task<KhachHangThuTienResponseDto> TraCuuKhachHangAsync(string sdt)
        {
            if (string.IsNullOrWhiteSpace(sdt))
            {
                return new KhachHangThuTienResponseDto
                {
                    IsFound = false,
                    Message = "Vui long nhap so dien thoai khach hang"
                };
            }

            var khachHang = await _context.KHACH_HANG.FirstOrDefaultAsync(kh => kh.SDT == sdt);

            if (khachHang == null)
            {
                return new KhachHangThuTienResponseDto
                {
                    SDT = sdt,
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
            var khachHang = await _context.KHACH_HANG.FirstOrDefaultAsync(kh => kh.SDT == dto.SDTKhachHang);
            if (khachHang == null) throw new KeyNotFoundException("Khong tim thay khach hang");

            // KIỂM TRA QUY ĐỊNH 4 TRONG DB
            var quyDinh4 = await _context.QUY_DINH
            .FirstOrDefaultAsync(qd => qd.TenQuyDinh == "QD4_KiemTraTienThu");

            // Mặc định là BẬT (True)
            bool batQuyDinh4 = true;

            if (quyDinh4 != null)
            {
                // Nếu Giá trị là "1" hoặc "true" thì là Bật. Ngược lại là Tắt.
                if (quyDinh4.GiaTri == "0" || quyDinh4.GiaTri.ToLower() == "false")
                {
                    batQuyDinh4 = false;
                }
            }
            // ÁP DỤNG LOGIC CHECK
            if (batQuyDinh4)
            {
                // ---TRƯỜNG HỢP: QUY ĐỊNH BẬT---

                // 1. Khách phải có nợ mới được thu
                if (khachHang.CongNo <= 0)
                    throw new InvalidOperationException("Khách hàng không có nợ, không được phép thu tiền.");

                // 2. Số tiền thu không được lớn hơn số nợ
                if (dto.SoTienThu > khachHang.CongNo)
                {
                    throw new InvalidOperationException($"Quy định 4 đang bật: Số tiền thu ({dto.SoTienThu}) không được vượt quá số nợ hiện tại ({khachHang.CongNo}).");
                }
            }
            // --- TRƯỜNG HỢP: QUY ĐỊNH TẮT (Cho phép nợ âm) ---
            // Không làm gì cả. 
            // Code sẽ chạy tiếp xuống dưới -> Trừ tiền -> Nợ thành số Âm


            // Lấy nhân viên đầu tiên 
            var nhanVien = await _context.NHAN_VIEN.FirstOrDefaultAsync();

            // Nếu bảng nhân viên trống trơn thì báo lỗi (Vì phiếu thu bắt buộc phải có người lập)
            if (nhanVien == null)
            {
                throw new Exception("Lỗi hệ thống: Không tìm thấy bất kỳ nhân viên nào trong CSDL để lập phiếu.");
            }

            decimal congNoTruoc = khachHang.CongNo;
            var maPhieu = "PTT" + DateTime.UtcNow.ToString("yyyyMMddHHmmss");
            var ngayThuTien = DateTime.UtcNow;

            var phieuThuTien = new PHIEU_THU_TIEN
            {
                MaPhieu = maPhieu,
                NgayThuTien = ngayThuTien,
                SoTienThu = dto.SoTienThu,
                MaKH = khachHang.MaKH,
                MaNV = nhanVien.MaNV // Thay bằng mã NV thực tế
            };

            _context.PHIEU_THU_TIEN.Add(phieuThuTien);

            // Cập nhật khách hàng: Giảm nợ
            khachHang.CongNo -= dto.SoTienThu;

            // Cập nhật Báo Cáo: Tăng Trả Nợ
            await UpdateBaoCaoCongNo_LapPhieu(khachHang.MaKH, ngayThuTien, dto.SoTienThu, congNoTruoc, khachHang.CongNo);

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

        // --- Cac ham Get du lieu (Read-only) ---
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
                }).ToListAsync();
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
                }).ToListAsync();
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
                   IsFound = true
               }).ToListAsync();
        }

        // --- Private Helper Methods (Logic Bao Cao) ---

        private async Task UpdateBaoCaoCongNo_LapPhieu(string maKH, DateTime ngayThu, decimal soTienThu, decimal noDauKy, decimal noCuoiKy)
        {
            var thang = ngayThu.Month;
            var nam = ngayThu.Year;

            var baoCao = await _context.BAO_CAO_CONG_NO
                .FirstOrDefaultAsync(bc => bc.MaKH == maKH && bc.Thang == thang && bc.Nam == nam);

            if (baoCao != null)
            {
                // Đã có báo cáo: Cộng dồn vào cột Trả Nợ
                baoCao.TraNo += soTienThu;

                // Nợ cuối giảm đi
                baoCao.NoCuoi -= soTienThu;
            }
            else
            {
                // Chưa có báo cáo: Tạo mới
                var baoCaoMoi = new BAO_CAO_CONG_NO
                {
                    MaBCCN = "BCCN" + Guid.NewGuid().ToString().Substring(0, 8),
                    Thang = thang,
                    Nam = nam,
                    MaKH = maKH,

                    NoDau = noDauKy,          // Nợ đầu = Nợ lúc chưa thu
                    NoPhatSinh = 0,           // Thu tiền không làm tăng phát sinh
                    TraNo = soTienThu,        // Ghi nhận vào cột Trả Nợ
                    NoCuoi = noCuoiKy         // Nợ cuối = Nợ đầu - Trả
                };
                _context.BAO_CAO_CONG_NO.Add(baoCaoMoi);
            }
        }

        private async Task UpdateBaoCaoCongNo_EditPhieu(string maKH, DateTime ngayHieuLuc, decimal chenhLechNo)
        {
            var baoCao = await _context.BAO_CAO_CONG_NO
                .FirstOrDefaultAsync(bc => bc.MaKH == maKH && bc.Thang == ngayHieuLuc.Month && bc.Nam == ngayHieuLuc.Year);

            if (baoCao != null)
            {
                baoCao.TraNo -= chenhLechNo;
                baoCao.NoCuoi += chenhLechNo;
            }
        }
    }
}