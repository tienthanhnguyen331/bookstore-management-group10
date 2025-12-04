import { X } from "lucide-react";
import BodyFormTable from "./BodyFormTable";

function HistoryDetailModal({ entry, onClose }) {
    const handleOverlayClick = function (e) {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            onClick={handleOverlayClick}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2>Chi tiết phiếu nhập {entry.id}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    <p className="text-gray-500 mb-6">Ngày: {entry.date}</p>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-3 text-left">STT</th>
                                    <th className="px-4 py-3 text-left">
                                        Tên sách
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        Thể loại
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        Tác giả
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        Số lượng
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        Đơn giá nhập
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        Thành tiền
                                    </th>
                                </tr>
                            </thead>
                            <BodyFormTable
                                entries={entry.bookList}
                                haveButton={false}
                            />
                            <tfoot>
                                <tr className="border-t-2 border-gray-300">
                                    <td
                                        colSpan="4"
                                        className="px-4 py-4 text-right"
                                    ></td>
                                    <td className="px-4 py-4">
                                        {entry.totalQuantity}
                                    </td>
                                    <td className="px-4 py-4"></td>
                                    <td className="px-4 py-4">
                                        {
                                            // calculate total amount
                                            entry.bookList
                                                .reduce(
                                                    (total, book) =>
                                                        total +
                                                        book.quantity *
                                                            book.unitPrice,
                                                    0
                                                )
                                                .toLocaleString("vi-VN")
                                        }{" "}
                                        đ
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                <div className="flex justify-end p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HistoryDetailModal;
