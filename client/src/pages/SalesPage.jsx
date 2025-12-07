import React, { useState } from 'react';
import { Header } from '../components/Header';
// 1. MOCK DATA 
const MOCK_BOOKS = [
  { id: 1, title: 'Nhập môn lập trình', category: 'Giáo dục', price: 100000, stock: 50 },
  { id: 2, title: 'Cơ sở trí tuệ nhân tạo', category: 'Khoa học', price: 120000, stock: 20 },
  { id: 3, title: 'Đắc nhân tâm', category: 'Kỹ năng sống', price: 80000, stock: 15 },
  { id: 4, title: 'Truyện kinh dị', category: 'Giải trí', price: 50000, stock: 100 },
];

const SalesPage = () => {
  // State quản lý form
  const [customerName, setCustomerName] = useState('');
  const [saleDate, setSaleDate] = useState(new Date().toISOString().slice(0, 10)); // Mặc định hôm nay
  const [selectedBookId, setSelectedBookId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);

  // Xử lý thêm sản phẩm
  const handleAddProduct = () => {
    if (!selectedBookId || quantity <= 0) return alert("Vui lòng chọn sách và nhập số lượng hợp lệ!");

    const book = MOCK_BOOKS.find(b => b.id === parseInt(selectedBookId));
    if (!book) return;

    // Kiểm tra xem sách đã có trong bảng chưa
    const existingItem = cart.find(item => item.id === book.id);
    if (existingItem) {
      setCart(cart.map(item => item.id === book.id ? { ...item, quantity: item.quantity + parseInt(quantity) } : item));
    } else {
      setCart([...cart, { ...book, quantity: parseInt(quantity) }]);
    }
    
    // Reset form nhập sách
    setQuantity(1);
    setSelectedBookId('');
  };

  // Xử lý xóa sản phẩm
  const handleDelete = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  // Xử lý hủy hóa đơn
  const handleReset = () => {
    if(window.confirm("Bạn có chắc muốn hủy hóa đơn này không?")) {
        setCart([]);
        setCustomerName('');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5FA]">
        <Header />
      

      <div main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Lập hóa đơn</h1>
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <div className="grid grid-cols-2 gap-8 mb-4">
            {/* Cột Trái */}
            <div className="space-y-4">
                <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Ngày bán<span className="text-red-500">*</span></label>
                <input 
                    type="date" 
                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                    value={saleDate}
                    onChange={(e) => setSaleDate(e.target.value)}
                />
                </div>
                <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Chọn sách<span className="text-red-500">*</span></label>
                <select 
                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                    value={selectedBookId}
                    onChange={(e) => setSelectedBookId(e.target.value)}
                >
                    <option value="">-- Chọn sách --</option>
                    {MOCK_BOOKS.map(b => (
                    <option key={b.id} value={b.id}>{b.title} (Tồn: {b.stock})</option>
                    ))}
                </select>
                </div>
            </div>

            {/* Cột Phải */}
            <div className="space-y-4">
                <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Khách hàng<span className="text-red-500">*</span></label>
                <input 
                    type="text" 
                    placeholder="Nhập tên khách hàng"
                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                />
                </div>
                <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Số lượng<span className="text-red-500">*</span></label>
                <input 
                    type="number" 
                    min="1"
                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                />
                </div>
            </div>
            </div>

            {/* Nút Thêm sản phẩm */}
            <div className="flex justify-center mt-6">
            <button 
                onClick={handleAddProduct}
                className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-8 rounded shadow transition-colors flex items-center gap-2"
            >
                + Thêm sản phẩm mới
            </button>
            </div>
        </div>

        {/* --- BẢNG HÓA ĐƠN --- */}
        {cart.length > 0 && (
            <div className="mt-8">
            <h2 className="text-2xl font-bold text-blue-600 text-center mb-6 uppercase">HÓA ĐƠN BÁN SÁCH</h2>
            
            {/* Thông tin phụ */}
            <div className="flex justify-between text-blue-600 font-medium mb-4 px-2">
                <span>Họ tên khách hàng: <span className="text-gray-700">{customerName || '...'}</span></span>
                <span>Ngày mua hàng: <span className="text-gray-700">{saleDate}</span></span>
            </div>

            {/* Bảng chi tiết */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <table className="w-full text-left border-collapse">
                <thead className="bg-blue-100 text-blue-800 font-bold text-sm">
                    <tr>
                    <th className="p-3 border-r border-blue-200 text-center w-16">STT</th>
                    <th className="p-3 border-r border-blue-200">Sách</th>
                    <th className="p-3 border-r border-blue-200 text-center">Thể loại</th>
                    <th className="p-3 border-r border-blue-200 text-center">Số lượng</th>
                    <th className="p-3 border-r border-blue-200 text-right">Đơn giá</th>
                    <th className="p-3 border-r border-blue-200 text-right">Thành tiền</th>
                    <th className="p-3 text-center">Xóa sản phẩm</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.map((item, index) => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3 text-center">{index + 1}</td>
                        <td className="p-3 font-medium text-gray-800">{item.title}</td>
                        <td className="p-3 text-center text-gray-600">{item.category}</td>
                        <td className="p-3 text-center">{item.quantity}</td>
                        <td className="p-3 text-right">{item.price.toLocaleString()}đ</td>
                        <td className="p-3 text-right font-bold text-gray-800">
                        {(item.price * item.quantity).toLocaleString()}đ
                        </td>
                        <td className="p-3 text-center">
                        <button 
                            onClick={() => handleDelete(item.id)}
                            className="bg-blue-400 hover:bg-blue-500 text-white p-2 rounded-full w-8 h-8 flex items-center justify-center mx-auto shadow"
                        >
                            🗑️
                        </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-center gap-8 mt-8">
                <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded shadow uppercase transition-transform active:scale-95">
                Đến trang thanh toán
                </button>
                <button 
                    onClick={handleReset}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded shadow uppercase transition-transform active:scale-95"
                >
                Hủy hóa đơn
                </button>
            </div>
            </div>
        )}
        </div>
    </div>
  );
};

export default SalesPage;