import { Header } from "../components/Header";
import { useState } from "react";
import { settingsService } from "../services/settingsService";
import { useEffect } from "react";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("rules");
    const [rules, setRules] = useState([]);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    // Load rules from backend on component mount
    useEffect(() => {
        loadRules();
    }, []);

    const loadRules = async () => {
        try {
            setLoading(true);
            const data = await settingsService.getRulesWithConfig();
            setRules(data);
            
            // Map rules to formData
            const initialFormData = {};
            data.forEach(rule => {
                initialFormData[rule.tenQuyDinh] = rule.giaTri;
            });
            setFormData(initialFormData);
            setError(null);
        } catch (err) {
            setError("Không thể tải dữ liệu quy định");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSaveSettings = async () => {
        try {
            setSaving(true);
            // Update each rule
            for (const [key, value] of Object.entries(formData)) {
                await settingsService.updateRule(key, value);
            }
            alert("Cài đặt quy định đã được lưu thành công!");
            await loadRules(); // Reload to confirm
        } catch (err) {
            alert("Lỗi khi lưu cài đặt: " + err.message);
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-sm">
                    {/* Tab Navigation */}
                    <div className="flex gap-8 border-b border-gray-200 px-6 pt-6 bg-gray-50">
                        <button
                            onClick={() => setActiveTab("rules")}
                            className={`pb-3 px-1 font-medium transition-colors ${
                                activeTab === "rules"
                                    ? "text-blue-400 border-b-2 border-blue-400"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Cài đặt quy định
                        </button>
                        <button
                            onClick={() => setActiveTab("staff")}
                            className={`pb-3 px-1 font-medium transition-colors ${
                                activeTab === "staff"
                                    ? "text-blue-400 border-b-2 border-blue-400"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Quản lí nhân viên
                        </button>
                    </div>

                    <div className="p-6">
                        {/* Tab 1: Rules Settings */}
                        {activeTab === "rules" && (
                            <div>
                                <div className="mb-8">
                                    <h1 className="mb-2 text-2xl font-bold text-blue-400">
                                        CÀI ĐẶT QUY ĐỊNH
                                    </h1>
                                    <p className="text-gray-500">
                                        Đặt ra ngưỡng nhập kho, tồn tối thiểu và chính
                                        sách giới hạn nợ để hệ thống áp dụng khi tạo
                                        hóa đơn.
                                    </p>
                                </div>

                                {error && (
                                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                                        {error}
                                    </div>
                                )}

                                {loading ? (
                                    <div className="flex items-center justify-center min-h-96">
                                        <p className="text-gray-500">Đang tải dữ liệu...</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-2 gap-6 mb-6">
                                            {/* QD1_NhapToiThieu */}
                                            {formData.QD1_NhapToiThieu !== undefined && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        SỐ LƯỢNG NHẬP TỐI THIỂU (CUỐN)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        name="QD1_NhapToiThieu"
                                                        value={formData.QD1_NhapToiThieu || ""}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                        disabled={saving}
                                                    />
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Số lượng tối thiểu khi nhập sách vào kho
                                                    </p>
                                                </div>
                                            )}

                                            {/* QD1_TonToiDaTruocNhap */}
                                            {formData.QD1_TonToiDaTruocNhap !== undefined && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        TỒN TỐI ĐA TRƯỚC NHẬP (CUỐN)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        name="QD1_TonToiDaTruocNhap"
                                                        value={formData.QD1_TonToiDaTruocNhap || ""}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                        disabled={saving}
                                                    />
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Số lượng tối đa trong kho trước khi nhập
                                                    </p>
                                                </div>
                                            )}

                                            {/* QD2_NoToiDa */}
                                            {formData.QD2_NoToiDa !== undefined && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        NỢ TỐI ĐA CỦA KHÁCH (VND)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        name="QD2_NoToiDa"
                                                        value={formData.QD2_NoToiDa || ""}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                        disabled={saving}
                                                    />
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Ví dụ: 30000000 (30 triệu)
                                                    </p>
                                                </div>
                                            )}

                                            {/* QD2_TonToiThieuSauBan */}
                                            {formData.QD2_TonToiThieuSauBan !== undefined && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        TỒN TỐI THIỂU SAU BÁN (CUỐN)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        name="QD2_TonToiThieuSauBan"
                                                        value={formData.QD2_TonToiThieuSauBan || ""}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                        disabled={saving}
                                                    />
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Số lượng tối thiểu trong kho sau khi bán
                                                    </p>
                                                </div>
                                            )}

                                            {/* QD4_ThuKhongVuotNo */}
                                            {formData.QD4_ThuKhongVuotNo !== undefined && (
                                                <div className="flex items-start gap-3 pt-8">
                                                    <input
                                                        type="checkbox"
                                                        id="QD4_ThuKhongVuotNo"
                                                        name="QD4_ThuKhongVuotNo"
                                                        checked={formData.QD4_ThuKhongVuotNo === "true" || formData.QD4_ThuKhongVuotNo === true}
                                                        onChange={(e) => {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                QD4_ThuKhongVuotNo: e.target.checked
                                                            }));
                                                        }}
                                                        className="w-5 h-5 text-blue-400 border-gray-300 rounded focus:ring-blue-400 cursor-pointer mt-1"
                                                        disabled={saving}
                                                    />
                                                    <div>
                                                        <label
                                                            htmlFor="QD4_ThuKhongVuotNo"
                                                            className="text-sm font-medium text-gray-700 cursor-pointer"
                                                        >
                                                            Áp dụng quy định thu tiền không vượt nợ
                                                        </label>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Số tiền thu không được vượt quá số nợ của khách hàng
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Save Button */}
                                        <div className="flex justify-end">
                                            <button
                                                onClick={handleSaveSettings}
                                                disabled={saving}
                                                className={`px-6 py-3 text-white rounded-lg transition-colors shadow-sm font-medium ${
                                                    saving
                                                        ? "bg-gray-400 cursor-not-allowed"
                                                        : "bg-blue-400 hover:bg-blue-500"
                                                }`}
                                            >
                                                {saving ? "ĐANG LƯU..." : "LƯU CÀI ĐẶT"}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Tab 2: Staff Management */}
                        {activeTab === "staff" && (
                            <div className="flex items-center justify-center min-h-96">
                                <p className="text-gray-400 italic">
                                    Chức năng đang phát triển
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
