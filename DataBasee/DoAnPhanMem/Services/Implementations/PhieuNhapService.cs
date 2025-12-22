using DoAnPhanMem.Data;
using DoAnPhanMem.DTO;

using DoAnPhanMem.Models;
using DoAnPhanMem.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DoAnPhanMem.Services.Implementations
{
    public class PhieuNhapService : IPhieuNhapService
    {
        private readonly DataContext _context;
        private readonly IRuleService _ruleService;

        public PhieuNhapService(DataContext context, IRuleService ruleService)
        {
            _context = context;
            _ruleService = ruleService;
        }

        public async Task<bool> TaoPhieuNhapAsync(PhieuNhapCreateDto request)
        {
            using var transaction = _context.Database.BeginTransaction();
            try
            {
                // --- LOGIC SINH MÃ TỰ ĐỘNG TĂNG (START) ---

                // 1. Lấy ra phiếu nhập có mã lớn nhất hiện tại trong DB
                // (Lưu ý: Chỉ lấy những mã bắt đầu bằng "PN" để tránh lỗi data rác)
                var lastPhieu = await _context.PHIEU_NHAP_SACH
                                              .Where(x => x.MaPhieu.StartsWith("PN"))
                                              .OrderByDescending(x => x.MaPhieu)
                                              .FirstOrDefaultAsync();

                string newMaPhieu = "PN001"; // Mặc định nếu database trống trơn

                if (lastPhieu != null)
                {
                    // lastPhieu.MaPhieu đang là "PN005" chẳng hạn
                    // Substring(2) để cắt bỏ chữ "PN", lấy "005"
                    string numberPart = lastPhieu.MaPhieu.Substring(2);

                    if (int.TryParse(numberPart, out int number))
                    {
                        // Cộng 1 lên thành 6, rồi format lại thành "006"
                        int nextNumber = number + 1;
                        newMaPhieu = "PN" + nextNumber.ToString("D3");
                        // "D3" nghĩa là luôn đảm bảo 3 chữ số (1 -> 001, 10 -> 010)
                    }
                }
                // --- LOGIC SINH MÃ TỰ ĐỘNG TĂNG (END) ---


                // BƯỚC 1: TẠO PHIẾU NHẬP (HEADER)
                var phieuNhap = new PHIEU_NHAP_SACH
                {
                    MaPhieu = newMaPhieu, // <--- Dùng mã vừa sinh ở trên
                    MaNV = "NV01" // (Gán tạm như cũ)
                };

                _context.PHIEU_NHAP_SACH.Add(phieuNhap);
                await _context.SaveChangesAsync();
                
               

                // BƯỚC 2: DUYỆT DANH SÁCH CHI TIẾT
                foreach (var item in request.DanhSachSach)
                {
                    var sach = await _context.SACH.FindAsync(item.MaSach);
                    if (sach == null) throw new Exception($"Sách {item.MaSach} không tồn tại.");

                    // Kiểm tra quy định
                    _ruleService.CheckRule_NhapSach(item.SoLuong, sach.SoLuongTon);

                    // BƯỚC 3: LƯU CHI TIẾT (Sửa lại cho khớp tên cột trong DB)
                    var chiTiet = new CHI_TIET_PHIEU_NHAP
                    {
                        MaPhieu = phieuNhap.MaPhieu,
                        MaSach = item.MaSach,

                        // --- SỬA Ở ĐÂY CHO KHỚP DB ---
                        SoLuongNhap = item.SoLuong, // Khớp cột SoLuongNhap

                        Gia = item.DonGiaNhap,      // DB tên là 'Gia', DTO là 'DonGiaNhap' -> Gán qua

                        NgayNhap = request.NgayNhap // DB bạn để Ngày Nhập ở bảng Chi Tiết -> Lấy từ DTO gán vào
                    };

                    _context.CHI_TIET_PHIEU_NHAP.Add(chiTiet);

                    // BƯỚC 4: CẬP NHẬT KHO
                    sach.SoLuongTon += item.SoLuong;

                    // Nếu bạn muốn cập nhật giá vốn của sách theo giá nhập mới nhất:
                    // sach.DonGia = item.DonGiaNhap; 
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return true;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                throw new Exception(ex.Message);
            }
        }
    }
}