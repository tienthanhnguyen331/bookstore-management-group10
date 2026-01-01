/*
using System;

using System.Linq;
using System.Threading.Tasks;
using DoAnPhanMem.Data;
using DoAnPhanMem.DTO;
using DoAnPhanMem.Services.Interfaces;
using DoAnPhanMem.Models;
using Microsoft.EntityFrameworkCore;

namespace DoAnPhanMem.Services.Implementations
{
    public class SaleService : ISaleService
    {
        private readonly DataContext _context;

        public SaleService(DataContext context)
        {
            _context = context;
        }

        public async Task<(string MaHoaDon, decimal Total)> CreateSaleAsync(CompleteSaleDto dto)
        {
            if (dto.Items == null || !dto.Items.Any()) throw new ArgumentException("Danh sách sản phẩm rỗng");

<<<<<<< HEAD
            // Sử dụng Transaction để đảm bảo toàn vẹn dữ liệu
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // =================================================================================
                // [QUAN TRỌNG] CHỐT NGÀY HẠCH TOÁN (ACCOUNTING DATE)
                // =================================================================================
                // [SỬA] Dùng 'At' thay vì 'NgayLap' theo đúng DTO của bạn.
                // Nếu Client gửi ngày lên (nhập đơn cũ) thì dùng ngày đó.
                // Nếu không gửi, mặc định dùng ngày hiện tại.
                DateTime ngayHachToan = dto.At ?? DateTime.Now; 
                
                int thang = ngayHachToan.Month; 
                int nam = ngayHachToan.Year;
                // =================================================================================

                // 1. XỬ LÝ KHÁCH HÀNG (Tìm hoặc Tạo mới khách vãng lai)
                KHACH_HANG kh = null;
                if (!string.IsNullOrWhiteSpace(dto.SDT))
                {
                    kh = await _context.KHACH_HANG.FirstOrDefaultAsync(k => k.SDT == dto.SDT);
                    
                    // Nếu chưa có khách hàng -> Tạo mới (Khách vãng lai)
                    if (kh == null)
                    {
                        // [SỬA] Dùng 'IsDebt' (Bạn cần thêm bool IsDebt vào CompleteSaleDto)
                        if (dto.IsDebt) throw new InvalidOperationException("Khách vãng lai (mới) không được phép ghi nợ!");

                        // Logic tự sinh mã KH (KH001, KH002...)
                        var existingKeys = await _context.KHACH_HANG.AsNoTracking()
                            .Where(k => k.MaKH.StartsWith("KH"))
                            .Select(k => k.MaKH).ToListAsync();
                        
                        var numericKeys = existingKeys
                            .Where(k => System.Text.RegularExpressions.Regex.IsMatch(k, "^KH\\d+$")).ToList();
                        
                        int max = 0;
                        foreach (var key in numericKeys) { 
                            if (int.TryParse(key.Substring(2), out var n) && n > max) max = n; 
                        }
                        
                        string newMa;
                        int attempt = max + 1;
                        do { 
                            newMa = "KH" + attempt; 
                            if (!await _context.KHACH_HANG.AnyAsync(x => x.MaKH == newMa)) break; 
                            attempt++; 
                        } while (true);

                        kh = new KHACH_HANG { 
                            MaKH = newMa, 
                            HoTen = "Khách vãng lai", 
                            SDT = dto.SDT, 
                            CongNo = 0m,
                            DiaChi = "",
                            Email = ""
                        };
                        _context.KHACH_HANG.Add(kh);
                        await _context.SaveChangesAsync();
                    }
                }
                else 
                {
                    // Bắt buộc có SĐT để quản lý (hoặc tùy nghiệp vụ bên bạn)
                    if(dto.IsDebt) throw new InvalidOperationException("Cần thông tin khách hàng để ghi nợ!");
                }

                // 2. TẠO HÓA ĐƠN (HEADER)
                // Lưu ý: Mã hóa đơn có thể sinh theo ngày hạch toán để dễ quản lý
                var maHoaDon = $"HD-{ngayHachToan:yyyyMMddHHmmss}-{Guid.NewGuid().ToString("N").Substring(0, 6)}";
                var hoaDon = new HOA_DON
                {
                    MaHoaDon = maHoaDon,
                    MaNV = dto.MaNV,
                    MaKH = kh?.MaKH ?? "" // Nếu bán cho khách lẻ không lưu tên thì để rỗng hoặc mã mặc định
                };
                _context.HOA_DON.Add(hoaDon);

                decimal total = 0m;

                // 3. DUYỆT SẢN PHẨM -> CẬP NHẬT KHO & BÁO CÁO TỒN
                foreach (var item in dto.Items)
                {
                    var sach = await _context.SACH.FirstOrDefaultAsync(s => s.MaSach == item.MaSach);
                    if (sach == null) throw new InvalidOperationException($"Sách {item.MaSach} không tồn tại");
                    if (sach.SoLuongTon < item.SoLuong) throw new InvalidOperationException($"Tồn kho không đủ cho {item.MaSach}");

                    // -------------------------------------------------------------------
                    // [LOGIC BÁO CÁO TỒN] - ĐÃ SỬA ĐỂ DÙNG ĐÚNG NGÀY THÁNG
                    // -------------------------------------------------------------------
                    // Dùng biến 'thang' và 'nam' đã chốt từ ngayHachToan
                    string maBCT = $"BCT_{thang}_{nam}_{item.MaSach}";
                    
                    // 1. Tìm trong Local trước (tránh lỗi duplicate key trong cùng transaction)
                    var bct = _context.BAO_CAO_TON.Local.FirstOrDefault(x => x.MaBCT == maBCT);
                    
                    // 2. Nếu không có ở Local, tìm dưới Database
                    if (bct == null) bct = await _context.BAO_CAO_TON.FirstOrDefaultAsync(b => b.MaBCT == maBCT);

                    if (bct == null)
                    {
                        // TRƯỜNG HỢP: Chưa có báo cáo tháng này -> TẠO MỚI
                        
                        // Logic tìm Tồn Đầu: Phải lấy Tồn Cuối của tháng gần nhất trong quá khứ
                        var baoCaoThangTruoc = await _context.BAO_CAO_TON
                            .Where(b => b.MaSach == item.MaSach && (b.Nam < nam || (b.Nam == nam && b.Thang < thang)))
                            .OrderByDescending(b => b.Nam).ThenByDescending(b => b.Thang)
                            .FirstOrDefaultAsync();

                        // Nếu tìm thấy báo cáo cũ -> Lấy Tồn Cuối làm Tồn Đầu tháng này.
                        // Nếu không thấy -> Lấy Tồn hiện tại (Vì đây là giao dịch đầu tiên được ghi nhận).
                        int tonDau = baoCaoThangTruoc != null ? baoCaoThangTruoc.TonCuoi : sach.SoLuongTon;

                        bct = new BAO_CAO_TON
                        {
                            MaBCT = maBCT, 
                            MaSach = item.MaSach, 
                            Thang = thang, // Lưu đúng vào tháng của hóa đơn
                            Nam = nam,
                            TonDau = tonDau, 
                            PhatSinh = 0,
                            DaBan = item.SoLuong, 
                            TonCuoi = tonDau - item.SoLuong 
                        };
                        _context.BAO_CAO_TON.Add(bct);
                    }
                    else
                    {
                        // TRƯỜNG HỢP: Đã có báo cáo -> CỘNG DỒN
                        bct.DaBan += item.SoLuong;
                        bct.TonCuoi -= item.SoLuong;
                    }
                    // -------------------------------------------------------------------

                    // Trừ kho thực tế trong bảng Sách
                    sach.SoLuongTon -= item.SoLuong;
                    _context.SACH.Update(sach);

                    // Tạo Chi tiết Hóa đơn
                    var cthd = new CHI_TIET_HOA_DON
=======
            // ensure customer exists if SDT provided, otherwise create a guest customer
            string maKH = null;
            if (!string.IsNullOrWhiteSpace(dto.SDT)) // nếu có SDT thì tìm hoặc tạo khách hàng
            {
                var kh = await _context.KHACH_HANG.FirstOrDefaultAsync(k => k.SDT == dto.SDT); // tìm khách hàng theo SDT
                if (kh == null) // nếu không tìm thấy thì tạo khách vãng lai ,còn nếu tìm thấy thì không làm gì cả (khong tạo mới)
                {
                    // Generate MaKH using the same KH<number> rule as KhachHangService
                    var existingKeys = await _context.KHACH_HANG
                        .AsNoTracking()
                        .Where(k => k.MaKH.StartsWith("KH"))
                        .Select(k => k.MaKH)
                        .ToListAsync();

                    var numericKeys = existingKeys // lọc chỉ lấy phần số
                        .Where(k => System.Text.RegularExpressions.Regex.IsMatch(k, "^KH\\d+$")) // bắt đầu với KH theo sau là số
                        .ToList();

                    int max = 0;
                    foreach (var key in numericKeys)
                    {
                        var suffix = key.Substring(2);
                        if (int.TryParse(suffix, out var n))
                        {
                            if (n > max) max = n;
                        }
                    }

                    string newMa;
                    int attempt = max + 1;
                    do
                    {
                        newMa = "KH" + attempt;
                        var exists2 = await _context.KHACH_HANG.AnyAsync(x => x.MaKH == newMa);
                        if (!exists2) break;
                        attempt++;
                    } while (true);

                    kh = new KHACH_HANG
                    {
                        MaKH = newMa,
                        HoTen = "Khách vãng lai",
                        DiaChi = string.Empty,
                        SDT = dto.SDT,
                        Email = string.Empty,
                        CongNo = 0m
                    };
                    _context.KHACH_HANG.Add(kh);
                    await _context.SaveChangesAsync();
                }
                maKH = kh.MaKH;
            }


            string? maNVValue = null; // nếu MaNV không hợp lệ thì để null
            if (!string.IsNullOrWhiteSpace(dto.MaNV)) // kiểm tra MaNV có tồn tại không
            {
                var nv = await _context.NHAN_VIEN.FindAsync(dto.MaNV); // tìm nhân viên
                if (nv != null) maNVValue = dto.MaNV; // nếu tìm thấy thì gán
            }

            // tạo mã hóa đơn
            var maHoaDon = $"HD-{DateTime.Now:yyyyMMddHHmmss}-{Guid.NewGuid().ToString("N").Substring(0,6)}"; // định dạng HD-yyyymmddHHMMSS-xxxxxx

            var hoaDon = new HOA_DON
            { // tạo hóa đơn
                MaHoaDon = maHoaDon,
                MaNV = maNVValue,
                MaKH = maKH ?? string.Empty // nếu maKH null thì để chuỗi rỗng
            };
            _context.HOA_DON.Add(hoaDon); // thêm vào context

            decimal total = 0m; // tổng tiền của hóa đơn

            foreach (var item in dto.Items) // duyệt qua từng mục trong đơn hàng
            {
                var sach = await _context.SACH.FirstOrDefaultAsync(s => s.MaSach == item.MaSach); // tìm sách theo MaSach
                if (sach == null) throw new InvalidOperationException($"Sách {item.MaSach} không tồn tại"); // nếu không tìm thấy thì lỗi
                if (sach.SoLuongTon < item.SoLuong) throw new InvalidOperationException($"Tồn kho không đủ cho {item.MaSach}"); // nếu tồn kho không đủ thì lỗi

                sach.SoLuongTon -= item.SoLuong; // cập nhật tồn kho
                _context.SACH.Update(sach); // lưu thay đổi tồn kho, hàm Update đánh dấu entity là đã thay đổi 

                
                    var cthd = new CHI_TIET_HOA_DON // tạo chi tiết hóa đơn
>>>>>>> origin/feature/api-hoadon-auth
                    {
                        MaHoaDon = maHoaDon,
                        MaSach = item.MaSach,
                        DonGiaBan = item.DonGia,
<<<<<<< HEAD
                        SoLuong = item.SoLuong,
                        
                        // [QUAN TRỌNG] Lưu đúng ngày hạch toán vào chi tiết
                        NgayLapHoaDon = ngayHachToan 
                    };
                    _context.CHI_TIET_HOA_DON.Add(cthd);

                    total += item.DonGia * item.SoLuong;
                }

                // 4. XỬ LÝ CÔNG NỢ & BÁO CÁO CÔNG NỢ (Chỉ khi mua Nợ)
                // [SỬA] Dùng IsDebt từ DTO
                if (dto.IsDebt && kh != null)
                {
                    // A. Snapshot nợ hiện tại (Dùng làm Nợ Đầu nếu cần thiết cho khách mới)
                    decimal noHienTaiSnapshot = kh.CongNo;

                    // B. Cộng nợ vào khách hàng
                    kh.CongNo += total;
                    _context.KHACH_HANG.Update(kh);

                    // C. Cập nhật Báo Cáo Công Nợ
                    // Dùng đúng Tháng/Năm của ngày hạch toán
                    string maBCCN = $"BCCN_{thang}_{nam}_{kh.MaKH}"; 

                    // 1. Tìm Local trước
                    var bccn = _context.BAO_CAO_CONG_NO.Local.FirstOrDefault(x => x.MaBCCN == maBCCN);

                    // 2. Tìm DB sau
                    if (bccn == null)
                    {
                        bccn = await _context.BAO_CAO_CONG_NO.FirstOrDefaultAsync(b => b.MaBCCN == maBCCN);
                    }

                    if (bccn == null)
                    {
                        // [LOGIC MỚI] Tìm báo cáo tháng gần nhất trong quá khứ để lấy số dư
                        var baoCaoCu = await _context.BAO_CAO_CONG_NO
                            .Where(b => b.MaKH == kh.MaKH && (b.Nam < nam || (b.Nam == nam && b.Thang < thang)))
                            .OrderByDescending(b => b.Nam).ThenByDescending(b => b.Thang)
                            .FirstOrDefaultAsync();

                        // Ưu tiên lấy Nợ Cuối tháng trước. Nếu khách mới tinh thì lấy snapshot hiện tại.
                        decimal noDau = baoCaoCu != null ? baoCaoCu.NoCuoi : noHienTaiSnapshot;

                        bccn = new BAO_CAO_CONG_NO
                        {
                            MaBCCN = maBCCN,
                            MaKH = kh.MaKH,
                            Thang = thang,
                            Nam = nam,
                            NoDau = noDau,
                            NoPhatSinh = total, // Mua nợ = Tăng phát sinh
                            TraNo = 0,
                            NoCuoi = noDau + total
                        };
                        _context.BAO_CAO_CONG_NO.Add(bccn);
                    }
                    else
                    {
                        // Đã có báo cáo tháng này -> Cộng dồn
                        bccn.NoPhatSinh += total;
                        bccn.NoCuoi += total;
                    }
                }

                // 5. LƯU & COMMIT TRANSACTION
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return (maHoaDon, total);
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
        
        // Hàm lấy chi tiết hóa đơn (Không đổi)
=======
                        NgayLapHoaDon = dto.At ?? DateTime.Now,
                        SoLuong = item.SoLuong
                    };
                _context.CHI_TIET_HOA_DON.Add(cthd);

                total += item.DonGia * item.SoLuong;
            }

            await _context.SaveChangesAsync();

            return (maHoaDon, total);
        }

>>>>>>> origin/feature/api-hoadon-auth
        public async Task<DoAnPhanMem.DTO.InvoiceDto?> GetInvoiceAsync(string maHoaDon)
        {
            var hd = await _context.HOA_DON.FindAsync(maHoaDon);
            if (hd == null) return null;
<<<<<<< HEAD
            // ... (Logic GetInvoiceAsync giữ nguyên) ...
            var items = await _context.CHI_TIET_HOA_DON.Where(c => c.MaHoaDon == maHoaDon)
                .Join(_context.SACH, c => c.MaSach, s => s.MaSach, (c, s) => new { c, s })
                .Join(_context.THE_LOAI, cs => cs.s.MaTL, tl => tl.MaTL, (cs, tl) => new DoAnPhanMem.DTO.InvoiceItemDto
                {
                    MaSach = cs.s.MaSach, TenSach = cs.s.TenSach, TenTL = tl.TenTL, SoLuong = cs.c.SoLuong, DonGia = cs.c.DonGiaBan
                }).ToListAsync();
            var total = items.Sum(i => i.DonGia * i.SoLuong);
            var ngayLap = await _context.CHI_TIET_HOA_DON.Where(c => c.MaHoaDon == maHoaDon).Select(c => c.NgayLapHoaDon).FirstOrDefaultAsync();
            return new DoAnPhanMem.DTO.InvoiceDto { MaHoaDon = maHoaDon, NgayLap = ngayLap == default ? DateTime.Now : ngayLap, Items = items, Total = total };
        }
    }
}
=======

            var items = await _context.CHI_TIET_HOA_DON
                .Where(c => c.MaHoaDon == maHoaDon)
                .Join(_context.SACH, c => c.MaSach, s => s.MaSach, (c, s) => new { c, s })
                .Join(_context.THE_LOAI, cs => cs.s.MaTL, tl => tl.MaTL, (cs, tl) => new DoAnPhanMem.DTO.InvoiceItemDto {
                    MaSach = cs.s.MaSach,
                    TenSach = cs.s.TenSach,
                    TenTL = tl.TenTL,
                    SoLuong = cs.c.SoLuong,
                    DonGia = cs.c.DonGiaBan
                })
                .ToListAsync();

            var total = items.Sum(i => i.DonGia * i.SoLuong);

            var ngayLap = await _context.CHI_TIET_HOA_DON
                .Where(c => c.MaHoaDon == maHoaDon)
                .Select(c => c.NgayLapHoaDon)
                .FirstOrDefaultAsync();

            var dto = new DoAnPhanMem.DTO.InvoiceDto
            {
                MaHoaDon = maHoaDon,
                NgayLap = ngayLap == default ? System.DateTime.Now : ngayLap,
                Items = items,
                Total = total
            };

            return dto;
        }
    }
}
>>>>>>> origin/feature/api-hoadon-auth
*/

using System;
using System.Linq;
using System.Threading.Tasks;
using DoAnPhanMem.Data;
using DoAnPhanMem.DTO;
using DoAnPhanMem.Services.Interfaces;
using DoAnPhanMem.Models;
using Microsoft.EntityFrameworkCore;

namespace DoAnPhanMem.Services.Implementations
{
    public class SaleService : ISaleService
    {
        private readonly DataContext _context;

        public SaleService(DataContext context)
        {
            _context = context;
        }

        public async Task<(string MaHoaDon, decimal Total)> CreateSaleAsync(CompleteSaleDto dto)
        {
            if (dto.Items == null || !dto.Items.Any()) throw new ArgumentException("Danh sách sản phẩm rỗng");

            // =================================================================================
            // 1. CHỐT NGÀY HẠCH TOÁN (ACCOUNTING DATE)
            // =================================================================================
            // Dùng ngày Client gửi lên hoặc mặc định hiện tại. 
            // Ngày này sẽ được dùng cho cả Hóa đơn và Chi tiết.
            DateTime ngayHachToan = dto.At ?? DateTime.Now;

            // =================================================================================
            // 2. XỬ LÝ KHÁCH HÀNG (Logic từ HEAD - Chặt chẽ hơn)
            // =================================================================================
            KHACH_HANG kh = null;
            string maKH = null;

            if (!string.IsNullOrWhiteSpace(dto.SDT))
            {
                kh = await _context.KHACH_HANG.FirstOrDefaultAsync(k => k.SDT == dto.SDT);

                // Nếu chưa có khách hàng -> Tạo mới (Khách vãng lai)
                if (kh == null)
                {
                    // Nếu khách mới mà đòi ghi nợ ngay -> Chặn (Logic nghiệp vụ an toàn)
                    if (dto.IsDebt) throw new InvalidOperationException("Khách vãng lai (mới) không được phép ghi nợ!");

                    // Logic tự sinh mã KH (KH001, KH002...)
                    var existingKeys = await _context.KHACH_HANG.AsNoTracking()
                        .Where(k => k.MaKH.StartsWith("KH"))
                        .Select(k => k.MaKH).ToListAsync();

                    var numericKeys = existingKeys
                        .Where(k => System.Text.RegularExpressions.Regex.IsMatch(k, "^KH\\d+$")).ToList();

                    int max = 0;
                    foreach (var key in numericKeys)
                    {
                        if (int.TryParse(key.Substring(2), out var n) && n > max) max = n;
                    }

                    string newMa;
                    int attempt = max + 1;
                    do
                    {
                        newMa = "KH" + attempt;
                        if (!await _context.KHACH_HANG.AnyAsync(x => x.MaKH == newMa)) break;
                        attempt++;
                    } while (true);

                    kh = new KHACH_HANG
                    {
                        MaKH = newMa,
                        HoTen = "Khách vãng lai",
                        SDT = dto.SDT,
                        CongNo = 0m,
                        DiaChi = "",
                        Email = ""
                    };
                    _context.KHACH_HANG.Add(kh);
                    await _context.SaveChangesAsync();
                }
                maKH = kh.MaKH;
            }
            else
            {
                // Nếu mua nợ mà không có thông tin khách -> Chặn
                if (dto.IsDebt) throw new InvalidOperationException("Cần thông tin khách hàng để ghi nợ!");
            }

            // =================================================================================
            // 3. TẠO HÓA ĐƠN (HEADER)
            // =================================================================================
            var maHoaDon = $"HD-{ngayHachToan:yyyyMMddHHmmss}-{Guid.NewGuid().ToString("N").Substring(0, 6)}";

            var hoaDon = new HOA_DON
            {
                MaHoaDon = maHoaDon,
                MaNV = dto.MaNV,
                MaKH = maKH ?? "" // Nếu khách lẻ không lưu tên
            };
            _context.HOA_DON.Add(hoaDon);

            decimal total = 0m;

            // =================================================================================
            // 4. DUYỆT SẢN PHẨM -> CẬP NHẬT KHO (SACH) & TẠO CHI TIẾT
            // =================================================================================
            // Lưu ý: Không cập nhật Báo Cáo Tồn ở đây vì Controller đã gọi Service riêng rồi.

            foreach (var item in dto.Items)
            {
                var sach = await _context.SACH.FirstOrDefaultAsync(s => s.MaSach == item.MaSach);
                if (sach == null) throw new InvalidOperationException($"Sách {item.MaSach} không tồn tại");
                if (sach.SoLuongTon < item.SoLuong) throw new InvalidOperationException($"Tồn kho không đủ cho {item.MaSach}");

                // Trừ kho thực tế
                sach.SoLuongTon -= item.SoLuong;
                _context.SACH.Update(sach);

                var cthd = new CHI_TIET_HOA_DON
                {
                    MaHoaDon = maHoaDon,
                    MaSach = item.MaSach,
                    DonGiaBan = item.DonGia,
                    SoLuong = item.SoLuong,
                    // Lưu đúng ngày hạch toán
                    NgayLapHoaDon = ngayHachToan
                };
                _context.CHI_TIET_HOA_DON.Add(cthd);

                total += item.DonGia * item.SoLuong;
            }

            // Lưu thay đổi vào DB (Bao gồm Khách mới, Hóa đơn, Chi tiết, Cập nhật kho Sách)
            await _context.SaveChangesAsync();

            // Trả về kết quả để Controller tiếp tục xử lý Báo cáo & Công nợ
            return (maHoaDon, total);
        }

        public async Task<DoAnPhanMem.DTO.InvoiceDto?> GetInvoiceAsync(string maHoaDon)
        {
            var hd = await _context.HOA_DON.FindAsync(maHoaDon);
            if (hd == null) return null;

            var items = await _context.CHI_TIET_HOA_DON
                .Where(c => c.MaHoaDon == maHoaDon)
                .Join(_context.SACH, c => c.MaSach, s => s.MaSach, (c, s) => new { c, s })
                .Join(_context.THE_LOAI, cs => cs.s.MaTL, tl => tl.MaTL, (cs, tl) => new DoAnPhanMem.DTO.InvoiceItemDto
                {
                    MaSach = cs.s.MaSach,
                    TenSach = cs.s.TenSach,
                    TenTL = tl.TenTL,
                    SoLuong = cs.c.SoLuong,
                    DonGia = cs.c.DonGiaBan
                })
                .ToListAsync();

            var total = items.Sum(i => i.DonGia * i.SoLuong);

            var ngayLap = await _context.CHI_TIET_HOA_DON
                .Where(c => c.MaHoaDon == maHoaDon)
                .Select(c => c.NgayLapHoaDon)
                .FirstOrDefaultAsync();

            var dto = new DoAnPhanMem.DTO.InvoiceDto
            {
                MaHoaDon = maHoaDon,
                NgayLap = ngayLap == default ? System.DateTime.Now : ngayLap,
                Items = items,
                Total = total
            };

            return dto;
        }
    }
}