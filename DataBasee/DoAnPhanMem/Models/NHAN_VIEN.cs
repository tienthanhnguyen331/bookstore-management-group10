using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace DoAnPhanMem.Models
{
    public class NHAN_VIEN
    {
        [Key]
        [StringLength (100)]    
        public string MaNV {  get; set; }
        [StringLength(100)]
        public string HoTen { get; set; }
        [StringLength(100)]

        public string? DiaChi { get; set; }
        [StringLength(100)]
        public string? SDT { get; set; }
        [StringLength (100)]
        public string? Email { get; set; }

        [StringLength (100)]
        public string ChucVu { get; set; }
        public ICollection<PHIEU_NHAP_SACH> PhieuNhapSach { get; set; }
        public ICollection<HOA_DON> HoaDon { get; set; }
        public ICollection<PHIEU_THU_TIEN> PhieuThuTien { get; set; }
        public ICollection<QUY_DINH> QuyDinh {  get; set; }
        [StringLength(100)]
        public string TenDangNhap { get; set; }
        [ForeignKey("TenDangNhap")]
        public TAI_KHOAN TaiKhoan { get; set; }

    }
}
