using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace DoAnPhanMem.Models
{
    public class TAC_GIA
    {
        [Key]
        [StringLength(100)]
        public string MaTG { get; set; }

        [Required] //Bắt buộc phải có dữ liệu không để trống
        [StringLength(100)]
        public string TenTG { get; set; }

        public ICollection<SACH_TAC_GIA> SachTacGia { get; set; }

    }
}
