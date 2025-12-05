export default function CustomerDebtTableHead() {
    const headers = [
        "STT",
        "Tên khách hàng",
        "Email",
        "Số điện thoại",
        "Địa chỉ",
        "Số tiền nợ",
        "Thao tác",
    ];

    return (
        <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
                {headers.map((header) => (
                    <th
                        key={header}
                        className="px-6 py-4 text-left text-gray-600"
                    >
                        {header}
                    </th>
                ))}
            </tr>
        </thead>
    );
}
