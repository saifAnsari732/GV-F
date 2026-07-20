"use client";
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaArrowLeft, FaClock, FaUsers, FaRupeeSign, FaRocket, FaEnvelope, FaCheckCircle, FaChalkboardTeacher, FaListUl, FaTimesCircle } from 'react-icons/fa';
import api from '../../../services/api';

const G = 'linear-gradient(135deg,#00D4FF,#7C3AED)';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useRouter();
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
        <p className="text-gray-500 font-medium">Loading course details...</p>
      </div>
    </div>
  );

  /* ── Error ── */
  if (error) return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center relative overflow-x-hidden pt-20">
      {BG_MESH}
      <div className="flex flex-col items-center gap-4 text-center relative z-10 px-6">
        <FaExclamationTriangle className="text-red-500 text-4xl mb-1.5 animate-bounce" />
        <h3 className="font-['Syne',sans-serif] text-2xl font-extrabold text-gray-900">Something went wrong</h3>
        <p className="text-gray-500 max-w-md">{error}</p>
        <button onClick={() => navigate.push('/courses')}
          className="mt-2 px-7 py-3 rounded-xl text-white font-bold text-[15px] shadow-md transition-all hover:scale-[1.01]"
          style={{ background: G }}>
          ← Back to Courses
        </button>
      </div>
    </div>
  );

  /* ── Not Found ── */
  if (!course) return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center relative overflow-x-hidden pt-20">
      {BG_MESH}
      <div className="flex flex-col items-center gap-4 text-center relative z-10">
        <div className="text-5xl opacity-60">🔍</div>
        <h3 className="font-['Syne',sans-serif] text-2xl font-extrabold text-gray-900">Course Not Found</h3>
        <button onClick={() => navigate.push('/courses')}
          className="mt-2 px-7 py-3 rounded-xl text-white font-bold text-[15px] shadow-md transition-all hover:scale-[1.01]"
          style={{ background: G }}>
          ← Back to Courses
        </button>
      </div>
    </div>
  );

  /* ── Main ── */
  return (
    <div className="min-h-screen bg-gray-50/50 font-['Space_Grotesk',sans-serif] text-gray-900 relative overflow-x-hidden pt-24">
      {BG_MESH}

      {/* Container */}
      <div className="max-w-[1200px] mx-auto px-6 pb-20 relative z-10">

        {/* ── Back Button ── */}
        <button
          onClick={() => navigate.push('/courses')}
          className="inline-flex items-center gap-2.5 bg-white border border-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-bold mb-8 transition-all hover:border-cyan-500/20 hover:text-cyan-600 hover:-translate-x-0.5 cursor-pointer shadow-sm"
        >
          <FaArrowLeft /> Back to Courses
        </button>

        {/* ── Hero ── */}
        <div className="grid grid-cols-1 md:grid-cols-[400px_1fr] gap-8 bg-white border border-gray-200/80 shadow-md shadow-gray-100 rounded-3xl overflow-hidden mb-8 relative group">
          <div className="absolute top-0 left-0 right-0 h-[4px] z-10" style={{ background: G }} />

          {/* Image */}
          <div className="relative min-h-[300px] overflow-hidden bg-gray-50">
            <img
              src={course.courseImage || '/uploads/default-course.jpg'}
              alt={course.courseName}
              onError={e => e.target.src = '/uploads/default-course.jpg'}
              className="w-full h-full object-cover block transition-transform duration-700 ease-in-out group-hover:scale-105"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col justify-between p-8">
            <div className="flex items-center gap-3 flex-wrap mb-3.5">
              <span className="text-[11px] font-bold tracking-[2.5px] uppercase text-cyan-600">
                Course Details
              </span>
              {course.courseCode && (
                <span className="bg-cyan-55 bg-cyan-50 border border-cyan-200/60 text-cyan-700 px-3.5 py-0.5 rounded-full text-xs font-bold tracking-wide">
                  {course.courseCode}
                </span>
              )}
            </div>

            <h1 className="font-['Syne',sans-serif] text-3xl font-extrabold leading-tight text-gray-900 mb-4">
              {course.courseName}
            </h1>

            <p className="text-sm leading-relaxed text-gray-600 mb-6 flex-1">
              {course.description || 'Master this course and elevate your career.'}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 max-sm:grid-cols-1 gap-4">
              <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                <div className="w-[36px] h-[36px] rounded-lg flex items-center justify-center text-sm shrink-0 bg-cyan-50 text-cyan-700">
                  <FaClock />
                </div>
                <div>
                  <div className="text-[10px] font-bold tracking-[0.5px] uppercase text-gray-400 mb-0.5">Duration</div>
                  <div className="font-['Syne',sans-serif] text-[14px] font-extrabold text-gray-900 leading-none">{course.duration}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                <div className="w-[36px] h-[36px] rounded-lg flex items-center justify-center text-sm shrink-0 bg-emerald-50 text-emerald-700">
                  <FaUsers />
                </div>
                <div>
                  <div className="text-[10px] font-bold tracking-[0.5px] uppercase text-gray-400 mb-0.5">Students</div>
                  <div className="font-['Syne',sans-serif] text-[14px] font-extrabold text-gray-900 leading-none">{course.totalStudents || 0}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                <div className="w-[36px] h-[36px] rounded-lg flex items-center justify-center text-sm shrink-0 bg-amber-50 text-amber-700">
                  <FaRupeeSign />
                </div>
                <div>
                  <div className="text-[10px] font-bold tracking-[0.5px] uppercase text-gray-400 mb-0.5">Fee</div>
                  <div className="font-['Syne',sans-serif] text-[14px] font-extrabold text-gray-900 leading-none">
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
            <div className="bg-white border border-gray-200/70 shadow-sm rounded-2xl p-6 sm:p-7">
              <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-cyan-50 border border-cyan-200/60 rounded-xl flex items-center justify-center text-cyan-600 text-sm shrink-0">
                  <FaListUl />
                </div>
                <h2 className="font-['Syne',sans-serif] text-xl font-extrabold text-gray-900 m-0">Course Syllabus</h2>
              </div>

              <div className="flex flex-col gap-3">
                {course.syllabus.map((item, index) => (
                  <div
                    key={index}
                    className="flex max-sm:flex-col gap-4 bg-gray-50/60 border border-gray-200/60 rounded-xl p-4 transition-all hover:border-cyan-500/20"
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center font-['Syne',sans-serif] text-xs font-extrabold text-white shrink-0 shadow-sm"
                      style={{ background: G }}>
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap mb-1">
                        <span className="text-[10px] font-bold tracking-[1px] uppercase text-cyan-600">Module {index + 1}</span>
                      </div>
                      <h3 className="font-['Syne',sans-serif] text-[15px] font-bold text-gray-900 mb-1">{item.topic}</h3>
                      {item.subtopics && item.subtopics.length > 0 && (
                        <p className="text-[13px] text-gray-500 leading-relaxed font-medium">{item.subtopics.join(', ')}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Highlights & Who is this course for */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Highlights */}
            <div className="bg-white border border-gray-200/70 shadow-sm rounded-2xl p-6 sm:p-7">
              <h3 className="font-['Syne',sans-serif] text-lg font-extrabold text-gray-900 mb-5 pb-3 border-b border-gray-100 flex items-center gap-2.5">
                🌟 Course Highlights
              </h3>
              <ul className="space-y-3.5 text-sm text-gray-600 font-semibold">
                <li className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-600 flex items-center justify-center text-xs">✓</span>
                  100% Practical & Hands-on Lab Training
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-600 flex items-center justify-center text-xs">✓</span>
                  Comprehensive Printed Study Material & PDFs
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-600 flex items-center justify-center text-xs">✓</span>
                  Regular Chapter-wise Mock Tests & Assignments
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-600 flex items-center justify-center text-xs">✓</span>
                  Industry Recognized Government-Verified Certification
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-600 flex items-center justify-center text-xs">✓</span>
                  Dedicated Job Placement & Interview Preparation Support
                </li>
              </ul>
            </div>

            {/* Who is this for */}
            <div className="bg-white border border-gray-200/70 shadow-sm rounded-2xl p-6 sm:p-7">
              <h3 className="font-['Syne',sans-serif] text-lg font-extrabold text-gray-900 mb-5 pb-3 border-b border-gray-100 flex items-center gap-2.5">
                🎯 Who Should Enroll?
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-50/60 border border-gray-200/60 p-3 rounded-xl">
                  <h4 className="text-sm font-bold text-gray-900 mb-0.5">Absolute Beginners</h4>
                  <p className="text-xs text-gray-500 font-medium">Students and individuals with zero prior computer knowledge who want to build a strong foundation.</p>
                </div>
                <div className="bg-gray-50/60 border border-gray-200/60 p-3 rounded-xl">
                  <h4 className="text-sm font-bold text-gray-900 mb-0.5">Career Seekers & Aspirants</h4>
                  <p className="text-xs text-gray-500 font-medium">Anyone looking to secure jobs in administration, accounting, data entry, or software engineering fields.</p>
                </div>
                <div className="bg-gray-50/60 border border-gray-200/60 p-3 rounded-xl">
                  <h4 className="text-sm font-bold text-gray-900 mb-0.5">Upskilling Professionals</h4>
                  <p className="text-xs text-gray-500 font-medium">Office workers wishing to master Microsoft Office, modern tools, or professional accounting standards.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Instructor */}
          {course.instructor && (
            <div className="bg-white border border-gray-200/70 shadow-sm rounded-2xl p-6 sm:p-7">
              <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-cyan-50 border border-cyan-200/60 rounded-xl flex items-center justify-center text-cyan-600 text-sm shrink-0">
                  <FaChalkboardTeacher />
                </div>
                <h2 className="font-['Syne',sans-serif] text-xl font-extrabold text-gray-900 m-0">Instructor</h2>
              </div>

              <div className="flex items-center gap-4 bg-gray-50/60 border border-gray-200/60 rounded-xl px-5 py-4">
                <div className="w-[44px] h-[44px] rounded-lg flex items-center justify-center font-['Syne',sans-serif] text-[15px] font-bold text-white shrink-0 shadow-md shadow-cyan-500/20"
                  style={{ background: G }}>
                  {course.instructor.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-['Syne',sans-serif] text-[15px] font-bold text-gray-900 mb-0.5">{course.instructor}</div>
                  <div className="text-[10px] font-bold tracking-[1px] uppercase text-cyan-600">Course Instructor</div>
                </div>
              </div>
            </div>
          )}

          {/* Prerequisites */}
          {course.prerequisites && (
            <div className="bg-white border border-gray-200/70 shadow-sm rounded-2xl p-6 sm:p-7">
              <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-cyan-50 border border-cyan-200/60 rounded-xl flex items-center justify-center text-cyan-600 text-sm shrink-0">
                  <FaCheckCircle />
                </div>
                <h2 className="font-['Syne',sans-serif] text-xl font-extrabold text-gray-900 m-0">Prerequisites</h2>
              </div>
              <p className="text-[14px] text-gray-600 leading-relaxed font-medium">{course.prerequisites}</p>
            </div>
          )}

          {/* CTA */}
          <div className="relative">
            <div className="bg-white border border-gray-200/80 shadow-md rounded-3xl px-8 py-10 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[4px]" style={{ background: G }} />

              <span className="inline-block text-[11px] font-bold tracking-[2.5px] uppercase text-cyan-600 mb-2 relative z-10">
                Get Started
              </span>

              <h2 className="font-['Syne',sans-serif] text-2xl font-extrabold text-gray-900 mb-2 relative z-10">
                Ready to Enroll?
              </h2>

              <p className="text-sm text-gray-500 mb-6 relative z-10">
                Join <strong className="text-cyan-600">{course.totalStudents || 0} students</strong> already learning this course
              </p>

              <div className="flex items-center justify-center gap-4 flex-wrap max-md:flex-col max-md:items-stretch relative z-10">
                <button
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-white font-bold text-sm cursor-pointer border-none transition-all shadow-md hover:scale-[1.01] hover:shadow-cyan-500/20"
                  style={{ background: G }}>
                  <FaRocket /> Enroll Now
                </button>
                <button
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-sm cursor-pointer bg-gray-50 border border-gray-200 text-gray-700 transition-all hover:bg-gray-100 hover:text-cyan-600">
                  <FaEnvelope /> Contact Us
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CourseDetail;