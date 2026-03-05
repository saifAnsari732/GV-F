import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaBookOpen, FaChartBar, FaCheckCircle, FaClock,
  FaUser, FaBriefcase, FaRupeeSign, FaArrowRight,
  FaGraduationCap, FaExclamationTriangle
} from 'react-icons/fa';
import '../../styles/StudentDashboard.css';
import api from '../../services/api';

const StudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/api/dashboard/student', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) setDashboardData(response.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      setLoading(false);
    }
  };

  const getInitial = (name) => (!name || typeof name !== 'string') ? '?' : name.charAt(0).toUpperCase();
  const fmt = (v) => (v === undefined || v === null) ? '0' : v.toLocaleString();

  if (loading) return (
    <div className="sd-page">
      <div className="sd-center-state">
        <div className="sd-spinner" />
        <p>Loading dashboard...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="sd-page">
      <div className="sd-center-state">
        <FaExclamationTriangle className="sd-state-icon sd-err-icon" />
        <h3>Something went wrong</h3>
        <p>{error}</p>
        <button onClick={fetchDashboardData} className="sd-retry-btn">Retry</button>
      </div>
    </div>
  );

  if (!dashboardData) return (
    <div className="sd-page">
      <div className="sd-center-state">
        <p>No data available</p>
      </div>
    </div>
  );

  const { student, coursesCount, fees, attendance } = dashboardData;
  const feePercent = fees?.total > 0 ? Math.round(((fees?.paid || 0) / fees.total) * 100) : 0;

  const stats = [
    { icon: <FaBookOpen />, label: 'Enrolled Courses', value: coursesCount || 0, sub: 'Active courses', palette: { bg: 'rgba(0,212,255,0.1)', color: '#00D4FF' } },
    { icon: <FaChartBar />, label: 'Attendance', value: `${attendance?.percentage || 0}%`, sub: `${attendance?.present || 0} of ${attendance?.total || 0} classes`, palette: { bg: 'rgba(16,185,129,0.1)', color: '#10B981' } },
    { icon: <FaCheckCircle />, label: 'Fees Paid', value: `₹${fmt(fees?.paid)}`, sub: `of ₹${fmt(fees?.total)}`, palette: { bg: 'rgba(124,58,237,0.1)', color: '#A78BFA' } },
    { icon: <FaClock />, label: 'Fees Pending', value: `₹${fmt(fees?.pending)}`, sub: 'Remaining balance', palette: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' } },
  ];

  const quickActions = [
    { to: '/profile', icon: <FaUser />, label: 'Update Profile', sub: 'Manage personal info', palette: { bg: 'rgba(0,212,255,0.08)', color: '#00D4FF', bar: 'linear-gradient(135deg,#00D4FF,#7C3AED)' } },
    { to: '/courses', icon: <FaGraduationCap />, label: 'Browse Courses', sub: 'Explore available courses', palette: { bg: 'rgba(16,185,129,0.08)', color: '#10B981', bar: 'linear-gradient(135deg,#10B981,#00D4FF)' } },
    { to: '/jobs', icon: <FaBriefcase />, label: 'Find Jobs', sub: 'View job opportunities', palette: { bg: 'rgba(124,58,237,0.08)', color: '#A78BFA', bar: 'linear-gradient(135deg,#7C3AED,#EC4899)' } },
    { to: '/student/fees', icon: <FaRupeeSign />, label: 'Fee Details', sub: 'Payment history & info', palette: { bg: 'rgba(245,158,11,0.08)', color: '#F59E0B', bar: 'linear-gradient(135deg,#F59E0B,#EF4444)' } },
  ];

  return (
    <div className="sd-page">
      <div className="sd-bg-mesh" />

      <div className="sd-container">
        {/* ── HEADER ── */}
        <div className="sd-header">
          <div className="sd-welcome">
            <span className="sd-eyebrow">Student Dashboard</span>
            <h1 className="sd-welcome-title">
              Welcome back, <span className="sd-name-accent">{student?.name || 'Student'}</span> 👋
            </h1>
            <p className="sd-welcome-sub">Here's an overview of your learning journey</p>
          </div>
          <div className="sd-profile-card">
            <div className="sd-avatar">{getInitial(student?.name)}</div>
            <div className="sd-profile-info">
              <div className="sd-profile-name">{student?.name || 'Student'}</div>
              <div className="sd-profile-email">{student?.email || 'Email not available'}</div>
              <span className="sd-profile-badge">Student</span>
            </div>
          </div>
        </div>

        {/* ── STATS ── */}
        <div className="sd-stats-grid">
          {stats.map((s, i) => (
            <div key={i} className="sd-stat-card" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="sd-stat-top">
                <div className="sd-stat-icon-box" style={{ background: s.palette.bg, color: s.palette.color }}>
                  {s.icon}
                </div>
                <span className="sd-stat-label">{s.label}</span>
              </div>
              <div className="sd-stat-value">{s.value}</div>
              <div className="sd-stat-sub">{s.sub}</div>
              <div className="sd-stat-glow" style={{ background: s.palette.color }} />
            </div>
          ))}
        </div>

        {/* ── TWO COLUMN ── */}
        <div className="sd-two-col">
          {/* My Courses */}
          <div className="sd-section">
            <div className="sd-section-head">
              <h2>My Courses</h2>
              <Link to="/courses" className="sd-view-all">View All <FaArrowRight /></Link>
            </div>
            <div className="sd-courses-list">
              {student?.enrolledCourses?.length > 0 ? (
                student.enrolledCourses.map((en, i) => (
                  <div key={en?._id || i} className="sd-course-row" style={{ animationDelay: `${i * 0.07}s` }}>
                    <div className="sd-course-thumb">
                      <img
                        src={en?.course?.courseImage}
                        alt={en?.course?.courseName || 'Course'}
                      />
                    </div>
                    <div className="sd-course-info">
                      <div className="sd-course-name">{en?.course?.courseName || 'Course Name'}</div>
                      <div className="sd-course-code">{en?.course?.courseCode || ''}</div>
                      <span className={`sd-badge sd-badge-${en?.status || 'active'}`}>
                        {en?.status || 'active'}
                      </span>
                    </div>
                    <Link to={`/courses/${en?.course?._id || '#'}`} className="sd-row-btn">
                      View <FaArrowRight />
                    </Link>
                  </div>
                ))
              ) : (
                <div className="sd-empty">
                  <FaGraduationCap className="sd-empty-icon" />
                  <p>Not enrolled in any courses yet</p>
                  <Link to="/courses" className="sd-cta-link">Browse Courses</Link>
                </div>
              )}
            </div>
          </div>

          {/* Fee Summary */}
          <div className="sd-section">
            <div className="sd-section-head"><h2>Fee Summary</h2></div>

            <div className="sd-fee-progress-card">
              <div className="sd-fee-prog-header">
                <span>Payment Progress</span>
                <span className="sd-fee-pct">{feePercent}% paid</span>
              </div>
              <div className="sd-prog-track">
                <div className="sd-prog-fill" style={{ width: `${feePercent}%` }} />
              </div>
              <div className="sd-fee-totals">
                <div>
                  <div className="sd-fee-num" style={{ color: '#10B981' }}>₹{fmt(fees?.paid)}</div>
                  <div className="sd-fee-lbl">Paid</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="sd-fee-num" style={{ color: '#F59E0B' }}>₹{fmt(fees?.pending)}</div>
                  <div className="sd-fee-lbl">Pending</div>
                </div>
              </div>
            </div>

            <div className="sd-fee-records">
              {fees?.records?.length > 0 ? fees.records.slice(0, 3).map((rec, i) => (
                <div key={rec?._id || i} className="sd-fee-row">
                  <div>
                    <div className="sd-fee-course-name">{rec?.course?.courseName || 'Course'}</div>
                    <div className="sd-fee-course-code">{rec?.course?.courseCode || ''}</div>
                  </div>
                  <div className="sd-fee-right">
                    <div className="sd-fee-amount">₹{fmt(rec?.totalFees)}</div>
                    <span className={`sd-badge sd-badge-fee-${rec?.status || 'pending'}`}>{rec?.status || 'pending'}</span>
                  </div>
                </div>
              )) : (
                <div className="sd-empty"><p>No fee records available</p></div>
              )}
            </div>
          </div>
        </div>

        {/* ── ATTENDANCE ── */}
        <div className="sd-section sd-section-full">
          <div className="sd-section-head"><h2>Recent Attendance</h2></div>
          {attendance?.recentRecords?.length > 0 ? (
            <div className="sd-att-table">
              <div className="sd-att-thead">
                <span>Date</span><span>Course</span><span>Status</span>
              </div>
              {attendance.recentRecords.map((rec, i) => (
                <div key={rec?._id || i} className="sd-att-row" style={{ animationDelay: `${i * 0.05}s` }}>
                  <span className="sd-att-date">
                    {rec?.date ? new Date(rec.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                  </span>
                  <span className="sd-att-course">{rec?.course?.courseName || 'Course'}</span>
                  <span className={`sd-badge sd-badge-att-${rec?.status || 'absent'}`}>
                    {rec?.status === 'present' && '✓ Present'}
                    {rec?.status === 'absent' && '✗ Absent'}
                    {rec?.status === 'late' && '⚠ Late'}
                    {!rec?.status && '— No status'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="sd-empty"><p>No attendance records available</p></div>
          )}
        </div>

        {/* ── QUICK ACTIONS ── */}
        <div className="sd-quick-section">
          <span className="sd-eyebrow" style={{ marginBottom: 8, display: 'block' }}>Shortcuts</span>
          <h2 className="sd-section-title">Quick Actions</h2>
          <div className="sd-actions-grid">
            {quickActions.map((a, i) => (
              <Link key={i} to={a.to} className="sd-action-card" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="sd-action-bar" style={{ background: a.palette.bar }} />
                <div className="sd-action-icon" style={{ background: a.palette.bg, color: a.palette.color }}>{a.icon}</div>
                <div className="sd-action-label">{a.label}</div>
                <div className="sd-action-sub">{a.sub}</div>
                <div className="sd-action-arrow" style={{ color: a.palette.color }}><FaArrowRight /></div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;