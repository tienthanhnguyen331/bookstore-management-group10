import { Search, Plus, Save } from "lucide-react";
import { Header } from "../components/Header.jsx";
import BookTable from "../features/books/BookTable";
import { useState, useEffect, useMemo } from "react";
import EditBookModal from "../features/books/EditBookModal.jsx";
import AddBookModal from "../features/books/AddBookModal.jsx";
import { bookService } from "../services/bookService.js";
const BookPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State quản lý Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  // State MỚI: Lưu danh sách ID các sách đã bị chỉnh sửa
  const [modifiedIds, setModifiedIds] = useState(new Set());

  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchBooks = () => {
    if(modifiedIds.size > 0) {
        const confirm = window.confirm("Bạn có chắc muốn tải lại danh sách sách không? Mọi thay đổi chưa lưu sẽ bị mất.");
        if(!confirm) return;
    }
    setLoading(true);
    bookService.getBooks().then(data =>{
        const sortedBooks = data.sort((a, b) => a.id - b.id);
        setBooks(sortedBooks);
        setModifiedIds(new Set()); 
        setLoading(false);
    })
    .catch(err => {
        console.error(err);
        setLoading(false);
    })
  }
  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAddBook = async (newBook) => {

    try {
    //Gọi API post
      await bookService.addBook(newBook);
      alert("Đã thêm sách thành công!");
      setIsAddModalOpen(false); //Đóng modal
      fetchBooks(); //Tải lại danh sách sách
    } catch (error) {
      console.error("Lỗi khi thêm sách:", error);
      alert("Có lỗi xảy ra khi thêm sách!" + (error.response?.data || error.message));
    }
  };  
    // Mở Modal
  const handleEditClick = (book) => {
    setEditingBook(book);
    setIsEditModalOpen(true);
  };

  // Xử lí lưu thay đổi giá sách
  const handleOkEdit = (updatedBook) => {
    const oldBook = books.find(b => b.MaSach === updatedBook.MaSach);

    //So sánh giá
    const oldPrice = parseFloat(oldBook.DonGia);
    const newPrice = parseFloat(updatedBook.DonGia);
    if (oldPrice === newPrice) {
        setIsEditModalOpen(false);
        return;
    }
          // Nếu giá có thay đổi → cập nhật UI + đánh dấu modifiedIds
      setBooks(prevBooks => prevBooks.map(b =>
          b.MaSach === updatedBook.MaSach ? updatedBook : b
      ));

    setModifiedIds(prev => new Set(prev).add(updatedBook.MaSach));

    setIsEditModalOpen(false);
  };

  const handleSaveChanges = async () => {
    if (modifiedIds.size === 0) {
        alert("Không có thay đổi nào để lưu!");
        return;
    }
    try {
        const booksToUpdate = books.filter(b => modifiedIds.has(b.MaSach));
        await Promise.all(booksToUpdate.map(book => bookService.updateBook(book)));
        alert(`Đã cập nhật thành công ${booksToUpdate.length} cuốn sách!`);
        
        // Reset lại trạng thái
        setModifiedIds(new Set()); 
    } catch (error) {
        console.error("Lỗi khi lưu thay đổi:", error);
        alert("Có lỗi xảy ra khi lưu thay đổi!" + (error.response?.data || error.message));
    }
  };
  return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Nút thêm sách và tiêu đề  */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Danh sách sách
                    </h1>
                    <div className="flex gap-1">
                        <button className="bg-blue-400 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-500" onClick={() => setIsAddModalOpen(true)}>
                            + Thêm sách
                        </button>
                    </div>
                </div>
                {/* Thanh tìm kiếm */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm sách</label>
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
                        <Search size={18} className="text-gray-500" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Nhập tên sách, tác giả hoặc thể loại..."
                            className="w-full outline-none text-sm text-gray-800"
                        />
                    </div>
                </div>
                {/* Hiển thị thông báo nếu có thay đổi chưa lưu */}
                {modifiedIds.size > 0 && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md text-sm flex items-center">
                        ⚠️ Bạn đang có {modifiedIds.size} thay đổi chưa lưu. Hãy bấm nút đỏ bên dưới để cập nhật.
                    </div>
                )}
                {/* Bảng hiển thị sách */}
                <BookTable
                    books={
                        useMemo(() => {
                            const term = searchTerm.trim().toLowerCase();
                            if (!term) return books;
                            return books.filter(b =>
                                (b.TenSach || '').toLowerCase().includes(term) ||
                                (b.TenTacGia || '').toLowerCase().includes(term) ||
                                (b.TenTheLoai || '').toLowerCase().includes(term)
                            );
                            }, [books, searchTerm])
                    }
                    loading={loading}
                    onOpenEditModal={handleEditClick}
                />

                {/* Nút lưu thay đổi */}
                <div className="mt-8 flex justify-center">
                    <button 
                        onClick={handleSaveChanges}
                        // disabled={modifiedIds.size === 0} 
                        className= "flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 font-medium">             
                        Lưu thay đổi
                    </button>
                </div>


                {/* Modal */}
                {isEditModalOpen && editingBook && (
                    <EditBookModal 
                        selectedBook={editingBook}
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        onSave={handleOkEdit} // Truyền hàm xử lý Local
                    />
                )}
                <AddBookModal 
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSave={handleAddBook}
                />
            </main>
        </div>
    );
}
export default BookPage;
