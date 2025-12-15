using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DoAnPhanMem.Data;
using DoAnPhanMem.Models;
using DoAnPhanMem.DTO;

namespace DoAnPhanMem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuyDinhController : ControllerBase
    {
        private readonly DataContext _context;

        public QuyDinhController(DataContext context)
        {
            _context = context;
        }

        // 1. API Lấy danh sách tất cả quy định
        // GET: api/QuyDinh
        [HttpGet]
        public async Task<IActionResult> GetAllRules()
        {
            var rules = await _context.QUY_DINH.ToListAsync();
            return Ok(rules);
        }

        // 2. API Cập nhật quy định (Thực hiện QĐ6)
        // PUT: api/QuyDinh/QD2_NoToiDa
        [HttpPut("{key}")]
        public async Task<IActionResult> UpdateRule(string key, [FromBody] UpdateRuleDto input)
        {
            // Tìm quy định trong DB theo key (Ví dụ: "QD2_NoToiDa")
            var rule = await _context.QUY_DINH.FindAsync(key);

            if (rule == null)
            {
                return NotFound($"Không tìm thấy quy định có mã: {key}");
            }

            // Cập nhật giá trị mới
            rule.GiaTri = input.GiaTri;
            rule.TrangThai = input.TrangThai;

            // Lưu xuống Database
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Cập nhật quy định thành công!",
                data = rule
            });
        }
    }
}
