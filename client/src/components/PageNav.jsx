import { NavLink } from "react-router-dom";

// temp nav -> after filling all page in header -> fix
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

function PageNav() {
    return (
        // Navigation
        <nav className="flex items-center gap-1">
            {navItems.map((item, index) => (
                <NavLink
                    key={index}
                    to={item.link}
                    className={({ isActive }) =>
                        isActive
                            ? "px-4 py-1.5 rounded transition-colors bg-blue-400 text-white"
                            : "px-4 py-1.5 rounded transition-colors text-gray-700 hover:bg-gray-100"
                    }
                >
                    {item.label}
                </NavLink>
            ))}
        </nav>
    );
}

export default PageNav;
