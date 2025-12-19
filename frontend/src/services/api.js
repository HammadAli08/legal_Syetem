import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const errorMessage = error.response?.data?.detail || error.message || 'An error occurred';
        return Promise.reject(new Error(errorMessage));
    }
);

export const classificationAPI = {
    predict: async (text) => {
        const response = await apiClient.post('/classification/predict', { text });
        return response.data;
    },
};

export const prioritizationAPI = {
    predict: async (text) => {
        const response = await apiClient.post('/prioritization/predict', { text });
        return response.data;
    },
};

export const chatAPI = {
    ask: async (message, chatHistory = []) => {
        const response = await apiClient.post('/chat/ask', {
            message,
            chat_history: chatHistory,
        });
        return response.data;
    },
    clearHistory: async () => {
        const response = await apiClient.post('/chat/clear');
        return response.data;
    },
};

export default apiClient;
