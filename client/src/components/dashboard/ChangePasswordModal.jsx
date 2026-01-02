import { useState, useEffect } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { changePasswordService } from "../../services/authService";

function ChangePasswordModal({ isOpen, onClose, username }) {
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    // Reset form state when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setFormData({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            setError("");
            setSuccess("");
            setShowOldPassword(false);
            setShowNewPassword(false);
            setShowConfirmPassword(false);
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Validation
        if (!formData.oldPassword) {
            setError("Vui lòng nhập mật khẩu cũ");
            return;
        }

        if (!formData.newPassword) {
            setError("Vui lòng nhập mật khẩu mới");
            return;
        }

        if (formData.newPassword.length < 6) {
            setError("Mật khẩu mới phải có ít nhất 6 ký tự");
            return;
        }

        if (formData.newPassword === formData.oldPassword) {
            setError("Mật khẩu mới phải khác mật khẩu cũ");
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError("Xác nhận mật khẩu không khớp");
            return;
        }

        try {
            setLoading(true);
            const result = await changePasswordService(
                username,
                formData.oldPassword,
                formData.newPassword
            );
            setSuccess(result.message || "Đổi mật khẩu thành công");
            setFormData({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            });

            // Close modal after 2 seconds
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={handleOverlayClick}
        >
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Đổi mật khẩu
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                            {success}
                        </div>
                    )}

                    {/* Old Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mật khẩu cũ <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showOldPassword ? "text" : "password"}
                                name="oldPassword"
                                value={formData.oldPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-400 pr-10"
                                placeholder="Nhập mật khẩu cũ"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowOldPassword(!showOldPassword)
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showOldPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mật khẩu mới <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-400 pr-10"
                                placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowNewPassword(!showNewPassword)
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showNewPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Xác nhận mật khẩu mới{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-400 pr-10"
                                placeholder="Nhập lại mật khẩu mới"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                            disabled={loading}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className={`flex-1 px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500 transition-colors ${
                                loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            disabled={loading}
                        >
                            {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ChangePasswordModal;
