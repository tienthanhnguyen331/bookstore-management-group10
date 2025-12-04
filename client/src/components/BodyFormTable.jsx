import { Trash } from "lucide-react";

function BodyFormTable({ entries, handleDelete = null, haveButton = true }) {
    return (
        <tbody className="">
            {entries.map((entry, index) => (
                <tr key={entry.id} className="border-t border-gray-100">
                    <td className="px-4 py-4">{index + 1}</td>
                    <td className="px-4 py-4">{entry.bookName}</td>
                    <td className="px-4 py-4">{entry.category}</td>
                    <td className="px-4 py-4">{entry.author}</td>
                    <td className="px-4 py-4">{entry.quantity}</td>
                    <td className="px-4 py-4">
                        {entry.unitPrice.toLocaleString("vi-VN")} đ
                    </td>
                    <td className="px-4 py-4">
                        {(entry.quantity * entry.unitPrice).toLocaleString(
                            "vi-VN"
                        )}{" "}
                        đ
                    </td>
                    {haveButton && (
                        <td className="px-4 py-4">
                            <button
                                onClick={() => handleDelete(entry.id)}
                                className="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors"
                            >
                                <Trash className="w-4 h-4" />
                            </button>
                        </td>
                    )}
                </tr>
            ))}
        </tbody>
    );
}

export default BodyFormTable;
