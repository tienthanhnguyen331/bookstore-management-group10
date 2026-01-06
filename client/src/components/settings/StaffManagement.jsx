import { useEffect, useState } from "react";
import { employeeService } from "../../services/employeeService";
import EditEmployeeForm from "../../features/settings/EditEmployeeForm";
import { Pencil, X } from "lucide-react";
import StateMessage from "../../components/shared/StateMessage";

export default function StaffManagement() {
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [staffs, setStaffs] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);

    const defaultStaff = {
        username: "",
        hoTen: "",
        chucVu: "" 
    };

    const [newStaff, setNewStaff] = useState(defaultStaff);
    const [usernameError, setUsernameError] = useState(""); // lưu thông báo lỗi cho username


    // Load danh sách nhân viên
    useEffect(() => {
        fetchStaffs();
    }, []);

    const fetchStaffs = async () => {
        try {
            const data = await employeeService.getAll();
            setStaffs(data);
        } catch (err) {
            console.error(err);
            setStaffs([]); // không lấy được dữ liệu
        }
    };

    const handleEditClick = (staff) => {
        setEditingStaff(staff);
    };

    // Tạo nhân viên
    const handleCreateStaff = async (e) => {
        e.preventDefault();

        try { 
            await employeeService.create({
                TenDangNhap: newStaff.username,
                HoTen: newStaff.hoTen,
                ChucVu: newStaff.chucVu,
                MatKhau: "1" 
            });

            setShowForm(false);
            setNewStaff({ username: "", hoTen: "", chucVu: "NhanVien" });
            // reset lỗi trước khi submit
            setUsernameError("");
            setShowSuccessModal(true);
            fetchStaffs();

        } catch (err) {
            console.error(err);
            // Nếu backend trả lỗi trùng username
            if (err.response && err.response.data && err.response.data.message) {
                setUsernameError(err.response.data.message); // ví dụ: "Tên đăng nhập đã tồn tại"
            } else {
                setUsernameError("Tạo nhân viên thất bại");
        }
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-blue-400">
                    QUẢN LÍ NHÂN VIÊN
                </h2>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 bg-blue-400 text-white rounded-lg"
                >
                    + Thêm nhân viên
                </button>
            </div>

            {/* Table */}
            <table className="min-w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                    <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 border-b border-gray-200">Mã NV</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 border-b border-gray-200">Họ tên</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 border-b border-gray-200">Username</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 border-b border-gray-200">SĐT</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 border-b border-gray-200">Email</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 border-b border-gray-200">Chức vụ</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 border-b border-gray-200">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {staffs.map((staff) => (
                    <tr key={staff.MaNV} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-2 text-sm text-gray-700">{staff.MaNV}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{staff.HoTen}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{staff.Username}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{staff.SDT || "-"}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{staff.Email || "-"}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">
                        <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            staff.ChucVu === "Admin"
                                ? "bg-red-50 text-red-700"
                                : staff.ChucVu === "BanHang"
                                ? "bg-yellow-50 text-yellow-700"
                                : staff.ChucVu === "ThuKho"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-green-50 text-green-700"
                            }`}
                        >
                            {staff.ChucVu}
                        </span>
                        </td>

                        <td className="px-4 py-2 text-sm flex justify-center">
                            {/* Sửa */}
                            <button
                                onClick={() => handleEditClick(staff)}
                                className="px-2 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                                title="Cập nhật NV"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                            </td>
                    </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal tao NV */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Overlay */}
                    <div 
                        className="fixed inset-0 bg-opacity-40 backdrop-blur-sm"
                        onClick={() => {
                            setShowForm(false);
                            setNewStaff(defaultStaff);
                            setUsernameError("");
                        }}
                    ></div>
                    
                    {/* Modal Content */}
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-fade-in relative z-10">
                        
                        <div className="flex justify-between items-center mb-4 border-b pb-4">
                            <h2 className="text-xl font-bold text-gray-800">Tạo tài khoản nhân viên</h2>
                            <button 
                                onClick={() => {
                                    setShowForm(false);
                                    setNewStaff(defaultStaff);
                                    setUsernameError("");
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateStaff}>
                            <div className="space-y-4">
                                {/* Tên đăng nhập */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tên đăng nhập <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="username"
                                        required
                                        value={newStaff.username}
                                        onChange={(e) => {
                                            setNewStaff({ ...newStaff, username: e.target.value });
                                            if (usernameError) setUsernameError("");
                                        }}
                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Ví dụ: nguyenvana"
                                    />
                                    {usernameError && (
                                        <p className="text-red-500 text-sm mt-1">❗ {usernameError}</p>
                                    )}
                                </div>

                                {/* Họ tên */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Họ tên <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="hoTen"
                                        required
                                        value={newStaff.hoTen}
                                        onChange={e =>
                                            setNewStaff({ ...newStaff, hoTen: e.target.value })
                                        }
                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Ví dụ: Nguyễn Văn A"
                                    />
                                </div>

                                {/* Chức vụ */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Chức vụ <span className="text-red-500">*</span></label>
                                    {/* <select
                                        name="chucVu"
                                        required
                                        value={newStaff.chucVu}
                                        onChange={(e) =>
                                            setNewStaff({ ...newStaff, chucVu: e.target.value })
                                        }
                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">-- Chọn chức vụ --</option>
                                        <option value="NhanVien">Nhân viên</option>
                                        <option value="Admin">Admin</option>
                                    </select> */}

                                    <input
                                        type="text"
                                        name="chucVu"
                                        required
                                        value={newStaff.hoTen}
                                        onChange={e =>
                                            setNewStaff({ ...newStaff, hoTen: e.target.value })
                                        }
                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Nhân viên hoặc Admin"
                                    />
                                </div>

                                {/* Thông tin mật khẩu */}
                                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                                    <p className="text-xs text-gray-600">
                                        Mật khẩu mặc định: <b className="text-gray-800">1</b>
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setNewStaff(defaultStaff);
                                        setUsernameError("");
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                                >
                                    + Tạo nhân viên
                                </button>
                            </div>
                        </form>
                        
                        {/* Error Message */}
                        <StateMessage
                            error={usernameError}
                            onClose={() => setUsernameError(null)}
                        />
                    </div>
                </div>
            )}

            {/* UPDATE MODAL */}
            {editingStaff && (
                <EditEmployeeForm
                    employee={editingStaff}
                    onSuccess={() => {
                        setEditingStaff(null);
                        fetchStaffs();
                    }}
                    onCancel={() => setEditingStaff(null)}
                />
            )}
            
            {/* SUCCESS MODAL */}
            {showSuccessModal && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 animate-fadeIn"
                    onClick={() => setShowSuccessModal(false)}
                >
                    <div 
                        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-slideDown"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between p-4 border-b border-green-200 bg-green-50">
                            <div className="flex items-center gap-2">
                                <svg
                                    className="w-5 h-5 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <h3 className="text-lg font-semibold text-green-900">Thành công</h3>
                            </div>
                            <button
                                onClick={() => setShowSuccessModal(false)}
                                className="text-green-400 hover:text-green-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4">
                            <p className="text-green-700 mb-2">Tạo nhân viên thành công!</p>
                            <p className="text-sm text-gray-600">Mật khẩu mặc định: <b>1</b></p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
