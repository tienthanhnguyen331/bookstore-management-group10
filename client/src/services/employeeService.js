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

  // Cập nhật nhân viên
  update: async (MaNV, data) => {
    try {
      const res = await api.put(`/Admin/${MaNV}`, data);
      return res.data; // { message: "Cập nhật thành công" }
    } catch (err) {
      console.error("Error updating employee:", err.response || err);
      throw err;
    }
  },
  
};
