import api from './api';

export const teacherService = {
  getDashboard: async () => {
    const response = await api.get('/teacher/dashboard');
    return response.data;
  },

  getCourses: async (params = {}) => {
    const response = await api.get('/teacher/courses', { params });
    return response.data.courses;
  }
};
