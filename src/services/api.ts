import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:8080/api/v1';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        // Lấy token từ cookie thay vì localStorage để đồng bộ với middleware
        const token = Cookies.get('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized error (e.g., redirect to login)
            Cookies.remove('access_token');
            Cookies.remove('role_name');
            window.location.href = '/auth/login';
        }
        return Promise.reject(error);
    }
);



export default api;