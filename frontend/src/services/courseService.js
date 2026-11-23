import api from './api';

export const courseService = {
  getCourses: async (params = {}) => {
    const response = await api.get('/courses', { params });
    return response.data;
  },

  getCourseById: async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data.course;
  },

  createCourse: async (courseData) => {
    const response = await api.post('/courses', courseData);
    return response.data.course;
  },

  updateCourse: async (id, courseData) => {
    const response = await api.patch(`/courses/${id}`, courseData);
    return response.data.course;
  },

  submitCourse: async (id) => {
    const response = await api.patch(`/courses/${id}/submit`);
    return response.data.course;
  },

  deleteCourse: async (id) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  }
};
