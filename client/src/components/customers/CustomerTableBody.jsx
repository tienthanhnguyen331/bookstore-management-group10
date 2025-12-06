import { Edit2, Trash2 } from "lucide-react";
import EmptyState from "../EmptyState";

function CustomerTableBody({ customers, onEdit, onDelete }) {
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
                        key={index}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                        <td className="px-6 py-4 text-gray-700">
                            {customer.id}
                        </td>
                        <td className="px-6 py-4">{customer.name}</td>
                        <td className="px-6 py-4 text-gray-600">
                            {customer.email}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                            {customer.address}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                            {customer.phone}
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => onEdit(customer)}
                                    className="p-2 text-blue-400 hover:bg-blue-50 rounded-full transition-colors"
                                    title="Chỉnh sửa"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => onDelete(customer)}
                                    className="p-2 text-red-400 hover:bg-red-50 rounded-full transition-colors"
                                    title="Xóa"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))
            )}
        </tbody>
    );
}

export default CustomerTableBody;
