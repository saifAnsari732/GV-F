import axios from 'axios';
import axiosInstance from './axiosapi';

const API_URL = '/api';

// Courses API
export const coursesAPI = {
  getAll: () => axiosInstance.get(`${API_URL}/courses`),
  getById: (id) => axiosInstance.get(`${API_URL}/courses/${id}`),
  create: (data) => axiosInstance.post(`${API_URL}/courses`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => axiosInstance.put(`${API_URL}/courses/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => axiosInstance.delete(`${API_URL}/courses/${id}`)
};

// Jobs API
export const jobsAPI = {
  getAll: () => axios.get(`${API_URL}/jobs`),
  getById: (id) => axios.get(`${API_URL}/jobs/${id}`),
  create: (data) => axios.post(`${API_URL}/jobs`, data),
  update: (id, data) => axios.put(`${API_URL}/jobs/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/jobs/${id}`)
};

// Students API
export const studentsAPI = {
  getAll: () => axios.get(`${API_URL}/students`),
  getById: (id) => axios.get(`${API_URL}/students/${id}`),
  enroll: (id, courseId) => axios.post(`${API_URL}/students/${id}/enroll`, { courseId }),
  update: (id, data) => axios.put(`${API_URL}/students/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/students/${id}`)
};

// Attendance API
export const attendanceAPI = {
  mark: (data) => axios.post(`${API_URL}/attendance`, data),
  bulkMark: (data) => axios.post(`${API_URL}/attendance/bulk`, data),
  getStudentAttendance: (studentId, params) => 
    axios.get(`${API_URL}/attendance/student/${studentId}`, { params }),
  getCourseAttendance: (courseId, params) => 
    axios.get(`${API_URL}/attendance/course/${courseId}`, { params })
};

// Fees API
export const feesAPI = {
  getAll: () => axios.get(`${API_URL}/fees`),
  getStudentFees: (studentId) => axios.get(`${API_URL}/fees/student/${studentId}`),
  getById: (id) => axios.get(`${API_URL}/fees/${id}`),
  addPayment: (id, data) => axios.post(`${API_URL}/fees/${id}/payment`, data),
  getPending: () => axios.get(`${API_URL}/fees/pending`),
  getStatistics: () => axios.get(`${API_URL}/fees/statistics`)
};

// Dashboard API
export const dashboardAPI = {
  getAdminDashboard: () => axios.get(`${API_URL}/dashboard/admin`),
  getStudentDashboard: () => axios.get(`${API_URL}/dashboard/student`)
};


