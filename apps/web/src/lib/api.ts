import { API_BASE_URL } from '@/lib/api-config';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string) {
    return this.request<{ access_token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(data: { email: string; password: string; firstName: string; lastName: string }) {
    return this.request<{ access_token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Jobs
  async getJobs(params?: { search?: string; country?: string; department?: string; page?: number; limit?: number }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<any>(`/jobs?${query}`);
  }

  async getJobById(id: string) {
    return this.request<any>(`/jobs/${id}`);
  }

  async createJob(data: any) {
    return this.request<any>('/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async applyForJob(jobId: string, coverLetter?: string) {
    return this.request<any>(`/jobs/${jobId}/apply`, {
      method: 'POST',
      body: JSON.stringify({ coverLetter }),
    });
  }

  async getMyApplications() {
    return this.request<any>('/jobs/candidate/my-applications');
  }

  async getEmployerJobs() {
    return this.request<any>('/jobs/employer/my-jobs');
  }

  async getJobStats() {
    return this.request<any>('/jobs/employer/stats');
  }

  // AI
  async getMigrationGuidance(country: string) {
    return this.request<any>(`/ai/migration/${country}`);
  }

  async getCareerGuidance(query: string) {
    return this.request<any>('/ai/career/chat', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
  }

  async getChurnPrediction() {
    return this.request<any>('/ai/churn/predict');
  }

  async logStudyActivity(activityType: string, duration: number, metadata?: any) {
    return this.request<any>('/ai/activity', {
      method: 'POST',
      body: JSON.stringify({ activityType, duration, metadata }),
    });
  }

  // Documents
  async getDocuments(category?: string) {
    const query = category ? `?category=${category}` : '';
    return this.request<any>(`/documents${query}`);
  }

  async getDocumentStats() {
    return this.request<any>('/documents/stats');
  }

  async uploadDocument(data: { name: string; type: string; category: string; fileUrl: string }) {
    return this.request<any>('/documents', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Notifications
  async getNotifications(unreadOnly?: boolean) {
    const query = unreadOnly ? '?unread=true' : '';
    return this.request<any>(`/notifications${query}`);
  }

  async getUnreadCount() {
    return this.request<any>('/notifications/unread-count');
  }

  async markAsRead(notificationId: string) {
    return this.request<any>(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  async markAllAsRead() {
    return this.request<any>('/notifications/read-all', {
      method: 'PUT',
    });
  }

  // Migration
  async getMigrationProgress() {
    return this.request<any>('/migration/progress');
  }

  async updateMigrationProgress(data: any) {
    return this.request<any>('/migration/progress', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Clinical Logs
  async getClinicalLogs() {
    return this.request<any>('/clinical-log');
  }

  async createClinicalLog(data: any) {
    return this.request<any>('/clinical-log', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Exams
  async getExamQuestions(type?: string) {
    const query = type ? `?type=${type}` : '';
    return this.request<any>(`/exam/questions${query}`);
  }

  async submitExam(answers: { questionId: string; answer: number }[], timeSpent: number) {
    return this.request<any>('/exam/submit', {
      method: 'POST',
      body: JSON.stringify({ answers, timeSpent }),
    });
  }

  async getExamHistory() {
    return this.request<any>('/exam/history');
  }

  async getExamStats() {
    return this.request<any>('/exam/stats');
  }

  // Advocacy
  async submitAdvocacyReport(data: any) {
    return this.request<any>('/advocacy', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAdvocacyReports() {
    return this.request<any>('/advocacy');
  }
}

export const api = new ApiClient(API_BASE_URL);
