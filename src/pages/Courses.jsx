/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaClock, FaUsers, FaArrowRight, FaBookOpen, FaSearch } from 'react-icons/fa';
import api from '../services/api';

const cardPalettes = [
  { bar:'linear-gradient(90deg,#00D4FF,#7C3AED)', iconColor:'#00D4FF', iconBg:'rgba(0,212,255,0.12)',  fee:'#00D4FF' },
  { bar:'linear-gradient(90deg,#F59E0B,#EF4444)', iconColor:'#F59E0B', iconBg:'rgba(245,158,11,0.12)', fee:'#F59E0B' },
  { bar:'linear-gradient(90deg,#10B981,#00D4FF)', iconColor:'#10B981', iconBg:'rgba(16,185,129,0.12)', fee:'#10B981' },
  { bar:'linear-gradient(90deg,#7C3AED,#EC4899)', iconColor:'#A78BFA', iconBg:'rgba(124,58,237,0.12)', fee:'#A78BFA' },
  { bar:'linear-gradient(90deg,#EF4444,#F59E0B)', iconColor:'#F87171', iconBg:'rgba(239,68,68,0.12)',  fee:'#F87171' },
  { bar:'linear-gradient(90deg,#06B6D4,#10B981)', iconColor:'#06B6D4', iconBg:'rgba(6,182,212,0.12)',  fee:'#06B6D4' },
];

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/api/courses');
      if (res.data.success) setCourses(res.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch courses');
      setLoading(false);
    }
  };

  const filtered = courses.filter(c =>
    c.courseName.toLowerCase().includes(search.toLowerCase()) ||
    (c.courseCode && c.courseCode.toLowerCase().includes(search.toLowerCase()))
  );

  const BG_LAYERS = (
    <>
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background:'radial-gradient(ellipse at 10% 20%,rgba(0,212,255,0.06) 0%,transparent 50%),radial-gradient(ellipse at 90% 80%,rgba(124,58,237,0.06) 0%,transparent 50%)'
      }}/>
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        backgroundImage:'linear-gradient(rgba(0,212,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.02) 1px,transparent 1px)',
        backgroundSize:'64px 64px'
      }}/>
    </>
  );

  /* ── Loading ── */
  if (loading) return (
    <div className="min-h-screen bg-[#080C14] font-['Space_Grotesk',sans-serif] text-[#F0F6FF] relative overflow-x-hidden flex items-center justify-center">
      {BG_LAYERS}
      <div className="flex flex-col items-center gap-5 relative z-10">
        <div className="w-11 h-11 rounded-full border-[3px] border-[rgba(0,212,255,0.12)] border-t-[#00D4FF] animate-spin"/>
        <p className="text-[#8B9AB5] text-[15px]">Loading courses...</p>
      </div>
    </div>
  );

  /* ── Error ── */
  if (error) return (
    <div className="min-h-screen bg-[#080C14] font-['Space_Grotesk',sans-serif] text-[#F0F6FF] relative overflow-x-hidden flex items-center justify-center">
      {BG_LAYERS}
      <div className="flex flex-col items-center text-center relative z-10">
        <div className="text-[3rem] mb-5 opacity-60">⚠</div>
        <h3 className="font-['Syne',sans-serif] text-2xl text-[#F0F6FF] mb-2.5">Something went wrong</h3>
        <p className="text-[#8B9AB5] mb-7">{error}</p>
        <button onClick={fetchCourses}
          className="px-7 py-3 rounded-xl text-white font-semibold text-[15px] border-none cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,212,255,0.3)]"
          style={{background:'linear-gradient(135deg,#00D4FF,#7C3AED)'}}>
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080C14] font-['Space_Grotesk',sans-serif] text-[#F0F6FF] relative overflow-x-hidden">
      {BG_LAYERS}

      {/* ── Hero ── */}
      <div className="pt-[100px] pb-[60px] max-md:pt-20 max-md:pb-[50px] text-center relative z-10">
        {/* bottom divider line */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-px"
          style={{background:'linear-gradient(90deg,transparent,rgba(0,212,255,0.3),transparent)'}}/>

        <div className="max-w-[1280px] mx-auto px-6">
          <span className="inline-block text-[11px] font-bold tracking-[2.5px] uppercase text-[#00D4FF] mb-4">
            Our Programs
          </span>
          <h1 className="font-['Syne',sans-serif] text-[clamp(2.2rem,4vw,4rem)] font-semibold leading-[1.1] text-[#F0F6FF] mb-4">
            Explore Our{' '}
            <span style={{background:'linear-gradient(135deg,#00D4FF,#7C3AED)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>
              Courses
            </span>
          </h1>
          <p className="text-[1.05rem] text-[#8B9AB5] max-w-[500px] mx-auto mb-9 leading-[1.7]">
            Comprehensive training programs designed to launch your tech career
          </p>

          {/* Search */}
          <div className="relative max-w-[480px] mx-auto mb-4">
            <FaSearch className="absolute left-[18px] top-1/2 -translate-y-1/2 text-[#4B5563] text-sm pointer-events-none"/>
            <input type="text" placeholder="Search courses..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-[46px] pr-5 py-3.5 bg-[#111827] border border-white/[0.07] rounded-2xl text-[#F0F6FF] font-['Space_Grotesk',sans-serif] text-[15px] outline-none transition-all duration-300 placeholder-[#4B5563] focus:border-[rgba(0,212,255,0.35)] focus:shadow-[0_0_0_3px_rgba(0,212,255,0.07)]"
            />
          </div>
          <div className="text-[13px] text-[#4B5563]">
            {filtered.length} course{filtered.length !== 1 ? 's' : ''} available
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="max-w-[1280px] mx-auto px-6 relative z-10">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <FaBookOpen className="text-[#4B5563] text-5xl mb-5"/>
            <h3 className="font-['Syne',sans-serif] text-2xl text-[#F0F6FF] mb-2.5">No courses found</h3>
            <p className="text-[#8B9AB5]">{search ? `No results for "${search}"` : 'Please check back later'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] max-sm:grid-cols-1 gap-6 py-[50px] pb-20 max-md:gap-[18px] max-md:py-10 max-md:pb-[60px]">
            {filtered.map((course, i) => {
              const p = cardPalettes[i % cardPalettes.length];
              return (
                <div key={course._id}
                  className="group bg-[#111827] rounded-[20px] border border-white/[0.07] overflow-hidden flex flex-col relative transition-all duration-[400ms] animate-[fadeInUp_0.6s_ease-out_backwards] hover:-translate-y-2 hover:border-[rgba(0,212,255,0.2)] hover:shadow-[0_24px_48px_rgba(0,0,0,0.35),0_0_40px_rgba(0,212,255,0.1)]"
                  style={{animationDelay:`${i*0.08}s`}}>

                  {/* Top bar */}
                  <div className="h-[3px] w-full shrink-0" style={{background:p.bar}}/>

                  {/* Image */}
                  <div className="relative h-[190px] overflow-hidden">
                    <img src={course.courseImage} alt={course.courseName}
                      onError={e => e.target.src='/uploads/default-course.jpg'}
                      className="w-full h-full object-cover block transition-transform duration-[600ms] group-hover:scale-[1.07]"/>
                    {/* overlay */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-25 transition-opacity duration-400 mix-blend-multiply"
                      style={{background:p.bar}}/>
                    {course.courseCode && (
                      <span className="absolute top-3 right-3 px-[13px] py-[5px] rounded-full text-xs font-bold tracking-[0.5px] backdrop-blur-[10px]"
                        style={{background:p.iconBg, color:p.iconColor, border:`1px solid ${p.iconColor}30`}}>
                        {course.courseCode}
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-6 max-[480px]:p-[18px] flex-1 flex flex-col">
                    <h3 className="font-['Syne',sans-serif] text-[1.25rem] font-bold text-[#F0F6FF] mb-2.5 leading-[1.3] transition-colors duration-300 group-hover:text-[#00D4FF]">
                      {course.courseName}
                    </h3>
                    <p className="text-[#8B9AB5] text-[0.88rem] leading-[1.7] mb-5 flex-1 line-clamp-3">
                      {course.description}
                    </p>

                    {/* Meta pills */}
                    <div className="flex flex-wrap gap-2.5 mb-5">
                      {[
                        { icon: <FaClock style={{color:p.iconColor}}/>, text: course.duration },
                        { icon: <FaUsers style={{color:p.iconColor}}/>, text: `${course.totalStudents||0} students` },
                      ].map((m,j) => (
                        <div key={j} className="flex items-center gap-[7px] bg-white/[0.04] border border-white/[0.07] px-3.5 py-1.5 rounded-full text-xs font-medium text-[#8B9AB5] transition-all duration-300 group-hover:border-white/[0.12]">
                          {m.icon}<span>{m.text}</span>
                        </div>
                      ))}
                    </div>

                    <div className="h-px bg-white/[0.07] mb-5"/>

                    {/* Footer */}
                    <div className="flex justify-between items-center gap-3 max-md:flex-col max-md:items-stretch">
                      <div className="flex flex-col gap-[3px]">
                        <span className="text-[11px] font-semibold tracking-[1px] uppercase text-[#4B5563]">Course Fee</span>
                        <span className="font-['Syne',sans-serif] text-2xl font-extrabold leading-none" style={{color:p.fee}}>
                          ₹{course.fees?.toLocaleString()}
                        </span>
                      </div>
                      <Link to={`/courses/${course._id}`}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-['Space_Grotesk',sans-serif] font-semibold text-sm text-white no-underline whitespace-nowrap transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 hover:scale-[1.04] hover:shadow-[0_8px_24px_rgba(0,212,255,0.25)]"
                        style={{background:p.bar}}>
                        View Details
                        <FaArrowRight className="text-[11px] transition-transform duration-300 group-hover:translate-x-1"/>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Courses;