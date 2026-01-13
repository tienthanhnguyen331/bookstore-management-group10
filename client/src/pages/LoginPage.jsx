import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import { AlertCircle, BookOpen, Eye, EyeOff, TrendingUp, Users } from 'lucide-react';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [showPassword, setShowPassword] = useState(false);

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
        <div className="min-h-screen flex">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-blue-400 to-blue-500 p-12 flex-col justify-between relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300 rounded-full opacity-20 blur-3xl -mr-48 -mt-48"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full opacity-20 blur-3xl -ml-48 -mb-48"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg border border-white/20">
                            <BookOpen className="h-8 w-8 text-white" />
                        </div>
                        <span className="text-2xl font-semibold text-white">BOOKSTORE</span>
                    </div>
                    
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Quản lý nhà sách<br />chuyên nghiệp và đẳng cấp
                    </h2>
                    <p className="text-blue-100 text-lg">
                        Hệ thống quản lý toàn diện cho mọi hoạt động kinh doanh sách
                    </p>
                </div>

                <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-4 text-white">
                        <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/20">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="font-medium">Báo cáo chi tiết</div>
                            <div className="text-sm text-blue-100">Theo dõi doanh thu</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-white">
                        <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/20">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="font-medium">Quản lý nhân viên</div>
                            <div className="text-sm text-blue-100">Kiểm soát tài khoản nhân viên</div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden mb-8 flex justify-center">
                        <Logo />
                    </div>

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Đăng nhập
                        </h1>
                        <p className="text-gray-600">
                            Nhập thông tin để truy cập hệ thống
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Error Alert */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                                <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                                <p className="text-sm text-red-700 flex-1">{error}</p>
                            </div>
                        )}

                        {/* Username Field */}
                        <div className="space-y-2">
                            <label 
                                htmlFor="username" 
                                className="block text-sm font-medium text-gray-700"
                            >
                                Tên đăng nhập
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                                placeholder="Nhập tên đăng nhập"
                            />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label 
                                htmlFor="password" 
                                className="block text-sm font-medium text-gray-700"
                            >
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all pr-11"
                                    placeholder="Nhập mật khẩu"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                            </div>
                            <Link 
                                to="/forgot-password" 
                                className="text-sm font-medium text-blue-400 hover:text-blue-500 transition-colors"
                            >
                                Quên mật khẩu?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full py-2.5 px-4 bg-blue-400 hover:bg-blue-500 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all"
                        >
                            Đăng nhập
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-sm text-gray-500 mt-8">
                        © 2026 BookStore. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
