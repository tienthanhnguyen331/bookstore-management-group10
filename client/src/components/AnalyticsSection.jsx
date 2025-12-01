import React from "react";

// temporary data -> waiting for data from backend -> deal with later
const analytics = [
    {
        icon: "🪙",
        label: "Tổng doanh thu",
        value: "7.200.000.000đ",
        bgColor: "bg-blue-400",
    },
    {
        icon: "🤝",
        label: "Đơn hàng",
        value: "300.000 đơn",
        bgColor: "bg-blue-400",
    },
    {
        icon: "💳",
        label: "Công nợ",
        value: "7.200.000đ",
        bgColor: "bg-blue-400",
    },
];

export function AnalyticsSection() {
    return (
        <section className="mb-12">
            <h2 className="mb-6 text-xl font-semibold">Analytics</h2>

            <div className="grid grid-cols-3 gap-6">
                {analytics.map((item, index) => {
                    const icon = item.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white rounded-lg p-6 shadow-sm"
                        >
                            <div
                                className={`w-12 h-12 ${item.bgColor} rounded-full flex items-center justify-center mb-4`}
                            >
                                <span>{icon}</span>
                            </div>
                            <div className="text-gray-500 text-sm mb-2">
                                {item.label}
                            </div>
                            <div className="text-2xl">{item.value}</div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
