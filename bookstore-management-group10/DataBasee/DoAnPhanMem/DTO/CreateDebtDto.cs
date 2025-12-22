using System;

namespace DoAnPhanMem.DTO
{
    public class CreateDebtDto
    {
        public string SDT { get; set; }
        public decimal Amount { get; set; }
        public DateTime? At { get; set; }
    }
}
