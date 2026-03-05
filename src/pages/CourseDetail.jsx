/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaClock, FaUsers, FaRupeeSign, FaRocket, FaEnvelope, FaCheckCircle, FaChalkboardTeacher, FaListUl } from 'react-icons/fa';
import api from '../services/api';
const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCourseDetail = async () => {
    try {
      const response = await api.get(`/api/courses/${id}`);
      console.log("cors detl", response.data);
      if (response.data.success) setCourse(response.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch course details');
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourseDetail(); }, [id]);

  /* ── Loading ── */
  if (loading) return (
    <div className="min-h-screen bg-[#080C14] font-['Space_Grotesk',sans-serif] text-[#F0F6FF] flex items-center justify-center relative overflow-x-hidden">
      {/* bg mesh */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at 10% 15%, rgba(0,212,255,0.07) 0%, transparent 50%), radial-gradient(ellipse at 90% 85%, rgba(124,58,237,0.07) 0%, transparent 50%)'
        }} />
      <div className="flex flex-col items-center gap-4 relative z-10">
        <div className="w-11 h-11 rounded-full border-[3px] border-[rgba(0,212,255,0.1)] border-t-[#00D4FF] animate-spin" />
        <p className="text-[#8B9AB5]">Loading course details...</p>
      </div>
    </div>
  );

  /* ── Error ── */
  if (error) return (
    <div className="min-h-screen bg-[#080C14] text-[#F0F6FF] flex items-center justify-center relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse at 10% 15%, rgba(0,212,255,0.07) 0%, transparent 50%), radial-gradient(ellipse at 90% 85%, rgba(124,58,237,0.07) 0%, transparent 50%)' }} />
      <div className="flex flex-col items-center gap-4 text-center relative z-10">
        <div className="text-5xl opacity-60">⚠</div>
        <h3 className="font-['Syne',sans-serif] text-2xl font-extrabold">Something went wrong</h3>
        <p className="text-[#8B9AB5]">{error}</p>
        <button onClick={() => navigate('/courses')}
          className="mt-2 px-7 py-3 rounded-xl text-white font-semibold text-[15px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,212,255,0.3)]"
          style={{ background: 'linear-gradient(135deg,#00D4FF,#7C3AED)' }}>
          ← Back to Courses
        </button>
      </div>
    </div>
  );

  /* ── Not Found ── */
  if (!course) return (
    <div className="min-h-screen bg-[#080C14] text-[#F0F6FF] flex items-center justify-center relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse at 10% 15%, rgba(0,212,255,0.07) 0%, transparent 50%), radial-gradient(ellipse at 90% 85%, rgba(124,58,237,0.07) 0%, transparent 50%)' }} />
      <div className="flex flex-col items-center gap-4 text-center relative z-10">
        <div className="text-5xl opacity-60">🔍</div>
        <h3 className="font-['Syne',sans-serif] text-2xl font-extrabold">Course Not Found</h3>
        <button onClick={() => navigate('/courses')}
          className="mt-2 px-7 py-3 rounded-xl text-white font-semibold text-[15px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,212,255,0.3)]"
          style={{ background: 'linear-gradient(135deg,#00D4FF,#7C3AED)' }}>
          ← Back to Courses
        </button>
      </div>
    </div>
  );

  /* ── Main ── */
  return (
    <div className="min-h-screen bg-[#080C14] font-['Space_Grotesk',sans-serif] text-[#F0F6FF] relative overflow-x-hidden">

      {/* Background mesh */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at 10% 15%, rgba(0,212,255,0.07) 0%, transparent 50%), radial-gradient(ellipse at 90% 85%, rgba(124,58,237,0.07) 0%, transparent 50%)'
        }} />

      {/* Grid lines */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,212,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.02) 1px, transparent 1px)',
          backgroundSize: '64px 64px'
        }} />

      {/* Container */}
      <div className="max-w-[1200px] mx-auto px-6 pt-10 pb-20 relative z-10">

        {/* ── Back Button ── */}
        <button
          onClick={() => navigate('/courses')}
          className="inline-flex items-center gap-2.5 bg-[#111827] border border-white/[0.07] text-[#8B9AB5] px-5 py-2.5 rounded-xl text-sm font-semibold mb-9 transition-all duration-300 hover:border-[rgba(0,212,255,0.3)] hover:text-[#00D4FF] hover:-translate-x-1 cursor-pointer"
        >
          <FaArrowLeft /> Back to Courses
        </button>

        {/* ── Hero ── */}
        <div className="grid grid-cols-1 md:grid-cols-[420px_1fr] gap-9 bg-[#111827] border border-white/[0.07] rounded-3xl overflow-hidden mb-8 relative group"
          style={{ borderTop: '3px solid transparent', backgroundImage: 'linear-gradient(#111827,#111827), linear-gradient(135deg,#00D4FF,#7C3AED)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box' }}>

          {/* top gradient bar */}
          <div className="absolute top-0 left-0 right-0 h-[3px] z-10"
            style={{ background: 'linear-gradient(135deg,#00D4FF,#7C3AED)' }} />

          {/* Image */}
          <div className="relative min-h-[340px] max-md:min-h-[240px] overflow-hidden">
            <img
              src={`${course.courseImage}`}
              alt={course.courseName}
              onError={e => e.target.src = '/uploads/default-course.jpg'}
              className="w-full h-full object-cover block transition-transform duration-700 ease-in-out group-hover:scale-105"
            />
            {/* overlay: fades right on md, bottom on mobile */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(to right, transparent 60%, #111827 100%)' }}
              aria-hidden="true" />
            <div className="absolute inset-0 pointer-events-none md:hidden"
              style={{ background: 'linear-gradient(to bottom, transparent 60%, #111827 100%)' }}
              aria-hidden="true" />
          </div>

          {/* Info */}
          <div className="flex flex-col justify-between p-9 md:pl-0 max-md:pt-6">
            {/* Eyebrow + badge */}
            <div className="flex items-center gap-3 flex-wrap mb-3.5">
              <span className="text-[11px] font-bold tracking-[2.5px] uppercase text-[#00D4FF]">
                Course Details
              </span>
              {course.courseCode && (
                <span className="bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.25)] text-[#00D4FF] px-3.5 py-1 rounded-full text-xs font-bold tracking-wide">
                  {course.courseCode}
                </span>
              )}
            </div>

            <h1 className="font-['Syne',sans-serif] text-[clamp(1.8rem,3vw,2.8rem)] font-extrabold leading-[1.12] text-[#F0F6FF] mb-4">
              {course.courseName}
            </h1>

            <p className="text-[0.97rem] leading-[1.8] text-[#8B9AB5] mb-7 flex-1">
              {course.description}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 max-sm:grid-cols-1 gap-3.5">

              <div className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.07] rounded-2xl px-4 py-3.5 transition-all duration-300 hover:border-[rgba(0,212,255,0.15)]">
                <div className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center text-[15px] shrink-0 bg-[rgba(0,212,255,0.1)] text-[#00D4FF]">
                  <FaClock />
                </div>
                <div>
                  <div className="text-[10px] font-semibold tracking-[1px] uppercase text-[#4B5563] mb-0.5">Duration</div>
                  <div className="font-['Syne',sans-serif] text-[1.15rem] font-extrabold text-[#F0F6FF] leading-none">{course.duration}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.07] rounded-2xl px-4 py-3.5 transition-all duration-300 hover:border-[rgba(0,212,255,0.15)]">
                <div className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center text-[15px] shrink-0 bg-[rgba(16,185,129,0.1)] text-[#10B981]">
                  <FaUsers />
                </div>
                <div>
                  <div className="text-[10px] font-semibold tracking-[1px] uppercase text-[#4B5563] mb-0.5">Students Enrolled</div>
                  <div className="font-['Syne',sans-serif] text-[1.15rem] font-extrabold text-[#F0F6FF] leading-none">{course.totalStudents || 0}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.07] rounded-2xl px-4 py-3.5 transition-all duration-300 hover:border-[rgba(0,212,255,0.15)]">
                <div className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center text-[15px] shrink-0 bg-[rgba(245,158,11,0.1)] text-[#F59E0B]">
                  <FaRupeeSign />
                </div>
                <div>
                  <div className="text-[10px] font-semibold tracking-[1px] uppercase text-[#4B5563] mb-0.5">Course Fee</div>
                  <div className="font-['Syne',sans-serif] text-[1.15rem] font-extrabold leading-none"
                    style={{ background: 'linear-gradient(135deg,#00D4FF,#7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    ₹{course.fees?.toLocaleString()}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="flex flex-col gap-6">

          {/* Syllabus */}
          {course.syllabus && course.syllabus.length > 0 && (
            <div className="bg-[#111827] border border-white/[0.07] rounded-[20px] p-8 max-sm:p-[24px_18px] animate-[fadeInUp_0.5s_ease-out_backwards]">
              <div className="flex items-center gap-3.5 mb-7 pb-5 border-b border-white/[0.07]">
                <div className="w-10 h-10 bg-[rgba(0,212,255,0.08)] border border-[rgba(0,212,255,0.15)] rounded-[10px] flex items-center justify-center text-[#00D4FF] text-base shrink-0">
                  <FaListUl />
                </div>
                <h2 className="font-['Syne',sans-serif] text-2xl font-extrabold text-[#F0F6FF] m-0">Course Syllabus</h2>
              </div>

              <div className="flex flex-col gap-3.5">
                {course.syllabus.map((item, index) => (
                  <div
                    key={index}
                    className="flex max-sm:flex-col gap-[18px] bg-white/[0.02] border border-white/[0.07] rounded-2xl p-5 transition-all duration-300 hover:border-[rgba(0,212,255,0.2)] hover:bg-[rgba(0,212,255,0.03)] hover:translate-x-1 animate-[fadeInUp_0.5s_ease-out_backwards]"
                    style={{ animationDelay: `${index * 0.07}s` }}
                  >
                    {/* badge */}
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center font-['Syne',sans-serif] text-[0.9rem] font-extrabold text-white shrink-0"
                      style={{ background: 'linear-gradient(135deg,#00D4FF,#7C3AED)' }}>
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap mb-1.5">
                        <span className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#00D4FF]">Module {index + 1}</span>
                        {item.duration && (
                          <span className="inline-flex items-center gap-1.5 text-xs text-[#4B5563] bg-white/[0.04] px-2.5 py-0.5 rounded-full border border-white/[0.07]">
                            <FaClock /> {item.duration}
                          </span>
                        )}
                      </div>
                      <h3 className="font-['Syne',sans-serif] text-[1.05rem] font-bold text-[#F0F6FF] mb-2">{item.topic}</h3>
                      {item.description && (
                        <p className="text-[0.88rem] text-[#8B9AB5] leading-[1.7]">{item.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructor */}
          {course.instructor && (
            <div className="bg-[#111827] border border-white/[0.07] rounded-[20px] p-8 max-sm:p-[24px_18px] animate-[fadeInUp_0.5s_ease-out_backwards]">
              <div className="flex items-center gap-3.5 mb-7 pb-5 border-b border-white/[0.07]">
                <div className="w-10 h-10 bg-[rgba(0,212,255,0.08)] border border-[rgba(0,212,255,0.15)] rounded-[10px] flex items-center justify-center text-[#00D4FF] text-base shrink-0">
                  <FaChalkboardTeacher />
                </div>
                <h2 className="font-['Syne',sans-serif] text-2xl font-extrabold text-[#F0F6FF] m-0">Instructor</h2>
              </div>

              <div className="flex items-center gap-[18px] bg-white/[0.02] border border-white/[0.07] rounded-2xl px-6 py-5">
                <div className="w-[52px] h-[52px] rounded-2xl flex items-center justify-center font-['Syne',sans-serif] text-[1.3rem] font-extrabold text-white shrink-0"
                  style={{ background: 'linear-gradient(135deg,#00D4FF,#7C3AED)' }}>
                  {course.instructor.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-['Syne',sans-serif] text-[1.1rem] font-bold text-[#F0F6FF] mb-1">{course.instructor}</div>
                  <div className="text-xs font-semibold tracking-[1px] uppercase text-[#00D4FF]">Course Instructor</div>
                </div>
              </div>
            </div>
          )}

          {/* Prerequisites */}
          {course.prerequisites && (
            <div className="bg-[#111827] border border-white/[0.07] rounded-[20px] p-8 max-sm:p-[24px_18px] animate-[fadeInUp_0.5s_ease-out_backwards]">
              <div className="flex items-center gap-3.5 mb-7 pb-5 border-b border-white/[0.07]">
                <div className="w-10 h-10 bg-[rgba(0,212,255,0.08)] border border-[rgba(0,212,255,0.15)] rounded-[10px] flex items-center justify-center text-[#00D4FF] text-base shrink-0">
                  <FaCheckCircle />
                </div>
                <h2 className="font-['Syne',sans-serif] text-2xl font-extrabold text-[#F0F6FF] m-0">Prerequisites</h2>
              </div>
              <p className="text-[0.97rem] text-[#8B9AB5] leading-[1.8]">{course.prerequisites}</p>
            </div>
          )}

          {/* CTA */}
          <div className="relative animate-[fadeInUp_0.5s_ease-out_backwards]">
            <div className="bg-[#111827] border border-white/[0.07] rounded-3xl px-10 py-[60px] max-md:px-6 max-md:py-12 text-center relative overflow-hidden">

              {/* top bar */}
              <div className="absolute top-0 left-0 right-0 h-[3px]"
                style={{ background: 'linear-gradient(135deg,#00D4FF,#7C3AED)' }} />

              {/* radial glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(0,212,255,0.06) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(124,58,237,0.06) 0%, transparent 60%)' }} />

              <span className="inline-block text-[11px] font-bold tracking-[2.5px] uppercase text-[#00D4FF] mb-3 relative z-10">
                Get Started
              </span>

              <h2 className="font-['Syne',sans-serif] text-[clamp(1.8rem,3vw,2.5rem)] font-extrabold text-[#F0F6FF] mb-3 relative z-10">
                Ready to Enroll?
              </h2>

              <p className="text-base text-[#8B9AB5] mb-9 relative z-10">
                Join <strong className="text-[#00D4FF]">{course.totalStudents || 0} students</strong> already learning this course
              </p>

              <div className="flex items-center justify-center gap-4 flex-wrap max-md:flex-col max-md:items-stretch relative z-10">
                <button
                  className="inline-flex items-center justify-center gap-2.5 px-9 py-[15px] rounded-2xl text-white font-bold text-base cursor-pointer border-none transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_10px_30px_rgba(0,212,255,0.4)]"
                  style={{ background: 'linear-gradient(135deg,#00D4FF,#7C3AED)', boxShadow: '0 4px 20px rgba(0,212,255,0.25)' }}>
                  <FaRocket /> Enroll Now
                </button>
                <button
                  className="inline-flex items-center justify-center gap-2.5 px-9 py-[15px] rounded-2xl font-bold text-base cursor-pointer bg-white/[0.04] text-[#F0F6FF] border border-white/[0.07] transition-all duration-300 hover:border-[rgba(0,212,255,0.35)] hover:text-[#00D4FF] hover:-translate-y-0.5">
                  <FaEnvelope /> Contact Us
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Keyframes for fadeInUp (Tailwind JIT won't have this by default) */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default CourseDetail;