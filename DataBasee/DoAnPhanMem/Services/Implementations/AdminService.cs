using System;
using System.Linq;
using System.Threading.Tasks;
using DoAnPhanMem.Data;
using DoAnPhanMem.DTO;
using DoAnPhanMem.Models;
using DoAnPhanMem.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net; // Thư viện mã hóa mật khẩu

namespace DoAnPhanMem.Services.Implementations
{
    public class AdminService : IAdminService
    {
        private readonly DataContext _context;

        public AdminService(DataContext context)
        {
            _context = context;
        }

        public async Task<bool> CreateEmployeeAsync(EmployeeCreateDto request)
        {
            // 1. Kiểm tra trùng Tên Đăng Nhập
            if (await _context.TAI_KHOAN.AnyAsync(x => x.TenDangNhap == request.TenDangNhap))
            {
                throw new Exception($"Tên đăng nhập '{request.TenDangNhap}' đã tồn tại.");
            }

            // Dùng Transaction để đảm bảo tính toàn vẹn (thêm cả 2 bảng hoặc không thêm gì cả)
            using var transaction = _context.Database.BeginTransaction();
            try
            {
                // ========================================================
                // BƯỚC 1: TẠO TÀI KHOẢN TRƯỚC (Để có TenDangNhap tham chiếu)
                // ========================================================

                // Mặc định mật khẩu là "1"
                string defaultPassword = "1";
                string passwordHash = BCrypt.Net.BCrypt.HashPassword(defaultPassword);

                var newAccount = new TAI_KHOAN
                {
                    TenDangNhap = request.TenDangNhap,
                    MatKhau = passwordHash
                    // Nếu bảng TAI_KHOAN của bạn có cột LoaiTaiKhoan/ChucVu thì gán thêm ở đây
                };

                _context.TAI_KHOAN.Add(newAccount);
                await _context.SaveChangesAsync(); // Lưu ngay để TenDangNhap tồn tại trong DB

                // ========================================================
                // BƯỚC 2: SINH MÃ NHÂN VIÊN TỰ ĐỘNG (NV01, NV02...)
                // ========================================================
                var lastNV = await _context.NHAN_VIEN
                    .OrderByDescending(x => x.MaNV)
                    .FirstOrDefaultAsync();

                string newMaNV = "NV01";
                if (lastNV != null)
                {
                    // Lấy phần số từ mã cũ (VD: NV05 -> lấy 05)
                    string numberPart = lastNV.MaNV.Substring(2);
                    if (int.TryParse(numberPart, out int number))
                    {
                        newMaNV = "NV" + (number + 1).ToString("D2"); // Tăng lên 1 và format 2 chữ số
                    }
                }

                // ========================================================
                // BƯỚC 3: TẠO NHÂN VIÊN VÀ LIÊN KẾT VỚI TÀI KHOẢN
                // ========================================================
                var newEmployee = new NHAN_VIEN
                {
                    MaNV = newMaNV,
                    HoTen = request.HoTen,
                    ChucVu = request.ChucVu,
                    TenDangNhap = request.TenDangNhap, // Khóa ngoại trỏ về bảng TAI_KHOAN

                    DiaChi = "",
                    SDT = "",
                    Email = ""


                };

                _context.NHAN_VIEN.Add(newEmployee);
                await _context.SaveChangesAsync();

                // Nếu chạy đến đây mà không lỗi thì Commit
                await transaction.CommitAsync();
                return true;
            }
            catch (Exception ex)
            {
                // Có lỗi thì hoàn tác mọi thứ
                await transaction.RollbackAsync();
                throw; // Ném lỗi ra cho Controller bắt
            }
        }

        public async Task<List<NhanVienResponseDto>> GetAllNhanVienAsync()
        {
            // Lấy dữ liệu từ bảng NHAN_VIEN và chuyển sang DTO
            var listNhanVien = await _context.NHAN_VIEN
                .Select(nv => new NhanVienResponseDto
                {
                    MaNV = nv.MaNV,
                    HoTen = nv.HoTen,
                    Username = nv.TenDangNhap, // Map cột TenDangNhap vào Username
                    SDT = nv.SDT,
                    Email = nv.Email,
                    ChucVu = nv.ChucVu
                })
                .OrderBy(nv => nv.MaNV) // Sắp xếp theo mã nhân viên cho đẹp
                .ToListAsync();

            return listNhanVien;
        }

        public async Task<bool> UpdateEmployeeAsync(string MaNV, UpdateEmployeeDto dto)
        {
            // Tìm nhân viên theo mã
            var nv = await _context.NHAN_VIEN.FindAsync(MaNV);
            if (nv == null) return false; // trả về false nếu không tìm thấy

            // Cập nhật thông tin
            nv.HoTen = dto.HoTen;
            nv.SDT = dto.SDT;
            nv.Email = dto.Email;
            nv.ChucVu = dto.ChucVu;

            // Lưu thay đổi
            await _context.SaveChangesAsync();
            return true;
        }

    }
}