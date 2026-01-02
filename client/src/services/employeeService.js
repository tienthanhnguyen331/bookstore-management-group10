import api from "./api";

export const employeeService = {
   getAll: async () => {
    const res = await api.get("/Admin/employees");
    return res.data; 
  },

  create: async (data) => {
    try {
      const res = await api.post("/Admin/create-employee", data);
      return res.data;
    } catch (err) {
      console.error("Error creating employee:", err.response || err);
      throw err;
    }
  },

  // tạm thời các hàm khác chỉ mock vì backend chưa có
  delete: async () => {},
  update: async () => {},
  resetPassword: async () => {},
};
