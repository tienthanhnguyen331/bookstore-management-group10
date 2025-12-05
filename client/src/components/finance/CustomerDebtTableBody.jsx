import { Edit2 } from "lucide-react";
import EmptyState from "../EmptyState";

export default function CustomerDebtTableBody({ customers, onEditClick }) {
    return (
        <tbody>
            {customers.length === 0 ? (
                <tr>
                    <td colSpan="7" className="px-6 py-12">
                        <EmptyState message="Không tìm thấy khách hàng nào" />
                    </td>
                </tr>
            ) : (
                customers.map((customer, index) => (
                    <tr
                        key={customer.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                        <td className="px-6 py-4 text-gray-700">{index + 1}</td>
                        <td className="px-6 py-4">{customer.name}</td>
                        <td className="px-6 py-4 text-gray-600">
                            {customer.email}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                            {customer.phone}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                            {customer.address}
                        </td>
                        <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full">
                                {customer.debt.toLocaleString("vi-VN")} đ
                            </span>
                        </td>
                        <td className="px-6 py-4">
                            <button
                                onClick={() => onEditClick(customer)}
                                className="p-2 text-blue-400 hover:bg-blue-50 rounded-full transition-colors"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                        </td>
                    </tr>
                ))
            )}
        </tbody>
    );
}
