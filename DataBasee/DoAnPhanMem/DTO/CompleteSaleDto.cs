/*
﻿using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace DoAnPhanMem.DTO
{
    public class CompleteSaleDto
    {
        public string MaNV { get; set; }
        public string? SDT { get; set; }
<<<<<<< HEAD
        public System.DateTime? At { get; set; }
        [JsonPropertyName("DanhSachSanPham")]
        public List<SaleItemDto> Items { get; set; }
        public bool IsDebt { get; set; }
=======
        public System.DateTime? At { get; set; } // lấy thời gian hiện tại nếu null
        public List<SaleItemDto> Items { get; set; }
>>>>>>> origin/feature/api-hoadon-auth
    }
}
*/

using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace DoAnPhanMem.DTO
{
    public class CompleteSaleDto
    {
        public string MaNV { get; set; }
        public string? SDT { get; set; }

        // Giữ lại comment giải thích cho dễ hiểu
        public System.DateTime? At { get; set; } // Lấy thời gian hiện tại nếu null

        // QUAN TRỌNG: Giữ cái này để map đúng JSON từ Frontend
        [JsonPropertyName("DanhSachSanPham")]
        public List<SaleItemDto> Items { get; set; }

        // Giữ lại để dùng cho logic phân loại nợ
        public bool IsDebt { get; set; }
    }
}