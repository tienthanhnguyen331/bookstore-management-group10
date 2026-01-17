namespace DoAnPhanMem.DTO
{
    public class QuyDinhUpdateDto
    {
        // Nhận đúng 5 tham số từ JSON Frontend
        public int MinImportQuantity { get; set; }   // Số lượng nhập tối thiểu
        public int MinStockPreImport { get; set; }   // Tồn tối thiểu trước nhập
        public int MinStockPostSell { get; set; }    // Tồn tối thiểu sau bán
        public decimal MaxDebt { get; set; }         // Nợ tối đa
        public bool CheckDebtRule { get; set; }      // Có kiểm tra quy định thu tiền không
    }
}
