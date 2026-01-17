import api from "./api";

export const settingsService = {
    // Lấy toàn bộ quy định
    getRules: async () => {
        try {
            const response = await api.get("/QuyDinh");
            return response.data;
        } catch (error) {
            console.error("Error fetching rules:", error);
            throw error;
        }
    },

    // Cập nhật quy định
    updateRules: async (rulesData) => {
        try {
            const response = await api.put("/QuyDinh/CapNhat", {
                MinImportQuantity: Number(rulesData.MinImportQuantity),
                MinStockPreImport: Number(rulesData.MinStockPreImport),
                MinStockPostSell: Number(rulesData.MinStockPostSell),
                MaxDebt: Number(rulesData.MaxDebt),
                CheckDebtRule: Boolean(rulesData.CheckDebtRule),
            });
            return response.data;
        } catch (error) {
            console.error("Error updating rules:", error);
            throw error;
        }
    },
};
