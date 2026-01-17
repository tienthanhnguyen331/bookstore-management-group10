import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword, resetPasswordWithOtp } from '../services/authService';
import { AlertCircle, ArrowLeft, BookOpen, CheckCircle2, KeyRound, Lock, Mail } from 'lucide-react';
import AuthBrandingSidebar from '../components/auth/AuthBrandingSidebar';

const brandingFeatures = [
    {
        icon: Mail,
        title: 'Xác thực qua email',
        description: 'Nhận mã OTP an toàn'
    },
    {
        icon: Lock,
        title: 'Đặt lại mật khẩu',
        description: 'Tạo mật khẩu mới bảo mật'
    }
];

const ForgotPasswordPage = () => {
    const [step, setStep] = useState(1); // 1: Nhập Email, 2: Nhập OTP
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Xử lý Gửi OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setIsLoading(true);
        try {
            await forgotPassword(email);
            setStep(2);
            setMessage(`Mã OTP đã được gửi đến ${email}.`);
        } catch (err) {
            setError(err.response?.data || 'Không thể gửi OTP. Kiểm tra lại email.');
        } finally {
            setIsLoading(false);
        }
    };

    // Xử lý Đổi mật khẩu
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await resetPasswordWithOtp(email, otp, newPassword);
            alert('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data || 'Đổi mật khẩu thất bại. Mã OTP sai hoặc hết hạn.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Branding */}
            <AuthBrandingSidebar
                title="Đừng lo lắng! Chúng tôi sẽ giúp bạn"
                subtitle="Khôi phục mật khẩu chỉ trong vài bước đơn giản"
                features={brandingFeatures}
            />

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden mb-8 flex justify-center">
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-400 p-2 rounded-lg">
                                <BookOpen className="h-8 w-8 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-gray-900">BookStore</span>
                        </div>
                    </div>

                    {/* Back Button */}
                    <Link 
                        to="/login"
                        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Quay lại đăng nhập
                    </Link>

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Quên mật khẩu
                        </h1>
                        <p className="text-gray-600">
                            {step === 1 
                                ? 'Nhập email để nhận mã xác thực OTP' 
                                : 'Nhập mã OTP và mật khẩu mới của bạn'}
                        </p>
                    </div>

                    {/* Messages */}
                    {error && (
                        <div className="mb-5 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700 flex-1">{error}</p>
                        </div>
                    )}
                    {message && (
                        <div className="mb-5 bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                            <p className="text-sm text-green-700 flex-1">{message}</p>
                        </div>
                    )}

                    {/* Step Indicator */}
                    <div className="flex items-center justify-center mb-8">
                        <div className="flex items-center gap-2">
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                                step === 1 ? 'bg-blue-400 border-blue-400 text-white' : 'bg-green-50 border-green-500 text-green-600'
                            }`}>
                                {step === 1 ? '1' : <CheckCircle2 className="h-4 w-4" />}
                            </div>
                            <div className={`h-0.5 w-12 ${step === 2 ? 'bg-blue-400' : 'bg-gray-300'}`}></div>
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                                step === 2 ? 'bg-blue-400 border-blue-400 text-white' : 'bg-white border-gray-300 text-gray-400'
                            }`}>
                                2
                            </div>
                        </div>
                    </div>

                    {step === 1 ? (
                        <form onSubmit={handleSendOtp} className="space-y-5">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                                    placeholder="Nhập email của bạn"
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full py-2.5 px-4 bg-blue-400 hover:bg-blue-500 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Đang gửi...' : 'Gửi mã OTP'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleResetPassword} className="space-y-5">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input 
                                    type="email" 
                                    value={email} 
                                    disabled 
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Mã OTP
                                </label>
                                <div className="relative">
                                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        required
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                                        placeholder="Nhập mã OTP"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Mật khẩu mới
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="password"
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                                        placeholder="Nhập mật khẩu mới"
                                    />
                                </div>
                            </div>
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full py-2.5 px-4 bg-blue-400 hover:bg-blue-500 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                            </button>
                        </form>
                    )}

                    {/* Footer */}
                    <p className="text-center text-sm text-gray-500 mt-8">
                        © 2026 BookStore. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;