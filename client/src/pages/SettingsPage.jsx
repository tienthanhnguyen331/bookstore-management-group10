import { Header } from "../components/Header";
import { useState, useEffect } from "react";
import { settingsService } from "../services/settingsService";
import StateMessage from "./../components/shared/StateMessage";

export default function SettingsPage({rules, setRules, onRulesUpdate}) {
    const [activeTab, setActiveTab] = useState("rules");
    const [formData, setFormData] = useState(rules);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        setFormData(rules);
    }, [rules]);

    // Auto-dismiss success message after 1.5 seconds
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(null), 1500);
            return () => clearTimeout(timer);
        }
    }, [success]);

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
            setError(null);
            setSuccess(null);
            await settingsService.updateRules(formData);
            setRules(formData); // Update parent state
            setSuccess("Cài đặt quy định đã được lưu thành công!");
            await onRulesUpdate(); // Refresh from api to confirm
        } catch (err) {
            const errorMsg =
                err.response?.data?.message ||
                "Lỗi khi lưu cài đặt. Vui lòng thử lại";
            setError(errorMsg);
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

                                <StateMessage
                                    loading={loading}
                                    error={error}
                                    success={success}
                                    loadingMessage="Đang tải dữ liệu..."
                                    className="mb-6"
                                />

                                {!loading && (
                                    <>
                                        <div className="grid grid-cols-2 gap-6 mb-6">
                                            {/* MinImportQuantity */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    SỐ LƯỢNG NHẬP TỐI THIỂU (CUỐN)
                                                </label>
                                                <input
                                                    type="number"
                                                    name="MinImportQuantity"
                                                    value={formData.MinImportQuantity || ""}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                    disabled={saving}
                                                />
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Số lượng tối thiểu khi nhập sách vào kho
                                                </p>
                                            </div>

                                            {/* MinStockPreImport */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    TỒN TỐI ĐA TRƯỚC NHẬP (CUỐN)
                                                </label>
                                                <input
                                                    type="number"
                                                    name="MinStockPreImport"
                                                    value={formData.MinStockPreImport || ""}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                    disabled={saving}
                                                />
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Số lượng tối đa trong kho trước khi nhập
                                                </p>
                                            </div>

                                            {/* MaxDebt */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    NỢ TỐI ĐA CỦA KHÁCH (VND)
                                                </label>
                                                <input
                                                    type="number"
                                                    name="MaxDebt"
                                                    value={formData.MaxDebt || ""}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                    disabled={saving}
                                                />
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Ví dụ: 30000000 (30 triệu)
                                                </p>
                                            </div>

                                            {/* MinStockPostSell */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    TỒN TỐI THIỂU SAU BÁN (CUỐN)
                                                </label>
                                                <input
                                                    type="number"
                                                    name="MinStockPostSell"
                                                    value={formData.MinStockPostSell || ""}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                    disabled={saving}
                                                />
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Số lượng tối thiểu trong kho sau khi bán
                                                </p>
                                            </div>

                                            {/* CheckDebtRule */}
                                            <div className="flex items-start gap-3 pt-8">
                                                <input
                                                    type="checkbox"
                                                    id="CheckDebtRule"
                                                    name="CheckDebtRule"
                                                    checked={formData.CheckDebtRule || false}
                                                    onChange={(e) => {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            CheckDebtRule: e.target.checked
                                                        }));
                                                    }}
                                                    className="w-5 h-5 text-blue-400 border-gray-300 rounded focus:ring-blue-400 cursor-pointer mt-1"
                                                    disabled={saving}
                                                />
                                                <div>
                                                    <label
                                                        htmlFor="CheckDebtRule"
                                                        className="text-sm font-medium text-gray-700 cursor-pointer"
                                                    >
                                                        Áp dụng quy định thu tiền không vượt nợ
                                                    </label>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Số tiền thu không được vượt quá số nợ của khách hàng
                                                    </p>
                                                </div>
                                            </div>
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
