import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { createInvoice, getCustomerDebt } from '../services/salesService';
import { bookService } from '../services/bookService';

const SalesPage = () => {
    // --- Data State ---
    const [books, setBooks] = useState([]); // Danh sách sách từ DB
    const [cart, setCart] = useState([]);   // Giỏ hàng hiện tại

    // --- Form State ---
    const [customerPhone, setCustomerPhone] = useState('');
    const [saleDate, setSaleDate] = useState(new Date().toISOString().slice(0, 10));
    const [selectedBookID, setSelectedBookID] = useState('');
    const [quantity, setQuantity] = useState(1);
    
    // --- UI/Logic State ---
    const [loading, setLoading] = useState(false); // Loading khi bấm thanh toán
    const [customerDebt, setCustomerDebt] = useState(0); // Nợ hiện tại của khách
    const [checkingDebt, setCheckingDebt] = useState(false); // Loading khi đang check nợ
    const [customerError, setCustomerError] = useState(''); // Lỗi nếu ko tìm thấy khách
    const [customerDisplayName, setCustomerDisplayName] = useState('Khách vãng lai');
    
    // --- Settings & Draft State ---
    const [debtLimit, setDebtLimit] = useState(2000000); // Quy định nợ tối đa (mặc định 2tr)
   // const { draft, updateDraft, clearDraft } = useInvoiceDraft(); // Context lưu nháp
    //const [draftHydrated, setDraftHydrated] = useState(false); // Cờ kiểm tra đã load nháp chưa

    useEffect(() => {
        loadBooks();
    }, []);

    useEffect(() => {
    const loadRules = async () => {
      setRulesLoading(true);
      setRulesError('');
      try {
        const data = await settingsService.getRules();
        setDebtLimit(Number(data.maxDebt ?? 2000000));
      } catch (err) {
        console.error('Không tải được quy định nợ khách:', err);
        setRulesError('Không thể tải quy định nợ từ hệ thống.');
      } finally {
        setRulesLoading(false);
      }
    };
    loadRules();
  }, []);

    // Tự động kiểm tra nợ khi nhập số điện thoại khách
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
        const debtInfo = await getCustomerDebt(phone);
        if (!cancelled) {
          setCustomerDebt(debtInfo?.totalDebt ?? 0);
          setCustomerError('');
          setCustomerDisplayName(debtInfo?.fullName || 'Khách vãng lai');
        }
      } catch (err) {
        if (!cancelled) {
          if (err.response && err.response.status === 404) {
            setCustomerError('Không tìm thấy khách hàng trong hệ thống.');
          } else {
            setCustomerError('Không kiểm tra được nợ khách hàng.');
          }
          setCustomerDebt(0);
          setCustomerDisplayName('Khách vãng lai');
        }
      } finally {
        if (!cancelled) setCheckingDebt(false);
      }
    };

    const timer = setTimeout(check, 100); // debounce nhẹ tránh spam API
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [customerPhone]);

    // Xóa item khỏi giỏ
    const handleDelete = (id) => setCart(cart.filter(i => i.id !== id));

    // Logic Functions
    const loadBooks = async () => {
        try {
            const data = await bookService.getAllBooks();
            setBooks(data);
        } catch (error) {
            console.error(err);
            alert("Lỗi tải danh sách sách! Server có chạy không đó?");
        }
    };

    const handleAddToCart = () => {
        if (!selectedBookID || quantity <= 0) return alert("Chọn sách và số lượng đi!");
        const book = books.find(b => b.id === parseInt(selectedBookID));
        
        const existItem = cart.find(i => i.id === book.id);
        if (existItem) {
        setCart(cart.map(i => i.id === book.id ? { ...i, quantity: i.quantity + parseInt(quantity) } : i));
        } else {
        setCart([...cart, { ...book, quantity: parseInt(quantity) }]);
        }
        setQuantity(1);
    };

    const handleCheckout = async (isDebt = false) => {
        if (cart.length === 0) return alert("Giỏ hàng đang trống!");
        if (customerError) return alert(customerError);

        setLoading(true);
        try {
            const payload = {
                customerName: customerPhone ? customerPhone.trim() : "",
                isDebt,
                items: cart.map(item => ({
                    bookId: item.id,
                    quantity: item.quantity
                }))
            };

            const result = await createInvoice(payload);
            alert(`✅ ${result.message}\n💰 Tổng tiền: ${result.totalAmount.toLocaleString()}đ`);

            // Reset form
            setCart([]);
            setCustomerPhone('');
            setCustomerDisplayName('Khách vãng lai');
            setCustomerDebt(0);
            setSelectedBookID('');
            setQuantity(1);
            setSaleDate(new Date().toISOString().slice(0, 10));
            loadBooks(); // Cập nhật lại tồn kho (giả lập)

        } catch (error) {
        // 5. XỬ LÝ LỖI (Backend trả về 400 do vi phạm quy định nợ/tồn kho)
        if (error.response && error.response.data) {
            alert(`❌ KHÔNG THỂ THANH TOÁN:\n${error.response.data.message}`);
        } else {
            console.error(error);
            alert("❌ Lỗi hệ thống hoặc mất kết nối Server!");
        }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Lập Hóa Đơn</h1>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
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
                                <option value="">Chọn sách</option>
                                {
                                    books.map(b => (
                                        <option 
                                            key={b.id}
                                            value={b.id}
                                            disable={b.stock <= 0}
                                            className={b.stock <= 0 ? 'text-red-400' : ''}
                                        >
                                        {b.title} - Giá: {b.price.toLocaleString()} - Kho: {b.stock} {b.stock<=0 ? '(HẾT)' : ''}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Số điện thoại khách hàng</label>
                            <input 
                                type="tel"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={15}
                                className="w-full border p-2 rounded"
                                placeholder="Nhập số điện thoại..."
                                value={customerPhone}
                                onChange={e => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Nợ hiện tại: {checkingDebt ? 'đang kiểm tra...' : `${customerDebt.toLocaleString()}đ`} (giới hạn {debtLimit.toLocaleString()}đ)
                            </p>
                            {customerError && <p className="text-xs text-red-600 mt-1">{customerError}</p>}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Số lượng</label>
                            <input type="number" min="1" className="w-full border p-2 rounded" value={quantity} onChange={e => setQuantity(e.target.value)} />
                        </div>
                    </div>
                </div>
                <button onClick={handleAddToCart} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded mt-2">+ Thêm dòng</button>
            </div>
            {/* BẢNG HÓA ĐƠN */}
            <div className="bg-white rounded shadow-sm border overflow-hidden">
                <h2 className="text-xl font-bold text-blue-600 p-4 border-b bg-blue-50">
                    CHI TIẾT HÓA ĐƠN
                </h2>
                <div className="px-4 py-3 text-xl text-gray-700 border-b bg-white flex flex-col sm:flex-row sm:items-center sm:gap-6">
                    <div className="flex-1 space-y-2">
                        <p className="text-sm text-gray-600 font-semibold">Họ tên khách hàng: {customerDisplayName}</p>
                    </div>
                    <div className="sm:ml-auto text-right">
                        <p className="text-sm text-gray-600 font-semibold">Ngày lập: {saleDate}</p>
                    </div>
                </div>
                <table className="w-full text-left">

                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="p-3 text-center">STT</th>
                            <th className="p-3">Sách</th>
                            <th className="p-3">Thể loại</th>
                            <th className="p-3 text-center">Số lượng</th>
                            <th className="p-3 text-right">Đơn giá</th>
                            <th className="p-3 text-center">Xóa</th>
                        </tr>
                    </thead>

                    <tbody>
                        {cart.map((item, idx) => (
                            <tr key={idx} className="border-b">
                            <td className="p-3 text-center">{idx + 1}</td>
                            <td className="p-3 font-medium">{item.title}</td>
                            <td className="p-3">{item.category || '-'}</td>
                            <td className="p-3 text-center">{item.quantity}</td>
                            <td className="p-3 text-right">{item.price.toLocaleString()}</td>
                            <td className="p-3 text-center"><button className="text-red-500 font-bold" onClick={() => handleDelete(item.id)}>X</button></td>
                            </tr>
                        ))}          
                    </tbody>        
                </table>
                <div className="p-4 flex flex-col gap-3 items-end sm:flex-row sm:justify-end border-t bg-gray-50">

                    <div className="text-lg font-bold text-red-600 mr-auto">
                        Thành tiền: {cart.reduce((sum, i) => sum + i.price * i.quantity, 0).toLocaleString()}đ
                    </div> 
                    <button
                        onClick={() => handleCheckout(false)}
                        disabled={loading || customerDebt > debtLimit || !!customerError}
                        className={`bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded shadow uppercase ${(customerDebt > debtLimit || customerError) ? 'opacity-60 cursor-not-allowed' : ''}`}
                        >
                             {loading ? 'Đang xử lý...' : 'THANH TOÁN'}
                    </button>
                    
                    <button
                        onClick={() => handleCheckout(true)}
                        disabled={loading || customerDebt > debtLimit || !customerPhone.trim() || !!customerError}
                        className={`bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded shadow uppercase ${(customerDebt > debtLimit || !customerPhone.trim() || customerError) ? 'opacity-60 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Đang xử lý...' : 'GHI SỔ NỢ'}
                    </button>
                </div>
            </div>
        </div>
        
    );

};


export default SalesPage;