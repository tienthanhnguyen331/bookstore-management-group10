// Auth service
import api from './api';

export const loginService = async (username, password) => {
    const response = await api.post('/Auth/login', { username, password });
    return response.data;
};

export const changePasswordService = async (username, oldPassword, newPassword) => {
    const response = await api.post('/Auth/change-password', {
        Username: username,
        OldPassword: oldPassword,
        NewPassword: newPassword
    });
    return response.data;
};

export const forgotPassword = async (email) => {
    return await api.post('/auth/forgot-password', { email });
};

export const resetPasswordWithOtp = async (email, otp, newPassword) => {
    return await api.post('/auth/reset-password-otp', { email, otp, newPassword });
};