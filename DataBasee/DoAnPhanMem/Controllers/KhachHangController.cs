
using Microsoft.AspNetCore.Mvc;

using Microsoft.EntityFrameworkCore;
using DoAnPhanMem.Data;
using DoAnPhanMem.Models;
using DoAnPhanMem.DTO;
using DoAnPhanMem.Services.Implementations;
using DoAnPhanMem.Services.Interfaces;
namespace DoAnPhanMem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KhachHangController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IKhachHangService _khService;

        public KhachHangController(DataContext context, IKhachHangService khachHangService)
        {
            _context = context;
            _khService = khachHangService;
        }


        // API Lấy danh sách tất cả khách hàng -->OK

        // GET: api/KhachHang
        [HttpGet]
        public async Task<IActionResult> GetAllCustomers()
        {
            var customers = await _khService.GetAllAsync();
            return Ok(customers);
        }


        // API Lấy thông tin khách hàng theo MaKH
        // GET: api/KhachHang/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var dto = await _khService.GetByIdAsync(id);
            if (dto == null) return NotFound();
            return Ok(dto);
        }






        // API Tạo khách hàng mới -->OK

        // POST: api/KhachHang
        [HttpPost]
        //Danh sách các mã trạng thái có thể trả về
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<IActionResult> CreateCustomer([FromBody] DoAnPhanMem.DTO.CreateCustomerDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var created = await _khService.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = created.MaKH }, created);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                // Return inner exception message as well for debugging (remove in production)
                return BadRequest(new { message = ex.Message, detail = ex.InnerException?.Message });
            }
        }
        [HttpGet("by-sdt/{sdt}")] // API Lấy thông tin khách hàng theo số điện thoại
        [ProducesResponseType(StatusCodes.Status200OK)] // Thành công
        [ProducesResponseType(StatusCodes.Status404NotFound)]// Không tìm thấy
        public async Task<IActionResult> GetByPhone(string sdt)// GET: api/KhachHang/by-sdt/{sdt}
        {
            if (string.IsNullOrWhiteSpace(sdt)) return BadRequest("SDT is required"); // Kiểm tra đầu vào

            var dto = await _khService.GetByPhoneAsync(sdt); // Gọi service lấy dữ liệu
            if (dto == null) return NotFound(); // Nếu không tìm thấy trả về 404
            return Ok(dto); // Trả về dữ liệu khách hàng
        }


        [HttpPut("update-info/{id}")] // API dạng PUT: api/customer/update-info/5
        public async Task<IActionResult> UpdateCustomerInfo(string id, [FromBody] UpdateCustomerDto request)
        {
            // 1. Tìm khách hàng trong database theo ID
            var customer = await _context.KHACH_HANG.FindAsync(id);

            // 2. Nếu không tìm thấy thì báo lỗi 404
            if (customer == null)
            {
                return NotFound("Không tìm thấy khách hàng này!");
            }

            // 2.1: Kiểm tra số điện thoại trùng. Để đảm bảo nợ ai người nấy trả
            var isDuplicatePhoneNumber = await _context.KHACH_HANG.AnyAsync(k => k.SDT == request.SDT &&  k.MaKH != id);
            if(isDuplicatePhoneNumber)
            {
                return BadRequest(new { message = "Số điện thoại này đã được sử dụng bởi khách hàng khác!" });
            }


            // 3. Cập nhật thông tin mới từ form vào database
            customer.HoTen = request.HoTen;     
            customer.Email = request.Email;          
            customer.SDT = request.SDT; 
            customer.DiaChi = request.DiaChi;       

            // 4. Lưu thay đổi
            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "Cập nhật thành công!", data = customer });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Lỗi khi lưu dữ liệu: " + ex.Message);
            }
        }

    }
}

