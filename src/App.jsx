import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import Home from './pages/Home'
import Navbar from './components/Navbar';
import { CreateCertificate, CertificateList, VerifyCertificate, CertificateDetail } from './pages/Admin/Certificate';

// Lazy load pages
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Courses = lazy(() => import('./pages/Courses'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const Jobs = lazy(() => import('./pages/Jobs'));
const JobDetail = lazy(() => import('./pages/JobDetail'));
const Profile = lazy(() => import('./pages/Profile'));
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));
const StudentDashboard = lazy(() => import('./pages/Student/StudentDashboard'));
const CourseManagement = lazy(() => import('./pages/Admin/CourseManagemen'));
const AttendanceManagement = lazy(() => import('./pages/Admin/AttendanceManagement'))
const AdminJobs = lazy(() => import('./pages/Admin/Jobcreate'))
const JobApplication = lazy(() => import('./pages/Admin/Applications'))
const FeeInformation = lazy(() => import('./pages/Student/FeeInformation'));
const AdminFeeManagement = lazy(() => import('./pages/Admin/AdminFeeManagement'));

// Loading component
const LoadingSpinner = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <div className="spinner"></div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Router>
      <Navbar />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/admin/courses" element={<CourseManagement />} />
          <Route path="/admin/attendance" element={<AttendanceManagement />} />
          <Route path="/createjob" element={<AdminJobs />} />
          <Route path="/jobapplication" element={<JobApplication />} />
          <Route path="/admin/fees/manage" element={<AdminFeeManagement />} />
          <Route path="/admin/certificates/create" element={<CreateCertificate />} />
          <Route path="/admin/certificates" element={<CertificateList />} />
          <Route path="/verify-certificate" element={<VerifyCertificate />} />
          <Route path="/certificates/:id" element={<CertificateDetail />} />




          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/fees"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminFeeManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/fees"
            element={
              <ProtectedRoute>
                <FeeInformation />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
