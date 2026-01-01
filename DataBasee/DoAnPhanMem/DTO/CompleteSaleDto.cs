using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace DoAnPhanMem.DTO
{
    public class CompleteSaleDto
    {
        public string MaNV { get; set; }
        public string? SDT { get; set; }
        public System.DateTime? At { get; set; }
        [JsonPropertyName("DanhSachSanPham")]
        public List<SaleItemDto> Items { get; set; }
        public bool IsDebt { get; set; }
    }
}
