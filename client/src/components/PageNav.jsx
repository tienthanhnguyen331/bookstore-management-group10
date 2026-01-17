import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// temp nav -> after filling all page in header -> fix
const navItems = [
    { label: "Dashboard", link: "/dashboard", roles: ['Admin', 'NhanVien'] },
    { label: "Quản lí sách", link: "/book", roles: ['Admin', 'NhanVien'] },
    { label: "Nhập kho", link: "/inventory", roles: ['Admin', 'NhanVien'] },
    { label: "Bán hàng", link: "/sale", roles: ['Admin', 'NhanVien'] },
    { label: "Tài chính", link: "/finance", roles: ['Admin', 'NhanVien'] },
    { label: "Khách hàng", link: "/customer", roles: ['Admin', 'NhanVien'] },
    { label: "Báo cáo", link: "/report", roles: ['Admin'] },
    { label: "Cài đặt", link: "/setting", roles: ['Admin'] },
];

function PageNav() {
    const { user } = useAuth();

    // Filter items based on user role
    const filteredNavItems = navItems.filter(item => {
        if (!user) return false;
        return item.roles.includes(user.role);
    });

    return (
        // Navigation
        <nav className="flex items-center gap-1">
            {filteredNavItems.map((item, index) => (
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
