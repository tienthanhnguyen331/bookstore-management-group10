export const settingsService = {
    getRules: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ maxDebt: 2000000, minStockAfterSale: 20 });
            }, 200);
        });
    }
};
