import BodyHistoryTable from "./BodyHistoryTable";

export function EntryHistory({ history }) {
    return (
        <div>
            <h2 className="mb-4 text-xl font-semibold">Lịch sử nhập</h2>
            <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="overflow-auto h-100">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-100 text-center">
                                <th className="px-4 py-3">Mã PN</th>
                                <th className="px-4 py-3">Ngày nhập</th>
                                <th className="px-4 py-3">Số loại sách</th>
                                <th className="px-4 py-3">Tổng số lượng</th>
                                <th className="px-4 py-3">Chi tiết</th>
                            </tr>
                        </thead>
                        <BodyHistoryTable history={history} />
                    </table>
                </div>
            </div>
        </div>
    );
}
