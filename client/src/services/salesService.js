// MOCK DATA
const MOCK_BOOKS = [
  { id: 1, title: 'Nhập môn lập trình', category: 'Giáo dục', price: 100000, stock: 50 },
  { id: 2, title: 'Cơ sở trí tuệ nhân tạo', category: 'Khoa học', price: 120000, stock: 20 },
  { id: 3, title: 'Đắc nhân tâm', category: 'Kỹ năng sống', price: 80000, stock: 15 },
  { id: 4, title: 'Truyện kinh dị', category: 'Giải trí', price: 50000, stock: 100 },
];

const MOCK_CUSTOMERS = [
    { phone: '0909000111', fullName: 'Nguyễn Văn A', totalDebt: 500000 },
    { phone: '0909000222', fullName: 'Trần Thị B', totalDebt: 0 },
    { phone: '0909000333', fullName: 'Lê Văn C', totalDebt: 2500000 }, // Nợ quá hạn
];

export const getBooks = async () => {
  return new Promise(() => {
    setTimeout(() => {resolve
      resolve(MOCK_BOOKS);
    }, 500);
  });
};

export const getCustomerDebt = async (phone) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const customer = MOCK_CUSTOMERS.find(c => c.phone === phone);
            if (customer) {
                resolve(customer);
            } else {
                // Giả lập không tìm thấy khách
                reject({ response: { status: 404 } });
            }
        }, 300);
    });
};

export const createInvoice = async (payload) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Giả lập logic check nợ/tồn kho đơn giản
            
            const totalAmount = payload.items.reduce((sum, item) => {
                const book = MOCK_BOOKS.find(b => b.id === item.bookId);
                return sum + (book ? book.price * item.quantity : 0);
            }, 0);

            resolve({
                message: "Thanh toán thành công (MOCK)!",
                totalAmount: totalAmount
            });
        }, 1000);
    });
};
