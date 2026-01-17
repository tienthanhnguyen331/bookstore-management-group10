export default function BookDetails({ book }) {
    if (!book) return null;
    return (
        <div className="grid grid-cols-3 gap-6">
            <div>
                <label className="block mb-2 text-gray-600">Thể loại</label>
                <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded text-gray-700">
                    {book.TenTheLoai}
                </div>
            </div>
            <div>
                <label className="block mb-2 text-gray-600">Tác giả</label>
                <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded text-gray-700">
                    {book.TenTacGia}
                </div>
            </div>
        </div>
    );
}
