import { useState } from "react";
import { employeeService } from "../../services/employeeService";

export default function EditEmployeeForm({ employee, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    HoTen: employee.HoTen || "",
    SDT: employee.SDT || "",
    Email: employee.Email || "",
    ChucVu: employee.ChucVu || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await employeeService.update(employee.MaNV, formData);
      onSuccess(); // reload list + đóng modal
    } catch (err) {
      setError("Cập nhật nhân viên thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg w-96">
      <h3 className="font-bold mb-4">Cập nhật nhân viên</h3>

      <input
        name="HoTen"
        className="w-full mb-2 px-3 py-2 border rounded"
        placeholder="Họ tên"
        value={formData.HoTen}
        onChange={handleChange}
      />

      <input
        name="SDT"
        className="w-full mb-2 px-3 py-2 border rounded"
        placeholder="SĐT"
        value={formData.SDT}
        onChange={handleChange}
      />
      
     <input
        name="Email"
        type="email"
        className="w-full mb-2 px-3 py-2 border rounded
                  bg-gray-100 text-gray-400 cursor-not-allowed"
        value={formData.Email}
        disabled
      />

      <select
        name="ChucVu"
        className="w-full mb-4 px-3 py-2 border rounded"
        value={formData.ChucVu}
        onChange={handleChange}
      >
        <option value="NhanVien">Nhân viên</option>
        <option value="Admin">Admin</option>
      </select>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <div className="flex justify-end gap-3">
        <button type="button" onClick={onCancel}>
          Hủy
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-400 text-white px-4 py-2 rounded"
        >
          {loading ? "Đang lưu..." : "Lưu"}
        </button>
      </div>
    </form>
  );
}
