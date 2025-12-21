using System.Collections.Generic;

namespace DoAnPhanMem.DTO
{
    public class CompleteSaleDto
    {
        public string MaNV { get; set; }
        public string? SDT { get; set; }
        public System.DateTime? At { get; set; }
        public List<SaleItemDto> Items { get; set; }
    }
}
