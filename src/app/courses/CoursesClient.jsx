"use client";
import Link from "next/link";
import React, { useState } from 'react';
import { FaClock, FaUsers, FaArrowRight, FaBookOpen, FaSearch } from 'react-icons/fa';

const cardPalettes = [
  { gradient: 'from-cyan-500 to-blue-600', icon: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { gradient: 'from-amber-500 to-red-500', icon: 'text-amber-400', bg: 'bg-amber-500/10' },
  { gradient: 'from-emerald-500 to-cyan-500', icon: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { gradient: 'from-violet-500 to-fuchsia-500', icon: 'text-violet-400', bg: 'bg-violet-500/10' },
  { gradient: 'from-red-500 to-amber-500', icon: 'text-red-400', bg: 'bg-red-500/10' },
  { gradient: 'from-cyan-500 to-emerald-500', icon: 'text-cyan-400', bg: 'bg-cyan-500/10' },
];

export default function CoursesClient({ initialCourses }) {
  const [search, setSearch] = useState('');

  const filtered = initialCourses.filter(c =>
    c.courseName.toLowerCase().includes(search.toLowerCase()) ||
    (c.courseCode && c.courseCode.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="pt-28 pb-20 relative overflow-hidden">
      {/* Decorative BG */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-600/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* ── Hero ── */}
      <div className="text-center relative z-10 max-w-4xl mx-auto px-6 mb-16">
        <span className="inline-block text-xs font-bold tracking-[2px] uppercase text-cyan-400 mb-4 bg-cyan-500/10 px-4 py-1.5 rounded-full border border-cyan-500/20">
          Our Programs
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Explore Our{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Courses
          </span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
          Comprehensive training programs designed to launch your tech career with industry-recognized certifications.
        </p>

        {/* Search */}
        <div className="relative max-w-lg mx-auto mb-4">
          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"/>
          <input type="text" placeholder="Search courses or codes..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-5 py-4 bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl text-gray-900 text-base outline-none transition-all duration-300 placeholder-gray-500 focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10"
          />
        </div>
        <div className="text-sm text-gray-500 font-medium">
          {filtered.length} course{filtered.length !== 1 ? 's' : ''} available
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white/50 rounded-3xl border border-gray-200/50 backdrop-blur-sm">
            <FaBookOpen className="text-gray-600 text-6xl mb-6"/>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No courses found</h3>
            <p className="text-gray-600">{search ? `No results match "${search}"` : 'Please check back later'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filtered.map((course, i) => {
              const p = cardPalettes[i % cardPalettes.length];
              return (
                <div key={course._id}
                  className="group bg-white/80 backdrop-blur-md rounded-3xl border border-gray-200/50 overflow-hidden flex flex-col relative transition-all duration-300 hover:-translate-y-2 hover:border-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/10">

                  {/* Top bar */}
                  <div className={`h-1.5 w-full bg-gradient-to-r ${p.gradient}`}/>

                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-50">
                    <img src={course.courseImage || '/uploads/default-course.jpg'} alt={course.courseName}
                      onError={e => e.target.src='/uploads/default-course.jpg'}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"/>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-100 via-gray-900/20 to-transparent opacity-80" />
                    
                    {course.courseCode && (
                      <span className={`absolute top-4 right-4 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider backdrop-blur-md border border-gray-200 ${p.bg} ${p.icon}`}>
                        {course.courseCode}
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-6 flex-1 flex flex-col relative">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 leading-snug group-hover:text-cyan-400 transition-colors">
                      {course.courseName}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                      {course.description}
                    </p>

                    {/* Meta pills */}
                    <div className="flex flex-wrap gap-3 mb-6">
                      <div className="flex items-center gap-2 bg-gray-50/50 border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700">
                        <FaClock className={p.icon}/> <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-50/50 border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700">
                        <FaUsers className={p.icon}/> <span>{course.totalStudents||0}</span>
                      </div>
                    </div>

                    <div className="h-px bg-gray-100/50 mb-6"/>

                    {/* Footer */}
                    <div className="flex justify-between items-center gap-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-1">Fee</span>
                        <span className={`text-2xl font-extrabold ${p.icon}`}>
                          ₹{course.fees?.toLocaleString()}
                        </span>
                      </div>
                      <Link href={`/courses/${course._id}`}
                        className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white transition-all duration-300 hover:scale-105 hover:shadow-lg bg-gradient-to-r ${p.gradient}`}>
                        View
                        <FaArrowRight className="text-[11px] group-hover:translate-x-1 transition-transform"/>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
