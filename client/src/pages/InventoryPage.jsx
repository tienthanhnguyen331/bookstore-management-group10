import { Header } from "../components/Header";
import { StockEntryForm } from "../components/StockEntryForm";
import { EntryFormTable } from "../components/EntryFormTable";
import { useState } from "react";

export default function InventoryPage({ rules }) {
    const [entries, setEntries] = useState([]);
    const [selectedDate, setSelectedDate] = useState(() =>
        new Date().toISOString().slice(0, 10)
    );
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="max-w-7xl mx-auto px-6 py-8 ">
                <h1 className="mb-8 text-xl font-semibold">Nhập kho</h1>
                <div className="mb-6">
                    <label className="block mb-2 font-semibold">
                        Ngày nhập<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-400"
                    />
                </div>
                <StockEntryForm
                    entries={entries}
                    setEntries={setEntries}
                    rules={rules}
                    saving={saving}
                    error={error}
                    success={success}
                    setError={setError}
                    setSuccess={setSuccess}
                />
                <EntryFormTable
                    entries={entries}
                    setEntries={setEntries}
                    selectedDate={selectedDate}
                    setSaving={setSaving}
                    setError={setError}
                    setSuccess={setSuccess}
                />
            </main>
        </div>
    );
}
