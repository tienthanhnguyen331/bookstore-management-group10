using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;


namespace DoAnPhanMem.Models
{
    public class TAI_KHOAN
    {
        [Key]
        [StringLength(100)]
        public string TenDangNhap {  get; set; }
        [StringLength(100)]
        public string MatKhau {  get; set; }

        
        public NHAN_VIEN NhanVien { get; set; }

    }
}
