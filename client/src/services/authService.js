// Auth service
import api from './api';

export const loginService = async (username, password) => {
    const response = await api.post('/Auth/login', { username, password });
    return response.data;
};
