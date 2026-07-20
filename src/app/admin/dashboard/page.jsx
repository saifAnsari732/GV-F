"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaBookOpen, FaChartBar, FaCheckCircle, FaBriefcase, FaGraduationCap, FaArrowRight, FaExclamationTriangle } from 'react-icons/fa';
import api from '../../../services/api';

const G = 'linear-gradient(135deg,#00D4FF,#7C3AED)';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useRouter();

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/api/dashboard/admin', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) setDashboardData(response.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      setLoading(false);
    }
  };

  const getInitials = (name = '') =>
    name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const BG_MESH = (
    <>
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: 'radial-gradient(ellipse at 10% 15%,rgba(6,182,212,0.05) 0%,transparent 50%),radial-gradient(ellipse at 90% 80%,rgba(124,58,237,0.05) 0%,transparent 50%)'
      }} />
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.015) 1px,transparent 1px)',
        backgroundSize: '64px 64px'
      }} />
    </>
  );

  if (loading) return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-['Space_Grotesk',sans-serif] relative overflow-x-hidden flex items-center justify-center pt-20">
      {BG_MESH}
      <div className="flex flex-col items-center gap-4 relative z-10">
        <div className="w-11 h-11 rounded-full border-[3px] border-cyan-500/20 border-t-cyan-500 animate-spin" />
        <p className="text-gray-500 font-medium">Loading dashboard...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-['Space_Grotesk',sans-serif] relative overflow-x-hidden flex items-center justify-center pt-20">
      {BG_MESH}
      <div className="flex flex-col items-center gap-3.5 text-center relative z-10 px-6">
        <FaExclamationTriangle className="text-red-500 text-4xl mb-1.5 animate-bounce" />
        <h3 className="font-['Syne',sans-serif] text-2xl font-extrabold text-gray-900">Something went wrong</h3>
        <p className="text-gray-500 max-w-md">{error}</p>
        <button onClick={fetchDashboardData}
          className="px-7 py-3 rounded-xl text-white font-bold text-[15px] cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(6,182,212,0.3)] shadow-md"
          style={{ background: G }}>
          Retry
        </button>
      </div>
    </div>
  );

  if (!dashboardData) return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center relative pt-20">
      {BG_MESH}
      <p className="text-gray-500 font-medium relative z-10">No data available</p>
    </div>
  );

  const { overview, courseWiseStudents, recentStudents } = dashboardData;

  const stats = [
    { icon: <FaGraduationCap />, label: 'Total Students', value: overview?.totalStudents, sub: 'Active students',
      iconBg: 'rgba(6,182,212,0.08)', color: '#0891b2' },
    { icon: <FaBookOpen />, label: 'Total Courses',  value: overview?.totalCourses,  sub: 'Active courses',
      iconBg: 'rgba(124,58,237,0.08)', color: '#7c3aed' },
    { icon: <FaBriefcase />, label: 'Active Jobs',    value: overview?.totalJobs,     sub: 'Job postings',
      iconBg: 'rgba(16,185,129,0.08)', color: '#059669' },
  ];

  const actions = [
    { label: 'Courses',    path: '/admin/courses',      bg: 'rgba(6,182,212,0.08)', color: '#0891b2', icon: <FaBookOpen className="text-xl" />, bar: 'linear-gradient(135deg,#00D4FF,#7C3AED)' },
    { label: 'Attendance', path: '/admin/attendance',   bg: 'rgba(124,58,237,0.08)', color: '#7c3aed', icon: <FaChartBar className="text-xl" />, bar: 'linear-gradient(135deg,#7C3AED,#EC4899)' },
    { label: 'Fees Info',  path: '/admin/fees/manage',  bg: 'rgba(16,185,129,0.08)', color: '#059669', icon: <FaCheckCircle className="text-xl" />, bar: 'linear-gradient(135deg,#10B981,#00D4FF)' },
    { label: 'Jobs',       path: '/createjob',          bg: 'rgba(245,158,11,0.08)', color: '#d97706', icon: <FaBriefcase className="text-xl" />, bar: 'linear-gradient(135deg,#F59E0B,#EF4444)' },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 font-['Space_Grotesk',sans-serif] text-gray-900 relative overflow-x-hidden pt-24">
      {BG_MESH}

      <div className="max-w-[1400px] mx-auto px-6 pb-20 relative z-10">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white border border-gray-200/80 shadow-md shadow-gray-100 rounded-3xl px-8 py-7 mb-7 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[4px]" style={{ background: G }} />
          <div>
            <span className="block text-[11px] font-bold tracking-[2.5px] uppercase text-cyan-600 mb-1.5">Admin Portal</span>
            <h1 className="font-['Syne',sans-serif] text-3xl font-extrabold leading-tight text-gray-900 mb-1.5">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-500">Welcome back! Here's what's happening with your institute.</p>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-7">
          {stats.map((s, i) => (
            <div key={i}
              className="bg-white border border-gray-200/70 shadow-sm rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-cyan-500/20 group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                  style={{ background: s.iconBg, color: s.color }}>
                  {s.icon}
                </div>
                <span className="text-[13px] font-bold text-gray-500 uppercase tracking-wide">{s.label}</span>
              </div>
              <div className="font-['Syne',sans-serif] text-3xl font-extrabold text-gray-900 mb-1">{s.value ?? 0}</div>
              <div className="text-xs text-gray-500 font-medium">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Courses + Quick Actions ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-7">

          {/* Top Courses */}
          <div className="bg-white border border-gray-200/70 shadow-sm rounded-2xl p-6 sm:p-7">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <h2 className="font-['Syne',sans-serif] text-lg font-extrabold text-gray-900 m-0">🏆 Top Courses by Students</h2>
            </div>
            <div className="flex flex-col gap-3">
              {courseWiseStudents?.length > 0 ? courseWiseStudents.map(course => (
                <div key={course._id}
                  className="flex justify-between items-center bg-gray-50/60 border border-gray-200/60 rounded-xl px-4 py-3.5 transition-all duration-300 hover:border-cyan-500/20">
                  <div>
                    <h4 className="text-[14px] font-bold text-gray-900 mb-1.5">{course.courseName}</h4>
                    <span className="text-[10px] font-bold text-cyan-700 bg-cyan-50 border border-cyan-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {course.courseCode}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm text-indigo-600 font-extrabold">👥 {course.totalStudents}</span>
                    <span className="text-xs text-gray-500 font-semibold">₹{course.fees?.toLocaleString() || '0'}</span>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10">
                  <p className="text-gray-400 font-medium text-sm">No course data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-gray-200/70 shadow-sm rounded-2xl p-6 sm:p-7">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <h2 className="font-['Syne',sans-serif] text-lg font-extrabold text-gray-900 m-0">⚡ Quick Actions</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {actions.map((a, i) => (
                <button key={i} onClick={() => navigate.push(a.path)}
                  className="group flex flex-col items-center justify-center gap-3 py-6 px-4 rounded-xl border border-gray-200 bg-white cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/20 hover:shadow-lg relative overflow-hidden"
                >
                  {/* top accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: a.bar }} />
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm transition-transform duration-300 group-hover:scale-105"
                    style={{ background: a.bg, color: a.color }}>
                    {a.icon}
                  </div>
                  <span className="font-['Syne',sans-serif] text-sm font-bold text-gray-900">{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Recent Students ── */}
        <div className="bg-white border border-gray-200/70 shadow-sm rounded-2xl p-6 sm:p-7">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
            <h2 className="font-['Syne',sans-serif] text-lg font-extrabold text-gray-900 m-0">🎓 Recent Students</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {recentStudents?.length > 0 ? recentStudents.map(student => (
              <div key={student._id}
                className="flex flex-col items-center px-4 py-5 rounded-xl border border-gray-200 bg-gray-50/60 text-center transition-all duration-300 hover:border-cyan-500/20 hover:bg-white hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-[15px] font-bold text-white mb-3 shadow-md shadow-indigo-500/20"
                  style={{ background: 'linear-gradient(135deg,#667eea,#764ba2)' }}>
                  {getInitials(student.name)}
                </div>
                <h4 className="text-[14px] font-bold text-gray-900 m-0 mb-1 truncate w-full">{student.name}</h4>
                <p className="text-[11px] text-gray-500 m-0 mb-2.5 truncate w-full">{student.email}</p>
                <span className="text-[10px] text-gray-400 font-bold bg-white border border-gray-200 px-2 py-0.5 rounded-full">
                  {new Date(student.createdAt).toLocaleDateString()}
                </span>
              </div>
            )) : (
              <p className="text-gray-400 font-medium text-sm text-center py-10 col-span-full">No recent students</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;