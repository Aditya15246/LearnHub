import api from './api';

export const adminService = {
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  updateUserStatus: async (userId, status) => {
    const response = await api.patch(`/admin/users/${userId}/status`, { status });
    return response.data;
  },

  getPendingCourses: async () => {
    const response = await api.get('/admin/courses/pending');
    return response.data.courses;
  },

  approveCourse: async (courseId) => {
    const response = await api.patch(`/admin/courses/${courseId}/approve`);
    return response.data.course;
  },

  rejectCourse: async (courseId, reason) => {
    const response = await api.patch(`/admin/courses/${courseId}/reject`, { reason });
    return response.data.course;
  },

  unpublishCourse: async (courseId) => {
    const response = await api.patch(`/admin/courses/${courseId}/unpublish`);
    return response.data.course;
  }
};
