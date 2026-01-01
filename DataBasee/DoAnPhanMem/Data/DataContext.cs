using DoAnPhanMem.Models;
using Microsoft.EntityFrameworkCore;

namespace DoAnPhanMem.Data
{
    public class DataContext :DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) 
        { 

        }
        public DbSet<SACH> SACH { get; set; }
        public DbSet<THE_LOAI> THE_LOAI { get; set; }
        public DbSet<TAC_GIA> TAC_GIA { get; set; }
        public DbSet<NHAN_VIEN> NHAN_VIEN { get; set; }
        public DbSet<KHACH_HANG> KHACH_HANG { get; set; }
        public DbSet<TAI_KHOAN> TAI_KHOAN { get; set; }
        public DbSet<HOA_DON> HOA_DON { get; set; }
        public DbSet<CHI_TIET_HOA_DON> CHI_TIET_HOA_DON { get; set; }
        public DbSet<PHIEU_NHAP_SACH> PHIEU_NHAP_SACH { get; set; }
        public DbSet<CHI_TIET_PHIEU_NHAP> CHI_TIET_PHIEU_NHAP { get; set; }
        public DbSet<PHIEU_THU_TIEN> PHIEU_THU_TIEN { get; set; }
        public DbSet<BAO_CAO_TON> BAO_CAO_TON { get; set; }
        public DbSet<BAO_CAO_CONG_NO> BAO_CAO_CONG_NO { get; set; }
        public DbSet<QUY_DINH> QUY_DINH { get; set; }
        public DbSet<SACH_TAC_GIA> SACH_TAC_GIA { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<HOA_DON>()
                .HasOne(h => h.NhanVien)
                .WithMany(NV =>NV.HoaDon) 
                .HasForeignKey(h => h.MaNV)
                .OnDelete(DeleteBehavior.Restrict); 

            modelBuilder.Entity<HOA_DON>()
                .HasOne(h => h.KhachHang)
                .WithMany(KH => KH.HoaDon)
                .HasForeignKey(h => h.MaKH)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PHIEU_THU_TIEN>()
                .HasOne(p => p.NhanVien)
                .WithMany(NV => NV.PhieuThuTien)
                .HasForeignKey(p => p.MaNV)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PHIEU_THU_TIEN>()
                .HasOne(p => p.KhachHang)
                .WithMany(KH => KH.PhieuThuTien)
                .HasForeignKey(p => p.MaKH)
                .OnDelete(DeleteBehavior.Restrict);
          
            modelBuilder.Entity<CHI_TIET_PHIEU_NHAP>()
                .HasKey(ct => new { ct.MaPhieu, ct.MaSach });

            modelBuilder.Entity<CHI_TIET_HOA_DON>()
                .HasKey(ct => new { ct.MaHoaDon, ct.MaSach });
            modelBuilder.Entity<SACH_TAC_GIA>()
               .HasKey(ct => new { ct.MaSach, ct.MaTG });
          

            modelBuilder.Entity<SACH>(entity =>
            {
               
                // BỎ ràng buộc >= 150 và < 300 đi, vì đó là việc của Code check quy định
                entity.HasCheckConstraint("CK_SACH_SoLuongTon_Valid", "SoLuongTon >= 0");
                entity.Property(e => e.SoLuongTon).HasDefaultValue(0);
            });

            modelBuilder.Entity<KHACH_HANG>(entity =>
            {
                // BỎ ràng buộc <= 20000 đi để đáp ứng QĐ6 (Thay đổi quy định)
                entity.Property(e => e.CongNo).HasDefaultValue(0);
            });

            modelBuilder.Entity<CHI_TIET_HOA_DON>(entity =>
            {
                // Số lượng bán > 0 
                entity.HasCheckConstraint("CK_CTHD_SoLuong", "SoLuong > 0");
            });

            modelBuilder.Entity<PHIEU_THU_TIEN>(entity =>
            {
                // Tiền thu > 0 
                entity.HasCheckConstraint("CK_PTT_SoTien", "SoTienThu > 0");
            });

            modelBuilder.Entity<CHI_TIET_PHIEU_NHAP>(entity =>
                {
                    // Số lượng nhập > 0
                    entity.HasCheckConstraint("CK_CTPN_SoLuong", "SoLuongNhap > 0");
                });

           
        }
            
           
            
    }
}
