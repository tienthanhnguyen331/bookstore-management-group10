import Spinner from "./Spinner";

/**
 * Reusable component for displaying loading, error, and empty states in tables
 * @param {number} colSpan - Number of columns to span
 * @param {boolean} loading - Whether data is loading
 * @param {string} error - Error message if any
 * @param {boolean} isEmpty - Whether data array is empty
 * @param {string} loadingMessage - Custom loading message (default: "Đang tải dữ liệu...")
 * @param {string} emptyMessage - Custom empty message (default: "Không có dữ liệu")
 */
export default function TableStateRow({
    colSpan,
    loading = false,
    error = null,
    isEmpty = false,
    loadingMessage = "Đang tải dữ liệu...",
    emptyMessage = "Không có dữ liệu",
}) {
    if (loading) {
        return (
            <tr>
                <td
                    colSpan={colSpan}
                    className="px-4 py-8 text-center text-gray-500"
                >
                    <div className="flex items-center justify-center gap-2">
                        <Spinner size={20} />
                        <span>{loadingMessage}</span>
                    </div>
                </td>
            </tr>
        );
    }

    if (error) {
        return (
            <tr>
                <td
                    colSpan={colSpan}
                    className="px-4 py-8 text-center text-red-500"
                >
                    {error}
                </td>
            </tr>
        );
    }

    if (isEmpty) {
        return (
            <tr>
                <td
                    colSpan={colSpan}
                    className="px-4 py-8 text-center text-gray-500"
                >
                    {emptyMessage}
                </td>
            </tr>
        );
    }

    return null;
}
