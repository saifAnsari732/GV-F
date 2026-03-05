import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaBookOpen, FaChartBar, FaCheckCircle, FaClock,
  FaUser, FaBriefcase, FaRupeeSign, FaArrowRight,
  FaGraduationCap, FaExclamationTriangle
} from 'react-icons/fa';
import api from '../../services/api';

const G = 'linear-gradient(135deg,#00D4FF,#7C3AED)';

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

  const BG_MESH = (
    <>
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: 'radial-gradient(ellipse at 10% 15%,rgba(0,212,255,0.07) 0%,transparent 50%),radial-gradient(ellipse at 90% 80%,rgba(124,58,237,0.07) 0%,transparent 50%)'
      }} />
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        backgroundImage: 'linear-gradient(rgba(0,212,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.02) 1px,transparent 1px)',
        backgroundSize: '64px 64px'
      }} />
    </>
  );

  /* ── Loading ── */
  if (loading) return (
    <div className="min-h-screen bg-[#080C14] text-[#F0F6FF] font-['Space_Grotesk',sans-serif] relative overflow-x-hidden flex items-center justify-center">
      {BG_MESH}
      <div className="flex flex-col items-center gap-4 relative z-10">
        <div className="w-11 h-11 rounded-full border-[3px] border-[rgba(0,212,255,0.1)] border-t-[#00D4FF] animate-spin" />
        <p className="text-[#8B9AB5]">Loading dashboard...</p>
      </div>
    </div>
  );

  /* ── Error ── */
  if (error) return (
    <div className="min-h-screen bg-[#080C14] text-[#F0F6FF] font-['Space_Grotesk',sans-serif] relative overflow-x-hidden flex items-center justify-center">
      {BG_MESH}
      <div className="flex flex-col items-center gap-3.5 text-center relative z-10">
        <FaExclamationTriangle className="text-[#F87171] text-4xl mb-1.5" />
        <h3 className="font-['Syne',sans-serif] text-2xl font-extrabold">Something went wrong</h3>
        <p className="text-[#8B9AB5]">{error}</p>
        <button onClick={fetchDashboardData}
          className="px-7 py-3 rounded-xl text-white font-semibold text-[15px] border-none cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,212,255,0.3)]"
          style={{ background: G }}>
          Retry
        </button>
      </div>
    </div>
  );

  /* ── No data ── */
  if (!dashboardData) return (
    <div className="min-h-screen bg-[#080C14] text-[#F0F6FF] flex items-center justify-center relative">
      {BG_MESH}
      <p className="text-[#8B9AB5] relative z-10">No data available</p>
    </div>
  );

  const { student, coursesCount, fees, attendance } = dashboardData;
  const feePercent = fees?.total > 0 ? Math.round(((fees?.paid || 0) / fees.total) * 100) : 0;

  const stats = [
    { icon: <FaBookOpen />, label: 'Enrolled Courses', value: coursesCount || 0, sub: 'Active courses', bg: 'rgba(0,212,255,0.1)', color: '#00D4FF' },
    { icon: <FaChartBar />, label: 'Attendance', value: `${attendance?.percentage || 0}%`, sub: `${attendance?.present || 0} of ${attendance?.total || 0} classes`, bg: 'rgba(16,185,129,0.1)', color: '#10B981' },
    { icon: <FaCheckCircle />, label: 'Fees Paid', value: `₹${fmt(fees?.paid)}`, sub: `of ₹${fmt(fees?.total)}`, bg: 'rgba(124,58,237,0.1)', color: '#A78BFA' },
    { icon: <FaClock />, label: 'Fees Pending', value: `₹${fmt(fees?.pending)}`, sub: 'Remaining balance', bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' },
  ];

  const quickActions = [
    { to: '/profile', icon: <FaUser />, label: 'Update Profile', sub: 'Manage personal info', bg: 'rgba(0,212,255,0.08)', color: '#00D4FF', bar: 'linear-gradient(135deg,#00D4FF,#7C3AED)' },
    { to: '/courses', icon: <FaGraduationCap />, label: 'Browse Courses', sub: 'Explore available courses', bg: 'rgba(16,185,129,0.08)', color: '#10B981', bar: 'linear-gradient(135deg,#10B981,#00D4FF)' },
    { to: '/jobs', icon: <FaBriefcase />, label: 'Find Jobs', sub: 'View job opportunities', bg: 'rgba(124,58,237,0.08)', color: '#A78BFA', bar: 'linear-gradient(135deg,#7C3AED,#EC4899)' },
    { to: '/student/fees', icon: <FaRupeeSign />, label: 'Fee Details', sub: 'Payment history & info', bg: 'rgba(245,158,11,0.08)', color: '#F59E0B', bar: 'linear-gradient(135deg,#F59E0B,#EF4444)' },
  ];

  const badgeClass = {
    active:   'bg-[rgba(16,185,129,0.12)] text-[#10B981] border border-[rgba(16,185,129,0.2)]',
    completed:'bg-[rgba(0,212,255,0.1)] text-[#00D4FF] border border-[rgba(0,212,255,0.2)]',
    paid:     'bg-[rgba(16,185,129,0.12)] text-[#10B981] border border-[rgba(16,185,129,0.2)]',
    partial:  'bg-[rgba(245,158,11,0.12)] text-[#F59E0B] border border-[rgba(245,158,11,0.2)]',
    pending:  'bg-[rgba(239,68,68,0.12)] text-[#F87171] border border-[rgba(239,68,68,0.2)]',
    present:  'bg-[rgba(16,185,129,0.12)] text-[#10B981] border border-[rgba(16,185,129,0.2)]',
    absent:   'bg-[rgba(239,68,68,0.12)] text-[#F87171] border border-[rgba(239,68,68,0.2)]',
    late:     'bg-[rgba(245,158,11,0.12)] text-[#F59E0B] border border-[rgba(245,158,11,0.2)]',
  };

  return (
    <div className="min-h-screen bg-[#080C14] font-['Space_Grotesk',sans-serif] text-[#F0F6FF] relative overflow-x-hidden">
      {BG_MESH}

      <div className="max-w-[1400px] mx-auto px-6 pt-10 pb-20 relative z-10">

        {/* ── HEADER ── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#111827] border border-white/[0.07] rounded-3xl px-10 py-9 mb-7 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: G }} />
          <div>
            <span className="block text-[11px] font-bold tracking-[2.5px] uppercase text-[#00D4FF] mb-2.5">Student Dashboard</span>
            <h1 className="font-['Syne',sans-serif] text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold leading-[1.15] text-[#F0F6FF] mb-2">
              Welcome back,{' '}
              <span style={{ background: G, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {student?.name || 'Student'}
              </span>{' '}👋
            </h1>
            <p className="text-[0.97rem] text-[#8B9AB5]">Here's an overview of your learning journey</p>
          </div>

          <div className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.07] rounded-2xl px-5 py-[18px] shrink-0">
            <div className="w-[54px] h-[54px] rounded-2xl flex items-center justify-center font-['Syne',sans-serif] text-[1.4rem] font-extrabold text-white shrink-0"
              style={{ background: G }}>
              {getInitial(student?.name)}
            </div>
            <div>
              <div className="font-['Syne',sans-serif] text-base font-bold text-[#F0F6FF] mb-0.5">{student?.name || 'Student'}</div>
              <div className="text-[0.82rem] text-[#4B5563] mb-1.5">{student?.email || 'Email not available'}</div>
              <span className="inline-block bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.2)] text-[#00D4FF] px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-[0.5px]">
                Student
              </span>
            </div>
          </div>
        </div>

        {/* ── STATS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[18px] mb-7">
          {stats.map((s, i) => (
            <div key={i}
              className="bg-[#111827] border border-white/[0.07] rounded-[20px] px-[22px] py-[26px] relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-[rgba(0,212,255,0.18)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.25)] group"
              style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-[10px] flex items-center justify-center text-base shrink-0"
                  style={{ background: s.bg, color: s.color }}>
                  {s.icon}
                </div>
                <span className="text-xs font-semibold tracking-[0.5px] text-[#8B9AB5]">{s.label}</span>
              </div>
              <div className="font-['Syne',sans-serif] text-[1.9rem] font-extrabold text-[#F0F6FF] leading-none mb-1.5">{s.value}</div>
              <div className="text-xs text-[#4B5563]">{s.sub}</div>
              {/* glow */}
              <div className="absolute -bottom-5 -right-5 w-20 h-20 rounded-full opacity-[0.08] blur-[20px] transition-opacity duration-300 group-hover:opacity-[0.16]"
                style={{ background: s.color }} />
            </div>
          ))}
        </div>

        {/* ── TWO COL ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">

          {/* My Courses */}
          <div className="bg-[#111827] border border-white/[0.07] rounded-[20px] p-7">
            <div className="flex justify-between items-center mb-[22px] pb-4 border-b border-white/[0.07]">
              <h2 className="font-['Syne',sans-serif] text-[1.2rem] font-extrabold text-[#F0F6FF] m-0">My Courses</h2>
              <Link to="/courses" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#00D4FF] no-underline transition-all duration-300 hover:gap-2.5">
                View All <FaArrowRight />
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              {student?.enrolledCourses?.length > 0 ? (
                student.enrolledCourses.map((en, i) => (
                  <div key={en?._id || i}
                    className="flex items-center gap-3.5 bg-white/[0.02] border border-white/[0.07] rounded-2xl p-3.5 transition-all duration-300 hover:border-[rgba(0,212,255,0.2)] hover:bg-[rgba(0,212,255,0.03)] hover:translate-x-1">
                    <div className="w-[52px] h-[52px] rounded-[10px] overflow-hidden shrink-0">
                      <img src={en?.course?.courseImage} alt={en?.course?.courseName || 'Course'} className="w-full h-full object-cover block" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[0.95rem] text-[#F0F6FF] mb-0.5 truncate">{en?.course?.courseName || 'Course Name'}</div>
                      <div className="text-[0.8rem] text-[#4B5563] mb-1.5">{en?.course?.courseCode || ''}</div>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize tracking-[0.3px] ${badgeClass[en?.status] || badgeClass.active}`}>
                        {en?.status || 'active'}
                      </span>
                    </div>
                    <Link to={`/courses/${en?.course?._id || '#'}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[rgba(0,212,255,0.08)] border border-[rgba(0,212,255,0.2)] text-[#00D4FF] no-underline rounded-[10px] text-xs font-semibold whitespace-nowrap shrink-0 transition-all duration-300 hover:bg-[rgba(0,212,255,0.15)] hover:translate-x-0.5">
                      View <FaArrowRight />
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 px-5">
                  <FaGraduationCap className="text-[#4B5563] text-4xl mb-3.5 mx-auto block" />
                  <p className="text-[#8B9AB5] mb-4 text-[0.95rem]">Not enrolled in any courses yet</p>
                  <Link to="/courses"
                    className="inline-flex items-center gap-2 px-[22px] py-2.5 text-white no-underline rounded-xl font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,212,255,0.3)]"
                    style={{ background: G }}>
                    Browse Courses
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Fee Summary */}
          <div className="bg-[#111827] border border-white/[0.07] rounded-[20px] p-7">
            <div className="flex justify-between items-center mb-[22px] pb-4 border-b border-white/[0.07]">
              <h2 className="font-['Syne',sans-serif] text-[1.2rem] font-extrabold text-[#F0F6FF] m-0">Fee Summary</h2>
            </div>

            {/* Progress card */}
            <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-5 mb-4">
              <div className="flex justify-between items-center mb-3 text-[13px] text-[#8B9AB5] font-semibold">
                <span>Payment Progress</span>
                <span className="text-[#00D4FF] font-bold">{feePercent}% paid</span>
              </div>
              <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden mb-4">
                <div className="h-full rounded-full transition-all duration-[800ms]"
                  style={{ width: `${feePercent}%`, background: 'linear-gradient(90deg,#00D4FF,#7C3AED)' }} />
              </div>
              <div className="flex justify-between">
                <div>
                  <div className="font-['Syne',sans-serif] text-[1.2rem] font-extrabold mb-0.5" style={{ color: '#10B981' }}>₹{fmt(fees?.paid)}</div>
                  <div className="text-[11px] font-semibold tracking-[1px] uppercase text-[#4B5563]">Paid</div>
                </div>
                <div className="text-right">
                  <div className="font-['Syne',sans-serif] text-[1.2rem] font-extrabold mb-0.5" style={{ color: '#F59E0B' }}>₹{fmt(fees?.pending)}</div>
                  <div className="text-[11px] font-semibold tracking-[1px] uppercase text-[#4B5563]">Pending</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              {fees?.records?.length > 0 ? fees.records.slice(0, 3).map((rec, i) => (
                <div key={rec?._id || i}
                  className="flex justify-between items-center bg-white/[0.02] border border-white/[0.07] rounded-xl px-4 py-3.5 transition-all duration-300 hover:border-[rgba(0,212,255,0.15)]">
                  <div>
                    <div className="text-[0.92rem] font-semibold text-[#F0F6FF] mb-0.5">{rec?.course?.courseName || 'Course'}</div>
                    <div className="text-[0.8rem] text-[#4B5563]">{rec?.course?.courseCode || ''}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <div className="font-['Syne',sans-serif] text-base font-extrabold text-[#F0F6FF]">₹{fmt(rec?.totalFees)}</div>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${badgeClass[rec?.status] || badgeClass.pending}`}>
                      {rec?.status || 'pending'}
                    </span>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8"><p className="text-[#8B9AB5]">No fee records available</p></div>
              )}
            </div>
          </div>
        </div>

        {/* ── ATTENDANCE ── */}
        <div className="bg-[#111827] border border-white/[0.07] rounded-[20px] p-7 mb-5">
          <div className="flex justify-between items-center mb-[22px] pb-4 border-b border-white/[0.07]">
            <h2 className="font-['Syne',sans-serif] text-[1.2rem] font-extrabold text-[#F0F6FF] m-0">Recent Attendance</h2>
          </div>
          {attendance?.recentRecords?.length > 0 ? (
            <div className="flex flex-col">
              {/* thead */}
              <div className="hidden sm:grid sm:grid-cols-[160px_1fr_140px] gap-3 px-4 py-2.5 text-[11px] font-bold tracking-[1.5px] uppercase text-[#4B5563] mb-2">
                <span>Date</span><span>Course</span><span>Status</span>
              </div>
              {attendance.recentRecords.map((rec, i) => (
                <div key={rec?._id || i}
                  className="grid grid-cols-[130px_1fr_120px] max-sm:grid-cols-2 max-sm:grid-rows-2 gap-3 items-center px-4 py-3.5 bg-white/[0.02] border border-white/[0.07] rounded-xl mb-2 transition-all duration-300 hover:border-[rgba(0,212,255,0.15)] hover:bg-[rgba(0,212,255,0.02)]"
                  style={{ animationDelay: `${i * 0.05}s` }}>
                  <span className="text-[0.85rem] text-[#8B9AB5] font-medium">
                    {rec?.date ? new Date(rec.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                  </span>
                  <span className="text-[0.9rem] text-[#F0F6FF] font-medium max-sm:col-span-2">{rec?.course?.courseName || 'Course'}</span>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold w-fit ${badgeClass[rec?.status] || badgeClass.absent}`}>
                    {rec?.status === 'present' && '✓ Present'}
                    {rec?.status === 'absent' && '✗ Absent'}
                    {rec?.status === 'late' && '⚠ Late'}
                    {!rec?.status && '— No status'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8"><p className="text-[#8B9AB5]">No attendance records available</p></div>
          )}
        </div>

        {/* ── QUICK ACTIONS ── */}
        <div className="mt-2">
          <span className="block text-[11px] font-bold tracking-[2.5px] uppercase text-[#00D4FF] mb-2">Shortcuts</span>
          <h2 className="font-['Syne',sans-serif] text-[1.4rem] font-extrabold text-[#F0F6FF] mb-5">Quick Actions</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-[18px]">
            {quickActions.map((a, i) => (
              <Link key={i} to={a.to}
                className="bg-[#111827] border border-white/[0.07] rounded-[20px] px-[22px] py-7 no-underline relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-[rgba(0,212,255,0.18)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.25)] group block"
                style={{ animationDelay: `${i * 0.08}s` }}>
                {/* top bar */}
                <div className="absolute top-0 left-0 right-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: a.bar }} />
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[5deg]"
                  style={{ background: a.bg, color: a.color }}>
                  {a.icon}
                </div>
                <div className="font-['Syne',sans-serif] text-base font-bold text-[#F0F6FF] mb-1.5">{a.label}</div>
                <div className="text-[0.82rem] text-[#4B5563] leading-[1.5] mb-4">{a.sub}</div>
                <div className="text-xs transition-transform duration-300 group-hover:translate-x-1" style={{ color: a.color }}>
                  <FaArrowRight />
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default StudentDashboard;