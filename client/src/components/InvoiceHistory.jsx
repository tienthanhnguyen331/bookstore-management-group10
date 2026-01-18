import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { salesService } from "../services/salesService";
import formatCurrency from "../utils/formatCurrency";

const InvoiceHistory = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const data = await salesService.getInvoices();
            // Sort by date desc
            const sortedData = data.sort(
                (a, b) => new Date(b.NgayLap) - new Date(a.NgayLap)
            );
            setInvoices(sortedData);
        } catch (err) {
            console.error("Error fetching invoices:", err);
            setError("Không thể tải danh sách hóa đơn.");
        } finally {
            setLoading(false);
        }
    };

    const handleExportPDF = async (invoice) => {
        const doc = new jsPDF();

        // Add Vietnamese font (Roboto-Regular)
        try {
            const fontUrl = "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf";
            const response = await fetch(fontUrl);
            const blob = await response.blob();
            const reader = new FileReader();

            await new Promise((resolve) => {
                reader.onloadend = () => {
                    const base64data = reader.result.split(",")[1];
                    doc.addFileToVFS("Roboto-Regular.ttf", base64data);
                    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
                    doc.setFont("Roboto");
                    resolve();
                };
                reader.readAsDataURL(blob);
            });
        } catch (e) {
            console.error("Could not load font, falling back to default", e);
        }

        // HEADER
        doc.setFontSize(22);
        doc.setTextColor(40, 40, 40);
        doc.text("HOA DON BAN HANG", 105, 20, { align: "center" });

        doc.setFontSize(10);
        doc.text(`Ma HD: ${invoice.MaHoaDon}`, 14, 30);
        doc.text(
            `Ngay lap: ${new Date(invoice.NgayLap).toLocaleString("vi-VN")}`,
            14,
            35
        );
        doc.text(`Khach hang: ${invoice.TenKhachHang}`, 14, 40);
        if (invoice.SDTKhachHang) {
            doc.text(`SDT: ${invoice.SDTKhachHang}`, 14, 45);
        }

        // TABLE
        const tableColumn = ["STT", "Ten Sach", "SL", "Don Gia", "Thanh Tien"];
        const tableRows = [];

        invoice.DanhSachSanPham.forEach((item, index) => {
            const rowData = [
                index + 1,
                item.TenSach,
                item.SoLuong,
                item.DonGia.toLocaleString("vi-VN") + " d",
                item.ThanhTien.toLocaleString("vi-VN") + " d",
            ];
            tableRows.push(rowData);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 55,
            theme: "grid",
            headStyles: { fillColor: [66, 133, 244] }, // Blue header
            styles: { font: "Roboto" }, // Use custom font
        });

        // TOTAL
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(12);
        doc.setFont("Roboto", "normal");
        doc.text(
            `Tong cong: ${invoice.TongTien.toLocaleString("vi-VN")} d`,
            190,
            finalY,
            { align: "right" }
        );

        doc.save(`HoaDon_${invoice.MaHoaDon}.pdf`);
    };

    const filteredInvoices = invoices.filter((inv) =>
        inv.TenKhachHang.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.MaHoaDon.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (inv.SDTKhachHang && inv.SDTKhachHang.includes(searchTerm))
    );

    if (loading) return <div className="text-center py-8">Đang tải lịch sử...</div>;
    if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Lịch Sử Hóa Đơn</h2>
                <input
                    type="text"
                    placeholder="Tìm theo tên, SĐT, mã HD..."
                    className="border border-gray-300 rounded px-4 py-2 w-full max-w-sm focus:outline-none focus:border-blue-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b border-gray-200">
                            <th className="px-4 py-3 font-medium text-gray-600">Mã HD</th>
                            <th className="px-4 py-3 font-medium text-gray-600">Ngày Lập</th>
                            <th className="px-4 py-3 font-medium text-gray-600">Khách Hàng</th>
                            <th className="px-4 py-3 font-medium text-gray-600 text-right">Tổng Tiền</th>
                            <th className="px-4 py-3 font-medium text-gray-600 text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInvoices.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-4 py-8 text-center text-gray-400">
                                    Không tìm thấy hóa đơn nào
                                </td>
                            </tr>
                        ) : (
                            filteredInvoices.map((inv) => (
                                <tr key={inv.MaHoaDon} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-800">{inv.MaHoaDon}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {new Date(inv.NgayLap).toLocaleString("vi-VN")}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-800">
                                        <div>{inv.TenKhachHang}</div>
                                        {inv.SDTKhachHang && (
                                            <div className="text-xs text-gray-500">{inv.SDTKhachHang}</div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-medium text-blue-600 text-right">
                                        {inv.TongTien.toLocaleString("vi-VN")} đ
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => handleExportPDF(inv)}
                                            className="text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-xs transition-colors shadow-sm"
                                        >
                                            Xuất PDF
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InvoiceHistory;
