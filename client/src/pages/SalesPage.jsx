import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { createInvoice } from '../services/salesService'; // Hoặc salesService.createInvoice tùy cách export
import { bookService } from '../services/bookService';
import { settingsService } from '../services/settingsService';
import { salesService } from '../services/salesService';

const SalesPage = () => {
    // --- Data State ---
    const [books, setBooks] = useState([]); // Danh sách sách từ DB
    const [cart, setCart] = useState([]);   // Giỏ hàng hiện tại

    // --- Form State ---
    const [customerPhone, setCustomerPhone] = useState('');
    const [saleDate, setSaleDate] = useState(new Date().toISOString().slice(0, 10));
    const [selectedBookID, setSelectedBookID] = useState('');
    const [quantity, setQuantity] = useState(1);
    
    // --- State load quy định ---
    const [rulesLoading, setRulesLoading] = useState(false);
    const [rulesError, setRulesError] = useState('');
    
    // --- UI/Logic State ---
    const [loading, setLoading] = useState(false); // Loading khi bấm thanh toán
    const [customerDebt, setCustomerDebt] = useState(0); // Nợ hiện tại của khách
    const [checkingDebt, setCheckingDebt] = useState(false); // Loading khi đang check nợ
    const [customerError, setCustomerError] = useState(''); // Lỗi nếu ko tìm thấy khách
    const [customerDisplayName, setCustomerDisplayName] = useState('Khách vãng lai');
    
    // --- Settings State ---
    const [debtLimit, setDebtLimit] = useState(2000000); // Quy định nợ tối đa

    // 1. Load danh sách sách
    useEffect(() => {
        loadBooks();
    }, []);

    // 2. Load Quy định (Nợ tối đa)
    useEffect(() => {
        const loadRules = async () => {
            setRulesLoading(true);
            setRulesError('');
            try {
                const data = await settingsService.getRules();
                // Backend trả về chuỗi hoặc số, ép kiểu cho chắc
                const maxDebtVal = data.QD2_NoToiDa || data.maxDebt || 2000000; 
                setDebtLimit(Number(maxDebtVal));
            } catch (err) {
                console.error('Không tải được quy định nợ khách:', err);
                setRulesError('Không thể tải quy định nợ từ hệ thống.');
            } finally {
                setRulesLoading(false);
            }
        };
        loadRules();
    }, []);

    // 3. Tự động kiểm tra nợ khi nhập số điện thoại (Debounce)
    useEffect(() => {
        const phone = customerPhone.trim();
        if (!phone) {
            setCustomerDebt(0);
            setCustomerError('');
            setCustomerDisplayName('Khách vãng lai');
            return;
        }

        let cancelled = false;
        const check = async () => {
            setCheckingDebt(true);
            try {
                const customer = await salesService.getCustomerDebt(phone);
                // Log để debug xem cấu trúc trả về
                console.log("Thông tin khách:", customer); 
                
                if (!cancelled) {
                    setCustomerDebt(customer.CongNo ?? 0);
                    setCustomerError('');
                    setCustomerDisplayName(customer.HoTen || 'Khách vãng lai');
                }
            } catch (err) {
                if (!cancelled) {
                    // Nếu lỗi 404 nghĩa là khách chưa có trong hệ thống -> Vẫn cho bán (Khách vãng lai)
                    // Backend trả về message trong err.response.data
                    if (err.response && (err.response.status === 404 || err.response.status === 200)) {
                         // Một số API trả 200 nhưng nội dung báo là "Khách vãng lai"
                         setCustomerDebt(0);
                         setCustomerDisplayName('Khách vãng lai');
                         setCustomerError(''); // Không coi là lỗi, chỉ là chưa có dữ liệu
                    } else {
                        setCustomerError('Lỗi kết nối kiểm tra khách hàng.');
                    }
                }
            } finally {
                if (!cancelled) setCheckingDebt(false);
            }
        };

        const timer = setTimeout(check, 300); // Tăng delay lên 300ms cho mượt
        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [customerPhone]);

    // Hàm tải sách
    const loadBooks = async () => {
        try {
            const data = await bookService.getBooks();
            setBooks(data);
        } catch (error) {
            console.error(error);
            alert("Lỗi tải danh sách sách! Vui lòng kiểm tra Server.");
        }
    };

    // Hàm xóa sách khỏi giỏ (Dùng MaSach)
    const handleDelete = (maSach) => {
        setCart(cart.filter(i => i.MaSach !== maSach));
    };

    // Hàm thêm vào giỏ hàng
    const handleAddToCart = () => {
        // 1. Validate input
        if (!selectedBookID || quantity <= 0) {
            return alert("Vui lòng chọn sách và nhập số lượng hợp lệ!");
        }

        // 2. Tìm sách trong danh sách gốc (Dùng MaSach)
        const book = books.find(b => b.MaSach === selectedBookID);
        
        if (!book) {
            console.error("Không tìm thấy sách ID:", selectedBookID);
            return; 
        }

        // 3. Kiểm tra trong giỏ hàng xem có chưa
        const existItem = cart.find(i => i.MaSach === book.MaSach);

        if (existItem) {
            // Nếu có rồi -> Cộng dồn số lượng
            // Kiểm tra tồn kho trước khi cộng
            if (existItem.quantity + parseInt(quantity) > book.SoLuongTon) {
                return alert(`Kho chỉ còn ${book.SoLuongTon} cuốn. Giỏ hàng đang có ${existItem.quantity}.`);
            }

            setCart(cart.map(i => 
                i.MaSach === book.MaSach 
                    ? { ...i, quantity: i.quantity + parseInt(quantity) } 
                    : i
            ));
        } else {
            // Nếu chưa có -> Thêm mới
            if (parseInt(quantity) > book.SoLuongTon) {
                return alert(`Kho chỉ còn ${book.SoLuongTon} cuốn!`);
            }
            // Spread properties của book vào item để có TenSach, DonGia...
            setCart([...cart, { ...book, quantity: parseInt(quantity) }]);
        }
        
        // Reset số lượng về 1 sau khi thêm
        setQuantity(1);
    };

    // --- HÀM THANH TOÁN ---
    const handleCheckout = async (isDebt = false) => {
        if (cart.length === 0) return alert("Giỏ hàng đang trống!");
        if (customerError && customerError !== 'Không tìm thấy khách hàng trong hệ thống.') {
             // Chỉ chặn nếu lỗi hệ thống, còn lỗi ko tìm thấy khách thì coi là khách mới/vãng lai
             return alert(customerError);
        }

        setLoading(true);
        try {
            // Chuẩn bị dữ liệu gửi đi (Payload)
            // Cấu trúc này PHẢI khớp với class LapHoaDonDto trong C#
            const payload = {
                SDTKhachHang: customerPhone ? customerPhone.trim() : "", 
                IsDebt: isDebt, // Gửi cờ nợ/tiền mặt
                At: saleDate,
                DanhSachSanPham: cart.map(item => ({
                    MaSach: item.MaSach, // Dùng MaSach
                    SoLuong: parseInt(item.quantity) // Đảm bảo số nguyên
                }))
            };

            // Gọi API (createInvoice import từ service)
            const result = await createInvoice(payload);
            
            const tongTienThucTe = result.tongTien || result.TongTien || 0;

            alert(`✅ ${result.message || "Thanh toán thành công!"}\n💰 Tổng tiền: ${tongTienThucTe.toLocaleString()}đ`);

            // Reset form hoàn toàn
            setCart([]);
            setCustomerPhone('');
            setCustomerDisplayName('Khách vãng lai');
            setCustomerDebt(0);
            setSelectedBookID('');
            setQuantity(1);
            setSaleDate(new Date().toISOString().slice(0, 10));
            
            // Load lại sách để cập nhật Tồn Kho mới
            await loadBooks(); 

        } catch (error) {
            // Xử lý lỗi từ Backend trả về
            if (error.response && error.response.data) {
                // Backend trả về BadRequest(new { message = "..." })
                const msg = error.response.data.message || JSON.stringify(error.response.data);
                alert(`❌ KHÔNG THỂ THANH TOÁN:\n${msg}`);
            } else {
                console.error(error);
                alert("❌ Lỗi hệ thống hoặc mất kết nối Server!");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F5FA]">
            <Header />
    
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Lập Hóa Đơn</h1>
                
                {/* FORM NHẬP LIỆU */}
                <div className = "grid grid-cols-2 gap-8 mb-4">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Ngày lập hóa đơn</label>
                            <input type="date" className="w-full border p-2 rounded" value={saleDate} onChange={e => setSaleDate(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Chọn sách</label>
                            <select 
                                className="w-full border p-2 rounded" value={selectedBookID}
                                onChange={e => setSelectedBookID(e.target.value)}
                            >
                                <option value="">-- Chọn sách --</option>
                                {books.map(b => (
                                    <option 
                                        key={b.MaSach} 
                                        value={b.MaSach}
                                        disabled={b.SoLuongTon <= 0}
                                        className={b.SoLuongTon <= 0 ? 'text-red-400 italic' : ''}
                                    >
                                        {b.TenSach} - Giá: {(b.DonGia || 0).toLocaleString()} - Kho: {b.SoLuongTon} {b.SoLuongTon <= 0 ? '(HẾT)' : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Số điện thoại khách hàng</label>
                            <div className="flex gap-2">
                                <input 
                                    type="tel"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={15}
                                    className="w-full border p-2 rounded"
                                    placeholder="Nhập SĐT để tìm hoặc bán khách lẻ..."
                                    value={customerPhone}
                                    onChange={e => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                                />
                            </div>
                            <div className="mt-1 flex justify-between items-start">
                                <p className="text-xs text-gray-500">
                                    Nợ hiện tại: <span className="font-bold text-blue-600">{checkingDebt ? '...' : `${customerDebt.toLocaleString()}đ`}</span> 
                                    (Max: {debtLimit.toLocaleString()}đ)
                                </p>
                                {customerError && <span className="text-xs text-orange-500">{customerError}</span>}
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Số lượng mua</label>
                            <input type="number" min="1" className="w-full border p-2 rounded" value={quantity} onChange={e => setQuantity(e.target.value)} />
                        </div>
                    </div>
                </div>
                
                <button 
                    onClick={handleAddToCart} 
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded mt-2 shadow"
                >
                    + Thêm vào giỏ
                </button>
            </div>

            {/* BẢNG GIỎ HÀNG */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white rounded shadow-sm border overflow-hidden">
                <h2 className="text-xl font-bold text-blue-600 p-4 border-b bg-blue-50">
                    CHI TIẾT HÓA ĐƠN
                </h2>
                <div className="px-4 py-3 text-xl text-gray-700 border-b bg-white flex flex-col sm:flex-row sm:items-center sm:gap-6">
                    <div className="flex-1 space-y-2">
                        <p className="text-sm text-gray-600 font-semibold">
                            Khách hàng: <span className="text-black text-lg">{customerDisplayName}</span>
                        </p>
                    </div>
                    <div className="sm:ml-auto text-right">
                        <p className="text-sm text-gray-600 font-semibold">Ngày lập: {saleDate}</p>
                    </div>
                </div>

                <table className="w-full text-left">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="p-3 text-center w-12">STT</th>
                            <th className="p-3">Tên Sách</th>
                            <th className="p-3">Thể loại</th>
                            <th className="p-3 text-center">SL</th>
                            <th className="p-3 text-right">Đơn giá</th>
                            <th className="p-3 text-right">Thành tiền</th>
                            <th className="p-3 text-center w-16">Xóa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.length === 0 ? (
                            <tr><td colSpan="7" className="p-4 text-center text-gray-400 italic">Chưa có sản phẩm nào</td></tr>
                        ) : (
                            cart.map((item, idx) => (
                                <tr key={item.MaSach || idx} className="border-b hover:bg-gray-50">
                                    <td className="p-3 text-center">{idx + 1}</td>
                                    <td className="p-3 font-medium">{item.TenSach}</td>
                                    <td className="p-3 text-gray-500 text-sm">{item.TenTheLoai || item.TheLoai?.TenTL || '-'}</td>
                                    <td className="p-3 text-center font-bold">{item.quantity}</td>
                                    <td className="p-3 text-right">{(item.DonGia || 0).toLocaleString()}</td>
                                    <td className="p-3 text-right font-bold text-blue-600">
                                        {((item.DonGia || 0) * item.quantity).toLocaleString()}
                                    </td>
                                    <td className="p-3 text-center">
                                        <button 
                                            className="text-red-500 hover:text-red-700 font-bold px-2"
                                            onClick={() => handleDelete(item.MaSach)}
                                        >
                                            X
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>        
                </table>

                <div className="p-4 flex flex-col gap-3 items-end sm:flex-row sm:justify-end border-t bg-gray-50">
                    <div className="text-xl font-bold text-red-600 mr-auto">
                        Tổng cộng: {cart.reduce((sum, i) => sum + (i.DonGia || 0) * i.quantity, 0).toLocaleString()} VNĐ
                    </div> 
                    
                    {/* Nút Thanh Toán (Tiền mặt) */}
                    <button
                        onClick={() => handleCheckout(false)}
                        disabled={loading || cart.length === 0}
                        className={`bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded shadow uppercase flex items-center gap-2 ${
                            (loading || cart.length === 0) ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {loading ? 'Đang xử lý...' : 'Thanh Toán (Tiền Mặt)'}
                    </button>
                    
                    {/* Nút Ghi Nợ (Chỉ hiện khi có nhập SĐT) */}
                    <button
                        onClick={() => handleCheckout(true)}
                        disabled={loading || cart.length === 0 || !customerPhone.trim() || customerDisplayName === 'Khách vãng lai'}
                        className={`bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded shadow uppercase flex items-center gap-2 ${
                            (loading || cart.length === 0 || !customerPhone.trim() || customerDisplayName === 'Khách vãng lai') ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        title={!customerPhone.trim() ? "Vui lòng nhập SĐT khách hàng để ghi nợ" : ""}
                    >
                        {loading ? 'Đang xử lý...' : 'Ghi Sổ Nợ'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SalesPage;