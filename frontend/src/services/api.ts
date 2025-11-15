import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const deleteWorkEntry = (id: string) => {
  return api.delete(`/work-entries/${id}`);
};

export const deleteJob = (id: string) => {
  return api.delete(`/jobs/${id}`);
};

// Analytics API
export const analyticsApi = {
  getEarningsTrend: (period: string = "month", startDate?: string, endDate?: string) => {
    const params = new URLSearchParams({ period });
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    return api.get(`/analytics/earnings-trend?${params}`);
  },

  getJobDistribution: (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    return api.get(`/analytics/job-distribution?${params}`);
  },

  getWeeklyPattern: (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    return api.get(`/analytics/weekly-pattern?${params}`);
  },

  getSummary: (period: string = "week") => {
    return api.get(`/analytics/summary?period=${period}`);
  },

  getComparison: (
    currentStart: string,
    currentEnd: string,
    previousStart: string,
    previousEnd: string
  ) => {
    const params = new URLSearchParams({
      currentStart,
      currentEnd,
      previousStart,
      previousEnd,
    });
    return api.get(`/analytics/comparison?${params}`);
  },
};

export default api;
