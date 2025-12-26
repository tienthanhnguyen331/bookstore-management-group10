export default function BookList({ books = [], onSelect }) {
    return (
        <div className="overflow-y-auto max-h-64">
            {books.length > 0 ? (
                books.map((book) => {
                    const key = book.MaSach ?? book.id;
                    const name = book.TenSach ?? book.name;
                    const category = book.TenTheLoai ?? book.category;
                    const author = book.TenTacGia ?? book.author;
                    const stock = book.SoLuongTon || 0;

                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => onSelect(book)}
                            className="w-full px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-b-0"
                        >
                            <div className="text-gray-900">{`${name} (Tồn: ${stock})`}</div>
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
