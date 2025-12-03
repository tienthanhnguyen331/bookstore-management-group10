import { useState } from "react";

export function StockEntryForm({ entries, setEntries }) {
    const [formData, setFormData] = useState({
        date: "",
        bookName: "",
        category: "",
        author: "",
        quantity: "",
        unitPrice: "",
    });

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // get temp ID to add into entry form
    const getTemporaryID = function () {
        const id = entries[entries.length - 1]?.id || 1;

        return id + 1;
    };

    const handleSubmit = function (e) {
        e.preventDefault();

        if (
            !formData.bookName ||
            !formData.category ||
            !formData.author ||
            !formData.quantity ||
            !formData.unitPrice
        )
            return;

        setEntries((prev) => [...prev, { ...formData, id: getTemporaryID() }]);
        setFormData({
            date: "",
            bookName: "",
            category: "",
            author: "",
            quantity: "",
            unitPrice: "",
        });
    };

    return (
        <form
            className="bg-white rounded-lg p-6 mb-8 shadow-sm"
            onSubmit={handleSubmit}
        >
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                    <div>
                        <label className="block mb-2">
                            Tác giả<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.author}
                            onChange={(e) =>
                                handleChange("author", e.target.value)
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-400"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2">
                                Ngày nhập<span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) =>
                                        handleChange("date", e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-400"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block mb-2">
                                Thể loại<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.category}
                                onChange={(e) =>
                                    handleChange("category", e.target.value)
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-400"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block mb-2">
                            Tên sách<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.bookName}
                            onChange={(e) =>
                                handleChange("bookName", e.target.value)
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-400"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2">
                                Số lượng<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={formData.quantity}
                                onChange={(e) =>
                                    handleChange("quantity", e.target.value)
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-400"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">
                                Đơn giá nhập
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    value={formData.unitPrice}
                                    onChange={(e) =>
                                        handleChange(
                                            "unitPrice",
                                            e.target.value
                                        )
                                    }
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-400"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-center mt-6">
                <button
                    type="submit"
                    className=" px-12 py-3 bg-blue-400 text-white rounded hover:bg-blue-500 transition-colors"
                >
                    Thêm
                </button>
            </div>
        </form>
    );
}
