// Bảng hiển thị sách
import { Pencil, Trash2 } from "lucide-react";

const BookTable = ({ books, loading, onOpenEditModal }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {[
                            "Mã",
                            "Tên sách",
                            "Tác giả",
                            "Thể loại",
                            "Giá bán",
                            "Tồn kho",
                            "Thao tác",
                        ].map((header) => (
                            <th
                                key={header}
                                className="px-6 py-4 text-left text-sm font-medium text-gray-900 tracking-wider"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                        <tr>
                            <td colSpan="7" className="text-center py-4">
                                Đang tải dữ liệu...
                            </td>
                        </tr>
                    ) : books.length > 0 ? (
                        books.map((book) => (
                            <tr
                                key={book.MaSach}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {book.MaSach}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {book.TenSach}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {book.TenTacGia}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {book.TenTheLoai}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {book.DonGia.toLocaleString("vi-VN")}đ
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center pr-12">
                                    {book.SoLuongTon}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex gap-2">
                                        <button className="p-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-600 transition-colors">
                                            <Pencil
                                                size={16}
                                                onClick={() =>
                                                    onOpenEditModal(book)
                                                }
                                            />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center py-4">
                                Chưa có dữ liệu.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default BookTable;
