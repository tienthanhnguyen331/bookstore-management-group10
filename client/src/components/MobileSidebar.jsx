import { X } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
    { label: "Dashboard", link: "/dashboard" },
    { label: "Quản lí sách", link: "/book" },
    { label: "Nhập kho", link: "/inventory" },
    { label: "Bán hàng", link: "/sale" },
    { label: "Tài chính", link: "/finance" },
    { label: "Khách hàng", link: "/customer" },
    { label: "Báo cáo", link: "/report" },
    { label: "Cài đặt", link: "/setting" },
];

function MobileSidebar({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50  z-40 lg:hidden"
                onClick={onClose}
            />

            {/* Sidebar */}
            <div className="fixed top-0 left-0 bottom-0 w-64 bg-white z-50 shadow-xl lg:hidden transform transition-transform duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <span className="text-blue-400 tracking-wide">MENU</span>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4">
                    <div className="space-y-1">
                        {navItems.map((item, index) => (
                            <NavLink
                                key={index}
                                to={item.link}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    isActive
                                        ? "block px-4 py-3 rounded-lg bg-blue-400 text-white transition-colors"
                                        : "block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </div>
                </nav>
            </div>
        </>
    );
}

export default MobileSidebar;
