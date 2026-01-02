// services/employeeService.js

const mockEmployees = [
  {
    maNV: "NV001",
    hoTen: "Nguyễn Văn A",
    sdt: "0909123456",
    email: "a@gmail.com",
    chucVu: "NhanVien",
    username: "vana"
  },
  {
    maNV: "NV002",
    hoTen: "Trần Thị B",
    sdt: "0911222333",
    email: "b@gmail.com",
    chucVu: "NhanVien",
    username: "thib"
  },
  {
    maNV: "NV003",
    hoTen: "Nguyễn Duy Tu",
    sdt: "0909123446",
    email: "v@gmail.com",
    chucVu: "NhanVien",
    username: "vanaâ"
  }
  
];

export const employeeService = {
  getAll: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockEmployees);
      }, 500);
    });
  },

  create: async (data) => {
    console.log("Mock create employee:", data);
    return Promise.resolve({ message: "Tạo nhân viên thành công (mock)" });
  },

  delete: async (maNV) => {
    console.log("Mock delete:", maNV);
    return Promise.resolve({ message: "Xóa thành công (mock)" });
  },

  resetPassword: async (maNV) => {
    console.log("Mock reset password:", maNV);
    return Promise.resolve({ message: "Reset mật khẩu (mock)" });
  }
};
