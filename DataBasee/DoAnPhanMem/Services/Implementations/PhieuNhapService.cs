
﻿
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
                // 1. SINH MÃ PHIẾU NHẬP
                var lastPhieu = await _context.PHIEU_NHAP_SACH
                    .Where(x => x.MaPhieu.StartsWith("PN"))
                    .OrderByDescending(x => x.MaPhieu)
                    .FirstOrDefaultAsync();

                string newMaPhieu = "PN001";
                if (lastPhieu != null)
                {
                    string numberPart = lastPhieu.MaPhieu.Substring(2);
                    if (int.TryParse(numberPart, out int number))
                    {
                        newMaPhieu = "PN" + (number + 1).ToString("D3");
                    }
                }

                // 2. TẠO HEADER PHIẾU NHẬP
                var phieuNhap = new PHIEU_NHAP_SACH
                {
                    MaPhieu = newMaPhieu,
                    MaNV = "NV01" // Hoặc lấy từ User Context
                };

                _context.PHIEU_NHAP_SACH.Add(phieuNhap);
                await _context.SaveChangesAsync(); // Lưu header để tạo khóa ngoại

                // 3. DUYỆT CHI TIẾT & CẬP NHẬT KHO + BÁO CÁO
                foreach (var item in request.DanhSachSach)
                {
                    // A. Kiểm tra sách tồn tại
                    var sach = await _context.SACH.FindAsync(item.MaSach);
                    if (sach == null) throw new Exception($"Sách {item.MaSach} không tồn tại.");

                    // B. Check Rule (Quy định nhập)
                    _ruleService.CheckRule_NhapSach(item.SoLuong, sach.SoLuongTon);

                    // C. Tạo chi tiết phiếu nhập
                    var chiTiet = new CHI_TIET_PHIEU_NHAP
                    {
                        MaPhieu = phieuNhap.MaPhieu,
                        MaSach = item.MaSach,
                        SoLuongNhap = item.SoLuong,
                        Gia = item.DonGiaNhap,
                        NgayNhap = request.NgayNhap
                    };
                    _context.CHI_TIET_PHIEU_NHAP.Add(chiTiet);

                    // [MỚI] LOGIC CẬP NHẬT BÁO CÁO TỒN 🔥
                    int thang = request.NgayNhap.Month;
                    int nam = request.NgayNhap.Year;

                    // Tạo mã BCT chuẩn: BCT_Nam_Thang_MaSach (Thêm Năm để tránh trùng)
                    string currentMaBCT = $"BCT_{nam}_{thang}_{item.MaSach}";

                    // BƯỚC 1: Tìm trong BỘ NHỚ LOCAL trước
                    var baoCao = _context.BAO_CAO_TON.Local
                        .FirstOrDefault(x => x.MaBCT == currentMaBCT);

                    // BƯỚC 2: Nếu bộ nhớ chưa có, mới tìm dưới DATABASE
                    if (baoCao == null)
                    {
                        baoCao = await _context.BAO_CAO_TON
                            .FirstOrDefaultAsync(bc => bc.MaBCT == currentMaBCT);
                    }

                    if (baoCao != null)
                    {
                        // TRƯỜNG HỢP 1: Đã có báo cáo tháng này -> Cộng dồn
                        baoCao.PhatSinh += item.SoLuong;
                        baoCao.TonCuoi += item.SoLuong;
                    }
                    else
                    {
                        // TRƯỜNG HỢP 2: Chưa có -> Tạo mới
                        var newBaoCao = new BAO_CAO_TON
                        {
                            MaBCT = currentMaBCT,
                            MaSach = item.MaSach,
                            Thang = thang,
                            Nam = nam,
                            TonDau = sach.SoLuongTon, // Lấy tồn hiện tại làm tồn đầu
                            PhatSinh = item.SoLuong,
                            DaBan = 0, // Mặc định là 0 khi tạo mới từ phiếu nhập
                            TonCuoi = sach.SoLuongTon + item.SoLuong
                        };

                        _context.BAO_CAO_TON.Add(newBaoCao);
                    }

                    // D. Cập nhật kho tổng (Sách)
                    sach.SoLuongTon += item.SoLuong;
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return true;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();

                // Hiển thị lỗi chi tiết hơn nếu có InnerException
                string msg = ex.Message;
                if (ex.InnerException != null) msg += " | Chi tiết: " + ex.InnerException.Message;

                throw new Exception(msg);
            }
        }
    }

}