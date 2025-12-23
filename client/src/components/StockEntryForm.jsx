import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import BookSelection from "./inventory/BookSelection";
import BookDetails from "./inventory/BookDetails";
import { getBooks } from "../services/inventoryService";

// Books will be fetched from API when dropdown opens

export function StockEntryForm({ entries, setEntries }) {
    const [formData, setFormData] = useState({
        selectedBook: null,
        quantity: "",
        unitPrice: "",
    });

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [books, setBooks] = useState([]);
    const [loadingBooks, setLoadingBooks] = useState(false);
    const [booksError, setBooksError] = useState(null);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleBookSelect = (book) => {
        // Auto-fill unit price from API book data
        setFormData((prev) => ({
            ...prev,
            selectedBook: book,
            unitPrice: book.DonGia || "",
        }));
        setIsDropdownOpen(false);
        setSearchQuery("");
    };

    // Fetch books only when opening dropdown the first time
    useEffect(() => {
        const fetchIfNeeded = async () => {
            if (isDropdownOpen && books.length === 0 && !loadingBooks) {
                try {
                    setLoadingBooks(true);
                    const data = await getBooks();
                    setBooks(data);
                } catch (err) {
                    setBooksError("Không thể tải danh sách sách");
                } finally {
                    setLoadingBooks(false);
                }
            }
        };
        fetchIfNeeded();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDropdownOpen]);

    const handleClick = (e) => {
        e.preventDefault();

        // Create new entry with API schema + UI fields
        const newEntry = {
            id: Date.now(), // temporary ID for UI
            MaSach: formData.selectedBook.MaSach,
            bookName: formData.selectedBook.TenSach,
            category: formData.selectedBook.TenTheLoai,
            author: formData.selectedBook.TenTacGia,
            quantity: formData.quantity,
            unitPrice: formData.unitPrice,
        };

        // Add to entries array
        setEntries([...entries, newEntry]);

        // Reset form except date
        setFormData({
            selectedBook: null,
            quantity: "",
            unitPrice: "",
        });
    };

    return (
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
            <div className="space-y-6">
                {/* Book Selection */}
                <div>
                    <label className="block mb-2">
                        Chọn sách<span className="text-red-500">*</span>
                    </label>
                    <BookSelection
                        selectedBook={formData.selectedBook}
                        isOpen={isDropdownOpen}
                        onToggle={() => setIsDropdownOpen((v) => !v)}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        books={books}
                        onSelect={handleBookSelect}
                        loading={loadingBooks}
                    />
                    {booksError && (
                        <div className="text-sm text-red-500 mt-2">
                            {booksError}
                        </div>
                    )}
                </div>

                {/* Book Details (shown after selection) */}
                {formData.selectedBook && (
                    <BookDetails book={formData.selectedBook} />
                )}

                {/* Quantity */}
                <div>
                    <label className="block mb-2">
                        Số lượng nhập<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        min={1}
                        value={formData.quantity}
                        onChange={(e) =>
                            handleChange("quantity", +e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-400"
                        placeholder="Nhập số lượng"
                    />
                </div>

                {/* Unit Price (Auto-filled from API) */}
                <div>
                    <label className="block mb-2">
                        Đơn giá nhập<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        value={formData.unitPrice}
                        onChange={(e) =>
                            handleChange("unitPrice", +e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-400"
                        placeholder="Tự động điền từ dữ liệu sách"
                    />
                </div>

                <div className="flex justify-center pt-2">
                    <button
                        onClick={handleClick}
                        className="flex items-center gap-2 px-10 py-2 bg-blue-400 text-white rounded hover:bg-blue-500 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        <Plus className="w-4 h-4" />
                        Thêm
                    </button>
                </div>
            </div>
        </div>
    );
}
