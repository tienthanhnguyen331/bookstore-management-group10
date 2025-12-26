import api from "./api";

export const reportService = {
    getStockReport: async (month, year) => {
        try {
            const response = await api.post("/Reports/stock", {
                Month: month,
                Year: year,
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching stock report:", error);
            throw error;
        }
    },

    getDebtReport: async (month, year) => {
        try {
            const response = await api.post("/Reports/debt", {
                Month: month,
                Year: year,
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching debt report:", error);
            throw error;
        }
    },
};
