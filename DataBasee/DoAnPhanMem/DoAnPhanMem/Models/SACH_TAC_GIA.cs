using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace DoAnPhanMem.Models
{
    public class SACH_TAC_GIA
    {
       
        [StringLength(100)]
        public string MaSach { get; set; }
        [ForeignKey("MaSach")]
        public SACH Sach { get; set; }
       
        [StringLength(100)]
        public string MaTG { get; set; }
        [ForeignKey("MaTG")]
        public TAC_GIA TacGia { get; set; }
    }
}
