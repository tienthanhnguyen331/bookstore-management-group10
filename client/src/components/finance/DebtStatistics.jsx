import { DollarSign, Users, AlertCircle } from "lucide-react";
import StatCard from "./StatCard";

function DebtStatistics({ customers }) {
    const totalDebt = customers.reduce(
        (sum, customer) => sum + customer.debt,
        0
    );
    const totalCustomers = customers.length;
    const averageDebt = totalCustomers > 0 ? totalDebt / totalCustomers : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
                title="Tổng số khách nợ"
                value={`${totalCustomers} khách hàng`}
                icon={Users}
                color="blue"
            />
            <StatCard
                title="Tổng tiền nợ"
                value={`${totalDebt.toLocaleString("vi-VN")} đ`}
                icon={DollarSign}
                color="red"
            />
            <StatCard
                title="Nợ trung bình"
                value={`${averageDebt.toLocaleString("vi-VN")} đ`}
                icon={AlertCircle}
                color="orange"
            />
        </div>
    );
}

export default DebtStatistics;
