import { Edit2, Trash2, AlertCircle } from "lucide-react";
import CustomerTableHead from "./CustomerTableHead";
import CustomerTableBody from "./CustomerTableBody";

export default function CustomerTable({ customers, onEdit, onDelete }) {
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <CustomerTableHead />
                    <CustomerTableBody
                        customers={customers}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                </table>
            </div>
        </div>
    );
}
