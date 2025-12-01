function RecentOrdersRow({ order }) {
    return (
        <tr className="border-b border-gray-100 last:border-b-0">
            <td className="px-6 py-4">{order.id}</td>
            <td className="px-6 py-4">{order.date}</td>
            <td className="px-6 py-4">{order.customer}</td>
            <td className="px-6 py-4">{order.total}</td>
            <td className="px-6 py-4">
                <button className="w-10 h-10 bg-blue-300 hover:bg-blue-400 rounded-full flex items-center justify-center transition-colors">
                    <div className="w-5 h-5 text-gray-800">👁️</div>
                </button>
            </td>
        </tr>
    );
}

export default RecentOrdersRow;
