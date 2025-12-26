import api from "./api";

// Mapping các quy định để hiển thị
const ruleConfig = {
    QD1_NhapToiThieu: {
        label: "Số lượng nhập tối thiểu",
        description: "Số lượng tối thiểu khi nhập sách vào kho",
        type: "number"
    },
    QD1_TonToiDaTruocNhap: {
        label: "Tồn tối đa trước nhập",
        description: "Số lượng tối đa trong kho trước khi nhập",
        type: "number"
    },
    QD2_NoToiDa: {
        label: "Nợ tối đa của khách",
        description: "Tổng số tiền khách hàng được phép nợ tối đa",
        type: "number"
    },
    QD2_TonToiThieuSauBan: {
        label: "Tồn tối thiểu sau bán",
        description: "Số lượng tối thiểu trong kho sau khi bán",
        type: "number"
    },
    QD4_ThuKhongVuotNo: {
        label: "Thu tiền không vượt nợ",
        description: "Số tiền thu không được vượt quá số nợ của khách",
        type: "boolean"
    }
};

export const settingsService = {
    // Lấy toàn bộ quy định
    getRules: async () => {
        try {
            const response = await api.get("/quydinh");
            return response.data || [];
        } catch (error) {
            console.error("Error fetching rules:", error);
            throw error;
        }
    },

    // Lấy danh sách quy định với metadata
    getRulesWithConfig: async () => {
        try {
            const rules = await settingsService.getRules();
            return rules
                .filter(rule => ruleConfig[rule.tenQuyDinh])
                .map(rule => ({
                    ...rule,
                    ...ruleConfig[rule.tenQuyDinh]
                }));
        } catch (error) {
            console.error("Error fetching rules with config:", error);
            throw error;
        }
    },

    // Cập nhật quy định
    updateRule: async (key, giaTri, trangThai = true) => {
        try {
            const response = await api.put(`/quydinh/${key}`, {
                giaTri: giaTri.toString(),
                trangThai
            });
            return response.data;
        } catch (error) {
            console.error(`Error updating rule ${key}:`, error);
            throw error;
        }
    },

    // Lấy config của một quy định
    getRuleConfig: (key) => {
        return ruleConfig[key];
    },

    // Lấy tất cả config
    getAllRuleConfigs: () => {
        return ruleConfig;
    }
};
