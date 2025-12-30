import { Plus } from "lucide-react";
import { Header } from "../components/Header";
import { useState, useEffect } from "react";
import { useCustomerFilter } from "../components/finance/useCustomerFilter";
import CustomerSearchForm from "../components/finance/CustomerSearchForm";
import CustomerTable from "../components/customers/CustomerTable";
import EditCustomerModal from "../components/shared/EditCustomerModal";
import DeleteConfirmModal from "../components/customers/DeleteConfirmModal";
import { customerService } from "../services/customerService";

export default function CustomerListPage() {
    const [customers, setCustomers] = useState([]);
    const { searchForm, filteredCustomers, handleSearchChange } =
        useCustomerFilter(customers);
    const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const loadCustomers = async () => {
        try{
            const data = await customerService.getAll();
            setCustomers(Array.isArray(data) ? data : []);
        }catch(error){
            console.error("Lỗi khi tải danh sách khách hàng:", error);
        }
    };

    useEffect(() => {
        loadCustomers();
    }, []);

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

    const handleSaveCustomer = async (formData) => {
        const customerPayload = {
            HoTen: formData.HoTen,
            Email: formData.Email,
            DiaChi: formData.DiaChi,
            SDT: formData.SDT
        };
        if (selectedCustomer) {
            try {
                await customerService.update(selectedCustomer.MaKH, customerPayload);
                setCustomers((prev) =>
                prev.map((c) =>
                    c.MaKH === selectedCustomer.MaKH ? { ...c, ...formData } : c
                )
                
            );
            alert("Cập nhật thành công!");
            setSelectedCustomer(null);
        } catch (error) {
                console.error("Lỗi update:", error);
                const message = error.response?.data?.message || "Có lỗi xảy ra khi cập nhật!";
                alert("LỖI CẬP NHẬT:\n" + message);
        }
        } else {
            // this else code using for adding new customer
            try {
                const newCustomer = await customerService.create(customerPayload);
                if (newCustomer) {
                    setCustomers((prev) => [...prev, newCustomer]);
                    alert("Thêm mới thành công!");
                    setSelectedCustomer(null);
                }
            } catch (error) {

                console.error("Lỗi tạo khách mới:", error);
                const message = error.response?.data?.message || "Có lỗi xảy ra khi thêm mới!";
                alert("KHÔNG THỂ LƯU:\n" + message);
            }
        }
    };

    const handleConfirmDeleteCustomer = (customerId) => {
        setCustomers((prev) => prev.filter((c) => c.MaKH !== customerId));
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
                onClose={() => {
                    setIsAddEditModalOpen(false);
                    setSelectedCustomer(null);
                }}
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
