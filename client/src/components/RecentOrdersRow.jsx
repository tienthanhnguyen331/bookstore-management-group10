import { Eye } from "lucide-react";

function RecentOrdersRow({ order }) {
    return (
        <tr className="border-b border-gray-100 last:border-b-0">
            <td className="px-6 py-4">{order.id}</td>
            <td className="px-6 py-4">{order.date}</td>
            <td className="px-6 py-4">{order.customer}</td>
            <td className="px-6 py-4">{order.total}</td>
            <td className="px-6 py-4">
                <button className="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors">
                    <Eye className="w-4 h-4" />
                </button>
            </td>
        </tr>
    );
}

export default RecentOrdersRow;
