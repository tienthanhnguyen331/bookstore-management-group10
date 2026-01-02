/*using System.Threading.Tasks;
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
}*/

using System;
using System.Threading.Tasks;
using DoAnPhanMem.DTO;
using DoAnPhanMem.Services.Interfaces;
using Microsoft.AspNetCore.Authorization; // Thư viện phân quyền
using Microsoft.AspNetCore.Mvc;

namespace DoAnPhanMem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // 🔥 QUAN TRỌNG: Chỉ Admin mới được vào đây. 
    // Nếu bạn đang test mà chưa có Token Admin, hãy tạm comment dòng dưới lại.
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        // API: POST api/Admin/create-employee
        [HttpPost("create-employee")]
        public async Task<IActionResult> CreateEmployee([FromBody] EmployeeCreateDto request)
        {
            try
            {
                // Gọi Service để xử lý logic
                await _adminService.CreateEmployeeAsync(request);

                return Ok(new
                {
                    message = "Tạo nhân viên thành công!",
                    note = "Mật khẩu mặc định là: 1. Vui lòng yêu cầu nhân viên đổi mật khẩu khi đăng nhập lần đầu."
                });
            }
            catch (Exception ex)
            {
                // Bắt lỗi chi tiết để dễ debug
                var errorMsg = ex.Message;
                if (ex.InnerException != null)
                {
                    errorMsg += " | CHI TIẾT LỖI DB: " + ex.InnerException.Message;
                }
                return BadRequest(new { message = errorMsg });
            }
        }

        // GET: api/Admin/employees
        [HttpGet("employees")]
        public async Task<IActionResult> GetAllEmployees()
        {
            var result = await _adminService.GetAllNhanVienAsync();
            return Ok(result);
        }
    }
}