import { AlertCircle } from "lucide-react";

export default function EmptyState({
    message = "No data found",
    icon = AlertCircle,
}) {
    const Icon = icon || AlertCircle;

    return (
        <div className="flex items-center justify-center text-gray-500">
            <div className="text-center">
                <Icon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>{message}</p>
            </div>
        </div>
    );
}
