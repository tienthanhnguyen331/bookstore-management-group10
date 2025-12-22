import { useState } from "react";

export function useCustomerFilter(customers) {
    const [searchForm, setSearchForm] = useState({
        HoTen: "",
        Email: "",
        SDT: "",
    });

    const filteredCustomers = customers.filter((customer) => {
        const nameMatch =
            searchForm.HoTen === "" ||
            customer.HoTen?.toLowerCase().includes(searchForm.HoTen.toLowerCase());
        const emailMatch =
            searchForm.Email === "" ||
            customer.Email
                ?.toLowerCase()
                .includes(searchForm.Email.toLowerCase());
        const phoneMatch =
            searchForm.SDT === "" ||
            customer.SDT?.includes(searchForm.SDT);
        return nameMatch && emailMatch && phoneMatch;
    });

    const handleSearchChange = function (field, value) {
        setSearchForm((prev) => ({ ...prev, [field]: value }));
    };

    return {
        searchForm,
        filteredCustomers,
        handleSearchChange,
    };
}
