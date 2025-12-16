using DoAnPhanMem.Data;
using DoAnPhanMem.DTO;
using DoAnPhanMem.Models;
using DoAnPhanMem.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace DoAnPhanMem.Services.Implementations
{
    public class QuyDinhService : IQuyDinhService
    {
        private readonly DataContext _context;

        public QuyDinhService(DataContext context)
        {
            _context = context;
        }

        // Hàm chính: Nhận DTO từ Controller gửi xuống
        public async Task<bool> UpdateQuyDinhAsync(QuyDinhUpdateDto request)
        {
            // Dùng Transaction để đảm bảo: 1 là sửa hết 5 cái, 2 là không sửa cái nào (nếu lỗi)
            using var transaction = _context.Database.BeginTransaction();
            try
            {
                // 1. Cập nhật Số lượng nhập tối thiểu
                await UpdateSingleRule("QD1_NhapToiThieu", request.MinImportQuantity.ToString());

                // 2. Cập nhật Tồn tối thiểu trước nhập
                await UpdateSingleRule("QD1_TonToiDaTruocNhap", request.MinStockPreImport.ToString());

                // 3. Cập nhật Tồn tối thiểu sau bán
                await UpdateSingleRule("QD2_TonToiThieuSauBan", request.MinStockPostSell.ToString());

                // 4. Cập nhật Số nợ tối đa
                // (Chuyển số tiền sang chuỗi, "0.##" để bỏ số 0 thừa nếu có)
                await UpdateSingleRule("QD2_NoToiDa", request.MaxDebt.ToString("0.##"));

                // 5. Cập nhật Có kiểm tra thu tiền không (Bool -> "1" hoặc "0")
                string boolValue = request.CheckDebtRule ? "1" : "0";
                await UpdateSingleRule("QD4_KiemTraTienThu", boolValue);

                // Lưu tất cả thay đổi vào Database
                await _context.SaveChangesAsync();

                // Chốt giao dịch
                await transaction.CommitAsync();
                return true;
            }
            catch (Exception ex)
            {
                // Có lỗi thì hoàn tác (Undo) lại như chưa sửa gì
                await transaction.RollbackAsync();
                Console.WriteLine("Lỗi Update Quy Định: " + ex.Message);
                return false;
            }
        }

        // ==========================================================
        // ĐÂY LÀ HÀM PHỤ (HELPER) BẠN CẦN
        // Nhiệm vụ: Tìm dòng quy định theo Tên -> Có thì sửa, Chưa có thì thêm
        // ==========================================================
        private async Task UpdateSingleRule(string keyName, string newValue)
        {
            // Tìm trong bảng QUY_DINH xem có dòng nào tên là keyName không (VD: QD1_NhapToiThieu)
            var quyDinh = await _context.QUY_DINH
                                .FirstOrDefaultAsync(x => x.TenQuyDinh == keyName);

            if (quyDinh != null)
            {
                // TRƯỜNG HỢP 1: Đã có trong DB -> Chỉ việc cập nhật giá trị mới
                quyDinh.GiaTri = newValue;
                _context.QUY_DINH.Update(quyDinh);
            }
            else
            {
                // TRƯỜNG HỢP 2: Chưa có (lần đầu chạy) -> Tạo mới dòng này
                var quyDinhMoi = new QUY_DINH
                {
                    TenQuyDinh = keyName,
                    GiaTri = newValue,
                    TrangThai = true // Mặc định là đang hoạt động
                    // Nếu bảng của bạn có cột MaNV, nhớ thêm vào đây (có thể để null hoặc fix cứng admin)
                };
                _context.QUY_DINH.Add(quyDinhMoi);
            }
        }
    }
}