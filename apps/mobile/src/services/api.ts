import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (data: { email: string; password: string; firstName: string; lastName: string }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
};

export const jobs = {
  getAll: async (params?: any) => {
    const response = await api.get('/jobs', { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },
  apply: async (jobId: string, coverLetter?: string) => {
    const response = await api.post(`/jobs/${jobId}/apply`, { coverLetter });
    return response.data;
  },
};

export const migration = {
  getProgress: async () => {
    const response = await api.get('/migration/progress');
    return response.data;
  },
  updateProgress: async (data: any) => {
    const response = await api.put('/migration/progress', data);
    return response.data;
  },
  getGuidance: async (country: string) => {
    const response = await api.get(`/ai/migration/${country}`);
    return response.data;
  },
};

export const exams = {
  getQuestions: async (type?: string) => {
    const response = await api.get('/exam/questions', { params: { type } });
    return response.data;
  },
  submit: async (answers: any[], timeSpent: number) => {
    const response = await api.post('/exam/submit', { answers, timeSpent });
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('/exam/stats');
    return response.data;
  },
};

export const documents = {
  getAll: async () => {
    const response = await api.get('/documents');
    return response.data;
  },
  upload: async (data: any) => {
    const response = await api.post('/documents', data);
    return response.data;
  },
};

export default api;
