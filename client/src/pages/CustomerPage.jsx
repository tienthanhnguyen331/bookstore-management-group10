import { Plus } from "lucide-react";
import { Header } from "../components/Header";
import { useState } from "react";
import { useCustomerFilter } from "../components/finance/useCustomerFilter";
import CustomerSearchForm from "../components/finance/CustomerSearchForm";
import CustomerTable from "../components/customers/CustomerTable";
import EditCustomerModal from "../components/customers/EditCustomerModal";
import DeleteConfirmModal from "../components/customers/DeleteConfirmModal";
// import { CustomerTable } from "./customers/CustomerTable";
// import { AddEditCustomerModal } from "./customers/AddEditCustomerModal";
// import { DeleteConfirmModal } from "./customers/DeleteConfirmModal";
// import { customersData } from "./customers/customerListData";

const customersData = [
    {
        id: 1,
        code: "#1",
        name: "Nguyễn Văn A",
        email: "abc1@gmail.com",
        address: "Bình Tân",
        phone: "01272301075",
    },
    {
        id: 2,
        code: "#2",
        name: "Nguyễn Văn B",
        email: "abc2@gmail.com",
        address: "Long An",
        phone: "01272301076",
    },
    {
        id: 3,
        code: "#3",
        name: "Nguyễn Văn C",
        email: "abc3@gmail.com",
        address: "Vĩnh Long",
        phone: "01272301077",
    },
    {
        id: 4,
        code: "#4",
        name: "Nguyễn Văn D",
        email: "abc4@gmail.com",
        address: "Thanh Hóa",
        phone: "01272301078",
    },
    {
        id: 5,
        code: "#5",
        name: "Trần Văn A",
        email: "abc5@gmail.com",
        address: "Bình Định",
        phone: "01272301079",
    },
    {
        id: 6,
        code: "#6",
        name: "Lê Thị C",
        email: "abc6@gmail.com",
        address: "Gia Lai",
        phone: "01272301070",
    },
    {
        id: 7,
        code: "#7",
        name: "Dương Văn D",
        email: "abc7@gmail.com",
        address: "Đồng Tháp",
        phone: "01272301071",
    },
];

export default function CustomerListPage() {
    const [customers, setCustomers] = useState(customersData);
    const { searchForm, filteredCustomers, handleSearchChange } =
        useCustomerFilter(customers);
    const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const handleAddCustomer = () => {
        setSelectedCustomer(null);
        setIsAddEditModalOpen(true);
    };

    const handleEditCustomer = (customer) => {
        setSelectedCustomer(customer);
        setIsAddEditModalOpen((isOpen) => !isOpen);
    };

    const handleDeleteCustomer = function (customer) {
        setSelectedCustomer(customer);
        setIsDeleteModalOpen((isOpen) => !isOpen);
    };

    const handleSaveCustomer = (formData) => {
        if (selectedCustomer) {
            setCustomers((prev) =>
                prev.map((c) =>
                    c.id === selectedCustomer.id ? { ...c, ...formData } : c
                )
            );
        } else {
            // this else code using for adding new customer
            const newCustomer = {
                id: customers.length + 1,
                code: `#${customers.length + 1}`,
                ...formData,
            };
            setCustomers((prev) => [...prev, newCustomer]);
        }
        setSelectedCustomer(null);
    };

    const handleConfirmDeleteCustomer = (customerId) => {
        setCustomers((prev) => prev.filter((c) => c.id !== customerId));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="mb-2 text-xl font-semibold">
                            Danh sách khách hàng
                        </h1>
                        <p className="text-gray-500">
                            Quản lý thông tin khách hàng
                        </p>
                    </div>
                    <button
                        onClick={handleAddCustomer}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors shadow-sm"
                    >
                        <Plus className="w-5 h-5" />
                        Thêm khách mới
                    </button>
                </div>

                <CustomerSearchForm
                    searchForm={searchForm}
                    onSearchChange={handleSearchChange}
                />

                <CustomerTable
                    customers={filteredCustomers}
                    onEdit={handleEditCustomer}
                    onDelete={handleDeleteCustomer}
                />
            </div>

            {/* Modal for editing and adding */}
            <EditCustomerModal
                isOpen={isAddEditModalOpen}
                onClose={() => setIsAddEditModalOpen((isOpen) => !isOpen)}
                customer={selectedCustomer}
                onSave={handleSaveCustomer}
            />

            {/* Modal for deleting */}
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen((isOpen) => !isOpen)}
                customer={selectedCustomer}
                onConfirm={handleConfirmDeleteCustomer}
            />
        </div>
    );
}
