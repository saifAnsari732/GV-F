"use client";
import Link from "next/link";
import React, { useState } from 'react';
import { FaMapMarkerAlt, FaBriefcase, FaRupeeSign, FaClock, FaCalendarAlt, FaArrowRight, FaSearch, FaExclamationTriangle } from 'react-icons/fa';

const jobTypes = ['All', 'Full-time', 'Part-time', 'Internship', 'Contract'];

const typePalette = {
  'Full-time':  { bg: 'bg-emerald-500/10', color: 'text-emerald-400', border: 'border-emerald-500/20' },
  'Part-time':  { bg: 'bg-cyan-500/10', color: 'text-cyan-400', border: 'border-cyan-500/20' },
  'Internship': { bg: 'bg-amber-500/10', color: 'text-amber-400', border: 'border-amber-500/20' },
  'Contract':   { bg: 'bg-violet-500/10', color: 'text-violet-400', border: 'border-violet-500/20' },
  'default':    { bg: 'bg-gray-500/10', color: 'text-gray-600', border: 'border-gray-500/20' },
};

const cardBars = [
  'from-cyan-500 to-blue-600',
  'from-emerald-500 to-cyan-500',
  'from-amber-500 to-red-500',
  'from-violet-500 to-fuchsia-500',
  'from-red-500 to-amber-500',
  'from-cyan-500 to-emerald-500',
];

export default function JobsClient({ initialJobs }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const getPalette = (type) => typePalette[type] || typePalette.default;

  const filtered = initialJobs.filter(j => {
    const matchSearch = j.title?.toLowerCase().includes(search.toLowerCase()) ||
      j.company?.toLowerCase().includes(search.toLowerCase()) ||
      j.location?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || j.jobType === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="pt-28 pb-20 relative overflow-hidden">
      
      {/* Decorative BG */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* ── Hero ── */}
      <div className="text-center relative z-10 max-w-4xl mx-auto px-6 mb-16">
        <span className="inline-block text-xs font-bold tracking-[2px] uppercase text-indigo-400 mb-4 bg-indigo-500/10 px-4 py-1.5 rounded-full border border-indigo-500/20">
          Career Opportunities
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Find Your Next{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
            Dream Job
          </span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
          Placement-assisted opportunities curated exclusively for GV Computer Center graduates.
        </p>

        {/* Search */}
        <div className="relative max-w-xl mx-auto mb-6">
          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"/>
          <input
            type="text"
            className="w-full pl-12 pr-5 py-4 bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl text-gray-900 text-base outline-none transition-all duration-300 placeholder-gray-500 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 shadow-lg shadow-black/20"
            placeholder="Search by title, company or location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {jobTypes.map(type => (
            <button
              key={type}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 border ${
                filter === type 
                ? 'bg-indigo-500 text-gray-900 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)]' 
                : 'bg-white/50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:text-gray-900'
              }`}
              onClick={() => setFilter(type)}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="text-sm text-gray-500 font-medium">
          {filtered.length} job{filtered.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* ── List ── */}
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white/50 rounded-3xl border border-gray-200/50 backdrop-blur-sm">
            <FaBriefcase className="text-gray-600 text-6xl mb-6"/>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No jobs found</h3>
            <p className="text-gray-600">{search || filter !== 'All' ? 'Try adjusting your search or filters' : 'Check back later for new opportunities'}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {filtered.map((job, i) => {
              const p = getPalette(job.jobType);
              const bar = cardBars[i % cardBars.length];
              return (
                <div key={job._id} className="group bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200/50 overflow-hidden flex flex-col md:flex-row relative transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10">
                  
                  {/* Left accent bar */}
                  <div className={`hidden md:block w-1.5 h-full bg-gradient-to-b ${bar}`} />
                  <div className={`md:hidden h-1.5 w-full bg-gradient-to-r ${bar}`} />

                  <div className="p-6 md:p-8 flex-1 flex flex-col md:flex-row gap-6">
                    
                    {/* LEFT Content */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-indigo-300 transition-colors">{job.title}</h3>
                          <span className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md border ${p.bg} ${p.color} ${p.border}`}>
                            {job.jobType}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 text-gray-700 font-medium mb-5">
                        <span className="text-gray-900">{job.company}</span>
                        <span className="text-gray-600">•</span>
                        <span className="flex items-center gap-1.5 text-gray-600"><FaMapMarkerAlt className="text-gray-500" /> {job.location}</span>
                      </div>

                      <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-2">
                        {job.description}
                      </p>

                      {/* Meta Pills */}
                      <div className="flex flex-wrap gap-3 mb-6 md:mb-0">
                        {job.experience && (
                          <div className="flex items-center gap-2 bg-gray-50/50 border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700">
                            <FaBriefcase className="text-indigo-400" /> <span>{job.experience}</span>
                          </div>
                        )}
                        {job.salary && (
                          <div className="flex items-center gap-2 bg-gray-50/50 border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700">
                            <FaRupeeSign className="text-emerald-400" /> <span>{job.salary}</span>
                          </div>
                        )}
                        {job.deadline && (
                          <div className="flex items-center gap-2 bg-gray-50/50 border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700">
                            <FaCalendarAlt className="text-amber-400" /> <span>Apply by {new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* RIGHT Content */}
                    <div className="md:w-48 flex flex-col justify-between items-start md:items-end md:border-l border-gray-200/50 md:pl-6 pt-6 md:pt-0 border-t md:border-t-0">
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 md:mb-0">
                        <FaClock />
                        <span>Posted {new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                      </div>
                      <Link href={`/jobs/${job._id}`} className={`inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl font-bold text-sm text-gray-900 transition-all duration-300 hover:scale-105 hover:shadow-lg bg-gradient-to-r ${bar}`}>
                        View Details <FaArrowRight className="text-[11px] group-hover:translate-x-1 transition-transform"/>
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
