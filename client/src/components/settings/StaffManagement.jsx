import { useEffect, useState } from "react";
import { employeeService } from "../../services/employeeService";
import { Pencil, Trash2, RotateCw } from "lucide-react";

export default function StaffManagement() {
    const [staffs, setStaffs] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [deleteStaff, setDeleteStaff] = useState(null); // nhân viên cần xóa

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
           // alert("Không thể tải danh sách nhân viên");
            setStaffs([]); // không lấy được dữ liệu
        }
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
            alert("Tạo nhân viên thành công!\nMật khẩu mặc định: 1");
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
                                ? "bg-purple-50 text-purple-700"
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

                        {/* <td className="px-4 py-2 text-sm flex gap-2">
                            <button className="px-2 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition">Sửa</button>
                            <button className="px-2 py-1 rounded bg-yellow-50 text-yellow-600 hover:bg-yellow-100 transition">Reset</button>
                            <button className="px-2 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100 transition">Xóa</button>
                        </td> */}

                        <td className="px-4 py-2 text-sm flex gap-2">
                            {/* Sửa */}
                            <button
                               // onClick={() => setEditingStaff(staff)}
                                className="px-2 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                                title="Cập nhật NV"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>

                            {/* Reset mật khẩu */}
                            <button
                                //onClick={() => handleResetPassword(staff.MaNV)}
                                className="px-2 py-1 rounded bg-yellow-50 text-yellow-600 hover:bg-yellow-100 transition"
                                title="Reset MK"
                            >
                                <RotateCw className="w-4 h-4" />
                            </button>

                            {/* Xóa */}
                            <button
                                //onClick={() => setDeleteStaff(staff)}
                                className="px-2 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100 transition"
                                title="Xóa NV"
                            >
                                <Trash2 className="w-4 h-4" />
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
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
                    <form
                        onSubmit={handleUpdateStaff}
                        className="bg-white p-6 rounded-lg w-96"
                    >
                        <h3 className="font-bold mb-4">Cập nhật nhân viên</h3>

                        <input
                            className="w-full mb-2 px-3 py-2 border rounded"
                            value={editingStaff.hoTen}
                            onChange={(e) =>
                                setEditingStaff({ ...editingStaff, hoTen: e.target.value })
                            }
                        />
                        <input
                            className="w-full mb-2 px-3 py-2 border rounded"
                            value={editingStaff.sdt}
                            onChange={(e) =>
                                setEditingStaff({ ...editingStaff, sdt: e.target.value })
                            }
                        />
                        <input
                            className="w-full mb-2 px-3 py-2 border rounded"
                            value={editingStaff.email}
                            onChange={(e) =>
                                setEditingStaff({ ...editingStaff, email: e.target.value })
                            }
                        />

                        <select
                            className="w-full mb-4 px-3 py-2 border rounded"
                            value={editingStaff.chucVu}
                            onChange={(e) =>
                                setEditingStaff({ ...editingStaff, chucVu: e.target.value })
                            }
                        >
                            <option value="NhanVien">Nhân viên</option>
                            <option value="Admin">Admin</option>
                        </select>

                        <div className="flex justify-end gap-3">
                            <button type="button" onClick={() => setEditingStaff(null)}>
                                Hủy
                            </button>
                            <button className="bg-blue-400 text-white px-4 py-2 rounded">
                                Lưu
                            </button>
                        </div>
                    </form>
                </div>
            )}

             {/* Modal xóa nhân viên */}
            {deleteStaff && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg w-96">
                    <h3 className="font-bold mb-4">Xác nhận xóa nhân viên</h3>
                    <p className="mb-6">
                    Bạn có chắc chắn muốn xóa nhân viên <b>{deleteStaff.hoTen}</b>?
                    </p>
                    <div className="flex justify-end gap-3">
                    <button
                        onClick={() => setDeleteStaff(null)}
                        className="px-4 py-2 border rounded"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={confirmDeleteStaff}
                        className="bg-red-600 text-white px-4 py-2 rounded"
                    >
                        Xóa
                    </button>
                    </div>
                </div>
                </div>
            )}

        </div>
    );
}
