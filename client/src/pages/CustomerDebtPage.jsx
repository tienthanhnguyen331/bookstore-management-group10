import { useState, useEffect } from "react";
import CustomerDebtTable from "../components/finance/CustomerDebtTable";
import CustomerSearchForm from "../components/finance/CustomerSearchForm";
import DebtStatistics from "../components/finance/DebtStatistics";
import { useCustomerFilter } from "../components/finance/useCustomerFilter";
import { Header } from "../components/Header";
import { paymentReceiptService } from "../services/paymentReceiptService";
import StateMessage from "../components/shared/StateMessage";

function CustomerDebtPage({ rules }) {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const { searchForm, filteredCustomers, handleSearchChange } =
        useCustomerFilter(customers);

    // Fetch customers with debt on mount
    useEffect(() => {
        fetchCustomersWithDebt();
    }, []);

    // Auto-dismiss success message after 3 seconds
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const fetchCustomersWithDebt = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await paymentReceiptService.getCustomersWithDebt();
            setCustomers(data);
        } catch (err) {
            console.error("Error fetching customers:", err);
            setError("Không thể tải danh sách khách hàng. Vui lòng thử lại");
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentReceipt = function (receiptData) {
        // Update customer debt using the response from API
        setCustomers((prev) =>
            prev.map((c) =>
                c.MaKH === receiptData.MaKH
                    ? { ...c, CongNo: receiptData.CongNoSau }
                    : c
            )
        );
        setSuccessMessage(
            `Lưu phiếu thu thành công! Mã phiếu: ${receiptData.MaPhieu}`
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <h1 className="mb-2 text-xl font-semibold">
                        Danh sách nợ khách hàng
                    </h1>
                    <p className="text-gray-500">
                        Quản lý và theo dõi công nợ khách hàng
                    </p>
                </div>

                {/* <DebtStatistics customers={customers} /> */}

                <StateMessage
                    success={successMessage}
                    onClose={() => setSuccessMessage(null)}
                    className="mb-6 w-full"
                />

                <CustomerSearchForm
                    searchForm={searchForm}
                    onSearchChange={handleSearchChange}
                />

                <CustomerDebtTable
                    customers={filteredCustomers}
                    onPaymentReceipt={handlePaymentReceipt}
                    loading={loading}
                    error={error}
                    rules={rules}
                />
            </div>
        </div>
    );
}

export default CustomerDebtPage;
