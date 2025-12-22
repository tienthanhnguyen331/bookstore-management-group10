using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
namespace DoAnPhanMem.Models
{
    public class THE_LOAI
    {
        [Key]
        [StringLength(100)]
        public  string MaTL { get; set; }

        [Required]
        [StringLength(100)]
        public string TenTL { get; set; }

        public ICollection<SACH> Sach { get; set; }

    }
}
