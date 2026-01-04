import { useEffect, useState } from "react";
import { employeeService } from "../../services/employeeService";
import EditEmployeeForm from "../../features/settings/EditEmployeeForm";
import { Pencil } from "lucide-react";

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
            //alert("Tạo nhân viên thành công!\nMật khẩu mặc định: 1");
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
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
                    <form
                        onSubmit={handleCreateStaff}
                        className="bg-white p-6 rounded-lg w-96"
                    >
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                Tạo tài khoản nhân viên
                            </h3>
                        
                        <div className="mb-3">
                            <input
                                type="text"
                                placeholder="Tên đăng nhập"
                                value={newStaff.username}
                                onChange={(e) => {
                                setNewStaff({ ...newStaff, username: e.target.value });
                                if (usernameError) setUsernameError(""); // xóa lỗi khi sửa
                                }}
                                className={`w-full px-3 py-2 rounded border ${
                                usernameError ? "border-red-500" : "rounded border"
                                }`}
                                required
                            />
                            {usernameError && (
                                <p className="text-red-500 text-sm mt-1"><span>❗</span>{usernameError}</p> 
                            )}
                            </div>

                        <input
                            className="w-full mb-3 px-3 py-2 border rounded"
                            placeholder="Họ và tên"
                            value={newStaff.hoTen}
                            onChange={e =>
                                setNewStaff({ ...newStaff, hoTen: e.target.value })
                            }
                            required
                        />

                        <input
                            className="w-full mb-4 px-3 py-2 border rounded"
                            placeholder="Chức vụ (ví dụ: NhanVien, Admin)"
                            value={newStaff.chucVu}
                            onChange={(e) =>
                                setNewStaff({ ...newStaff, chucVu: e.target.value })
                            }
                            required
                        />

                        <p className="text-xs text-gray-500 mb-4">
                            Mật khẩu mặc định: <b>1</b>
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false);      // ẩn form
                                    setNewStaff(defaultStaff); // reset tất cả input
                                    setUsernameError(""); // reset lỗi
                                }}
                                className="text-gray-500"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-400 text-white px-4 py-2 rounded"
                            >
                                Tạo
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* UPDATE MODAL */}
            {editingStaff && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
                    <EditEmployeeForm
                    employee={editingStaff}
                    onSuccess={() => {
                        setEditingStaff(null);
                        fetchStaffs();
                    }}
                    onCancel={() => setEditingStaff(null)}
                    />
                </div>
            )}
            
            {/* SUCCESS MODAL */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-96 shadow-lg text-center">
                        {/* Icon thành công */}
                        <div className="flex justify-center mb-3">
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                <span className="text-green-600 text-2xl">✓</span>
                            </div>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Tạo nhân viên thành công
                        </h3>

                        <p className="text-sm text-gray-600 mb-5">
                            Mật khẩu mặc định: <b>1</b>
                        </p>

                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
