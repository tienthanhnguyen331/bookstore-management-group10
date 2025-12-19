import formatCurrency from "../../utils/formatCurrency";
import { CSVLink } from "react-csv";

const debtReportData = [
    {
        id: 1,
        customerName: "Nguyễn Tiến Thành",
        openingDebt: 0,
        changes: 500000,
        closingDebt: 500000,
    },
    {
        id: 2,
        customerName: "Trần Thị Bích",
        openingDebt: 150000,
        changes: 300000,
        closingDebt: 450000,
    },
    {
        id: 3,
        customerName: "Lê Minh Công",
        openingDebt: 500000,
        changes: 0,
        closingDebt: 500000,
    },
    {
        id: 4,
        customerName: "Phạm Thị Diệu",
        openingDebt: 100000,
        changes: 50000,
        closingDebt: 150000,
    },
    {
        id: 5,
        customerName: "Hoàng Văn Em",
        openingDebt: 200000,
        changes: 120000,
        closingDebt: 320000,
    },
];

function DebtReport({ month, year }) {
    const csvHeaders = [
        { label: "STT", key: "stt" },
        { label: "KHÁCH HÀNG", key: "customerName" },
        { label: "NỢ ĐẦU", key: "openingDebt" },
        { label: "PHÁT SINH", key: "changes" },
        { label: "NỢ CUỐI", key: "closingDebt" },
    ];

    const csvData = debtReportData.map((item, index) => ({
        stt: index + 1,
        customerName: item.customerName,
        openingDebt: item.openingDebt,
        changes: item.changes,
        closingDebt: item.closingDebt,
    }));

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-gray-500 text-sm">
                        BÁO CÁO CÔNG NỢ - THÁNG {month}/{year}
                    </p>
                    <h2 className="text-xl">Khách hàng đang nợ</h2>
                </div>
                <CSVLink
                    data={csvData}
                    headers={csvHeaders}
                    filename={`Bao_Cao_Cong_No_${month}_${year}.csv`}
                    className="text-blue-400 hover:text-blue-500 transition-colors"
                >
                    Xuất báo cáo công nợ
                </CSVLink>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-y border-gray-200">
                        <tr>
                            <th className="text-left px-4 py-3 text-gray-700">
                                STT
                            </th>
                            <th className="text-left px-4 py-3 text-gray-700">
                                KHÁCH HÀNG
                            </th>
                            <th className="text-center px-4 py-3 text-gray-700">
                                NỢ ĐẦU
                            </th>
                            <th className="text-center px-4 py-3 text-gray-700">
                                PHÁT SINH
                            </th>
                            <th className="text-center px-4 py-3 text-gray-700">
                                NỢ CUỐI
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {debtReportData.map((item, index) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-gray-900">
                                    {index + 1}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="text-gray-900">
                                        {item.customerName}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {item.customerId}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span
                                        className={
                                            item.openingDebt > 0
                                                ? "text-red-500"
                                                : "text-gray-900"
                                        }
                                    >
                                        {item.openingDebt > 0
                                            ? formatCurrency(item.openingDebt)
                                            : "0 ₫"}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span
                                        className={
                                            item.changes > 0
                                                ? "text-blue-500"
                                                : "text-gray-900"
                                        }
                                    >
                                        {item.changes > 0
                                            ? "+" + formatCurrency(item.changes)
                                            : "0 ₫"}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span
                                        className={
                                            item.closingDebt > 0
                                                ? "text-red-500"
                                                : "text-gray-900"
                                        }
                                    >
                                        {formatCurrency(item.closingDebt)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DebtReport;
