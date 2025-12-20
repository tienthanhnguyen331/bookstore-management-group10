using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
namespace DoAnPhanMem.Models
{
    public class KHACH_HANG
    {
        [Key]
        [StringLength(100)]
        public string MaKH { get; set; }
        [StringLength(100)]
        public string HoTen { get; set; }
        [StringLength(100)]
        public string DiaChi { get; set; }
        [StringLength(100)]
        public string SDT { get; set; }
        [StringLength(100)]
        public string Email {  get; set; }
        [Column(TypeName = "decimal(18, 0)")]
        public decimal CongNo { get; set; }

     
        public ICollection <HOA_DON> HoaDon { get; set; }
        public ICollection<PHIEU_THU_TIEN> PhieuThuTien { get; set; }
        public ICollection<BAO_CAO_CONG_NO> BaoCaoCongNo { get; set; }

    }
}
