import { useState } from 'react';
import { X } from 'lucide-react';

const AddBookModal = ({isOpen, onClose, onSave}) => {
    //Lưu dữ liệu form
    const [formData, setFormData] = useState({
        TenSach: '',
        TenTacGia: '',
        TenTheLoai: '',
        DonGia: 0,
        SoLuongTon: 0
    });
    //Nếu form không bật trả về null
    if(!isOpen) return null;

    //Xử lí thay đổi input, biến e là biến event của React cung cấp để lưu những j người dùng vừa nhập
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({ ... prev, [name]: value })); // ...prev: sao chép toàn bộ dữ liệu cũ, [name]: value: cập nhật trường vừa thay đổi
    };

    //Xử lí khi bấm nút Lưu
    const handleSubmit = (e) => {
        e.preventDefault(); //Ngăn chặn hành vi mặc định của form (tải lại trang)
        if (!formData.TenSach || !formData.TenTacGia) {
            return alert("Vui lòng nhập đủ tên sách và tác giả!");
        }
        //Chuyển đổi kiểu dữ liệu
        const payload = {
            //Copy dữ liệu từ formData
            ...formData,
            DonGia: parseFloat(formData.DonGia),
            SoLuongTon: parseInt(formData.SoLuongTon)
        };

        onSave(payload); //Gọi hàm onSave truyền dữ liệu lên trên

        //Reset form sau khi lưu
        setFormData({
            TenSach: '',
            TenTacGia: '',
            TenTheLoai: '',
            DonGia: 0,
            SoLuongTon: 0
        });
        onClose(); // Đóng modal sau khi lưu
        
    };
    
        return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div 
                className="fixed inset-0 bg-opacity-40 backdrop-blur-sm"
                onClick={onClose}
            ></div>
            
            {/* Modal Content */}
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-fade-in relative z-10">
                
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h2 className="text-xl font-bold text-gray-800">Thêm sách mới</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
          <div className="space-y-4">
                    {/* Tên sách */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700">Tên sách <span className="text-red-500">*</span></label>
                    <input 
                        type="text" name="TenSach" required
                        value={formData.TenSach} onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ví dụ: Dế Mèn Phiêu Lưu Ký"
                    />
                    </div>

                    {/* Tác giả */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700">Tác giả <span className="text-red-500">*</span></label>
                    <input 
                        type="text" name="TenTacGia" required
                        value={formData.TenTacGia} onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    </div>

                    {/* Thể loại */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700">Thể loại</label>
                    <input 
                        type="text" name="TenTheLoai"
                        value={formData.TenTheLoai} onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    </div>

                    {/* Giá & Tồn kho */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Giá bán</label>
                            <input 
                                type="number" name="DonGia" min="0"
                                value={formData.DonGia} onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tồn đầu</label>
                            <input 
                                type="number" name="SoLuongTon" min="0"
                                value={formData.SoLuongTon} onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                        Hủy bỏ
                    </button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">
                        + Thêm sách
                    </button>
                </div>
                </form>
            </div>
        </div>
    );
};
export default AddBookModal;