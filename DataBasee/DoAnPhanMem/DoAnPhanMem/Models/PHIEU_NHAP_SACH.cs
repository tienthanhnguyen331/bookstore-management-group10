using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace DoAnPhanMem.Models
{
    public class PHIEU_NHAP_SACH
    {
        [Key]
        [StringLength(100)]
        public string MaPhieu { get; set; }
        [StringLength(100)]
        public string MaNV { get; set;}
        [ForeignKey("MaNV")]
        public NHAN_VIEN NhanVien { get; set; }
         public ICollection<CHI_TIET_PHIEU_NHAP> ChiTietPhieuNhap { get; set; }

    }
}
