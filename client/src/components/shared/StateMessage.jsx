import Spinner from "./Spinner";
import { X } from "lucide-react";

/**
 * Reusable component for displaying loading, error, success, and empty states
 * Error and Success messages appear as modals that auto-dismiss after 1.5s
 * @param {boolean} loading - Whether data is loading
 * @param {string} error - Error message if any
 * @param {string} success - Success message if any
 * @param {boolean} isEmpty - Whether data array is empty
 * @param {string} loadingMessage - Custom loading message
 * @param {string} emptyMessage - Custom empty message
 * @param {Function} onClose - Callback to clear error/success state
 * @param {string} className - Additional CSS classes
 */
export default function StateMessage({
    loading = false,
    error = null,
    success = null,
    isEmpty = false,
    loadingMessage = "Đang tải dữ liệu...",
    emptyMessage = "Không có dữ liệu",
    onClose,
    className = "",
}) {

    if (loading) {
        return (
            <div
                className={`flex items-center justify-center gap-2 text-gray-500 ${className}`}
            >
                <Spinner size={20} />
                <span>{loadingMessage}</span>
            </div>
        );
    }

    if (error) {
        return (
            <div 
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 animate-fadeIn"
                onClick={onClose}
            >
                <div 
                    className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-slideDown"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-start justify-between p-4 border-b border-red-200 bg-red-50">
                        <div className="flex items-center gap-2">
                            <svg
                                className="w-5 h-5 text-red-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <h3 className="text-lg font-semibold text-red-900">Lỗi</h3>
                        </div>
                        {onClose && (
                            <button
                                onClick={onClose}
                                className="text-red-400 hover:text-red-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                    <div className="p-4">
                        <p className="text-red-700">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div 
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 animate-fadeIn"
                onClick={onClose}
            >
                <div 
                    className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-slideDown"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-start justify-between p-4 border-b border-green-200 bg-green-50">
                        <div className="flex items-center gap-2">
                            <svg
                                className="w-5 h-5 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <h3 className="text-lg font-semibold text-green-900">Thành công</h3>
                        </div>
                        {onClose && (
                            <button
                                onClick={onClose}
                                className="text-green-400 hover:text-green-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                    <div className="p-4">
                        <p className="text-green-700">{success}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (isEmpty) {
        return (
            <div className={`text-center text-gray-500 ${className}`}>
                {emptyMessage}
            </div>
        );
    }

    return null;
}
