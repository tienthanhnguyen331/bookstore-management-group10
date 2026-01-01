using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace DoAnPhanMem.Models
{
    public class BAO_CAO_TON
    {
        [Key]
        [StringLength(100)]
        public string MaBCT { get; set; }
        [StringLength(100)]
        public string MaSach { get; set; } 

        [ForeignKey("MaSach")]
        public SACH Sach { get; set; }

        [StringLength(100)]
        public int Thang { get; set; }
        public int Nam { get; set; }

       
        public int TonDau { get; set; }
       
        public int PhatSinh { get; set; }


        public int DaBan { get; set; } //Thêm cột ghi nhận số lượng sách đã bán
      

        public int TonCuoi { get; set; }

        

    
    }
}
