import React from "react";
import RecentOrdersRow from "./RecentOrdersRow";

// temp data -> waitng for data from be
const orders = [
    {
        id: "#HD01",
        date: "15/11/2025",
        customer: "Nguyễn Văn A",
        total: "175.000đ",
    },
    {
        id: "#HD02",
        date: "15/11/2025",
        customer: "Nguyễn Văn C",
        total: "173.000đ",
    },
    {
        id: "#HD03",
        date: "15/11/2025",
        customer: "Nguyễn Văn C",
        total: "177.000đ",
    },
    {
        id: "#HD04",
        date: "15/11/2025",
        customer: "Nguyễn Văn D",
        total: "178.000đ",
    },
    {
        id: "#HD05",
        date: "15/11/2025",
        customer: "Nguyễn Văn D",
        total: "178.000đ",
    },
    {
        id: "#HD06",
        date: "15/11/2025",
        customer: "Nguyễn Văn D",
        total: "178.000đ",
    },
    {
        id: "#HD07",
        date: "15/11/2025",
        customer: "Nguyễn Văn D",
        total: "178.000đ",
    },
];

export function RecentOrdersTable() {
    return (
        <section>
            <h2 className="mb-6 text-xl font-semibold">Đơn hàng gần đây</h2>

            <div className="bg-white rounded-lg shadow-sm overflow-auto h-96">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left px-6 py-4">Mã HD</th>
                            <th className="text-left px-6 py-4">Ngày bán</th>
                            <th className="text-left px-6 py-4">Khách hàng</th>
                            <th className="text-left px-6 py-4">Tổng tiền</th>
                            <th className="text-left px-6 py-4">Chi tiết</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, index) => (
                            <RecentOrdersRow key={index} order={order} />
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
