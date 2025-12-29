import api from "./api";

export const bookService = {
    // Hàm lấy tất cả sách
    getBooks: async () => {
        const response = await api.get("/Sach");
        return response.data;
    },

    addBook: async (bookData) => {
        const response = await api.post("/Sach/ThemSach", bookData);
        return response.data;
    },

    updateBook: async (bookData) => {
        const response = await api.put(`/Sach/CapNhat`, bookData);
        return response.data;
    }
    // // Hàm lấy sách theo ID
    // getBookById: async (id) => {
    //     return new Promise((resolve) => {
    //         const book = MOCK_BOOKS.find((b) => b.id === id);
    //         setTimeout(() => resolve(book), 300);
        

    
};
