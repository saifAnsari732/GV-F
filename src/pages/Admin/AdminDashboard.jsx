import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/dashboard/admin', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) setDashboardData(response.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">⏳ Loading dashboard...</div>;
  if (error)   return <div className="error">⚠️ {error}</div>;
  if (!dashboardData) return <div className="error">No data available</div>;

  const { overview, courseWiseStudents, recentStudents } = dashboardData;

  const getInitials = (name = '') =>
    name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back! Here's what's happening with your institute.</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {[
          { icon: '👨‍🎓', cls: 'students', label: 'Total Students', value: overview?.totalStudents, sub: 'Active students' },
          { icon: '📚', cls: 'courses',  label: 'Total Courses',  value: overview?.totalCourses,  sub: 'Active courses' },
          { icon: '💼', cls: 'jobs',     label: 'Active Jobs',    value: overview?.totalJobs,     sub: 'Job postings' },
        ].map(s => (
          <div className="stat-card" key={s.cls}>
            <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
            <div className="stat-content">
              <h3>{s.label}</h3>
              <p className="stat-number">{s.value ?? 0}</p>
              <span className="stat-label">{s.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Courses + Quick Actions */}
      <div className="dashboard-grid">
        {/* Top Courses */}
        <div className="section-card">
          <h2>🏆 Top Courses by Students</h2>
          <div className="courses-table">
            {courseWiseStudents?.length > 0 ? courseWiseStudents.map(course => (
              <div key={course._id} className="course-row">
                <div className="course-info-col">
                  <h4>{course.courseName}</h4>
                  <span className="course-code">{course.courseCode}</span>
                </div>
                <div className="course-stats-col">
                  <span className="student-count">👥 {course.totalStudents}</span>
                  <span className="course-fee">₹{course.fees?.toLocaleString() || '0'}</span>
                </div>
              </div>
            )) : <div className="no-data"><p>No course data available</p></div>}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-card">
          <h2>⚡ Quick Actions</h2>
          <div className="actions-grid">
            <button className="action-btn blue" onClick={() => navigate('/admin/courses')}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>Courses</span>
            </button>

            <button className="action-btn purple" onClick={() => navigate('/admin/attendance')}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <span>Attendance</span>
            </button>

            <button className="action-btn green" onClick={() => navigate('/admin/fees/manage')}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Fees Info</span>
            </button>

            <button className="action-btn amber" onClick={() => navigate('/createjob')}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Jobs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Students */}
      <div className="section-card">
        <h2>🎓 Recent Students</h2>
        <div className="students-grid">
          {recentStudents?.length > 0 ? recentStudents.map(student => (
            <div key={student._id} className="student-card">
              <div className="student-avatar">{getInitials(student.name)}</div>
              <div className="student-info">
                <h4>{student.name}</h4>
                <p>{student.email}</p>
                <span className="join-date">
                  {new Date(student.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          )) : <div className="no-data"><p>No recent students</p></div>}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;