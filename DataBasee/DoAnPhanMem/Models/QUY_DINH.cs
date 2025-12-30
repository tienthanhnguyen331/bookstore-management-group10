using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace DoAnPhanMem.Models
{
    public class QUY_DINH
    {
        [Key]
        [StringLength(100)]
        public string TenQuyDinh {  get; set; }
        [StringLength(100)]
        public string GiaTri {  get; set; }


        // Khóa ngoại chuẩn
        public string MaNV { get; set; }

        // --- QUAN TRỌNG: THÊM DÒNG NÀY ---
        [ForeignKey("MaNV")]
        public  NHAN_VIEN NhanVien { get; set; }



    }
}