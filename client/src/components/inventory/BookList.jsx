export default function BookList({ books = [], onSelect, rules }) {
    return (
        <div className="overflow-y-auto max-h-64">
            {books.length > 0 ? (
                books.map((book) => {
                    const key = book.MaSach ?? book.id;
                    const name = book.TenSach ?? book.name;
                    const category = book.TenTheLoai ?? book.category;
                    const author = book.TenTacGia ?? book.author;
                    const stock = book.SoLuongTon || 0;
                    const isDisabled = rules && stock >= rules.MinStockPreImport;

                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => !isDisabled && onSelect(book)}
                            disabled={isDisabled}
                            className={`w-full px-4 py-3 transition-colors text-left border-b border-gray-100 last:border-b-0 ${
                                isDisabled 
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                    : 'hover:bg-gray-50'
                            }`}
                        >
                            <div className={isDisabled ? 'text-gray-400' : 'text-gray-900'}>
                                {`${name} (Tồn: ${stock})`}
                                {isDisabled && <span className="ml-2 text-xs text-red-500">Đã đủ tồn</span>}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                                {category} • {author}
                            </div>
                        </button>
                    );
                })
            ) : (
                <div className="px-4 py-8 text-center text-gray-500">
                    Không tìm thấy sách nào
                </div>
            )}
        </div>
    );
}
