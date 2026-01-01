namespace DoAnPhanMem.Services.Interfaces
{
    public interface IRuleService
    {
        int GetIntRule(string key);
        decimal GetDecimalRule(string key);
        bool IsRuleEnabled(string key);
        void CheckRule_NhapSach(int soLuongNhap, int tonKhoHienTai);
        void CheckRule_BanSach(decimal noHienTai, int tonKhoSauBan);
        void CheckRule_ThuTien(decimal soTienThu, decimal noHienTai);
    }
}
