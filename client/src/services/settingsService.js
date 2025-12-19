// Mock data cho Settings
const mockRulesData = {
    minImportQuantity: 30,
    minStockBefore: 300,
    minStockAfter: 100,
    maxDebt: 10000000,
    applyPaymentLimit: false,
};

export const settingsService = {
    // Lấy toàn bộ quy định cài đặt
    getRules: async () => {
        return new Promise((resolve) => {
            // TODO: Thay bằng API khi backend xong
            // return api.get('/api/settings/rules');
            setTimeout(() => {
                resolve(mockRulesData);
            }, 300);
        });
    },

    // Lưu quy định cài đặt
    saveRules: async (data) => {
        return new Promise((resolve) => {
            // TODO: Thay bằng API khi backend xong
            // return api.post('/api/settings/rules', data);
            setTimeout(() => {
                console.log("Settings saved:", data);
                resolve({ success: true, message: "Cài đặt đã được lưu thành công" });
            }, 300);
        });
    },

    // Lấy từng quy định cụ thể
    getRule: async (ruleKey) => {
        return new Promise((resolve) => {
            // TODO: Thay bằng API khi backend xong
            // return api.get(`/api/settings/rules/${ruleKey}`);
            setTimeout(() => {
                resolve(mockRulesData[ruleKey] || null);
            }, 200);
        });
    },

    // Cập nhật từng quy định cụ thể
    updateRule: async (ruleKey, value) => {
        return new Promise((resolve) => {
            // TODO: Thay bằng API khi backend xong
            // return api.patch(`/api/settings/rules/${ruleKey}`, { value });
            setTimeout(() => {
                mockRulesData[ruleKey] = value;
                console.log(`Rule ${ruleKey} updated to:`, value);
                resolve({ success: true, message: `${ruleKey} đã được cập nhật` });
            }, 200);
        });
    },
};
