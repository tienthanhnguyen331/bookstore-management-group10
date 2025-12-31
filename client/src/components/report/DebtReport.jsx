import { useState, useEffect } from "react";
import formatCurrency from "../../utils/formatCurrency";
import { CSVLink } from "react-csv";
import { reportService } from "../../services/reportService";
import TableStateRow from "../shared/TableStateRow";

function DebtReport({ month, year }) {
    const [debtReportData, setDebtReportData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDebtData = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await reportService.getDebtReport(month, year);
                setDebtReportData(data);
            } catch (err) {
                setError("Không thể tải dữ liệu báo cáo công nợ");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDebtData();
    }, [month, year]);
    const csvHeaders = [
        { label: "STT", key: "stt" },
        { label: "KHÁCH HÀNG", key: "customerName" },
        { label: "NỢ ĐẦU", key: "openingDebt" },
        { label: "PHÁT SINH", key: "changes" },
        { label: "TRẢ NỢ", key: "payment" },
        { label: "NỢ CUỐI", key: "closingDebt" },
    ];

    const csvData = debtReportData.map((item, index) => ({
        stt: index + 1,
        customerName: item.HoTen,
        openingDebt: item.NoDau,
        changes: item.NoPhatSinh,
        payment: item.TraNo,
        closingDebt: item.NoCuoi,
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
                                TRẢ NỢ
                            </th>
                            <th className="text-center px-4 py-3 text-gray-700">
                                NỢ CUỐI
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        <TableStateRow
                            colSpan={6}
                            loading={loading}
                            error={error}
                            isEmpty={debtReportData.length === 0}
                        />
                        {!loading &&
                            !error &&
                            debtReportData.length > 0 &&
                            debtReportData.map((item, index) => (
                                <tr
                                    key={item.MaBCCN}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-4 py-3 text-gray-900">
                                        {index + 1}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-gray-900">
                                            {item.HoTen}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {item.MaKH} - {item.SDT}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={"text-gray-900"}>
                                            {item.NoDau > 0
                                                ? formatCurrency(item.NoDau)
                                                : "0 ₫"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="text-red-500">
                                            {item.NoPhatSinh > 0
                                                ? "+" + formatCurrency(item.NoPhatSinh)
                                                : "0 ₫"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="text-green-500">
                                            {item.TraNo > 0
                                                ? formatCurrency(item.TraNo)
                                                : "0 ₫"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={"text-gray-900"}>
                                            {formatCurrency(item.NoCuoi)}
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
