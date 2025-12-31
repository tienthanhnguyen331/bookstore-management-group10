import { Edit2, Trash2 } from "lucide-react";
import EmptyState from "../EmptyState";
import formatCurrency from "../../utils/formatCurrency";

function CustomerTableBody({
    customers,
    onEdit,
    showDebtColumn = false,
    emptyMessage = "Không tìm thấy khách hàng nào",
    colSpan = 7,
    useIndexAsKey = false,
}) {
    return (
        <tbody>
            {customers.length === 0 ? (
                <tr>
                    <td colSpan={colSpan} className="px-6 py-12">
                        <EmptyState message={emptyMessage} />
                    </td>
                </tr>
            ) : (
                customers.map((customer, index) => (
                    <tr
                        key={useIndexAsKey ? index : customer.MaKH}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                        {showDebtColumn ? (
                            <>
                                <td className="px-6 py-4 text-gray-700">
                                    {index + 1}
                                </td>
                                <td className="px-6 py-4">{customer.HoTen}</td>
                                <td className="px-6 py-4 text-gray-600">
                                    {customer.Email}
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                    {customer.SDT}
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                    {customer.DiaChi}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full">
                                        {formatCurrency(customer.CongNo)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button
                                        onClick={() => onEdit(customer)}
                                        className="p-2 text-blue-400 hover:bg-blue-50 rounded-full transition-colors"
                                        title="Lập phiếu thu"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </>
                        ) : (
                            <>
                                <td className="px-6 py-4 text-gray-700">
                                    {customer.MaKH}
                                </td>
                                <td className="px-6 py-4">{customer.HoTen}</td>
                                <td className="px-6 py-4 text-gray-600">
                                    {customer.Email}
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                    {customer.DiaChi}
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                    {customer.SDT}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => onEdit(customer)}
                                            className="p-2 text-blue-400 hover:bg-blue-50 rounded-full transition-colors"
                                            title="Chỉnh sửa"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </>
                        )}
                    </tr>
                ))
            )}
        </tbody>
    );
}

export default CustomerTableBody;
