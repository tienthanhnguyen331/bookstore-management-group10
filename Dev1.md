# Báo cáo Công việc Dev 1: Core Authentication & Routing

Tài liệu này tổng hợp logic và mã nguồn đã triển khai cho phần Core Auth của dự án.

## 1. Cấu hình API Client (`services/api.js`)

**Logic:**
*   Tạo instance Axios với `baseURL` trỏ về Backend.
*   **Request Interceptor:** Tự động lấy `token` từ `localStorage` và đính kèm vào header `Authorization` của mọi request.
*   **Response Interceptor:** Lắng nghe phản hồi từ server. Nếu gặp lỗi `401 Unauthorized` (Token hết hạn hoặc không hợp lệ), tự động xóa thông tin user trong `localStorage` và chuyển hướng về trang Login.

**Code:**
```javascript
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5051/api", // Use localhost for local development
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Auto logout if 401 Unauthorized
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;
```

## 2. Quản lý State (`context/AuthContext.jsx`)

**Logic:**
*   Sử dụng React Context để quản lý trạng thái `user` toàn cục.
*   **Initialization:** Khi ứng dụng khởi chạy (`useEffect`), kiểm tra `localStorage`. Nếu có thông tin user và token, khôi phục lại state `user` để duy trì đăng nhập khi F5.
*   **Login (Mock):**
    *   Giả lập độ trễ mạng 500ms.
    *   Kiểm tra hardcode: `admin`/`1` (Role: Admin) và `staff`/`1` (Role: NhanVien).
    *   Nếu đúng, lưu thông tin vào state và `localStorage`.
*   **Logout:** Xóa state và `localStorage`.

**Code:**
```jsx
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
```

## 3. Bảo vệ Route (`components/ProtectedRoute.jsx`)

**Logic:**
*   Component bao bọc các route cần bảo vệ.
*   Kiểm tra `user` từ `AuthContext`.
*   Nếu chưa đăng nhập (`!user`): Chuyển hướng về `/login`, kèm theo `state.from` để quay lại trang cũ sau khi login xong.
*   Nếu đã đăng nhập nhưng sai quyền (`allowedRoles`): Chuyển hướng về `/dashboard`.
*   Nếu hợp lệ: Render `Outlet` (nội dung trang con).

**Code:**
```jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        // Redirect to login page but save the attempted location
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // User is logged in but doesn't have permission
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
```

## 4. Trang Đăng nhập (`pages/LoginPage.jsx`)

**Logic:**
*   Form nhập Username/Password.
*   Gọi hàm `login` từ `AuthContext`.
*   Xử lý lỗi và hiển thị thông báo nếu đăng nhập thất bại.
*   Nếu thành công, chuyển hướng đến trang đích (`from`) hoặc mặc định là `/dashboard`.

**Code:**
```jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/dashboard';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!username || !password) {
            setError('Vui lòng nhập tên đăng nhập và mật khẩu');
            return;
        }

        try {
            await login(username, password);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message || 'Có lỗi xảy ra');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <Logo />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Đăng nhập hệ thống
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Quản lý nhà sách (Dev 1 Demo)
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-400 p-4">
                                <div className="flex">
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Tên đăng nhập
                            </label>
                            <div className="mt-1">
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="admin hoặc staff"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Mật khẩu
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Nhập '1'"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Đăng nhập
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
```

## 5. Tích hợp vào Ứng dụng (`App.jsx`)

**Logic:**
*   Bọc toàn bộ ứng dụng trong `AuthProvider`.
*   Định nghĩa Route `/login`.
*   Sử dụng `ProtectedRoute` để bảo vệ các route nghiệp vụ (Dashboard, Book, Sales...).
*   Phân quyền Admin cho các route nhạy cảm (Report, Setting).

**Code:**
```jsx
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// ... imports pages
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
    // ... (Logic load settings giữ nguyên)

    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    
                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['Admin', 'NhanVien']} />}>
                        <Route index element={<DashboardPage />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        {/* ... Các route khác ... */}
                    </Route>

                    {/* Admin Only Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
                        <Route path="/report" element={<ReportPage />} />
                        <Route path="/setting" element={<SettingsPage rules={rules} setRules={setRules} onRulesUpdate={loadRules} />} />
                    </Route>

                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
```
