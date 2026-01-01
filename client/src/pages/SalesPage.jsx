import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { createInvoice } from "../services/salesService"; // Hoặc salesService.createInvoice tùy cách export
import { bookService } from "../services/bookService";
import { settingsService } from "../services/settingsService";
import { salesService } from "../services/salesService";

const SalesPage = () => {
    // --- Data State ---
    const [books, setBooks] = useState([]); // Danh sách sách từ DB
    const [cart, setCart] = useState([]); // Giỏ hàng hiện tại

    // --- Form State ---
    const [customerPhone, setCustomerPhone] = useState("");
    const [saleDate, setSaleDate] = useState(
        new Date().toISOString().slice(0, 10)
    );
    const [selectedBookID, setSelectedBookID] = useState("");
    const [quantity, setQuantity] = useState(1);

    // --- State load quy định ---
    const [rulesLoading, setRulesLoading] = useState(false);
    const [rulesError, setRulesError] = useState("");

    // --- UI/Logic State ---
    const [loading, setLoading] = useState(false); // Loading khi bấm thanh toán
    const [customerDebt, setCustomerDebt] = useState(0); // Nợ hiện tại của khách
    const [checkingDebt, setCheckingDebt] = useState(false); // Loading khi đang check nợ
    const [customerError, setCustomerError] = useState(""); // Lỗi nếu ko tìm thấy khách
    const [customerDisplayName, setCustomerDisplayName] =
        useState("Khách vãng lai");

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
            setRulesError("");
            try {
                const data = await settingsService.getRules();
                // Backend trả về chuỗi hoặc số, ép kiểu cho chắc
                const maxDebtVal = data.QD2_NoToiDa || data.maxDebt || 2000000;
                setDebtLimit(Number(maxDebtVal));
            } catch (err) {
                console.error("Không tải được quy định nợ khách:", err);
                setRulesError("Không thể tải quy định nợ từ hệ thống.");
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
            setCustomerError("");
            setCustomerDisplayName("Khách vãng lai");
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
                    setCustomerError("");
                    setCustomerDisplayName(customer.HoTen || "Khách vãng lai");
                }
            } catch (err) {
                if (!cancelled) {
                    // Nếu lỗi 404 nghĩa là khách chưa có trong hệ thống -> Vẫn cho bán (Khách vãng lai)
                    // Backend trả về message trong err.response.data
                    if (
                        err.response &&
                        (err.response.status === 404 ||
                            err.response.status === 200)
                    ) {
                        // Một số API trả 200 nhưng nội dung báo là "Khách vãng lai"
                        setCustomerDebt(0);
                        setCustomerDisplayName("Khách vãng lai");
                        setCustomerError(""); // Không coi là lỗi, chỉ là chưa có dữ liệu
                    } else {
                        setCustomerError("Lỗi kết nối kiểm tra khách hàng.");
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
        setCart(cart.filter((i) => i.MaSach !== maSach));
    };

    // Hàm thêm vào giỏ hàng
    const handleAddToCart = () => {
        // 1. Validate input
        if (!selectedBookID || quantity <= 0) {
            return alert("Vui lòng chọn sách và nhập số lượng hợp lệ!");
        }

        // 2. Tìm sách trong danh sách gốc (Dùng MaSach)
        const book = books.find((b) => b.MaSach === selectedBookID);

        if (!book) {
            console.error("Không tìm thấy sách ID:", selectedBookID);
            return;
        }

        // 3. Kiểm tra trong giỏ hàng xem có chưa
        const existItem = cart.find((i) => i.MaSach === book.MaSach);

        if (existItem) {
            // Nếu có rồi -> Cộng dồn số lượng
            // Kiểm tra tồn kho trước khi cộng
            if (existItem.quantity + parseInt(quantity) > book.SoLuongTon) {
                return alert(
                    `Kho chỉ còn ${book.SoLuongTon} cuốn. Giỏ hàng đang có ${existItem.quantity}.`
                );
            }

            setCart(
                cart.map((i) =>
                    i.MaSach === book.MaSach
                        ? { ...i, quantity: i.quantity + parseInt(quantity) }
                        : i
                )
            );
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
        if (
            customerError &&
            customerError !== "Không tìm thấy khách hàng trong hệ thống."
        ) {
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
                DanhSachSanPham: cart.map((item) => ({
                    MaSach: item.MaSach, // Dùng MaSach
                    SoLuong: parseInt(item.quantity), // Đảm bảo số nguyên
                })),
            };

            // Gọi API (createInvoice import từ service)
            const result = await createInvoice(payload);

            const tongTienThucTe = result.tongTien || result.TongTien || 0;

            alert(
                `✅ ${
                    result.message || "Thanh toán thành công!"
                }\n💰 Tổng tiền: ${tongTienThucTe.toLocaleString()}đ`
            );

            // Reset form hoàn toàn
            setCart([]);
            setCustomerPhone("");
            setCustomerDisplayName("Khách vãng lai");
            setCustomerDebt(0);
            setSelectedBookID("");
            setQuantity(1);
            setSaleDate(new Date().toISOString().slice(0, 10));

            // Load lại sách để cập nhật Tồn Kho mới
            await loadBooks();
        } catch (error) {
            // Xử lý lỗi từ Backend trả về
            if (error.response && error.response.data) {
                // Backend trả về BadRequest(new { message = "..." })
                const msg =
                    error.response.data.message ||
                    JSON.stringify(error.response.data);
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
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="max-w-7xl mx-auto px-6 py-8">
                <h1 className="mb-8">Lập Hóa Đơn</h1>

                {/* FORM NHẬP LIỆU */}
                <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Left Column */}
                        <div className="space-y-6">
                            <div className="mb-13">
                                <label className="block mb-2">
                                    Ngày lập hóa đơn
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-400"
                                    value={saleDate}
                                    onChange={(e) =>
                                        setSaleDate(e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <label className="block mb-2">
                                    Chọn sách
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-400"
                                    value={selectedBookID}
                                    onChange={(e) =>
                                        setSelectedBookID(e.target.value)
                                    }
                                >
                                    <option value="">-- Chọn sách --</option>
                                    {books.map((b) => (
                                        <option
                                            key={b.MaSach}
                                            value={b.MaSach}
                                            disabled={b.SoLuongTon <= 0}
                                        >
                                            {b.TenSach} - Giá:{" "}
                                            {(b.DonGia || 0).toLocaleString()}đ
                                            - Kho: {b.SoLuongTon}{" "}
                                            {b.SoLuongTon <= 0 ? "(HẾT)" : ""}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            <div>
                                <label className="block mb-2">
                                    Số điện thoại khách hàng
                                </label>
                                <input
                                    type="tel"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={15}
                                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-400"
                                    placeholder="Nhập SĐT để tìm hoặc bán khách lẻ..."
                                    value={customerPhone}
                                    onChange={(e) =>
                                        setCustomerPhone(
                                            e.target.value.replace(/\D/g, "")
                                        )
                                    }
                                />
                                <div className="mt-2 flex justify-between items-start text-sm">
                                    <p className="text-gray-500">
                                        Nợ hiện tại:{" "}
                                        <span className="text-blue-400">
                                            {checkingDebt
                                                ? "..."
                                                : `${customerDebt.toLocaleString()}đ`}
                                        </span>
                                        <span className="text-gray-400">
                                            {" "}
                                            (Max: {debtLimit.toLocaleString()}đ)
                                        </span>
                                    </p>
                                    {customerError && (
                                        <span className="text-orange-500">
                                            {customerError}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block mb-2">
                                    Số lượng mua
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-400"
                                    value={quantity}
                                    onChange={(e) =>
                                        setQuantity(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className="px-6 py-2 bg-blue-400 text-white rounded hover:bg-blue-500 transition-colors"
                    >
                        + Thêm vào giỏ
                    </button>
                </div>

                {/* BẢNG GIỎ HÀNG */}
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="mb-4">Chi tiết hóa đơn</h2>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-gray-500">
                            <p>
                                Khách hàng:{" "}
                                <span className="text-gray-900">
                                    {customerDisplayName}
                                </span>
                            </p>
                            <p>Ngày lập: {saleDate}</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-3 text-left">STT</th>
                                    <th className="px-4 py-3 text-left">
                                        Tên Sách
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        Thể loại
                                    </th>
                                    <th className="px-4 py-3 text-center">
                                        SL
                                    </th>
                                    <th className="px-4 py-3 text-right">
                                        Đơn giá
                                    </th>
                                    <th className="px-4 py-3 text-right">
                                        Thành tiền
                                    </th>
                                    <th className="px-4 py-3 text-center">
                                        Xóa
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-4 py-8 text-center text-gray-400"
                                        >
                                            Chưa có sản phẩm nào
                                        </td>
                                    </tr>
                                ) : (
                                    cart.map((item, idx) => (
                                        <tr
                                            key={item.MaSach || idx}
                                            className="border-t border-gray-100"
                                        >
                                            <td className="px-4 py-4">
                                                {idx + 1}
                                            </td>
                                            <td className="px-4 py-4">
                                                {item.TenSach}
                                            </td>
                                            <td className="px-4 py-4 text-gray-500">
                                                {item.TenTheLoai ||
                                                    item.TheLoai?.TenTL ||
                                                    "-"}
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                {item.quantity}
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                {(
                                                    item.DonGia || 0
                                                ).toLocaleString()}
                                                đ
                                            </td>
                                            <td className="px-4 py-4 text-right text-blue-400">
                                                {(
                                                    (item.DonGia || 0) *
                                                    item.quantity
                                                ).toLocaleString()}
                                                đ
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <button
                                                    className="text-red-500 hover:text-red-600 px-2"
                                                    onClick={() =>
                                                        handleDelete(
                                                            item.MaSach
                                                        )
                                                    }
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center sm:justify-between">
                        <div className="text-gray-500">
                            Tổng cộng:{" "}
                            <span className="text-blue-400">
                                {cart
                                    .reduce(
                                        (sum, i) =>
                                            sum + (i.DonGia || 0) * i.quantity,
                                        0
                                    )
                                    .toLocaleString()}
                                đ
                            </span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            {/* Nút Thanh Toán (Tiền mặt) */}
                            <button
                                onClick={() => handleCheckout(false)}
                                disabled={loading || cart.length === 0}
                                className={`px-6 py-2 bg-blue-400 text-white rounded hover:bg-blue-500 transition-colors ${
                                    loading || cart.length === 0
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                }`}
                            >
                                {loading ? "Đang xử lý..." : "Thanh toán"}
                            </button>

                            {/* Nút Ghi Nợ */}
                            <button
                                onClick={() => handleCheckout(true)}
                                disabled={
                                    loading ||
                                    cart.length === 0 ||
                                    !customerPhone.trim() ||
                                    customerDisplayName === "Khách vãng lai"
                                }
                                className={`px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors ${
                                    loading ||
                                    cart.length === 0 ||
                                    !customerPhone.trim() ||
                                    customerDisplayName === "Khách vãng lai"
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                }`}
                                title={
                                    !customerPhone.trim()
                                        ? "Vui lòng nhập SĐT khách hàng để ghi nợ"
                                        : ""
                                }
                            >
                                {loading ? "Đang xử lý..." : "Ghi sổ nợ"}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SalesPage;
