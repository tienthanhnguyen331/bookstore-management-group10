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

const history = [
    { id: "#PN01", date: "15/11/2025", bookTypes: 2, totalQuantity: 2000 },
    { id: "#PN02", date: "15/11/2025", bookTypes: 3, totalQuantity: 3000 },
    { id: "#PN03", date: "15/11/2025", bookTypes: 4, totalQuantity: 4000 },
    { id: "#PN04", date: "15/11/2025", bookTypes: 5, totalQuantity: 5000 },
    { id: "#PN05", date: "15/11/2025", bookTypes: 5, totalQuantity: 5000 },
    { id: "#PN06", date: "15/11/2025", bookTypes: 5, totalQuantity: 5000 },
    { id: "#PN07", date: "15/11/2025", bookTypes: 5, totalQuantity: 5000 },
    { id: "#PN08", date: "15/11/2025", bookTypes: 5, totalQuantity: 5000 },
];

export default function InventoryPage() {
    const [entries, setEntries] = useState(tempData);

    const [histories, setHistories] = useState(history);

    // this function will save entry into history, when user click 'Lưu phiếu nhập' at EntryFormTable
    const handleSaveEntry = function (newHistory) {
        if (!history.date || !history.bookTypes || !history.totalQuantity)
            return;

        setHistories([...histories, newHistory]);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="max-w-7xl mx-auto px-6 py-8 ">
                <h1 className="mb-8 text-xl font-semibold">Nhập kho</h1>
                <StockEntryForm entries={entries} setEntries={setEntries} />
                <EntryFormTable
                    entries={entries}
                    history={histories}
                    setEntries={setEntries}
                    handleSaveEntry={handleSaveEntry}
                />
                <EntryHistory history={histories} />
            </main>
        </div>
    );
}
