import { useState } from "react";

export function useCustomerFilter(customers) {
    const [searchForm, setSearchForm] = useState({
        name: "",
        email: "",
        phone: "",
    });

    const filteredCustomers = customers.filter((customer) => {
        const nameMatch =
            searchForm.name === "" ||
            customer.name.toLowerCase().includes(searchForm.name.toLowerCase());
        const emailMatch =
            searchForm.email === "" ||
            customer.email
                .toLowerCase()
                .includes(searchForm.email.toLowerCase());
        const phoneMatch =
            searchForm.phone === "" ||
            customer.phone.includes(searchForm.phone);
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
