using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

public interface IRuleService
{
    int GetIntRule(string key);
    decimal GetDecimalRule(string key);
    bool IsRuleEnabled(string key);
    void CheckRule_NhapSach(int soLuongNhap, int tonKhoHienTai);
    void CheckRule_BanSach(decimal noHienTai, int tonKhoSauBan);
    void CheckRule_ThuTien(decimal soTienThu, decimal noHienTai);
}
