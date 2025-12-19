import { Header } from "../components/Header";
import { useState } from "react";
import { settingsService } from "../services/settingsService";
import { useEffect } from "react";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("rules");
    const [formData, setFormData] = useState({
        minImportQuantity: 30,
        minStockBefore: 300,
        minStockAfter: 100,
        maxDebt: 10000000,
        applyPaymentLimit: false,
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : Number(value),
        }));
    };

    const handleSaveSettings = async () => {
       // console.log("Dữ liệu cài đặt:", formData);
        const result = await settingsService.saveRules(formData);
        console.log("Kết quả lưu:", result);
        alert(result.message);
    };

    // Load rules from mock service on component mount
    useEffect(() => {
    const loadRules = async () => {
        const rules = await settingsService.getRules();
        setFormData(rules);
        console.log("Dữ liệu từ mock:", rules);
    };
    loadRules();
}, []);

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

                                <div className="grid grid-cols-2 gap-6 mb-6">
                                {/* Input 1: Min Import Quantity */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        SỐ LƯỢNG NHẬP TỐI THIỂU (CUỐN)
                                    </label>
                                    <input
                                        type="number"
                                        name="minImportQuantity"
                                        value={formData.minImportQuantity}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>

                                {/* Input 2: Min Stock Before */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        TỒN TỐI THIỂU TRƯỚC NHẬP (CUỐN)
                                    </label>
                                    <input
                                        type="number"
                                        name="minStockBefore"
                                        value={formData.minStockBefore}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>

                                {/* Input 3: Min Stock After */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        TỒN TỐI THIỂU SAU KHI BÁN (CUỐN)
                                    </label>
                                    <input
                                        type="number"
                                        name="minStockAfter"
                                        value={formData.minStockAfter}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>

                                {/* Input 4: Max Debt */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        SỐ NỢ TỐI ĐA (VND)
                                    </label>
                                    <input
                                        type="number"
                                        name="maxDebt"
                                        value={formData.maxDebt}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>

                                {/* Checkbox */}
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="applyPaymentLimit"
                                        name="applyPaymentLimit"
                                        checked={formData.applyPaymentLimit}
                                        onChange={handleInputChange}
                                        className="w-5 h-5 text-blue-400 border-gray-300 rounded focus:ring-blue-400 cursor-pointer"
                                    />
                                    <label
                                        htmlFor="applyPaymentLimit"
                                        className="text-sm font-medium text-gray-700 cursor-pointer"
                                    >
                                        Áp dụng số tiền thu không vượt quá số
                                        nợ.
                                    </label>
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="flex justify-end">
                                <button
                                    onClick={handleSaveSettings}
                                    className="px-6 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors shadow-sm font-medium"
                                >
                                    LƯU CÀI ĐẶT
                                </button>
                            </div>
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
