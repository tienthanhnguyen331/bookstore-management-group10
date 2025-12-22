using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace DoAnPhanMem.Models
{
   
    public class CHI_TIET_HOA_DON
    {
       
       
        [StringLength(100)]
        public string MaHoaDon { get; set; }

        [ForeignKey("MaHoaDon")]
        public HOA_DON HoaDon { get; set; }

       
        [StringLength(100)]
        public string MaSach { get; set; }

        [ForeignKey("MaSach")]
        public SACH Sach { get; set; }

       
        public int SoLuong { get; set; } 

        [Column(TypeName = "decimal(18, 0)")]
        public decimal DonGiaBan { get; set; } 
        public decimal ThanhTien { get; set; }
        public DateTime NgayLapHoaDon { get; set; }

    }
}

