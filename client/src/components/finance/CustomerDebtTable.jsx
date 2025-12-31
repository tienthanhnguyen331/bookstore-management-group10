import CustomerTableHead from "../shared/CustomerTableHead";
import CustomerTableBody from "../shared/CustomerTableBody";
import PaymentReceiptModal from "./PaymentReceiptModal";
import TableStateRow from "../shared/TableStateRow";
import { useState } from "react";

const debtTableHeaders = [
    "STT",
    "Tên khách hàng",
    "Email",
    "Số điện thoại",
    "Địa chỉ",
    "Số tiền nợ",
    "Lập phiếu thu",
];

export default function CustomerDebtTable({
    customers,
    onPaymentReceipt,
    loading = false,
    error = null,
    rules,
}) {
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handlePaymentClick = (customer) => {
        setSelectedCustomer(customer);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCustomer(null);
    };

    const handleSaveReceipt = (receiptData) => {
        onPaymentReceipt(receiptData);
        handleCloseModal();
    };

    return (
        <>
            <PaymentReceiptModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                customer={selectedCustomer}
                onSave={handleSaveReceipt}
                rules={rules}
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
                            {loading || error || customers.length === 0 ? (
                                <tbody>
                                    <TableStateRow
                                        colSpan={7}
                                        loading={loading}
                                        error={error}
                                        isEmpty={customers.length === 0}
                                        emptyMessage="Không có khách hàng nào đang nợ"
                                    />
                                </tbody>
                            ) : (
                                <CustomerTableBody
                                    customers={customers}
                                    onEdit={handlePaymentClick}
                                    showDebtColumn={true}
                                    colSpan={7}
                                    useIndexAsKey={false}
                                />
                            )}
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
