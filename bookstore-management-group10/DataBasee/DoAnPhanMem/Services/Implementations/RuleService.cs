using DoAnPhanMem.Models;
using Microsoft.EntityFrameworkCore;
using System;
using DoAnPhanMem.Data;
using DoAnPhanMem.Services.Interfaces;

namespace DoAnPhanMem.Services.Implementations
{
    public class RuleService : IRuleService
    {
    private readonly DataContext _context;

    public RuleService(DataContext context)
    {
        _context = context;
    }

    public int GetIntRule(string key)
    {
        var rule = _context.QUY_DINH.Find(key);
        // Nếu không tìm thấy hoặc tắt quy định -> Trả về giá trị mặc định an toàn
        if (rule == null || !rule.TrangThai) return 0;
        return int.Parse(rule.GiaTri);
    }

    public decimal GetDecimalRule(string key)
    {
        var rule = _context.QUY_DINH.Find(key);
        if (rule == null || !rule.TrangThai) return 0;
        return decimal.Parse(rule.GiaTri);
    }

    public bool IsRuleEnabled(string key)
    {
        var rule = _context.QUY_DINH.Find(key);
        return rule != null && rule.TrangThai && rule.GiaTri == "1";
    }


    // QĐ1: Kiểm tra khi nhập sách
    public void CheckRule_NhapSach(int soLuongNhap, int tonKhoHienTai)
    {
        int minNhap = GetIntRule("QD1_NhapToiThieu");
        int maxTon = GetIntRule("QD1_TonToiDaTruocNhap");

        if (soLuongNhap < minNhap)
            throw new Exception($"Vi phạm QĐ1: Số lượng nhập phải ít nhất {minNhap}.");

        if (tonKhoHienTai >= maxTon) // Lưu ý: Đề nói "ít hơn 300" mới được nhập
            throw new Exception($"Vi phạm QĐ1: Chỉ nhập sách có lượng tồn ít hơn {maxTon}.");
    }

    // QĐ2: Kiểm tra khi bán sách
    public void CheckRule_BanSach(decimal noHienTai, int tonKhoSauBan)
    {
        decimal maxNo = GetDecimalRule("QD2_NoToiDa");
        int minTon = GetIntRule("QD2_TonToiThieuSauBan");

        if (noHienTai > maxNo)
            throw new Exception($"Vi phạm QĐ2: Khách đang nợ {noHienTai}, vượt quá mức cho phép {maxNo}.");

        if (tonKhoSauBan < minTon)
            throw new Exception($"Vi phạm QĐ2: Lượng tồn sau khi bán phải còn ít nhất {minTon}.");
    }

    // QĐ4: Kiểm tra khi thu tiền
    public void CheckRule_ThuTien(decimal soTienThu, decimal noHienTai)
    {
        // Kiểm tra xem QĐ4 có đang bật không?
        bool isEnabled = IsRuleEnabled("QD4_KiemTraTienThu");

        if (isEnabled && soTienThu > noHienTai)
        {
            throw new Exception($"Vi phạm QĐ4: Số tiền thu ({soTienThu}) không được vượt quá số nợ ({noHienTai}).");
        }
    }
}
}
