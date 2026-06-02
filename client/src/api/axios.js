import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Matches your Node server port
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('skillhub_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle Global Errors (Optional but recommended)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('skillhub_user');
            localStorage.removeItem('skillhub_token');
            // Ideally redirect to login here, but usually handled by AuthContext
        }
        return Promise.reject(error);
    }
);

export default api;