import { CSVLink } from "react-csv";

const inventoryData = [
    {
        id: 1,
        bookName: "Calculus 1",
        openingStock: 147,
        changes: -59,
        closingStock: 206,
    },
    {
        id: 2,
        bookName: "Đế Mèn Phiêu Lưu Ký",
        openingStock: 198,
        changes: 94,
        closingStock: 292,
    },
    {
        id: 3,
        bookName: "Sách mới",
        openingStock: 0,
        changes: 308,
        closingStock: 308,
    },
    {
        id: 4,
        bookName: "Toán Cao Cấp A1",
        openingStock: 120,
        changes: 30,
        closingStock: 150,
    },
    {
        id: 5,
        bookName: "Vật Lý Đại Cương",
        openingStock: 85,
        changes: -25,
        closingStock: 60,
    },
    {
        id: 6,
        bookName: "Lập Trình C++",
        openingStock: 200,
        changes: 50,
        closingStock: 250,
    },
    {
        id: 7,
        bookName: "Tiếng Anh Giao Tiếp",
        openingStock: 175,
        changes: -45,
        closingStock: 130,
    },
    {
        id: 8,
        bookName: "Marketing Căn Bản",
        openingStock: 90,
        changes: 110,
        closingStock: 200,
    },
];

function InventoryReport({ month, year }) {
    const csvHeaders = [
        { label: "STT", key: "stt" },
        { label: "SÁCH", key: "bookName" },
        { label: "TỒN ĐẦU", key: "openingStock" },
        { label: "PHÁT SINH", key: "changes" },
        { label: "TỒN CUỐI", key: "closingStock" },
    ];

    const csvData = inventoryData.map((item, index) => ({
        stt: index + 1,
        bookName: item.bookName,
        openingStock: item.openingStock,
        changes: item.changes,
        closingStock: item.closingStock,
    }));

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-gray-500 text-sm mb-3">
                        BÁO CÁO TỒN KHO - THÁNG {month}/{year}
                    </p>
                    <h2 className="text-xl">Tình trạng kho</h2>
                </div>
                <CSVLink
                    data={csvData}
                    headers={csvHeaders}
                    filename={`Bao_Cao_Ton_Kho_${month}_${year}.csv`}
                    className="text-blue-400 hover:text-blue-500 transition-colors hover:cursor-pointer"
                >
                    Xuất báo cáo tồn kho
                </CSVLink>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    {/* Head */}
                    <thead className="bg-gray-50 border-y border-gray-200">
                        <tr>
                            <th className="text-left px-4 py-3 text-gray-700">
                                STT
                            </th>
                            <th className="text-left px-4 py-3 text-gray-700">
                                SÁCH
                            </th>
                            <th className="text-center px-4 py-3 text-gray-700">
                                TỒN ĐẦU
                            </th>
                            <th className="text-center px-4 py-3 text-gray-700">
                                PHÁT SINH
                            </th>
                            <th className="text-center px-4 py-3 text-gray-700">
                                TỒN CUỐI
                            </th>
                        </tr>
                    </thead>
                    {/* BODY */}
                    <tbody className="divide-y divide-gray-200">
                        {inventoryData.map((item, index) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-gray-900">
                                    {index + 1}
                                </td>
                                <td className="px-4 py-3 text-gray-900">
                                    {item.bookName}
                                </td>
                                <td className="px-4 py-3 text-center text-gray-900">
                                    {item.openingStock}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span
                                        className={
                                            item.changes >= 0
                                                ? "text-blue-500"
                                                : "text-red-500"
                                        }
                                    >
                                        {item.changes >= 0 ? "+" : ""}
                                        {item.changes}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-center text-gray-900">
                                    {item.closingStock}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default InventoryReport;
