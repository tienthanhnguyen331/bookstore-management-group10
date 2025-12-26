import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { paymentReceiptService } from "../../services/paymentReceiptService";
import StateMessage from "../shared/StateMessage";
import formatCurrency from "../../utils/formatCurrency";

function PaymentReceiptModal({ isOpen, onClose, customer, onSave }) {
    const [formData, setFormData] = useState({
        NgayThu: new Date().toISOString().split("T")[0],
        SoTienThu: "",
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [validationError, setValidationError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            setFormData({
                NgayThu: new Date().toISOString().split("T")[0],
                SoTienThu: "",
            });
            setError(null);
            setValidationError(null);
            setSaving(false);
        }
    }, [isOpen]);

    if (!isOpen || !customer) return null;

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationError(null);
        setError(null);

        // Validate amount
        const amount = parseFloat(formData.SoTienThu);
        if (amount <= 0) {
            setValidationError("Số tiền thu phải lớn hơn 0");
            return;
        }

        if (amount > customer.CongNo) {
            setValidationError(
                "Số tiền thu không được vượt quá số tiền nợ hiện tại"
            );
            return;
        }

        try {
            setSaving(true);
            const receiptData = await paymentReceiptService.createPaymentReceipt({
                SDT: customer.SDT,
                SoTienThu: amount,
            });
            
            // Call parent callback with receipt data
            onSave(receiptData);
            onClose();
        } catch (err) {
            console.error("Error creating payment receipt:", err);
            setError(
                err.response?.data?.message ||
                    "Không thể lưu phiếu thu. Vui lòng thử lại"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            onClick={handleOverlayClick}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
            <div className="bg-white rounded-lg max-w-2xl w-full">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold">Phiếu Thu Tiền</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-6">
                        {/* Current Debt Notice */}
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <p className="text-sm text-amber-800">
                                <span className="font-medium">Lưu ý:</span> Số
                                tiền nợ hiện tại:{" "}
                                <span className="font-semibold">
                                    {formatCurrency(customer.CongNo)}
                                </span>
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-2 text-gray-600">
                                    Họ tên khách hàng:
                                </label>
                                <input
                                    type="text"
                                    value={customer.HoTen}
                                    disabled
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-gray-600">
                                    Địa chỉ:
                                </label>
                                <input
                                    type="text"
                                    value={customer.DiaChi}
                                    disabled
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-2 text-gray-600">
                                    Điện thoại:
                                </label>
                                <input
                                    type="text"
                                    value={customer.SDT}
                                    disabled
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-gray-600">
                                    Email:
                                </label>
                                <input
                                    type="text"
                                    value={customer.Email}
                                    disabled
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-2 text-gray-600">
                                    Ngày thu tiền:
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={formData.NgayThu}
                                    onChange={(e) =>
                                        handleChange("NgayThu", e.target.value)
                                    }
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-gray-600">
                                    Số tiền thu:
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max={customer.CongNo}
                                    value={formData.SoTienThu}
                                    onChange={(e) =>
                                        handleChange(
                                            "SoTienThu",
                                            e.target.value
                                        )
                                    }
                                    required
                                    placeholder="Nhập số tiền thu"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Error Messages */}
                        <StateMessage
                            error={validationError || error}
                            onClose={() => {
                                setValidationError(null);
                                setError(null);
                            }}
                            className="mt-4"
                        />
                    </div>

                    <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            {saving ? "Đang lưu..." : "Lưu phiếu thu"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PaymentReceiptModal;
