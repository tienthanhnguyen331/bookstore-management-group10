


using DoAnPhanMem.Data;
using DoAnPhanMem.DTO;
using DoAnPhanMem.Models;
using DoAnPhanMem.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DoAnPhanMem.Services.Implementations
{
    public class KhachHangService : IKhachHangService
    {
        private readonly DataContext _context;
        private readonly IRuleService _ruleService;

        public KhachHangService(DataContext context, IRuleService ruleService)
        {
            _context = context;
            _ruleService = ruleService;
        }

        public async Task<List<CustomerDto>> GetAllAsync()
        {
            return await _context.KHACH_HANG
                .AsNoTracking()
                .OrderBy(x => x.MaKH)
                .Select(x => new CustomerDto
                {
                    MaKH = x.MaKH,
                    HoTen = x.HoTen,
                    Email = x.Email,
                    DiaChi = x.DiaChi,
                    SDT = x.SDT
                })
                .ToListAsync();
        }

        public async Task<DoAnPhanMem.DTO.CustomerDetailDto?> GetByIdAsync(string id)
        {
            var x = await _context.KHACH_HANG.AsNoTracking()
                .Where(k => k.MaKH == id)
                .Select(k => new DoAnPhanMem.DTO.CustomerDetailDto
                {
                    MaKH = k.MaKH,
                    HoTen = k.HoTen,
                    Email = k.Email,
                    DiaChi = k.DiaChi,
                    SDT = k.SDT,
                    CongNo = k.CongNo
                })
                .FirstOrDefaultAsync();
            return x;
        }

        public async Task<CustomerDto> CreateAsync(DoAnPhanMem.DTO.CreateCustomerDto dto)
        {
            if (dto == null) throw new ArgumentNullException(nameof(dto));

            // Check trùng số điện thoại, đảm bảo nợ ai nấy trả
            bool isDuplicate = await _context.KHACH_HANG.AnyAsync(k => k.SDT == dto.SDT);
            if (isDuplicate)
            {
                throw new InvalidOperationException($"Số điện thoại {dto.SDT} đã tồn tại trong hệ thống!");
            }

            // Only accept basic customer info from client
            var hoTen = string.IsNullOrWhiteSpace(dto.HoTen) ? null : dto.HoTen.Trim();
            var email = string.IsNullOrWhiteSpace(dto.Email) ? null : dto.Email.Trim();
            var sdt = string.IsNullOrWhiteSpace(dto.SDT) ? null : dto.SDT.Trim();
            var diaChi = string.IsNullOrWhiteSpace(dto.DiaChi) ? null : dto.DiaChi.Trim();

            if (string.IsNullOrEmpty(hoTen) && string.IsNullOrEmpty(sdt) && string.IsNullOrEmpty(email))
            {
                throw new ArgumentException("Vui lòng cung cấp ít nhất họ tên, số điện thoại hoặc email để tạo khách hàng.");
            }

            // Generate a unique MaKH in the form KH1, KH2, ...
            var existingKeys = await _context.KHACH_HANG
                .AsNoTracking()
                .Where(k => k.MaKH.StartsWith("KH"))
                .Select(k => k.MaKH)
                .ToListAsync();

            // Chỉ lấy các mã đúng định dạng KH+ số (Hợp nhất code từ 2 nhánh tại đây)
            var numericKeys = existingKeys
                .Where(k => System.Text.RegularExpressions.Regex.IsMatch(k, "^KH\\d+$"))
                .ToList();

            int max = 0;
            foreach (var key in numericKeys) // lấy phần số trong MaKH
            {
                var suffix = key.Substring(2); // bỏ 'KH' lấy phần số
                if (int.TryParse(suffix, out var n)) // chuyển phần số sang int
                {
                    if (n > max) max = n; // tìm số lớn nhất để tạo mã mới
                }
            }

            string newMa; // mã khách hàng mới
            int attempt = max + 1; // bắt đầu từ số lớn nhất + 1
            do
            {
                newMa = "KH" + attempt;
                // in case of race conditions, ensure uniqueness by checking DB
                var exists = await _context.KHACH_HANG.AnyAsync(x => x.MaKH == newMa);
                if (!exists) break;
                attempt++;
            } while (true);

            var entity = new KHACH_HANG
            {
                MaKH = newMa,
                HoTen = hoTen,
                Email = email,
                DiaChi = diaChi,
                SDT = sdt,
                CongNo = 0m
            };

            _context.KHACH_HANG.Add(entity);
            await _context.SaveChangesAsync();

            return new CustomerDto
            {
                MaKH = entity.MaKH,
                HoTen = entity.HoTen,
                Email = entity.Email,
                DiaChi = entity.DiaChi,
                SDT = entity.SDT
            };
        }

        // Lấy thông tin khách hàng theo số điện thoại
        public async Task<CustomerDetailDto?> GetByPhoneAsync(string sdt)
        {
            if (string.IsNullOrWhiteSpace(sdt)) return null; // Nếu sdt rỗng thì không tìm
            sdt = sdt.Trim(); // Loại bỏ khoảng trắng thừa

            var entity = await _context.KHACH_HANG // Tìm trong DB
                .AsNoTracking() // Không theo dõi thay đổi
                .FirstOrDefaultAsync(x => x.SDT == sdt); // So sánh số điện thoại

            if (entity == null) return null; // Không tìm thấy khách hàng
            else // Tìm thấy khách hàng
            {
                return new CustomerDetailDto // Trả về DTO chi tiết
                {
                    MaKH = entity.MaKH,
                    HoTen = entity.HoTen,
                    Email = entity.Email,
                    DiaChi = entity.DiaChi,
                    SDT = entity.SDT,
                    CongNo = entity.CongNo
                };
            }
        }
    }
}
