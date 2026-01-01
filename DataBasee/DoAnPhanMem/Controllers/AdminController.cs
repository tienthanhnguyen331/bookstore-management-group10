using System.Threading.Tasks;
using DoAnPhanMem.DTO;
using DoAnPhanMem.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;

namespace DoAnPhanMem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // [Authorize(Roles = "Admin")] // Mở ra khi đã có token admin
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpPost("create-employee")]
        public async Task<IActionResult> CreateEmployee([FromBody] EmployeeCreateDto request)
        {
            try
            {
                await _adminService.CreateEmployeeAsync(request);
                return Ok(new { message = "Tạo nhân viên thành công!", maNV = "Tự động sinh", defaultPassword = "1" });
            }
            catch (Exception ex)
            {
                // Logic bắt lỗi chi tiết Database
                var errorMsg = ex.Message;
                if (ex.InnerException != null)
                {
                    errorMsg += " | CHI TIẾT LỖI DB: " + ex.InnerException.Message;
                }
                return BadRequest(new { message = errorMsg });
            }
        }
    }
}