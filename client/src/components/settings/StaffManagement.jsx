import { useEffect, useState } from "react";
import { employeeService } from "../../services/employeeService";

export default function StaffManagement() {
    const [staffs, setStaffs] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);

    const [newStaff, setNewStaff] = useState({
        username: "",
        hoTen: "",
        sdt: "",
        email: ""
    });

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
            alert("Không thể tải danh sách nhân viên");
        }
    };

    // Tạo nhân viên
    const handleCreateStaff = async (e) => {
        e.preventDefault();

        try {
            await employeeService.create({
                username: newStaff.username,
                hoTen: newStaff.hoTen,
                sdt: newStaff.sdt,
                email: newStaff.email,
                password: "1"
            });

            alert("Tạo nhân viên thành công!\nMật khẩu mặc định: 1");
            setShowForm(false);
            setNewStaff({
                username: "",
                hoTen: "",
                sdt: "",
                email: ""
            });

            // reload danh sách
            fetchStaffs();
        } catch (err) {
            console.error(err);
            alert("Tạo nhân viên thất bại");
        }
    };

    // Update nhanvien
    const handleUpdateStaff = async (e) => {
        e.preventDefault();
        try {
            await employeeService.update(editingStaff.maNV, {
                hoTen: editingStaff.hoTen,
                sdt: editingStaff.sdt,
                email: editingStaff.email,
                chucVu: editingStaff.chucVu
            });

            alert("Cập nhật nhân viên thành công");
            setEditingStaff(null);
            fetchStaffs();
        } catch (err) {
            alert("Cập nhật thất bại");
        }
    };

     // Xoa Nhan Vien
    const handleDeleteStaff = async (maNV) => {
        if (!window.confirm("Bạn chắc chắn muốn xóa nhân viên này?")) return;

        try {
            await employeeService.remove(maNV);
            fetchStaffs();
        } catch (err) {
            alert("Xóa nhân viên thất bại");
        }
    };

    // reset password
    const handleResetPassword = async (maNV) => {
        if (!window.confirm("Reset mật khẩu về mặc định?")) return;

        try {
            await employeeService.resetPassword(maNV);
            alert("Đã reset mật khẩu về mặc định");
        } catch (err) {
            alert("Reset mật khẩu thất bại");
        }
    };


    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-blue-400">
                    QUẢN LÝ NHÂN VIÊN
                </h2>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 bg-blue-400 text-white rounded-lg"
                >
                    + Thêm nhân viên
                </button>
            </div>

            {/* Table */}
            <table className="w-full border border-gray-100 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left border-b border-gray-100">Mã NV</th>
                        <th className="px-4 py-3 text-left border-b border-gray-100">Họ tên</th>
                        <th className="px-4 py-3 text-left border-b border-gray-100">Username</th>
                        <th className="px-6 py-3 text-left border-b border-gray-100">SĐT</th>
                        <th className="px-4 py-3 text-left border-b border-gray-100">Email</th>
                        <th className="px-4 py-3 text-left border-b border-gray-100">Chức vụ</th>
                        <th className="px-15 py-3 text-left border-b border-gray-100"> Thao tác</th>

                    </tr>
                </thead>
                <tbody>
                    {staffs.map(staff => (
                        <tr key={staff.maNV} className="border-t hover:bg-gray-50">
                            <td className="px-4 py-3 border-b border-gray-100">{staff.maNV}</td>
                            <td className="px-4 py-3 border-b border-gray-100">{staff.hoTen}</td>
                            <td className="px-7 py-3 border-b border-gray-100">{staff.username}</td>
                            <td className="px-4 py-3 border-b border-gray-100">{staff.sdt}</td>
                            <td className="px-4 py-3 border-b border-gray-100">{staff.email}</td>
                            <td className="px-4 py-3 border-b border-gray-100">
                                <span
                                    className={`px-2 py-1 rounded text-xs ${
                                        staff.chucVu === "Admin"
                                            ? "bg-purple-100 text-purple-700"
                                            : "bg-green-100 text-green-700"
                                    }`}
                                >
                                    {staff.chucVu}
                                </span>
                            </td>
                            <td className="px-4 py-3 border-b border-gray-100">
                                 <div className="flex items-center gap-2">
                                    {/* Sửa */}
                                    <button
                                        onClick={() => setEditingStaff(staff)}
                                        className="px-3 py-1.5 rounded-md text-sm
                                                 text-blue-600
                                                hover:bg-blue-100 transition"
                                        title="Cập nhật nhân viên"
                                    >
                                         Sửa
                                    </button>

                                    {/* Reset mật khẩu */}
                                    <button
                                        onClick={() => handleResetPassword(staff.maNV)}
                                        className="px-3 py-1.5 rounded-md text-sm
                                                 text-yellow-600
                                                hover:bg-yellow-100 transition"
                                        title="Reset mật khẩu"
                                    >
                                         Reset
                                    </button>

                                    {/* Xóa */}
                                    <button
                                        onClick={() => handleDeleteStaff(staff.maNV)}
                                        className="px-3 py-1.5 rounded-md text-sm
                                                 text-red-600
                                                hover:bg-red-100 transition"
                                        title="Xóa nhân viên"
                                    >
                                         Xóa
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
                    <form
                        onSubmit={handleCreateStaff}
                        className="bg-white p-6 rounded-lg w-96"
                    >
                        <h3 className="font-bold mb-4">
                            Tạo tài khoản nhân viên
                        </h3>

                        <input
                            className="w-full mb-3 px-3 py-2 border rounded"
                            placeholder="Tên đăng nhập"
                            value={newStaff.username}
                            onChange={e =>
                                setNewStaff({ ...newStaff, username: e.target.value })
                            }
                            required
                        />

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
                            className="w-full mb-3 px-3 py-2 border rounded"
                            placeholder="Số điện thoại"
                            value={newStaff.sdt}
                            onChange={e =>
                                setNewStaff({ ...newStaff, sdt: e.target.value })
                            }
                        />

                        <input
                            className="w-full mb-3 px-3 py-2 border rounded"
                            placeholder="Email"
                            type="email"
                            value={newStaff.email}
                            onChange={e =>
                                setNewStaff({ ...newStaff, email: e.target.value })
                            }
                        />

                        <p className="text-xs text-gray-500 mb-4">
                            Mật khẩu mặc định: <b>1</b>
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
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
        </div>
    );
}
