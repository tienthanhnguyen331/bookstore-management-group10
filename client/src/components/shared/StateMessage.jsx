import Spinner from "./Spinner";

/**
 * Reusable component for displaying loading, error, success, and empty states
 * @param {boolean} loading - Whether data is loading
 * @param {string} error - Error message if any
 * @param {string} success - Success message if any
 * @param {boolean} isEmpty - Whether data array is empty
 * @param {string} loadingMessage - Custom loading message
 * @param {string} emptyMessage - Custom empty message
 * @param {string} className - Additional CSS classes
 */
export default function StateMessage({
    loading = false,
    error = null,
    success = null,
    isEmpty = false,
    loadingMessage = "Đang tải dữ liệu...",
    emptyMessage = "Không có dữ liệu",
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
                className={`px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center ${className}`}
            >
                {error}
            </div>
        );
    }

    if (success) {
        return (
            <div
                className={`px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm text-center ${className}`}
            >
                {success}
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
