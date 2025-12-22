import { AlertTriangle, X } from "lucide-react";

function DeleteConfirmModal({ isOpen, onClose, customer, onConfirm }) {
    if (!isOpen || !customer) return null;

    const handleOverlayClick = function (e) {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div
            onClick={handleOverlayClick}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
            <div className="bg-white rounded-lg max-w-md w-full">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                        </div>
                        <h2>Xác nhận xóa</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-gray-600 mb-2">
                        Bạn có chắc chắn muốn xóa khách hàng{" "}
                        <span className="text-gray-900">{customer.HoTen}</span>?
                    </p>
                    <p className="text-gray-500">
                        Hành động này không thể hoàn tác.
                    </p>
                </div>

                <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={() => {
                            onConfirm(customer.MaKH);
                            onClose();
                        }}
                        className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Xóa khách hàng
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteConfirmModal;
