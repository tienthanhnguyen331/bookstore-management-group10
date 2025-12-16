
using Microsoft.EntityFrameworkCore;
using DoAnPhanMem.Data;
using DoAnPhanMem.Services.Interfaces;
using DoAnPhanMem.DTO;
using DoAnPhanMem.Models;


namespace DoAnPhanMem.Services.Implementations
{
    public class SachService : ISachService
    {
        private readonly DataContext _context;

        public SachService(DataContext context)
        {
            _context = context;
        }

        public async Task<List<SachViewDto>> GetDanhSachSachAsync()
        {
            var query = from s in _context.SACH
                            // 1. Join bảng Thể Loại (Lấy tên Thể loại)
                        join tl in _context.THE_LOAI on s.MaTL equals tl.MaTL

                        select new SachViewDto
                        {
                            MaSach = s.MaSach,
                            TenSach = s.TenSach,
                            TenTheLoai = tl.TenTL,

                            DonGia = s.DonGia,





                            SoLuongTon = s.SoLuongTon,

                            // --- KHẮC PHỤC LỖI TẠI ĐÂY ---
                            // Logic: Tìm trong bảng trung gian -> Join sang bảng Tác giả -> Lấy Tên
                            TenTacGia = (from st in _context.SACH_TAC_GIA
                                             // Nối bảng Trung Gian (st) với bảng Tác Giả (tg) qua MaTG
                                         join tg in _context.TAC_GIA on st.MaTG equals tg.MaTG
                                         // Chỉ lấy dòng nào trùng với sách hiện tại (s.MaSach)
                                         where st.MaSach == s.MaSach
                                         select tg.TenTG) // Chọn cột tên để hiển thị
                                         .FirstOrDefault() ?? "Chưa cập nhật"
                        };

            return await query.ToListAsync();
        }
        public async Task<bool> CreateSachAsync(SachCreateDto request)
        {
            using var transaction = _context.Database.BeginTransaction();
            try
            {
                // =============================================================
                // BƯỚC 1: XỬ LÝ THỂ LOẠI (TL)
                // =============================================================
                string maTheLoaiChot = "";

                // Kiểm tra xem tên thể loại này đã có chưa?
                var theLoaiTonTai = await _context.THE_LOAI
                    .FirstOrDefaultAsync(tl => tl.TenTL == request.TenTheLoai);

                if (theLoaiTonTai != null)
                {
                    // A. Nếu có rồi -> Lấy mã dùng luôn
                    maTheLoaiChot = theLoaiTonTai.MaTL;
                }
                else
                {
                    // B. Nếu chưa có -> Tự sinh mã TL mới tăng dần
                    string lastIdTL = await _context.THE_LOAI
                        .OrderByDescending(x => x.MaTL)
                        .Select(x => x.MaTL)
                        .FirstOrDefaultAsync();

                    maTheLoaiChot = GenerateNextId(lastIdTL, "TL"); // Hàm tự viết bên dưới

                    var tlMoi = new THE_LOAI { MaTL = maTheLoaiChot, TenTL = request.TenTheLoai };
                    _context.THE_LOAI.Add(tlMoi);
                    await _context.SaveChangesAsync();
                }

                // =============================================================
                // BƯỚC 2: XỬ LÝ TÁC GIẢ (TG)
                // =============================================================
                string maTacGiaChot = "";

                // Kiểm tra tác giả có chưa
                var tacGiaTonTai = await _context.TAC_GIA
                    .FirstOrDefaultAsync(tg => tg.TenTG == request.TenTacGia);

                if (tacGiaTonTai != null)
                {
                    maTacGiaChot = tacGiaTonTai.MaTG;
                }
                else
                {
                    // Chưa có -> Tạo mã TG mới tăng dần
                    string lastIdTG = await _context.TAC_GIA
                        .OrderByDescending(x => x.MaTG)
                        .Select(x => x.MaTG)
                        .FirstOrDefaultAsync();

                    maTacGiaChot = GenerateNextId(lastIdTG, "TG");

                    var tgMoi = new TAC_GIA { MaTG = maTacGiaChot, TenTG = request.TenTacGia };
                    _context.TAC_GIA.Add(tgMoi);
                    await _context.SaveChangesAsync();
                }

                // =============================================================
                // BƯỚC 3: TẠO SÁCH (S)
                // =============================================================

                // Tìm mã sách lớn nhất hiện tại (Ví dụ: S004)
                string lastIdSach = await _context.SACH
                    .OrderByDescending(x => x.MaSach)
                    .Select(x => x.MaSach)
                    .FirstOrDefaultAsync();

                string newMaSach = GenerateNextId(lastIdSach, "S"); // -> Ra S005

                var sachMoi = new SACH
                {
                    MaSach = newMaSach,
                    TenSach = request.TenSach,
                    MaTL = maTheLoaiChot,      // Dùng mã vừa tìm/tạo ở B1
                    
                    DonGia = request.DonGia,
                    SoLuongTon = request.SoLuongTon
                };

                _context.SACH.Add(sachMoi);
                await _context.SaveChangesAsync();

                // =============================================================
                // BƯỚC 4: TẠO LIÊN KẾT (SACH_TAC_GIA)
                // =============================================================
                var lienKet = new SACH_TAC_GIA
                {
                    MaSach = newMaSach,
                    MaTG = maTacGiaChot // Dùng mã vừa tìm/tạo ở B2
                };

                _context.SACH_TAC_GIA.Add(lienKet);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();
                return true;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine("Lỗi: " + ex.Message);
                return false;
            }
        }

        // =============================================================
        // HÀM PHỤ: TỰ ĐỘNG TÍNH MÃ TIẾP THEO (Logic quan trọng)
        // Input: "S004", "S"  ==> Output: "S005"
        // =============================================================
        private string GenerateNextId(string lastId, string prefix)
        {
            if (string.IsNullOrEmpty(lastId))
            {
                // Nếu bảng rỗng chưa có gì -> Trả về mã đầu tiên (VD: S001)
                return prefix + "001";
            }

            // Cắt bỏ phần chữ, lấy phần số (Ví dụ: "S004" -> lấy "004")
            string numberPart = lastId.Substring(prefix.Length);

            // Chuyển thành số nguyên và cộng 1
            if (int.TryParse(numberPart, out int number))
            {
                number++; // 4 -> 5

                // Ghép lại: Prefix + Số (được lấp đầy số 0 cho đủ 3 ký tự)
                // Ví dụ: 5 -> "005", 10 -> "010", 100 -> "100"
                return prefix + number.ToString("D3");
            }

            // Phòng trường hợp lỗi không parse được số -> Dùng random để chữa cháy
            return prefix + DateTime.Now.Ticks.ToString().Substring(10);
        }


        // Thêm vào SachService.cs

        public async Task<bool> UpdateSachAsync(SachUpdateDto request)
        {
            using var transaction = _context.Database.BeginTransaction();
            try
            {
                // BƯỚC 1: Tìm cuốn sách đang cần sửa
                var sach = await _context.SACH.FirstOrDefaultAsync(x => x.MaSach == request.MaSach);
                if (sach == null) return false; // Không tìm thấy sách thì nghỉ luôn

                // BƯỚC 2: XỬ LÝ THỂ LOẠI (Logic thông minh: Có rồi thì lấy Mã, chưa có thì Tạo mới)
                string maTheLoaiMoi = "";

                // Kiểm tra tên thể loại mới này có trong DB chưa
                var theLoaiTonTai = await _context.THE_LOAI
                    .FirstOrDefaultAsync(tl => tl.TenTL == request.TenTheLoai);

                if (theLoaiTonTai != null)
                {
                    maTheLoaiMoi = theLoaiTonTai.MaTL; // Có rồi -> Lấy mã xài luôn
                }
                else
                {
                    // Chưa có -> Phải tạo Thể loại mới
                    // Lấy mã TL lớn nhất hiện tại để cộng thêm 1
                    string lastIdTL = await _context.THE_LOAI.OrderByDescending(x => x.MaTL).Select(x => x.MaTL).FirstOrDefaultAsync();
                    maTheLoaiMoi = GenerateNextId(lastIdTL, "TL"); // Tự sinh mã (VD: TL05)

                    // Lưu thể loại mới
                    _context.THE_LOAI.Add(new THE_LOAI { MaTL = maTheLoaiMoi, TenTL = request.TenTheLoai });
                    await _context.SaveChangesAsync();
                }

                // BƯỚC 3: XỬ LÝ TÁC GIẢ (Logic tương tự Thể loại)
                string maTacGiaMoi = "";
                var tacGiaTonTai = await _context.TAC_GIA.FirstOrDefaultAsync(tg => tg.TenTG == request.TenTacGia);

                if (tacGiaTonTai != null)
                {
                    maTacGiaMoi = tacGiaTonTai.MaTG;
                }
                else
                {
                    // Chưa có -> Tạo Tác giả mới
                    string lastIdTG = await _context.TAC_GIA.OrderByDescending(x => x.MaTG).Select(x => x.MaTG).FirstOrDefaultAsync();
                    maTacGiaMoi = GenerateNextId(lastIdTG, "TG");

                    _context.TAC_GIA.Add(new TAC_GIA { MaTG = maTacGiaMoi, TenTG = request.TenTacGia });
                    await _context.SaveChangesAsync();
                }

                // BƯỚC 4: CẬP NHẬT THÔNG TIN BẢNG SÁCH
                sach.TenSach = request.TenSach;
                sach.DonGia = request.DonGia;
                sach.MaTL = maTheLoaiMoi; // Gắn mã thể loại (mới hoặc cũ) vào

                // Lưu ý: Tuyệt đối KHÔNG đụng vào cột TheLoaiMaTL (nếu bạn chưa xóa nó trong DB)
                // sach.TheLoai = null; // Dòng này để tránh EF Core tự update object liên quan

                _context.SACH.Update(sach);
                await _context.SaveChangesAsync();

                // BƯỚC 5: CẬP NHẬT LIÊN KẾT TÁC GIẢ (Bảng SACH_TAC_GIA)
                // Vì quan hệ nhiều-nhiều, cách sửa an toàn nhất là: Xóa liên kết cũ -> Thêm liên kết mới

                // 5.1. Xóa liên kết cũ của sách này
                var lienKetCu = _context.SACH_TAC_GIA.Where(x => x.MaSach == request.MaSach);
                _context.SACH_TAC_GIA.RemoveRange(lienKetCu);
                await _context.SaveChangesAsync();

                // 5.2. Thêm liên kết mới với mã tác giả vừa tìm được ở Bước 3
                _context.SACH_TAC_GIA.Add(new SACH_TAC_GIA
                {
                    MaSach = request.MaSach,
                    MaTG = maTacGiaMoi
                });
                await _context.SaveChangesAsync();

                // Xong xuôi tất cả -> Chốt đơn
                await transaction.CommitAsync();
                return true;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine("Lỗi Update: " + ex.Message); // In lỗi ra xem nếu có
                return false;
            }
        }
    }
}