using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace DoAnPhanMem.Models
{
    public class SACH
    {
        [Key]
        [StringLength(100)]
        public string MaSach { get; set; }
        [StringLength(100)]
        public string TenSach { get; set; }
       
        public int SoLuongTon {  get; set; }
        [StringLength(100)]
        public string MaTL {  get; set; }
        [ForeignKey("MaTL")]

        public THE_LOAI TheLoai { get; set; }

        public ICollection<CHI_TIET_PHIEU_NHAP> ChiTietPhieuNhap { get; set; }
        public ICollection<BAO_CAO_TON> BaoCaoTon { get; set; }
        public ICollection<CHI_TIET_HOA_DON> ChiTietHoaDon { get; set; }

        public ICollection<SACH_TAC_GIA> SachTacGia { get; set; }

        

    }
}
