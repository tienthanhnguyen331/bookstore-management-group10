import { Header } from "../components/Header";
import { StockEntryForm } from "../components/StockEntryForm";
import { EntryFormTable } from "../components/EntryFormTable";
import { EntryHistory } from "../components/EntryHistory";
import { useState } from "react";

const tempData = [
    {
        id: 1,
        bookName: "Sách 01",
        category: "TL01",
        author: "Nguyễn Văn A",
        quantity: 1000,
    },
    {
        id: 2,
        bookName: "Sách 02",
        category: "TL02",
        author: "Nguyễn Văn C",
        quantity: 2000,
    },
    {
        id: 3,
        bookName: "Sách 03",
        category: "TL03",
        author: "Nguyễn Văn C",
        quantity: 3000,
    },
    {
        id: 4,
        bookName: "Sách 04",
        category: "TL04",
        author: "Nguyễn Văn D",
        quantity: 4000,
    },
];

const initialHistory = [
    { id: 1, date: "15/11/2025", bookTypes: 2, totalQuantity: 2000 },
    { id: 2, date: "15/11/2025", bookTypes: 3, totalQuantity: 3000 },
    { id: 3, date: "15/11/2025", bookTypes: 4, totalQuantity: 4000 },
    { id: 4, date: "15/11/2025", bookTypes: 5, totalQuantity: 5000 },
    { id: 5, date: "15/11/2025", bookTypes: 5, totalQuantity: 5000 },
    { id: 6, date: "15/11/2025", bookTypes: 5, totalQuantity: 5000 },
    { id: 7, date: "15/11/2025", bookTypes: 5, totalQuantity: 5000 },
    { id: 8, date: "15/11/2025", bookTypes: 5, totalQuantity: 5000 },
];

export default function InventoryPage() {
    const [entries, setEntries] = useState(tempData);

    const [histories, setHistories] = useState(initialHistory);

    // this function will save entry into history, when user click 'Lưu phiếu nhập' at EntryFormTable
    const handleSaveEntry = function (newHistory) {
        if (
            !newHistory.date ||
            !newHistory.bookTypes ||
            !newHistory.totalQuantity
        )
            return;

        setHistories([...histories, newHistory]);
        setEntries([]);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="max-w-7xl mx-auto px-6 py-8 ">
                <h1 className="mb-8 text-xl font-semibold">Nhập kho</h1>
                <StockEntryForm entries={entries} setEntries={setEntries} />
                <EntryFormTable
                    history={histories}
                    entries={entries}
                    setEntries={setEntries}
                    handleSaveEntry={handleSaveEntry}
                />
                <EntryHistory history={histories} />
            </main>
        </div>
    );
}
