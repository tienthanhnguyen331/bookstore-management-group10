import BodyFormTable from "./BodyFormTable";

export function EntryFormTable({
    entries,
    setEntries,
    handleSaveEntry,
    history,
}) {
    const handleDelete = (id) => {
        setEntries(entries.filter((entry) => entry.id !== id));
    };

    // convert a form into a history to save in historyList
    // a history includes: id, date, bookTypes, totalQuantity, bookList
    const convertEntryFormIntoHistory = function () {
        // date (temp curdate)
        const date = new Date().toLocaleDateString();

        // id
        const id = history[history.length - 1]?.id + 1 || 1;

        //bookTypes
        const bookTypes = entries.length;

        // totalQuantity
        const totalQuantity = entries.reduce(
            (total, entry) => total + entry.quantity,
            0
        );

        const bookList = [...entries];

        return { id, date, bookTypes, totalQuantity, bookList };
    };

    return (
        <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">Phiếu nhập</h2>
            <div className="bg-white rounded-lg p-6 shadow-sm">
                <p className="text-gray-500 mb-6">Ngày: 16/11/2025</p>

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
                        onClick={() =>
                            handleSaveEntry(convertEntryFormIntoHistory())
                        }
                        className="px-8 py-3 bg-blue-400 text-white rounded hover:bg-blue-500 transition-colors"
                    >
                        Lưu phiếu nhập
                    </button>
                </div>
            </div>
        </div>
    );
}
