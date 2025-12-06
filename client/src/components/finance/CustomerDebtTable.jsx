import { Plus, Edit2, Slice } from "lucide-react";
import CustomerDebtTableBody from "./CustomerDebtTableBody";
import CustomerDebtTableHead from "./CustomerDebtTableHead";
import { useState } from "react";
import EditCustomerModal from "./EditCustomerModal";

export default function CustomerDebtTable({ customers, onUpdateCustomer }) {
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleEditClick = (customer) => {
        setSelectedCustomer(customer);
        setIsModalOpen((isModalOpen) => !isModalOpen);
    };

    const handleCloseModal = () => {
        setIsModalOpen((isModalOpen) => !isModalOpen);
        setSelectedCustomer(null);
    };

    const handleSaveCustomer = (updatedCustomer) => {
        onUpdateCustomer(updatedCustomer);
    };

    return (
        <>
            {isModalOpen && (
                <EditCustomerModal
                    onCloseModal={handleCloseModal}
                    onSaveCustomer={handleSaveCustomer}
                    customer={selectedCustomer}
                />
            )}

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2>Danh sách ({customers.length})</h2>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <div className="min-h-[500px] overflow-y-auto">
                        <table className="w-full">
                            <CustomerDebtTableHead />
                            <CustomerDebtTableBody
                                customers={customers}
                                onEditClick={handleEditClick}
                            />
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
