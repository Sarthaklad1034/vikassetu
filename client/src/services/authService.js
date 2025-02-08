// authService.js
import api from './api';

const authService = {
    login: async(credentials) => {
        try {
            console.log('Attempting login with:', credentials);
            const response = await api.post('/users/login', credentials);
            console.log('Login response:', response.data);

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            }
            return response.data.user;
        } catch (error) {
            // console.error('Login error details:', error.response ? .data);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
    },

    register: async(userData) => {
        try {
            const response = await api.post('/users/register', userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getUser: async() => {
        try {
            const response = await api.get('/users/me');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};

export default authService;