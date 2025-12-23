import { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import { reportService } from "../../services/reportService";
import TableStateRow from "../shared/TableStateRow";

function InventoryReport({ month, year }) {
    const [inventoryData, setInventoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInventoryData = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await reportService.getStockReport(month, year);
                setInventoryData(data);
            } catch (err) {
                setError("Không thể tải dữ liệu báo cáo tồn kho");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchInventoryData();
    }, [month, year]);
    const csvHeaders = [
        { label: "STT", key: "stt" },
        { label: "SÁCH", key: "bookName" },
        { label: "TỒN ĐẦU", key: "openingStock" },
        { label: "PHÁT SINH", key: "changes" },
        { label: "TỒN CUỐI", key: "closingStock" },
    ];

    const csvData = inventoryData.map((item, index) => ({
        stt: index + 1,
        bookName: item.TenSach,
        openingStock: item.TonDau,
        changes: item.PhatSinh,
        closingStock: item.TonCuoi,
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
                        {/* reusable notice component */}
                        <TableStateRow
                            colSpan={5}
                            loading={loading}
                            error={error}
                            isEmpty={inventoryData.length === 0}
                        />
                        {!loading &&
                            !error &&
                            inventoryData.length > 0 &&
                            inventoryData.map((item, index) => (
                                <tr
                                    key={item.MaBCT}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-4 py-3 text-gray-900">
                                        {index + 1}
                                    </td>
                                    <td className="px-4 py-3 text-gray-900">
                                        {item.TenSach}
                                    </td>
                                    <td className="px-4 py-3 text-center text-gray-900">
                                        {item.TonDau}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span
                                            className={
                                                item.PhatSinh >= 0
                                                    ? "text-blue-500"
                                                    : "text-red-500"
                                            }
                                        >
                                            {item.PhatSinh >= 0 ? "+" : ""}
                                            {item.PhatSinh}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center text-gray-900">
                                        {item.TonCuoi}
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
