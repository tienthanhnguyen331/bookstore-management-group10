using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
namespace DoAnPhanMem.Models
{
    public class PHIEU_THU_TIEN
    {
        [Key]
        [StringLength(100)]
        public string MaPhieu { get; set; }
        public DateTime NgayThuTien { get; set; }
        [Column(TypeName = "decimal(18, 0)")]
        public decimal SoTienThu { get; set; }
        [StringLength(100)]
        public string? MaNV {  get; set; }
        [ForeignKey("MaNV")]
        [JsonIgnore]
        public NHAN_VIEN? NhanVien { get; set; }

        [StringLength(100)]
        public string MaKH {  get; set; }
        [ForeignKey("MaKH")]
        [JsonIgnore]
        public KHACH_HANG KhachHang { get; set; }



    }
}
