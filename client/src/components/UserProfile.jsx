import { User, LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";

function UserProfile() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Mock user data - replace with actual auth data
    const user = {
        name: "Nguyễn Văn A",
        email: "admin@bookstore.vn",
        role: "Quản trị viên",
    };

    const handleLogout = () => {
        // Add logout logic here
        console.log("Logging out...");
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
                <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                </div>
                <div className="hidden md:block text-left">
                    <div className="text-sm text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.role}</div>
                </div>
                <ChevronDown className="hidden md:block w-4 h-4 text-gray-400" />
            </button>

            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                    <div className="p-4 border-b border-gray-200">
                        <div className="text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">
                            {user.email}
                        </div>
                    </div>
                    <div className="p-2">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Đăng xuất
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserProfile;
