import BodyFormTable from "./BodyFormTable";
import { createImportReceipt } from "../services/inventoryService";
import formatDate from "../utils/formatDate";

export function EntryFormTable({
    entries,
    setEntries,
    selectedDate,
    setSaving,
    setError,
    setSuccess,
}) {
    const handleDelete = (id) => {
        setEntries(entries.filter((entry) => entry.id !== id));
    };

    const handleSave = async () => {
        // Clear previous messages
        setError(null);
        setSuccess(false);

        // Validation
        if (entries.length === 0) {
            setError("Vui lòng thêm ít nhất một sách vào phiếu nhập");
            return;
        }

        if (!selectedDate) {
            setError("Vui lòng chọn ngày nhập");
            return;
        }

        try {
            setSaving(true);

            // Build payload for API
            const payload = {
                NgayNhap: new Date(selectedDate).toISOString(),
                DanhSachSach: entries.map((entry) => ({
                    MaSach: entry.MaSach,
                    SoLuong: Number(entry.quantity),
                    DonGiaNhap: Number(entry.unitPrice),
                })),
            };

            // POST to API
            await createImportReceipt(payload);

            // Clear entries after successful save
            setEntries([]);
            setSuccess(true);
        } catch (err) {
            console.error("Error saving import receipt:", err);
            setError(err.response?.data?.message || "Không thể lưu phiếu nhập");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">Phiếu nhập</h2>
            <div className="bg-white rounded-lg p-6 shadow-sm">
                <p className="text-gray-500 mb-6">
                    Ngày:{" "}
                    {selectedDate ? formatDate(selectedDate) : "Chưa chọn"}
                </p>

                <div className="mb-6 overflow-auto max-h-96">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-3 text-left">STT</th>
                                <th className="px-4 py-3 text-left">
                                    Tên sách
                                </th>
                                <th className="px-4 py-3 text-left">
                                    Thể loại
                                </th>
                                <th className="px-4 py-3 text-left">Tác giả</th>
                                <th className="px-4 py-3 text-left">
                                    Số lượng
                                </th>
                                <th className="px-4 py-3 text-left">Đơn giá</th>
                                <th className="px-4 py-3 text-left">
                                    Thành tiền
                                </th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <BodyFormTable
                            entries={entries}
                            handleDelete={handleDelete}
                        />
                    </table>
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={handleSave}
                        disabled={entries.length === 0}
                        className="px-8 py-3 bg-blue-400 text-white rounded hover:bg-blue-500 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Lưu phiếu nhập
                    </button>
                </div>
            </div>
        </div>
    );
}
