import { X } from "lucide-react";
import { useEffect, useState } from "react";

function EditCustomerModal({ customer, onCloseModal, onSaveCustomer }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        debt: 0,
    });

    useEffect(() => {
        if (customer) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFormData({
                // because the id is needed when updating in CustomerDebtPage
                id: customer.id,
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                address: customer.address,
                debt: customer.debt,
            });
        }
    }, [customer]);

    // const [formData, setFormData] = useState({ ...customer });

    const handleCancel = function () {
        onCloseModal();
    };

    const handleSubmit = function (e) {
        e.preventDefault();
        onSaveCustomer({ ...formData });
        onCloseModal();
    };

    const handleChange = function (field, value) {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2>Chỉnh sửa thông tin khách hàng</h2>
                    <button
                        onClick={handleCancel}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-6">
                        <div>
                            <label className="block mb-2 text-gray-600">
                                Tên khách hàng
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) =>
                                    handleChange("name", e.target.value)
                                }
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 transition-colors"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-2 text-gray-600">
                                    Email<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        handleChange("email", e.target.value)
                                    }
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-gray-600">
                                    Số điện thoại
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) =>
                                        handleChange("phone", e.target.value)
                                    }
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2 text-gray-600">
                                Địa chỉ<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) =>
                                    handleChange("address", e.target.value)
                                }
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-gray-600">
                                Số tiền nợ
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={`${formData.debt.toLocaleString(
                                        "vi-VN"
                                    )} đ`}
                                    disabled
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                    <span className="text-gray-400 text-sm">
                                        (Không thể chỉnh sửa)
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors"
                        >
                            Lưu thay đổi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditCustomerModal;
