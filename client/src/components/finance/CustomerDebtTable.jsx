import CustomerTableHead from "../shared/CustomerTableHead";
import CustomerTableBody from "../shared/CustomerTableBody";
import EditCustomerModal from "../shared/EditCustomerModal";
import { useState } from "react";

const debtTableHeaders = [
    "STT",
    "Tên khách hàng",
    "Email",
    "Số điện thoại",
    "Địa chỉ",
    "Số tiền nợ",
    "Thao tác",
];

export default function CustomerDebtTable({ customers, onUpdateCustomer }) {
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleEditClick = (customer) => {
        setSelectedCustomer(customer);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCustomer(null);
    };

    const handleSaveCustomer = (updatedCustomer) => {
        onUpdateCustomer(updatedCustomer);
        handleCloseModal();
    };

    return (
        <>
            <EditCustomerModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                customer={selectedCustomer}
                onSave={handleSaveCustomer}
                showDebtField={true}
                title="Chỉnh sửa thông tin khách hàng"
            />

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2>Danh sách ({customers.length})</h2>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <div className="min-h-[500px] overflow-y-auto">
                        <table className="w-full">
                            <CustomerTableHead headers={debtTableHeaders} />
                            <CustomerTableBody
                                customers={customers}
                                onEdit={handleEditClick}
                                showDebtColumn={true}
                                colSpan={7}
                                useIndexAsKey={false}
                            />
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
