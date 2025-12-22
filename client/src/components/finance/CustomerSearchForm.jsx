import { Search } from "lucide-react";

function CustomerSearchForm({ searchForm, onSearchChange }) {
    return (
        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
            <div className="flex items-center gap-2 mb-6">
                <Search className="w-5 h-5 text-gray-400" />
                <h2 className="font-semibold">Tìm kiếm khách hàng nợ</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block mb-2 text-gray-600 ">
                        Tên khách hàng
                    </label>
                    <input
                        type="text"
                        placeholder="Nguyễn Văn A"
                        value={searchForm.HoTen}
                        onChange={(e) => onSearchChange("HoTen", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 transition-colors"
                    />
                </div>

                <div>
                    <label className="block mb-2 text-gray-600">Email</label>
                    <input
                        type="email"
                        placeholder="nguyenvana@gmail.com"
                        value={searchForm.Email}
                        onChange={(e) =>
                            onSearchChange("Email", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 transition-colors"
                    />
                </div>

                <div>
                    <label className="block mb-2 text-gray-600">
                        Số điện thoại
                    </label>
                    <input
                        type="tel"
                        placeholder="0366548525"
                        value={searchForm.SDT}
                        onChange={(e) =>
                            onSearchChange("SDT", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 transition-colors"
                    />
                </div>
            </div>
        </div>
    );
}

export default CustomerSearchForm;
