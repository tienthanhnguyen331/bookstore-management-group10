// Format VND (100.000 ₫)
export default function formatCurrency(amount) {
    return amount.toLocaleString("vi-VN") + " ₫";
}
