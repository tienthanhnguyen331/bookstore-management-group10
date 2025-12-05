import { useState } from "react";
import CustomerDebtTable from "../components/finance/CustomerDebtTable";
import CustomerSearchForm from "../components/finance/CustomerSearchForm";
import DebtStatistics from "../components/finance/DebtStatistics";
import { useCustomerFilter } from "../components/finance/useCustomerFilter";
import { Header } from "../components/Header";

const initialCustomers = [
    {
        id: 1,
        name: "Nguyễn Văn An",
        email: "nva@gmail.com",
        phone: "036252148215",
        address: "227 Nguyễn Văn Cừ, Q5, TP. HCM",
        debt: 100000,
    },
    {
        id: 2,
        name: "Trần Thị Bích",
        email: "ttbich@gmail.com",
        phone: "0987654321",
        address: "123 Lê Lợi, Q1, TP. HCM",
        debt: 250000,
    },
    {
        id: 3,
        name: "Lê Minh Công",
        email: "lmcong@gmail.com",
        phone: "0912345678",
        address: "456 Trần Hưng Đạo, Q5, TP. HCM",
        debt: 500000,
    },
    {
        id: 4,
        name: "Phạm Thị Diệu",
        email: "ptdieu@gmail.com",
        phone: "0923456789",
        address: "789 Hai Bà Trưng, Q3, TP. HCM",
        debt: 150000,
    },
    {
        id: 5,
        name: "Hoàng Văn Em",
        email: "hvem@gmail.com",
        phone: "0934567890",
        address: "321 Nguyễn Thị Minh Khai, Q1, TP. HCM",
        debt: 320000,
    },
];

function CustomerDebtPage() {
    const [customers, setCustomers] = useState(initialCustomers);
    const { searchForm, filteredCustomers, handleSearchChange } =
        useCustomerFilter(customers);

    const handleUpdateCustomer = function (updatedCustomer) {
        // Update customer in the state
        setCustomers((prev) =>
            prev.map((c) => (c.id === updatedCustomer.id ? updatedCustomer : c))
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

                <DebtStatistics customers={customers} />

                <CustomerSearchForm
                    searchForm={searchForm}
                    onSearchChange={handleSearchChange}
                />

                <CustomerDebtTable
                    customers={filteredCustomers}
                    onUpdateCustomer={handleUpdateCustomer}
                />
            </div>
        </div>
    );
}

export default CustomerDebtPage;
