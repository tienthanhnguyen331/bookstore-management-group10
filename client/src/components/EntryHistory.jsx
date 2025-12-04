import { useState } from "react";
import BodyHistoryTable from "./BodyHistoryTable";
import HistoryDetailModal from "./HistoryDetailModal";

export function EntryHistory({ history }) {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectedHistory, setSelectedHistory] = useState(null);

    const handleViewDetails = function (history) {
        setSelectedHistory(history);
        setIsOpenModal((isOpen) => !isOpen);
    };

    const handleCloseModal = function () {
        setIsOpenModal((isOpen) => !isOpen);
        setSelectedHistory(null);
    };

    return (
        <>
            {isOpenModal && (
                <HistoryDetailModal
                    entry={selectedHistory}
                    onClose={handleCloseModal}
                />
            )}

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
                            <BodyHistoryTable
                                history={history}
                                handleViewDetails={handleViewDetails}
                            />
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
