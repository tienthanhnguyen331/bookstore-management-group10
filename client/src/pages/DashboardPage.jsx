import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { profileService } from "../services/profileService";
import { User, Key } from "lucide-react";
import ChangePasswordModal from "../components/ChangePasswordModal";

function DashboardPage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const data = await profileService.getProfile();
                setProfile(data);
                setError("");
            } catch (err) {
                setError("Không thể tải thông tin nhân viên");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChangePassword = () => {
        setIsPasswordModalOpen(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="max-w-7xl mx-auto px-6 py-8">
                    <div className="text-center py-12">
                        <div className="text-gray-500">Đang tải...</div>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="max-w-7xl mx-auto px-6 py-8">
                    <div className="text-center py-12">
                        <div className="text-red-500">{error}</div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Section - Profile Card */}
                    <div className="lg:col-span-3">
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
                                    {profile?.ChucVu === "Admin"
                                        ? "Quản lý"
                                        : "Nhân viên"}
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
                                    onClick={handleChangePassword}
                                    className="cursor-pointer hover:bg-gray-50 rounded"
                                >
                                    <button className=" flex items-center gap-3 px-3 py-2 text-gray-600 ">
                                        <Key className="w-4 h-4" />
                                        <span className="text-sm">
                                            Đổi mật khẩu
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Profile Details */}
                    <div className="lg:col-span-9">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h1 className="text-xl font-semibold mb-6">
                                Thông tin cá nhân
                            </h1>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mã nhân viên
                                    </label>
                                    <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded text-gray-900">
                                        {profile?.MaNV}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tên đăng nhập
                                    </label>
                                    <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded text-gray-900">
                                        {profile?.TenDangNhap}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Họ tên
                                    </label>
                                    <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded text-gray-900">
                                        {profile?.HoTen}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded text-gray-900">
                                        {profile?.Email}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Số điện thoại
                                    </label>
                                    <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded text-gray-900">
                                        {profile?.SoDienThoai}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Chức vụ
                                    </label>
                                    <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded text-gray-900">
                                        {profile?.ChucVu === "Admin"
                                            ? "Quản lý"
                                            : "Nhân viên"}
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Địa chỉ
                                    </label>
                                    <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded text-gray-900">
                                        {profile?.DiaChi}
                                    </div>
                                </div>
                            </div>

                            {/* Change Password Button */}
                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={handleChangePassword}
                                    className="flex items-center gap-2 px-6 py-2 bg-blue-400 text-white rounded hover:bg-blue-500 transition-colors"
                                >
                                    <Key className="w-4 h-4" />
                                    Đổi mật khẩu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Change Password Modal */}
            <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                username={profile?.TenDangNhap}
            />
        </div>
    );
}

export default DashboardPage;
