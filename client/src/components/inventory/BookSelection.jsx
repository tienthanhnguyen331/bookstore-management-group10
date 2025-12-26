import { ChevronDown, Search } from "lucide-react";
import StateMessage from "../shared/StateMessage";
import BookList from "./BookList";

export default function BookSelection({
    selectedBook,
    isOpen,
    onToggle,
    searchQuery,
    setSearchQuery,
    books,
    onSelect,
    loading = false,
    rules,
}) {
    const filtered = (books || []).filter((b) => {
        const q = (searchQuery || "").toLowerCase();
        return (
            b.TenSach.toLowerCase().includes(q) ||
            (b.TenTheLoai || "").toLowerCase().includes(q) ||
            (b.TenTacGia || "").toLowerCase().includes(q)
        );
    });

    return (
        <div className="relative">
            <button
                type="button"
                onClick={onToggle}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-400 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
            >
                <span
                    className={selectedBook ? "text-gray-900" : "text-gray-400"}
                >
                    {selectedBook
                        ? selectedBook.TenSach
                        : "Chọn sách từ danh sách"}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-80 overflow-hidden">
                    {/* Search input */}
                    <div className="p-2 border-b border-gray-200">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm sách..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-400"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Loading & Books list */}
                    {loading ? (
                        <StateMessage
                            loading={loading}
                            loadingMessage="Đang tải danh sách sách..."
                            className="px-4 py-6"
                        />
                    ) : (
                        <BookList books={filtered} onSelect={onSelect} rules={rules} />
                    )}
                </div>
            )}
        </div>
    );
}
