import Spinner from "./Spinner";
import { X, AlertCircle, CheckCircle2, Info } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Reusable component for displaying loading, error, success, and empty states
 * Error and Success messages appear as toast notifications that auto-dismiss after 1.5s
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
    const [visible, setVisible] = useState(false);
    const [progressWidth, setProgressWidth] = useState(100);

    // Auto-dismiss error/success modals after 1.5 seconds
    useEffect(() => {
        if (error || success) {
            setVisible(true);
            setProgressWidth(100);
            
            // Animate progress bar
            const progressTimer = setTimeout(() => {
                setProgressWidth(0);
            }, 10);

            if (onClose) {
                const dismissTimer = setTimeout(() => {
                    setVisible(false);
                    setTimeout(onClose, 300); // Wait for fade out animation
                }, 1500);
                
                return () => {
                    clearTimeout(progressTimer);
                    clearTimeout(dismissTimer);
                };
            }
            
            return () => clearTimeout(progressTimer);
        } else {
            setVisible(false);
        }
    }, [error, success, onClose]);

    if (loading) {
        return (
            <div className={`flex items-center justify-center gap-3 text-gray-600 ${className}`}>
                <Spinner size={20} />
                <span className="text-sm font-medium">{loadingMessage}</span>
            </div>
        );
    }

    if (error && visible) {
        return (
            <div className="fixed top-4 right-4 z-50 pointer-events-none">
                <div 
                    className={`pointer-events-auto w-[380px] max-w-[calc(100vw-2rem)] transition-all duration-300 ${
                        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
                    }`}
                    style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
                >
                    <div className="relative overflow-hidden rounded-xl bg-white shadow-2xl border border-red-100">
                        {/* Gradient accent bar */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-red-600 to-rose-500" />
                        
                        {/* Background glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-transparent" />
                        
                        <div className="relative p-4">
                            <div className="flex items-start gap-3">
                                {/* Icon */}
                                <div className="relative flex-shrink-0">
                                    <div className="absolute inset-0 bg-red-500/20 blur-lg rounded-full" />
                                    <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-lg">
                                        <AlertCircle className="w-5 h-5 text-white" strokeWidth={2.5} />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0 pt-0.5">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="text-sm font-semibold text-gray-900">
                                            Lỗi
                                        </h3>
                                        {onClose && (
                                            <button
                                                onClick={() => {
                                                    setVisible(false);
                                                    setTimeout(onClose, 300);
                                                }}
                                                className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-all rounded-full p-1 hover:bg-gray-100 hover:scale-110 active:scale-95"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {error}
                                    </p>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div 
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-400 to-red-600 origin-left transition-all duration-[1500ms] linear"
                                style={{ width: `${progressWidth}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (success && visible) {
        return (
            <div className="fixed top-4 right-4 z-50 pointer-events-none">
                <div 
                    className={`pointer-events-auto w-[380px] max-w-[calc(100vw-2rem)] transition-all duration-300 ${
                        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
                    }`}
                    style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
                >
                    <div className="relative overflow-hidden rounded-xl bg-white shadow-2xl border border-green-100">
                        {/* Gradient accent bar */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500" />
                        
                        {/* Background glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent" />
                        
                        <div className="relative p-4">
                            <div className="flex items-start gap-3">
                                {/* Icon */}
                                <div className="relative flex-shrink-0">
                                    <div className="absolute inset-0 bg-green-500/20 blur-lg rounded-full" />
                                    <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                                        <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2.5} />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0 pt-0.5">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="text-sm font-semibold text-gray-900">
                                            Thành công
                                        </h3>
                                        {onClose && (
                                            <button
                                                onClick={() => {
                                                    setVisible(false);
                                                    setTimeout(onClose, 300);
                                                }}
                                                className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-all rounded-full p-1 hover:bg-gray-100 hover:scale-110 active:scale-95"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {success}
                                    </p>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div 
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 to-green-600 origin-left transition-all duration-[1500ms] linear"
                                style={{ width: `${progressWidth}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isEmpty) {
        return (
            <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
                <div className="relative mb-4">
                    <div className="absolute inset-0 bg-gray-200/50 blur-2xl rounded-full" />
                    <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg">
                        <Info className="w-8 h-8 text-gray-400" strokeWidth={1.5} />
                    </div>
                </div>
                <p className="text-gray-500 text-sm font-medium">{emptyMessage}</p>
                <p className="text-gray-400 text-xs mt-1">Thử tải lại hoặc kiểm tra bộ lọc</p>
            </div>
        );
    }

    return null;
}
