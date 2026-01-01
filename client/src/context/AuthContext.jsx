import { createContext, useState, useContext, useEffect } from 'react';
// import api from '../services/api'; // Tạm thời chưa dùng API thật

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load user from localStorage on mount
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        // --- MOCK DATA LOGIC ---
        // Giả lập độ trễ mạng
        await new Promise(resolve => setTimeout(resolve, 500));

        if (username === 'admin' && password === '1') {
            const mockUser = {
                username: 'admin',
                name: 'Nguyễn Văn Quản Lý',
                role: 'Admin',
                token: 'mock-jwt-token-admin'
            };
            setUser(mockUser);
            localStorage.setItem('user', JSON.stringify(mockUser));
            localStorage.setItem('token', mockUser.token);
            return true;
        }

        if (username === 'staff' && password === '1') {
            const mockUser = {
                username: 'staff',
                name: 'Trần Thị Nhân Viên',
                role: 'NhanVien',
                token: 'mock-jwt-token-staff'
            };
            setUser(mockUser);
            localStorage.setItem('user', JSON.stringify(mockUser));
            localStorage.setItem('token', mockUser.token);
            return true;
        }

        throw new Error("Tên đăng nhập hoặc mật khẩu không đúng");
        // --- END MOCK DATA ---
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
