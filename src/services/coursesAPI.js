import api from './coursesAPI';

export const coursesAPI = {
  getAll: () => api.get('/api/courses'),
  getById: (id) => api.get(`/api/courses/${id}`),
  create: (data) => api.post('/api/courses', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => api.put(`/api/courses/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/api/courses/${id}`)
};

export const jobsAPI = {
  getAll: () => api.get('/api/jobs'),
  getById: (id) => api.get(`/api/jobs/${id}`),
  create: (data) => api.post('/api/jobs', data),
  update: (id, data) => api.put(`/api/jobs/${id}`, data),
  delete: (id) => api.delete(`/api/jobs/${id}`)
};

export const studentsAPI = {
  getAll: () => api.get('/api/students'),
  getById: (id) => api.get(`/api/students/${id}`),
  enroll: (id, courseId) => api.post(`/api/students/${id}/enroll`, { courseId }),
  update: (id, data) => api.put(`/api/students/${id}`, data),
  delete: (id) => api.delete(`/api/students/${id}`)
};

export const attendanceAPI = {
  mark: (data) => api.post('/api/attendance', data),
  bulkMark: (data) => api.post('/api/attendance/bulk', data),
  getStudentAttendance: (studentId, params) => api.get(`/api/attendance/student/${studentId}`, { params }),
  getCourseAttendance: (courseId, params) => api.get(`/api/attendance/course/${courseId}`, { params })
};

export const feesAPI = {
  getAll: () => api.get('/api/fees'),
  getStudentFees: (studentId) => api.get(`/api/fees/student/${studentId}`),
  getById: (id) => api.get(`/api/fees/${id}`),
  addPayment: (id, data) => api.post(`/api/fees/${id}/payment`, data),
  getPending: () => api.get('/api/fees/pending'),
  getStatistics: () => api.get('/api/fees/statistics')
};

export const dashboardAPI = {
  getAdminDashboard: () => api.get('/api/dashboard/admin'),
  getStudentDashboard: () => api.get('/api/dashboard/student')
};