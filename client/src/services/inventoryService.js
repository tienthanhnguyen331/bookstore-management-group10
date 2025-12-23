import api from "./api";

export async function getBooks() {
    const res = await api.get("/Sach");
    return Array.isArray(res.data) ? res.data : [];
}

export async function getRules() {
    const res = await api.get("/QuyDinh");
    return res.data;
}

export async function createImportReceipt(payload) {
    // payload: { NgayNhap: string ISO, DanhSachSach: [{ MaSach, SoLuong, DonGiaNhap }] }
    const res = await api.post("/PhieuNhap/TaoPhieu", payload);
    return res.data;
}

export default {
    getBooks,
    getRules,
    createImportReceipt,
};
