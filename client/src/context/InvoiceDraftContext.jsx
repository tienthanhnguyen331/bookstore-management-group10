import React, { createContext, useContext, useState, useEffect } from 'react';

const InvoiceDraftContext = createContext();

export const InvoiceDraftProvider = ({ children }) => {
    const [draft, setDraft] = useState(() => {
        const saved = localStorage.getItem('invoice_draft');
        return saved ? JSON.parse(saved) : {};
    });

    const updateDraft = (newDraft) => {
        setDraft(prev => {
            const updated = { ...prev, ...newDraft };
            localStorage.setItem('invoice_draft', JSON.stringify(updated));
            return updated;
        });
    };

    const clearDraft = () => {
        setDraft({});
        localStorage.removeItem('invoice_draft');
    };

    return (
        <InvoiceDraftContext.Provider value={{ draft, updateDraft, clearDraft }}>
            {children}
        </InvoiceDraftContext.Provider>
    );
};

export const useInvoiceDraft = () => useContext(InvoiceDraftContext);
