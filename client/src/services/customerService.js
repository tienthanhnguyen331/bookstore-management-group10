import api from "./api";

export const customerService = {
    getAll: async () => {
        const response = await api.get("/KhachHang");
        return response.data;
    },
    create: async (customerData) => {
      const response = await api.post('/KhachHang', customerData);
      return response.data;
    }, 
    update: async (customerId, data) => {
      const response = await api.put(`/KhachHang/update-info/${customerId}`, data);
      return response.data;
    }
};