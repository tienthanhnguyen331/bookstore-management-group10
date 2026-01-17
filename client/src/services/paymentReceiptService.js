import api from "./api";

export const paymentReceiptService = {
    // Get customers with outstanding debt
    getCustomersWithDebt: async () => {
        try {
            const response = await api.get("/PhieuThuTien/KhachHangDangNo");
            return response.data;
        } catch (error) {
            console.error("Error fetching customers with debt:", error);
            throw error;
        }
    },

    // Search customer by phone number
    searchCustomer: async (phoneNumber) => {
        try {
            const response = await api.get("/PhieuThuTien/TraCuuKhachHang", {
                params: { sdt: phoneNumber },
            });
            return response.data;
        } catch (error) {
            console.error("Error searching customer:", error);
            throw error;
        }
    },

    // Create payment receipt
    createPaymentReceipt: async (data) => {
        try {
            const response = await api.post("/PhieuThuTien/LapPhieu", {
                SDTKhachHang: data.SDT,
                SoTienThu: data.SoTienThu,
            });
            return response.data;
        } catch (error) {
            console.error("Error creating payment receipt:", error);
            throw error;
        }
    },
};
