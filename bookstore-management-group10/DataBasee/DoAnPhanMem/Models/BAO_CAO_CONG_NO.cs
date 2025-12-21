using System; 
using System.Collections.Generic; 
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; 
using System.Text.Json.Serialization; 
namespace DoAnPhanMem.Models
{
    public class BAO_CAO_CONG_NO
    {
        [Key]
        [StringLength(100)]
        public string MaBCCN { get; set; }
        [StringLength(100)]
        public int Thang {  get; set; }
        public int Nam {  get; set; }
        [Column(TypeName = "decimal(18, 0)")]
        public decimal NoDau {  get; set; }
        [Column(TypeName = "decimal(18, 0)")]
        public decimal NoPhatSinh { get; set;}
        [Column(TypeName = "decimal(18, 0)")]
        public decimal NoCuoi { get; set; }
        [StringLength(100)]
        public string MaKH { get; set;}
        [ForeignKey("MaKH")]
        public KHACH_HANG KhachHang { get; set; }

    }
}
