import { useState } from "react";
import ReportFilters from "../components/report/ReportFilters";
import { Header } from "../components/Header";
import InventoryReport from "../components/report/InventoryReport";
import DebtReport from "../components/report/DebtReport";

function ReportPage() {
    const [selectedMonth, setSelectedMonth] = useState(
        new Date().getMonth() + 1
    );
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <p className="mb-2 text-xl font-semibold">BÁO CÁO</p>
                    <h1 className="mb-2">Báo cáo tồn kho và công nợ</h1>
                    <p className="text-gray-500">
                        Chọn tháng và năm để xem dữ liệu tương ứng
                    </p>
                </div>

                <ReportFilters
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    onMonthChange={setSelectedMonth}
                    onYearChange={setSelectedYear}
                />

                <InventoryReport month={selectedMonth} year={selectedYear} />

                <DebtReport month={selectedMonth} year={selectedYear} />
            </div>
        </div>
    );
}

export default ReportPage;
