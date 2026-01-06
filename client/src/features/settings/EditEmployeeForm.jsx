import { useState } from "react";
import { X } from "lucide-react";
import { employeeService } from "../../services/employeeService";
import StateMessage from "../../components/shared/StateMessage";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-opacity-40 backdrop-blur-sm"
        onClick={onCancel}
      ></div>
      
      {/* Modal Content */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-fade-in relative z-10">
        
        <div className="flex justify-between items-center mb-4 border-b pb-4">
          <h2 className="text-xl font-bold text-gray-800">Cập nhật nhân viên</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Họ tên */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Họ tên <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                name="HoTen" 
                required
                value={formData.HoTen} 
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ví dụ: Nguyễn Văn A"
              />
            </div>

            {/* Số điện thoại */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
              <input 
                type="text" 
                name="SDT"
                value={formData.SDT} 
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ví dụ: 0912345678"
              />
            </div>
            
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input 
                type="email"
                name="Email"
                value={formData.Email}
                disabled
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-100 text-gray-400 cursor-not-allowed"
              />
            </div>

            {/* Chức vụ */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Chức vụ <span className="text-red-500">*</span></label>
              <select
                name="ChucVu"
                required
                value={formData.ChucVu}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">-- Chọn chức vụ --</option>
                <option value="NhanVien">Nhân viên</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onCancel} 
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Hủy bỏ
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium disabled:opacity-50"
            >
              {loading ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
        
        {/* Error Message */}
        <StateMessage
          error={error}
          onClose={() => setError(null)}
        />
      </div>
    </div>
  );
}
