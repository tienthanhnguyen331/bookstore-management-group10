import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import BookSelection from "./inventory/BookSelection";
import BookDetails from "./inventory/BookDetails";
import { getBooks } from "../services/inventoryService";
import StateMessage from "./shared/StateMessage";

// Books will be fetched from API when dropdown opens

export function StockEntryForm({
    entries,
    setEntries,
    rules,
    saving,
    error,
    success,
    setError,
    setSuccess,
}) {
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
    const [quantityError, setQuantityError] = useState(null);
    const [unitPriceError, setUnitPriceError] = useState(null);

    // Auto-dismiss success message after 1.5 seconds
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(false), 1500);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));

        // Validate quantity against MinImportQuantity
        if (field === "quantity") {
            if (value <= 0) {
                setQuantityError("Số lượng phải lớn hơn 0");
            } else if (rules && value < rules.MinImportQuantity) {
                setQuantityError(
                    `Số lượng nhập tối thiểu là ${rules.MinImportQuantity} cuốn`
                );
            } else {
                setQuantityError(null);
            }
        }

        // Validate unit price against book's DonGia (max allowed price)
        if (field === "unitPrice") {
            if (value <= 0) {
                setUnitPriceError("Đơn giá phải lớn hơn 0");
            } else if (
                formData.selectedBook &&
                value > formData.selectedBook.DonGia
            ) {
                setUnitPriceError(
                    `Đơn giá nhập không được vượt quá ${formData.selectedBook.DonGia.toLocaleString(
                        "vi-VN"
                    )} ₫`
                );
            } else {
                setUnitPriceError(null);
            }
        }
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
                        rules={rules}
                    />
                    <StateMessage
                        error={booksError}
                        onClose={() => setBooksError(null)}
                        className="mt-2"
                    />
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
                    {quantityError && (
                        <div className="mb-2 text-sm text-red-600">
                            {quantityError}
                        </div>
                    )}
                    <input
                        type="number"
                        min={1}
                        value={formData.quantity}
                        onChange={(e) =>
                            handleChange("quantity", +e.target.value)
                        }
                        className={`w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-400 ${
                            quantityError ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Nhập số lượng"
                    />
                </div>

                {/* Unit Price (Auto-filled from API) */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label>
                            Đơn giá nhập<span className="text-red-500">*</span>
                        </label>
                        {unitPriceError && (
                            <span className="text-xs text-red-600">
                                {unitPriceError}
                            </span>
                        )}
                    </div>
                    <input
                        type="number"
                        value={formData.unitPrice}
                        onChange={(e) =>
                            handleChange("unitPrice", +e.target.value)
                        }
                        className={`w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-400 ${
                            unitPriceError
                                ? "border-red-500"
                                : "border-gray-300"
                        }`}
                        placeholder="Tự động điền từ dữ liệu sách"
                    />
                </div>

                <StateMessage
                    error={error}
                    success={success ? "Lưu phiếu nhập thành công!" : null}
                    onClose={() => {
                        setError(null);
                        setSuccess(false);
                    }}
                    className="mt-2"
                />

                <div className="flex justify-center pt-2">
                    <button
                        onClick={handleClick}
                        disabled={
                            !formData.selectedBook ||
                            !formData.quantity ||
                            !formData.unitPrice ||
                            quantityError ||
                            unitPriceError ||
                            saving
                        }
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
