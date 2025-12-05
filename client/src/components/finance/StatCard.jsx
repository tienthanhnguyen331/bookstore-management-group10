// used to display a statistic card with an icon, title, and value
const colorClasses = {
    blue: {
        border: "border-blue-400",
        bg: "bg-blue-100",
        text: "text-blue-400",
    },
    green: {
        border: "border-green-400",
        bg: "bg-green-100",
        text: "text-green-400",
    },
    red: {
        border: "border-red-400",
        bg: "bg-red-100",
        text: "text-red-400",
    },
    orange: {
        border: "border-orange-400",
        bg: "bg-orange-100",
        text: "text-orange-400",
    },
    purple: {
        border: "border-purple-400",
        bg: "bg-purple-100",
        text: "text-purple-400",
    },
};

function StatCard({ title, value, icon, color = "blue" }) {
    const Icon = icon;

    const colors = colorClasses[color] || colorClasses.blue;

    return (
        <div
            className={`bg-white rounded-lg p-6 shadow-sm border-l-4 ${colors.border}`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 mb-1">{title}</p>
                    <p className={colors.text}>{value}</p>
                </div>
                <div
                    className={`w-12 h-12 ${colors.bg} rounded-full flex items-center justify-center`}
                >
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                </div>
            </div>
        </div>
    );
}

export default StatCard;
