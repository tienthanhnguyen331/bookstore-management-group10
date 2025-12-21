using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace DoAnPhanMem.Models
{
    public class HOA_DON
    {
        [Key]
        [StringLength(100)]
        public string MaHoaDon {  get; set; }


        [StringLength(100)]
        public string? MaNV { get; set; }
        [ForeignKey("MaNV")]
        public NHAN_VIEN NhanVien { get; set; }


        [StringLength(100)]
        public string MaKH { get; set; }
        [ForeignKey("MaKH")]
        public KHACH_HANG KhachHang { get; set; }

        public ICollection<CHI_TIET_HOA_DON> ChiTietHoaDon { get; set; }

    }
}
