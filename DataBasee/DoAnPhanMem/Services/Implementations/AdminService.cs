using System;
using System.Linq;
using System.Threading.Tasks;
using DoAnPhanMem.Data;
using DoAnPhanMem.DTO;
using DoAnPhanMem.Models;
using DoAnPhanMem.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

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

            using var transaction = _context.Database.BeginTransaction();
            try
            {
                // ========================================================
                // BƯỚC 1: TẠO TÀI KHOẢN TRƯỚC
                // ========================================================

               /* string rawPassword = string.IsNullOrEmpty(request.MatKhau) ? "1" : request.MatKhau;*/

                var newAccount = new TAI_KHOAN
                {
                    TenDangNhap = request.TenDangNhap,
                    /*MatKhau = BCrypt.Net.BCrypt.HashPassword(rawPassword)*/
                    MatKhau=request.MatKhau,
                };

                _context.TAI_KHOAN.Add(newAccount);
                await _context.SaveChangesAsync();

                // ========================================================
                // BƯỚC 2: SINH MÃ NV TỰ ĐỘNG (NV01, NV02...)
                // ========================================================
                var lastNV = await _context.NHAN_VIEN
                    .OrderByDescending(x => x.MaNV)
                    .FirstOrDefaultAsync();

                string newMaNV = "NV01";
                if (lastNV != null)
                {
                    string numberPart = lastNV.MaNV.Substring(2);
                    if (int.TryParse(numberPart, out int number))
                    {
                        newMaNV = "NV" + (number + 1).ToString("D2");
                    }
                }

                // ========================================================
                // BƯỚC 3: TẠO NHÂN VIÊN (FIX LỖI NULL TẠI ĐÂY)
                // ========================================================
                var newEmployee = new NHAN_VIEN
                {
                    MaNV = newMaNV,
                    HoTen = request.HoTen,
                    ChucVu = request.ChucVu,
                    TenDangNhap = request.TenDangNhap,

                    // 🔥 FIX LỖI: Vì Database không cho phép NULL, ta điền chuỗi rỗng ""
                    // Nhân viên sẽ vào cập nhật lại sau.
                    DiaChi = "",
                    SDT = "",
                    Email = ""
                };

                _context.NHAN_VIEN.Add(newEmployee);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();
                return true;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
    }
}