
﻿using System;


namespace DoAnPhanMem.DTO
{
    public class CustomerDto
    {
        public string MaKH { get; set; } = null!;
        public string? HoTen { get; set; }
        public string? Email { get; set; }
        public string? DiaChi { get; set; }
        public string? SDT { get; set; }
        // CongNo intentionally omitted for list view
    }
}
