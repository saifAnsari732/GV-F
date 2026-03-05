import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center font-['Inter',sans-serif]"
      style={{ background: 'linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%)' }}>
      <p className="text-white/50 text-lg">⏳ Loading dashboard...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center font-['Inter',sans-serif]"
      style={{ background: 'linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%)' }}>
      <p className="text-[#f87171] text-lg">⚠️ {error}</p>
    </div>
  );

  if (!dashboardData) return (
    <div className="min-h-screen flex items-center justify-center font-['Inter',sans-serif]"
      style={{ background: 'linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%)' }}>
      <p className="text-white/50 text-lg">No data available</p>
    </div>
  );

  const { overview, courseWiseStudents, recentStudents } = dashboardData;

  const getInitials = (name = '') =>
    name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const stats = [
    { icon: '👨‍🎓', label: 'Total Students', value: overview?.totalStudents, sub: 'Active students',
      iconBg: 'linear-gradient(135deg,#667eea,#764ba2)', iconShadow: '0 8px 20px rgba(102,126,234,.4)' },
    { icon: '📚', label: 'Total Courses',  value: overview?.totalCourses,  sub: 'Active courses',
      iconBg: 'linear-gradient(135deg,#f093fb,#f5576c)', iconShadow: '0 8px 20px rgba(245,87,108,.4)' },
    { icon: '💼', label: 'Active Jobs',    value: overview?.totalJobs,     sub: 'Job postings',
      iconBg: 'linear-gradient(135deg,#4facfe,#00f2fe)', iconShadow: '0 8px 20px rgba(79,172,254,.4)' },
  ];

  const actions = [
    { label: 'Courses',    path: '/admin/courses',      hoverBg: 'linear-gradient(135deg,rgba(59,130,246,.45),rgba(99,102,241,.45))',    baseBg: 'rgba(59,130,246,.18)',
      svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /> },
    { label: 'Attendance', path: '/admin/attendance',   hoverBg: 'linear-gradient(135deg,rgba(139,92,246,.45),rgba(168,85,247,.45))',   baseBg: 'rgba(139,92,246,.18)',
      svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /> },
    { label: 'Fees Info',  path: '/admin/fees/manage',  hoverBg: 'linear-gradient(135deg,rgba(16,185,129,.45),rgba(52,211,153,.45))',   baseBg: 'rgba(16,185,129,.18)',
      svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> },
    { label: 'Jobs',       path: '/createjob',          hoverBg: 'linear-gradient(135deg,rgba(245,158,11,.45),rgba(251,191,36,.45))',   baseBg: 'rgba(245,158,11,.18)',
      svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /> },
  ];

  return (
    <div className="min-h-screen px-12 py-8 max-md:px-4 font-['Inter',sans-serif]"
      style={{ background: 'linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%)' }}>

      {/* ── Header ── */}
      <div className="mb-9">
        <h1 className="text-[2.4rem] font-extrabold m-0 mb-2 leading-tight"
          style={{ background: 'linear-gradient(90deg,#a78bfa,#60a5fa,#34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          Admin Dashboard
        </h1>
        <p className="text-base text-white/45 m-0">Welcome back! Here's what's happening with your institute.</p>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5 mb-8">
        {stats.map((s, i) => (
          <div key={i}
            className="flex items-center gap-[18px] p-6 rounded-[20px] border border-white/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] hover:border-white/20"
            style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="w-[58px] h-[58px] rounded-2xl flex items-center justify-center text-[1.7rem] shrink-0"
              style={{ background: s.iconBg, boxShadow: s.iconShadow }}>
              {s.icon}
            </div>
            <div>
              <h3 className="text-[.75rem] text-white/45 m-0 mb-1.5 font-semibold uppercase tracking-[1px]">{s.label}</h3>
              <p className="text-[2rem] text-white font-extrabold m-0 mb-1 leading-none">{s.value ?? 0}</p>
              <span className="text-[.78rem] text-white/30">{s.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Courses + Quick Actions ── */}
      <div className="grid grid-cols-2 max-[900px]:grid-cols-1 gap-6 mb-7">

        {/* Top Courses */}
        <div className="p-7 rounded-[20px] border border-white/10 backdrop-blur-xl" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <h2 className="text-[1.1rem] text-white font-bold m-0 mb-5 pb-3.5 border-b border-white/10">🏆 Top Courses by Students</h2>
          <div className="flex flex-col gap-2.5">
            {courseWiseStudents?.length > 0 ? courseWiseStudents.map(course => (
              <div key={course._id}
                className="flex justify-between items-center px-[18px] py-3.5 rounded-xl border border-white/[0.07] transition-all duration-200 hover:bg-white/[0.09]"
                style={{ background: 'rgba(255,255,255,0.04)' }}>
                <div>
                  <h4 className="text-[.95rem] text-white m-0 mb-1.5 font-semibold">{course.courseName}</h4>
                  <span className="text-[.72rem] text-[#60a5fa] bg-[rgba(96,165,250,.15)] px-2.5 py-0.5 rounded-full border border-[rgba(96,165,250,.3)]">
                    {course.courseCode}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[.88rem] text-[#a78bfa] font-bold">👥 {course.totalStudents}</span>
                  <span className="text-[.82rem] text-[#34d399] font-semibold">₹{course.fees?.toLocaleString() || '0'}</span>
                </div>
              </div>
            )) : (
              <p className="text-white/30 text-[.88rem] text-center py-5">No course data available</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-7 rounded-[20px] border border-white/10 backdrop-blur-xl" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <h2 className="text-[1.1rem] text-white font-bold m-0 mb-5 pb-3.5 border-b border-white/10">⚡ Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3.5">
            {actions.map((a, i) => (
              <button key={i} onClick={() => navigate(a.path)}
                className="group flex flex-col items-center justify-center gap-2.5 py-[22px] px-3.5 rounded-2xl border border-white/[0.08] cursor-pointer font-['Inter',sans-serif] font-semibold text-[.82rem] text-white transition-all duration-250 hover:-translate-y-[3px] hover:shadow-[0_12px_30px_rgba(0,0,0,0.4)] relative overflow-hidden"
                style={{ background: a.baseBg }}>
                {/* hover overlay */}
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-250 rounded-2xl"
                  style={{ background: a.hoverBg }} />
                <svg className="w-[26px] h-[26px] shrink-0 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {a.svg}
                </svg>
                <span className="relative z-10">{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent Students ── */}
      <div className="p-7 rounded-[20px] border border-white/10 backdrop-blur-xl" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <h2 className="text-[1.1rem] text-white font-bold m-0 mb-5 pb-3.5 border-b border-white/10">🎓 Recent Students</h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-4">
          {recentStudents?.length > 0 ? recentStudents.map(student => (
            <div key={student._id}
              className="flex flex-col items-center px-3.5 py-[22px] rounded-2xl border border-white/[0.08] text-center transition-all duration-300 hover:-translate-y-1.5 hover:bg-white/[0.09] hover:shadow-[0_12px_30px_rgba(0,0,0,0.3)]"
              style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-[1.3rem] font-bold text-white mb-3 border-2 border-[rgba(167,139,250,.4)]"
                style={{ background: 'linear-gradient(135deg,#667eea,#764ba2)' }}>
                {getInitials(student.name)}
              </div>
              <h4 className="text-[.88rem] text-white m-0 mb-1 font-semibold">{student.name}</h4>
              <p className="text-[.72rem] text-white/40 m-0 mb-2 break-all">{student.email}</p>
              <span className="text-[.7rem] text-white/30 bg-white/[0.06] px-2.5 py-0.5 rounded-full">
                {new Date(student.createdAt).toLocaleDateString()}
              </span>
            </div>
          )) : (
            <p className="text-white/30 text-[.88rem] text-center py-5 col-span-full">No recent students</p>
          )}
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;