import { Eye } from "lucide-react";

function BodyHistoryTable({ history }) {
    return (
        <tbody>
            {history.map((entry) => (
                <tr
                    key={entry.id}
                    className="border-t border-gray-100 text-center"
                >
                    <td className="px-4 py-4">{entry.id}</td>
                    <td className="px-4 py-4">{entry.date}</td>
                    <td className="px-4 py-4">{entry.bookTypes}</td>
                    <td className="px-4 py-4">{entry.totalQuantity}</td>
                    <td className="px-4 py-4">
                        <button className="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors">
                            <Eye className="w-4 h-4" />
                        </button>
                    </td>
                </tr>
            ))}
        </tbody>
    );
}

export default BodyHistoryTable;
