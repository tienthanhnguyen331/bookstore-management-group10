import React from "react";

export function AccountSection() {
    return (
        <section className="mb-12">
            <h1 className="mb-6 text-xl font-semibold">Account</h1>

            <div className="bg-white rounded-lg p-8 shadow-sm">
                <form className="grid grid-cols-2 gap-x-16 gap-y-6 mb-8">
                    {/* Họ Tên */}
                    <div>
                        <label className="block mb-2" htmlFor="name">
                            Họ Tên:
                        </label>
                        <input
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            type="text"
                            id="name"
                        />
                    </div>

                    {/* Chức vụ */}
                    <div>
                        <label className="block mb-2" htmlFor="position">
                            Chức vụ:
                        </label>
                        <input
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            type="text"
                            id="position"
                        />
                    </div>

                    {/* Số điện thoại */}
                    <div>
                        <label className="block mb-2" htmlFor="phone">
                            Số điện thoại:
                        </label>
                        <input
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            type="tel"
                            id="phone"
                        />
                    </div>

                    {/* Empty cell */}
                    <div></div>

                    {/* Địa chỉ */}
                    <div>
                        <label className="block mb-2" htmlFor="address">
                            Địa chỉ:
                        </label>
                        <input
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            type="text"
                            id="address"
                        />
                    </div>
                </form>

                {/* Change password button */}
                <div className="flex justify-center">
                    <button className="bg-blue-400 hover:bg-blue-500 text-white px-8 py-2 rounded transition-colors">
                        Đổi mật khẩu
                    </button>
                </div>
            </div>
        </section>
    );
}
