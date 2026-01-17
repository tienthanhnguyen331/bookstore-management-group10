import api from "./api"; // Đảm bảo bạn đã cấu hình axios trong file api.js

// 1. Hàm tra cứu khách hàng & công nợ
export const getCustomerDebt = async (phone) => {
    // Gọi API: GET /api/HoaDon/TraCuuKhachHang?sdt=...
    // Backend trả về: { MaKH, HoTen, CongNo, ... }
    const response = await api.get('/HoaDon/TraCuuKhachHang', { 
        params: { sdt: phone } 
    });
    return response.data;
};

// 2. Hàm lập hóa đơn (Thanh toán)
export const createInvoice = async (payload) => {
    // Gọi API: POST /api/HoaDon/LapHoaDon
    // Payload nhận vào từ SalesPage: { SDTKhachHang, IsDebt, DanhSachSanPham }
    const response = await api.post('/HoaDon/LapHoaDon', payload);
    return response.data; 
    // Backend trả về: { message, totalAmount, ... }
};

// 3. Export gom nhóm (để tương thích nếu bạn import dạng salesService.method)
export const salesService = {
    getCustomerDebt,
    createInvoice
};