import { User, Key } from "lucide-react";

function ProfileCard({ profile, onChangePassword }) {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Avatar */}
            <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 bg-blue-400 rounded-full flex items-center justify-center mb-4">
                    <User className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                    {profile?.HoTen}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    {profile?.ChucVu === "Admin" ? "Quản lý" : "Nhân viên"}
                </p>
            </div>

            {/* Menu Items */}
            <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2 bg-blue-50 text-blue-600 rounded">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">
                        Thông tin cá nhân
                    </span>
                </div>

                <div
                    className="flex items-center gap-3 px-3 py-2 text-gray-600 cursor-pointer hover:bg-gray-50 rounded"
                    onClick={onChangePassword}
                >
                    <Key className="w-4 h-4" />
                    <span className="text-sm">Đổi mật khẩu</span>
                </div>
            </div>
        </div>
    );
}

export default ProfileCard;
