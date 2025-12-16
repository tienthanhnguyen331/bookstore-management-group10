using DoAnPhanMem.DTO;

using System.Threading.Tasks;

namespace DoAnPhanMem.Services.Interfaces
{
    // LƯU Ý: Phải là 'interface', KHÔNG ĐƯỢC để là 'class'
    public interface IQuyDinhService
    {
        // 1. Không dùng từ khóa 'async' ở đây
        // 2. Kết thúc bằng dấu chấm phẩy ';' (không có ngoặc nhọn {})
        Task<bool> UpdateQuyDinhAsync(QuyDinhUpdateDto request);
    }
}