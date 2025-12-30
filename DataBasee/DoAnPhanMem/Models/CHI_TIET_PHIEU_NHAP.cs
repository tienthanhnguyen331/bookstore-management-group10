using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace DoAnPhanMem.Models
{
    public class CHI_TIET_PHIEU_NHAP
    {
        
        [StringLength(100)]
        public string MaPhieu { get; set; }
        [ForeignKey("MaPhieu")]
        public PHIEU_NHAP_SACH PhieuNhapSach { get; set; }

        
        [StringLength(100)]
        public string MaSach { get; set; }
        [ForeignKey("MaSach")]
        public SACH Sach { get; set; }
        public DateTime NgayNhap { get; set; }
        public int SoLuongNhap { get; set; }
        [Column(TypeName = "decimal(18, 0)")]
        public decimal Gia { get; set; }

    }
}