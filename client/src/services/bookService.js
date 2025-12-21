import api from './api';
const MOCK_BOOKS = [
  { id: 1, title: 'Nhập môn lập trình', category: 'Giáo dục', price: 100000, stock: 50, author: 'Nguyễn Văn A' },
  { id: 2, title: 'Cơ sở trí tuệ nhân tạo', category: 'Khoa học', price: 120000, stock: 20, author: 'Trần Thị B' },
  { id: 3, title: 'Đắc nhân tâm', category: 'Kỹ năng sống', price: 80000, stock: 15, author: 'Dale Carnegie' },
  { id: 4, title: 'Truyện kinh dị', category: 'Giải trí', price: 50000, stock: 100, author: 'Stephen King' },
  { id: 5, title: 'Dế mèn phiêu lưu ký', category: 'Văn học', price: 45000, stock: 0, author: 'Tô Hoài' },
];

export const bookService = {
  // Hàm lấy tất cả sách
  getBooks: async () => {
    const response = await api.get('/Sach');
    return response.data;
  },

  addBook: async (bookData) => {
  const response = await api.post('/Sach/ThemSach', bookData);
  return response.data;
},

  updateBook: async (bookData) => {
  const response = await api.put(`/Sach/CapNhat`, bookData);
  return response.data;
},
  // Hàm lấy sách theo ID
  getBookById: async (id) => {
    return new Promise((resolve) => {
      const book = MOCK_BOOKS.find(b => b.id === id);
      setTimeout(() => resolve(book), 300);
    });
  },
  
  // Hàm tìm kiếm sách
  searchBooks: async (keyword) => {
      return new Promise((resolve) => {
          const result = MOCK_BOOKS.filter(b => 
              b.title.toLowerCase().includes(keyword.toLowerCase())
          );
          setTimeout(() => resolve(result), 400);
      });
  }
};
