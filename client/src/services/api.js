// src/services/api.js
import axios from "axios";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add request interceptor
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Add response interceptor
api.interceptors.response.use(
    response => response,
    error => {
        // console.log('API Error:', {
        //     status: error.response ? .status,
        //     data: error.response ? .data,
        //     message: error.message
        // });
        return Promise.reject(error);
    }
);

export default api;