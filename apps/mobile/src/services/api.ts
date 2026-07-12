import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // AsyncStorage not available
  }
  return config;
});

export const auth = {
  login: async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },
  register: async (data: { email: string; password: string; firstName: string; lastName: string; role?: string }) => {
    const response = await api.post('/api/auth/register', data);
    return response.data;
  },
};

export const jobs = {
  getAll: async (params?: any) => {
    const response = await api.get('/api/jobs', { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/api/jobs/${id}`);
    return response.data;
  },
  apply: async (jobId: string, coverLetter?: string) => {
    const response = await api.post(`/api/jobs/${jobId}/apply`, { coverLetter });
    return response.data;
  },
};

export const migration = {
  getProgress: async () => {
    const response = await api.get('/api/migration/progress');
    return response.data;
  },
  updateProgress: async (data: any) => {
    const response = await api.put('/api/migration/progress', data);
    return response.data;
  },
  getGuidance: async (country: string) => {
    const response = await api.get(`/api/ai/migration/${country}`);
    return response.data;
  },
};

export const exams = {
  getQuestions: async (type?: string) => {
    const response = await api.get('/api/exam/questions', { params: { type } });
    return response.data;
  },
  submit: async (answers: any[], timeSpent: number) => {
    const response = await api.post('/api/exam/submit', { answers, timeSpent });
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('/api/exam/stats');
    return response.data;
  },
};

export const documents = {
  getAll: async () => {
    const response = await api.get('/api/documents');
    return response.data;
  },
  upload: async (data: any) => {
    const response = await api.post('/api/documents', data);
    return response.data;
  },
};

export default api;
