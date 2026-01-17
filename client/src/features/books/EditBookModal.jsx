import { X } from "lucide-react";
import { use, useState } from "react";

// Form sửa giá
function EditBookModal({ selectedBook, onClose, onSave }) {
    const [price, setPrice] = useState(selectedBook.DonGia);
    const [name, setName] = useState(selectedBook.TenSach);
    const [author, setAuthor] = useState(selectedBook.TenTacGia);
    const [category, setCategory] = useState(selectedBook.TenTheLoai);
    const handleNameChange = function (e) {
        e.preventDefault();
        setName(e.target.value);
    };
    const handleAuthorChange = function (e) {
        e.preventDefault();
        setAuthor(e.target.value);
    };
    const handleCategoryChange = function (e) {
        e.preventDefault();
        setCategory(e.target.value);
    };

    const handlePriceChange = function (e) {
        e.preventDefault();
        setPrice(e.target.value);
    };

    const handleOverlayClick = function (e) {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleSubmit = function (e) {
        e.preventDefault();
        const payload = {
            MaSach: selectedBook.MaSach,
            TenSach: name,
            TenTacGia: author,
            TenTheLoai: category,
            DonGia: Number(price),
            SoLuongTon: selectedBook.SoLuongTon,
        }
        onSave(payload);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={handleOverlayClick}
        >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h2 className="text-gray-900">Chỉnh sửa giá bán</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit}>
                    <div className="px-6 py-4 space-y-4">
                        <div>
                            <label className="block text-gray-700 mb-2">
                                Tên sách
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={handleNameChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">
                                Thể loại
                            </label>
                            <input
                                type="text"
                                value={category}
                                onChange={handleCategoryChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">
                                Tác giả
                            </label>
                            <input
                                type="text"
                                value={author}
                                onChange={handleAuthorChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">
                                Giá bán mới{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={price}
                                    onChange={handlePriceChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Nhập giá mới"
                                    min="0"
                                    step="1000"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                                    đ
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                        >
                            Cập nhật
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditBookModal;
