import { useEffect, useState } from 'react';
import { Search, Plus, Save } from 'lucide-react'; 
import { Header } from '../components/Header.jsx';
import BookTable from '../features/books/BookTable';

{/* Dữ liệu sách mẫu */}
const MOCK_BOOKS = [
  { id: 1, title: 'Nhập môn Công nghệ phần mềm', author: 'Lê Văn A', category: 'Giáo trình', price: 120000, stockQuantity: 400 },
  { id: 2, title: 'Đắc Nhân Tâm', author: 'Dale Carnegie', category: 'Kỹ năng sống', price: 85000, stockQuantity: 15 },
  { id: 3, title: 'Nhà Giả Kim', author: 'Paulo Coelho', category: 'Văn học', price: 79000, stockQuantity: 150 },
  { id: 4, title: 'Clean Code', author: 'Robert C. Martin', category: 'Kỹ thuật', price: 350000, stockQuantity: 5 },
  { id: 5, title: 'Tuổi trẻ đáng giá bao nhiêu', author: 'Rosie Nguyễn', category: 'Kỹ năng', price: 90000, stockQuantity: 200 },
];

const BookPage = () => 
{
  return (
    <div className="min-h-screen bg-[#F5F5FA]">
      <Header />
      <main className = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Nút thêm sách và tiêu đề  */}
        <div className = "flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h1 className = "text-2xl font-bold text-gray-900">Danh sách sách</h1>
            <div className = "flex gap-1">
                <button className = "bg-blue-400 text-white px-4 py-2 rounded-lg font-medium">
                  + Thêm sách
                </button>
            </div>
        </div>
        {/* Bảng hiển thị sách */}
        <BookTable books={MOCK_BOOKS} loading={false} onEdit={false} />

        {/* Nút lưu thay đổi */}
        <div className = "mt-8 flex justify-center">
            <button className = "flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 font-medium transition-colors" > Lưu thay đổi </button>
        </div>

      </main>
    </div>
  );
};
export default BookPage;