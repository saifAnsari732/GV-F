"use client";
import Link from "next/link";
import React, { useState, useEffect } from 'react';

import {
  FaBookOpen, FaChartBar, FaCheckCircle, FaClock,
  FaUser, FaBriefcase, FaRupeeSign, FaArrowRight,
  FaGraduationCap, FaExclamationTriangle
} from 'react-icons/fa';
import api from '../../../services/api';

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
        background: 'radial-gradient(ellipse at 10% 15%,rgba(6,182,212,0.05) 0%,transparent 50%),radial-gradient(ellipse at 90% 80%,rgba(124,58,237,0.05) 0%,transparent 50%)'
      }} />
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.015) 1px,transparent 1px)',
        backgroundSize: '64px 64px'
      }} />
    </>
  );

  /* ── Loading ── */
  if (loading) return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-['Space_Grotesk',sans-serif] relative overflow-x-hidden flex items-center justify-center pt-20">
      {BG_MESH}
      <div className="flex flex-col items-center gap-4 relative z-10">
        <div className="w-11 h-11 rounded-full border-[3px] border-cyan-500/20 border-t-cyan-500 animate-spin" />
        <p className="text-gray-500 font-medium">Loading dashboard...</p>
      </div>
    </div>
  );

  /* ── Error ── */
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

  /* ── No data ── */
  if (!dashboardData) return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center relative pt-20">
      {BG_MESH}
      <p className="text-gray-500 font-medium relative z-10">No data available</p>
    </div>
  );

  const { student, coursesCount, fees, attendance } = dashboardData;
  const feePercent = fees?.total > 0 ? Math.round(((fees?.paid || 0) / fees.total) * 100) : 0;

  const stats = [
    { icon: <FaBookOpen />, label: 'Enrolled Courses', value: coursesCount || 0, sub: 'Active courses', bg: 'rgba(6,182,212,0.08)', color: '#0891b2' },
    { icon: <FaChartBar />, label: 'Attendance', value: `${attendance?.percentage || 0}%`, sub: `${attendance?.present || 0} of ${attendance?.total || 0} classes`, bg: 'rgba(16,185,129,0.08)', color: '#059669' },
    { icon: <FaCheckCircle />, label: 'Fees Paid', value: `₹${fmt(fees?.paid)}`, sub: `of ₹${fmt(fees?.total)}`, bg: 'rgba(124,58,237,0.08)', color: '#7c3aed' },
    { icon: <FaClock />, label: 'Fees Pending', value: `₹${fmt(fees?.pending)}`, sub: 'Remaining balance', bg: 'rgba(245,158,11,0.08)', color: '#d97706' },
  ];

  const quickActions = [
    { to: '/profile', icon: <FaUser />, label: 'Update Profile', sub: 'Manage personal info', grad: 'from-cyan-500 to-blue-600', shadow: 'shadow-cyan-500/30' },
    { to: '/courses', icon: <FaGraduationCap />, label: 'Browse Courses', sub: 'Explore available courses', grad: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/30' },
    { to: '/jobs', icon: <FaBriefcase />, label: 'Find Jobs', sub: 'View job opportunities', grad: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-500/30' },
    { to: '/student/fees', icon: <FaRupeeSign />, label: 'Fee Details', sub: 'Payment history & info', grad: 'from-amber-500 to-orange-500', shadow: 'shadow-amber-500/30' },
    { to: '/student/pay-fees', icon: <span className="text-lg">📲</span>, label: 'Pay via QR', sub: 'Submit payment screenshot', grad: 'from-pink-500 to-rose-600', shadow: 'shadow-pink-500/30' },
  ];

  const badgeClass = {
    active:   'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    completed:'bg-cyan-50 text-cyan-700 border border-cyan-200/60',
    paid:     'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    partial:  'bg-amber-50 text-amber-700 border border-amber-200/60',
    pending:  'bg-rose-50 text-rose-700 border border-rose-200/60',
    present:  'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    absent:   'bg-rose-50 text-rose-700 border border-rose-200/60',
    late:     'bg-amber-50 text-amber-700 border border-amber-200/60',
  };

  return (
    <div className="min-h-screen bg-gray-50/50 font-['Space_Grotesk',sans-serif] text-gray-900 relative overflow-x-hidden pt-24">
      {BG_MESH}

      <div className="max-w-[1400px] mx-auto px-6 pb-20 relative z-10">

        {/* ── HEADER ── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white border border-gray-200/80 shadow-md shadow-gray-100 rounded-3xl px-8 py-7 mb-7 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[4px]" style={{ background: G }} />
          <div>
            <span className="block text-[11px] font-bold tracking-[2.5px] uppercase text-cyan-600 mb-1.5">Student Dashboard</span>
            <h1 className="font-['Syne',sans-serif] text-3xl font-extrabold leading-tight text-gray-900 mb-1.5">
              Welcome back,{' '}
              <span style={{ background: G, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {student?.name || 'Student'}
              </span>{' '}👋
            </h1>
            <p className="text-sm text-gray-500">Here's an overview of your learning journey</p>
          </div>

          <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 shrink-0">
            <div className="w-[50px] h-[50px] rounded-xl flex items-center justify-center font-['Syne',sans-serif] text-[1.3rem] font-extrabold text-white shrink-0 shadow-md shadow-cyan-500/20"
              style={{ background: G }}>
              {getInitial(student?.name)}
            </div>
            <div>
              <div className="font-['Syne',sans-serif] text-[15px] font-bold text-gray-900 mb-0.5">{student?.name || 'Student'}</div>
              <div className="text-[12px] text-gray-500 mb-1.5">{student?.email || 'Email not available'}</div>
              <span className="inline-block bg-cyan-50 border border-cyan-200 text-cyan-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-[0.5px] uppercase">
                Student
              </span>
            </div>
          </div>
        </div>

        {/* ── QUICK ACTIONS ── */}
        <div className="mb-7">
          <div className="flex items-center gap-3 mb-4">
            <span className="block text-[11px] font-bold tracking-[2.5px] uppercase text-cyan-600">Shortcuts</span>
            <div className="h-px flex-1 bg-gradient-to-r from-cyan-200 to-transparent" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {quickActions.map((a, i) => (
              <Link key={i} href={a.to}
                className={`group relative bg-gradient-to-br ${a.grad} ${a.shadow} shadow-lg rounded-2xl px-4 py-5 no-underline overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl block`}>
                {/* shine effect */}
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <div className="relative z-10">
                  <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white text-lg mb-3 group-hover:scale-110 transition-transform duration-300">
                    {a.icon}
                  </div>
                  <div className="text-white font-bold text-[14px] leading-tight mb-1">{a.label}</div>
                  <div className="text-white/70 text-[11px] leading-snug mb-3">{a.sub}</div>
                  <div className="flex items-center gap-1 text-white/80 text-[11px] font-semibold group-hover:translate-x-1 transition-transform duration-300">
                    Go <FaArrowRight className="text-[10px]" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── STATS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-7">
          {stats.map((s, i) => (
            <div key={i}
              className="bg-white border border-gray-200/70 shadow-sm rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-cyan-500/20 group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                  style={{ background: s.bg, color: s.color }}>
                  {s.icon}
                </div>
                <span className="text-[13px] font-bold text-gray-500 uppercase tracking-wide">{s.label}</span>
              </div>
              <div className="font-['Syne',sans-serif] text-3xl font-extrabold text-gray-900 mb-1">{s.value}</div>
              <div className="text-xs text-gray-500 font-medium">{s.sub}</div>
              {/* subtle hover accent glow */}
              <div className="absolute -bottom-5 -right-5 w-16 h-16 rounded-full opacity-[0.04] blur-[15px] transition-opacity duration-300 group-hover:opacity-[0.1]"
                style={{ background: s.color }} />
            </div>
          ))}
        </div>

        {/* ── TWO COL ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-7">

          {/* My Courses */}
          <div className="bg-white border border-gray-200/70 shadow-sm rounded-2xl p-6 sm:p-7">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <h2 className="font-['Syne',sans-serif] text-lg font-extrabold text-gray-900 m-0">My Courses</h2>
              <Link href="/courses" className="inline-flex items-center gap-1 text-[13px] font-bold text-cyan-600 hover:text-cyan-500 no-underline transition-all">
                View All <FaArrowRight className="text-xs" />
              </Link>
            </div>

            <div className="flex flex-col gap-3.5">
              {student?.enrolledCourses?.length > 0 ? (
                student.enrolledCourses.map((en, i) => (
                  <div key={en?._id || i}
                    className="flex items-center gap-4 bg-gray-50/60 border border-gray-200/60 rounded-xl p-3.5 transition-all duration-300 hover:border-cyan-500/20 hover:bg-cyan-500/[0.01] hover:translate-x-0.5">
                    <div className="w-[52px] h-[52px] rounded-xl overflow-hidden shrink-0 border border-gray-200 bg-white">
                      <img src={en?.course?.courseImage || '/uploads/default-course.jpg'} alt={en?.course?.courseName || 'Course'} className="w-full h-full object-cover block" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[15px] text-gray-900 mb-0.5 truncate">{en?.course?.courseName || 'Course Name'}</div>
                      <div className="text-[12px] text-gray-500 mb-1.5 font-medium">{en?.course?.courseCode || ''}</div>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold capitalize tracking-[0.3px] ${badgeClass[en?.status] || badgeClass.active}`}>
                        {en?.status || 'active'}
                      </span>
                    </div>
                    <Link href={`/courses/${en?.course?._id || '#'}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-cyan-50 border border-cyan-200 text-cyan-700 hover:bg-cyan-100/70 no-underline rounded-xl text-[11px] font-bold whitespace-nowrap shrink-0 transition-all">
                      View <FaArrowRight className="text-[10px]" />
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 px-5">
                  <FaGraduationCap className="text-gray-400 text-4xl mb-3 mx-auto block" />
                  <p className="text-gray-500 mb-4 text-[14px] font-medium">Not enrolled in any courses yet</p>
                  <Link href="/courses"
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-white no-underline rounded-xl font-bold text-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg shadow-md"
                    style={{ background: G }}>
                    Browse Courses
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Fee Summary */}
          <div className="bg-white border border-gray-200/70 shadow-sm rounded-2xl p-6 sm:p-7">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <h2 className="font-['Syne',sans-serif] text-lg font-extrabold text-gray-900 m-0">Fee Summary</h2>
            </div>

            {/* Progress card */}
            <div className="bg-gray-50/60 border border-gray-200/60 rounded-xl p-5 mb-5">
              <div className="flex justify-between items-center mb-3 text-[13px] text-gray-500 font-bold">
                <span>Payment Progress</span>
                <span className="text-cyan-600 font-extrabold">{feePercent}% paid</span>
              </div>
              <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden mb-4">
                <div className="h-full rounded-full transition-all duration-[800ms]"
                  style={{ width: `${feePercent}%`, background: 'linear-gradient(90deg,#00D4FF,#7C3AED)' }} />
              </div>
              <div className="flex justify-between">
                <div>
                  <div className="font-['Syne',sans-serif] text-lg font-extrabold mb-0.5 text-emerald-600">₹{fmt(fees?.paid)}</div>
                  <div className="text-[10px] font-bold tracking-[1px] uppercase text-gray-400">Paid</div>
                </div>
                <div className="text-right">
                  <div className="font-['Syne',sans-serif] text-lg font-extrabold mb-0.5 text-amber-600">₹{fmt(fees?.pending)}</div>
                  <div className="text-[10px] font-bold tracking-[1px] uppercase text-gray-400">Pending</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {fees?.records?.length > 0 ? fees.records.slice(0, 3).map((rec, i) => (
                <div key={rec?._id || i}
                  className="flex justify-between items-center bg-gray-50/60 border border-gray-200/60 rounded-xl px-4 py-3.5 transition-all duration-300 hover:border-cyan-500/20">
                  <div>
                    <div className="text-[14px] font-bold text-gray-900 mb-0.5">{rec?.course?.courseName || 'Course'}</div>
                    <div className="text-[11px] text-gray-500 font-medium">{rec?.course?.courseCode || ''}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <div className="font-['Syne',sans-serif] text-[15px] font-extrabold text-gray-900">₹{fmt(rec?.totalFees)}</div>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold capitalize ${badgeClass[rec?.status] || badgeClass.pending}`}>
                      {rec?.status || 'pending'}
                    </span>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10">
                  <p className="text-gray-400 font-medium text-sm">No fee records available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── ATTENDANCE ── */}
        <div className="bg-white border border-gray-200/70 shadow-sm rounded-2xl p-6 sm:p-7 mb-7">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
            <h2 className="font-['Syne',sans-serif] text-lg font-extrabold text-gray-900 m-0">Recent Attendance</h2>
          </div>
          {attendance?.recentRecords?.length > 0 ? (
            <div className="flex flex-col">
              {/* thead */}
              <div className="hidden sm:grid sm:grid-cols-[160px_1fr_140px] gap-3 px-4 py-2.5 text-[11px] font-bold tracking-[1.5px] uppercase text-gray-400 mb-1">
                <span>Date</span><span>Course</span><span>Status</span>
              </div>
              {attendance.recentRecords.map((rec, i) => (
                <div key={rec?._id || i}
                  className="grid grid-cols-[130px_1fr_120px] max-sm:grid-cols-2 max-sm:grid-rows-2 gap-3 items-center px-4 py-3.5 bg-gray-50/60 border border-gray-200/60 rounded-xl mb-2 transition-all duration-300 hover:border-cyan-500/20"
                  style={{ animationDelay: `${i * 0.05}s` }}>
                  <span className="text-[13px] text-gray-500 font-semibold">
                    {rec?.date ? new Date(rec.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                  </span>
                  <span className="text-[14px] text-gray-900 font-bold max-sm:col-span-2">{rec?.course?.courseName || 'Course'}</span>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold w-fit ${badgeClass[rec?.status] || badgeClass.absent}`}>
                    {rec?.status === 'present' && '✓ Present'}
                    {rec?.status === 'absent' && '✗ Absent'}
                    {rec?.status === 'late' && '⚠ Late'}
                    {!rec?.status && '— No status'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-400 font-medium text-sm">No attendance records available</p>
            </div>
          )}
        </div>

        {/* Quick Actions moved to top — removed from here */}

      </div>
    </div>
  );
};

export default StudentDashboard;