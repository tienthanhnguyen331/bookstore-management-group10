import { User, Key } from "lucide-react";
import ProfileField from "./ProfileField";
import EditableProfileField from "./EditableProfileField";
import AlertMessage from "./AlertMessage";

function ProfileForm({
    profile,
    formData,
    onInputChange,
    onUpdate,
    onChangePassword,
    updateLoading,
    updateError,
    updateSuccess,
}) {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-xl font-semibold mb-6">Thông tin cá nhân</h1>

            <AlertMessage type="error" message={updateError} />
            <AlertMessage type="success" message={updateSuccess} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileField label="Mã nhân viên" value={profile?.MaNV} />
                <ProfileField
                    label="Tên đăng nhập"
                    value={profile?.TenDangNhap}
                />
                <ProfileField label="Họ tên" value={profile?.HoTen} />

                <EditableProfileField
                    label="Email"
                    name="Email"
                    type="email"
                    value={formData.Email}
                    onChange={onInputChange}
                    placeholder="Nhập email"
                />

                <EditableProfileField
                    label="Số điện thoại"
                    name="SoDienThoai"
                    value={formData.SoDienThoai}
                    onChange={onInputChange}
                    placeholder="Nhập số điện thoại"
                />

                <ProfileField
                    label="Chức vụ"
                    value={
                        profile?.ChucVu === "Admin" ? "Quản lý" : "Nhân viên"
                    }
                />

                <EditableProfileField
                    label="Địa chỉ"
                    name="DiaChi"
                    value={formData.DiaChi}
                    onChange={onInputChange}
                    placeholder="Nhập địa chỉ"
                    fullWidth
                />
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-between">
                <button
                    onClick={onUpdate}
                    disabled={updateLoading}
                    className={`flex items-center gap-2 px-6 py-2 bg-blue-400 text-white rounded hover:bg-blue-600 transition-colors ${
                        updateLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                    <User className="w-4 h-4" />
                    {updateLoading ? "Đang cập nhật..." : "Cập nhật thông tin"}
                </button>
                <button
                    onClick={onChangePassword}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-400 text-white rounded hover:bg-blue-600 transition-colors"
                >
                    <Key className="w-4 h-4" />
                    Đổi mật khẩu
                </button>
            </div>
        </div>
    );
}

export default ProfileForm;
