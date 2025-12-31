import CustomerTableHead from "../shared/CustomerTableHead";
import CustomerTableBody from "../shared/CustomerTableBody";

const customerTableHeaders = [
    "MÃ KH",
    "Tên khách hàng",
    "Email",
    "Địa chỉ",
    "Số điện thoại",
    "Thao tác",
];

export default function CustomerTable({ customers, onEdit }) {
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <CustomerTableHead headers={customerTableHeaders} />
                    <CustomerTableBody
                        customers={customers}
                        onEdit={onEdit}
                        showDebtColumn={false}
                        colSpan={6}
                    />
                </table>
            </div>
        </div>
    );
}
