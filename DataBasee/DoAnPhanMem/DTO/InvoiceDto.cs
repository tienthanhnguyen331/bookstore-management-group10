using System;
using System.Collections.Generic;

namespace DoAnPhanMem.DTO
{
    public class InvoiceDto
    {
        public string MaHoaDon { get; set; }
        public DateTime NgayLap { get; set; }
        public List<InvoiceItemDto> Items { get; set; }
        public decimal Total { get; set; }
    }
}
