import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { profileService } from "../services/profileService";
import ProfileCard from "../components/dashboard/ProfileCard";
import ProfileForm from "../components/dashboard/ProfileForm";
import ChangePasswordModal from "../components/dashboard/ChangePasswordModal";

function DashboardPage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        SoDienThoai: "",
        DiaChi: "",
        Email: "",
    });
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateError, setUpdateError] = useState("");
    const [updateSuccess, setUpdateSuccess] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const data = await profileService.getProfile();
                setProfile(data);
                setFormData({
                    SoDienThoai: data.SoDienThoai || "",
                    DiaChi: data.DiaChi || "",
                    Email: data.Email || "",
                });
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setUpdateError("");
        setUpdateSuccess("");
    };

    const handleUpdateProfile = async () => {
        try {
            setUpdateLoading(true);
            setUpdateError("");
            setUpdateSuccess("");

            const result = await profileService.updateProfile(formData);
            setUpdateSuccess(result.message || "Cập nhật thông tin thành công");

            // Refresh profile data
            const updatedData = await profileService.getProfile();
            setProfile(updatedData);
            setFormData({
                SoDienThoai: updatedData.SoDienThoai || "",
                DiaChi: updatedData.DiaChi || "",
                Email: updatedData.Email || "",
            });

            // Clear success message after 1.5 seconds
            setTimeout(() => {
                setUpdateSuccess("");
            }, 1500);
        } catch (err) {
            setUpdateError(
                err.response?.data?.message || "Cập nhật thông tin thất bại"
            );
        } finally {
            setUpdateLoading(false);
        }
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
                        <ProfileCard
                            profile={profile}
                            onChangePassword={handleChangePassword}
                        />
                    </div>

                    {/* Right Section - Profile Details */}
                    <div className="lg:col-span-9">
                        <ProfileForm
                            profile={profile}
                            formData={formData}
                            onInputChange={handleInputChange}
                            onUpdate={handleUpdateProfile}
                            onChangePassword={handleChangePassword}
                            updateLoading={updateLoading}
                            updateError={updateError}
                            updateSuccess={updateSuccess}
                        />
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
