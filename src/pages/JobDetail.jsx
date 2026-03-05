/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import ApplyModal from '../components/ApplyModal';
import {
  FaArrowLeft, FaMapMarkerAlt, FaBriefcase, FaRupeeSign,
  FaCalendarAlt, FaCheckCircle, FaEnvelope, FaLink,
  FaClock, FaRocket, FaExclamationTriangle
} from 'react-icons/fa';
import api from '../services/api';

const BG_MESH = (
  <>
    <div className="fixed inset-0 pointer-events-none z-0" style={{background:'radial-gradient(ellipse at 10% 15%,rgba(0,212,255,0.07) 0%,transparent 50%),radial-gradient(ellipse at 90% 85%,rgba(124,58,237,0.07) 0%,transparent 50%)'}}/>
    <div className="fixed inset-0 pointer-events-none z-0" style={{backgroundImage:'linear-gradient(rgba(0,212,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.02) 1px,transparent 1px)',backgroundSize:'64px 64px'}}/>
  </>
);

const pill = "flex items-center gap-[7px] bg-white/[0.04] border border-white/[0.07] px-4 py-[7px] rounded-full text-[13px] font-medium text-[#8B9AB5]";
const sectionCls = "bg-[#111827] border border-white/[0.07] rounded-[20px] p-7 max-sm:p-[18px] animate-[fadeInUp_0.5s_ease-out_backwards]";

const typePalette = {
  'Full-time':  { bg:'rgba(16,185,129,0.1)',  color:'#10B981', border:'rgba(16,185,129,0.25)' },
  'Part-time':  { bg:'rgba(0,212,255,0.1)',   color:'#00D4FF', border:'rgba(0,212,255,0.25)' },
  'Internship': { bg:'rgba(245,158,11,0.1)',  color:'#F59E0B', border:'rgba(245,158,11,0.25)' },
  'Contract':   { bg:'rgba(124,58,237,0.1)',  color:'#A78BFA', border:'rgba(124,58,237,0.25)' },
};

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchJobDetail();
    if (isAuthenticated) checkApplicationStatus();
  }, [id, isAuthenticated]);

  const fetchJobDetail = async () => {
    try {
      const res = await api.get(`/api/jobs/${id}`);
      if (res.data.success) setJob(res.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch job details');
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    try {
      const res = await api.get('/api/applications/my-applications');
      setHasApplied(res.data.data.some(app => app.jobId._id === id));
    } catch { console.log('object'); }
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) { toast.info('Please login to apply for this job'); navigate('/login',{state:{from:`/jobs/${id}`}}); return; }
    setShowApplyModal(true);
  };

  const handleApplySuccess = () => { setHasApplied(true); setShowApplyModal(false); toast.success('Application submitted successfully!'); };

  const handleCopyLink = () => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(()=>setCopied(false),2000); };

  const pageCls = "min-h-screen bg-[#080C14] font-['Space_Grotesk',sans-serif] text-[#F0F6FF] relative overflow-x-hidden";

  /* ── Loading ── */
  if (loading) return (
    <div className={pageCls}>
      {BG_MESH}
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3.5 relative z-10">
        <div className="w-11 h-11 rounded-full border-[3px] border-[rgba(0,212,255,0.1)] border-t-[#00D4FF] animate-spin"/>
        <p className="text-[#8B9AB5]">Loading job details...</p>
      </div>
    </div>
  );

  /* ── Error ── */
  if (error) return (
    <div className={pageCls}>
      {BG_MESH}
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3.5 text-center relative z-10">
        <FaExclamationTriangle className="text-[#F87171] text-[2.5rem]"/>
        <h3 className="font-['Syne',sans-serif] text-[1.4rem] text-[#F0F6FF]">Something went wrong</h3>
        <p className="text-[#8B9AB5]">{error}</p>
        <button onClick={()=>navigate('/jobs')}
          className="px-7 py-3 rounded-xl text-white font-semibold text-[15px] border-none cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,212,255,0.3)]"
          style={{background:'linear-gradient(135deg,#00D4FF,#7C3AED)'}}>← Back to Jobs</button>
      </div>
    </div>
  );

  /* ── Not found ── */
  if (!job) return (
    <div className={pageCls}>
      {BG_MESH}
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3.5 relative z-10">
        <h3 className="font-['Syne',sans-serif] text-[1.4rem] text-[#F0F6FF]">Job not found</h3>
        <button onClick={()=>navigate('/jobs')}
          className="px-7 py-3 rounded-xl text-white font-semibold text-[15px] border-none cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
          style={{background:'linear-gradient(135deg,#00D4FF,#7C3AED)'}}>← Back to Jobs</button>
      </div>
    </div>
  );

  const tp = typePalette[job.jobType] || { bg:'rgba(139,154,181,0.1)', color:'#8B9AB5', border:'rgba(139,154,181,0.2)' };

  const SectionHead = ({ color='#00D4FF', title }) => (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-2 h-2 rounded-full shrink-0 shadow-[0_0_8px_currentColor]" style={{background:color, color}}/>
      <h3 className="font-['Syne',sans-serif] text-[1.2rem] font-extrabold text-[#F0F6FF] m-0">{title}</h3>
    </div>
  );

  return (
    <div className={pageCls}>
      {BG_MESH}

      <div className="max-w-[1200px] mx-auto px-6 pt-10 pb-20 relative z-10">

        {/* ── Back ── */}
        <button onClick={()=>navigate('/jobs')}
          className="inline-flex items-center gap-2.5 bg-[#111827] border border-white/[0.07] text-[#8B9AB5] px-5 py-2.5 rounded-xl font-['Space_Grotesk',sans-serif] text-sm font-medium cursor-pointer mb-7 transition-all duration-300 hover:border-[rgba(0,212,255,0.3)] hover:text-[#00D4FF] hover:-translate-x-[3px]">
          <FaArrowLeft/> Back to Jobs
        </button>

        {/* ── Hero ── */}
        <div className="bg-[#111827] border border-white/[0.07] rounded-3xl overflow-hidden mb-6">
          <div className="h-[3px]" style={{background:'linear-gradient(135deg,#00D4FF,#7C3AED)'}}/>
          <div className="flex flex-wrap justify-between items-start gap-6 px-10 py-9 max-[900px]:px-6 max-[900px]:py-7">
            {/* Left */}
            <div className="flex-1 min-w-[280px]">
              <div className="flex items-center gap-3 mb-3.5">
                <span className="text-[11px] font-bold tracking-[2.5px] uppercase text-[#00D4FF]">Job Listing</span>
                <span className="px-3.5 py-1 rounded-full text-xs font-bold tracking-[0.3px]"
                  style={{background:tp.bg, color:tp.color, border:`1px solid ${tp.border}`}}>
                  {job.jobType}
                </span>
              </div>
              <h1 className="font-['Syne',sans-serif] text-[clamp(1.7rem,4vw,3rem)] font-extrabold leading-[1.1] text-[#F0F6FF] mb-3">
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2.5 mb-[22px]">
                <span className="text-[1.05rem] font-semibold text-[#00D4FF]">{job.company}</span>
                <span className="text-[#4B5563]">·</span>
                <span className="inline-flex items-center gap-[5px] text-[0.9rem] text-[#8B9AB5]">
                  <FaMapMarkerAlt/> {job.location}
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5 max-sm:gap-2">
                {job.experience && <div className={pill}><FaBriefcase style={{color:'#00D4FF'}}/><span>{job.experience}</span></div>}
                {job.salary    && <div className={pill}><FaRupeeSign  style={{color:'#10B981'}}/><span>{job.salary}</span></div>}
                {job.deadline  && <div className={pill}><FaCalendarAlt style={{color:'#F59E0B'}}/><span>Apply by {new Date(job.deadline).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span></div>}
              </div>
            </div>
            {/* Posted */}
            <div className="shrink-0 pt-1">
              <div className="flex items-center gap-3.5 bg-white/[0.03] border border-white/[0.07] rounded-2xl px-5 py-4">
                <FaClock className="text-[20px] opacity-70" style={{color:'#00D4FF'}}/>
                <div>
                  <div className="text-[11px] font-semibold tracking-[1px] uppercase text-[#4B5563] mb-1">Posted on</div>
                  <div className="font-['Syne',sans-serif] text-[0.95rem] font-bold text-[#F0F6FF]">
                    {new Date(job.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="grid grid-cols-[1fr_320px] max-[900px]:grid-cols-1 gap-[22px] items-start">

          {/* ── Main ── */}
          <div className="flex flex-col gap-[18px]">

            {/* Description */}
            <div className={sectionCls}>
              <SectionHead color="#00D4FF" title="Job Description"/>
              <p className="text-[0.97rem] leading-[1.85] text-[#8B9AB5] whitespace-pre-line">{job.description}</p>
            </div>

            {/* Requirements */}
            {job.requirements?.length > 0 && (
              <div className={sectionCls}>
                <SectionHead color="#10B981" title="Requirements"/>
                <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
                  {job.requirements.map((req,i) => (
                    <li key={i}
                      className="flex items-start gap-3 bg-white/[0.02] border border-white/[0.07] rounded-[10px] px-4 py-3 transition-all duration-300 hover:border-[rgba(16,185,129,0.25)]">
                      <FaCheckCircle className="text-[#10B981] text-sm mt-0.5 shrink-0"/>
                      <span className="text-[0.92rem] text-[#8B9AB5] leading-[1.6]">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills */}
            {job.skills?.length > 0 && (
              <div className={sectionCls}>
                <SectionHead color="#A78BFA" title="Required Skills"/>
                <div className="flex flex-wrap gap-2.5">
                  {job.skills.map((sk,i) => (
                    <span key={i}
                      className="px-4 py-1.5 bg-[rgba(0,212,255,0.07)] border border-[rgba(0,212,255,0.15)] text-[#00D4FF] rounded-full text-[13px] font-semibold transition-all duration-300 hover:bg-[rgba(0,212,255,0.14)] hover:border-[rgba(0,212,255,0.3)] hover:-translate-y-0.5 cursor-default">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && (
              <div className={sectionCls}>
                <SectionHead color="#F59E0B" title="Benefits"/>
                <p className="text-[0.97rem] leading-[1.85] text-[#8B9AB5] whitespace-pre-line">{job.benefits}</p>
              </div>
            )}

            {/* Contact */}
            {job.contactEmail && (
              <div className={sectionCls}>
                <SectionHead color="#06B6D4" title="Contact Information"/>
                <div className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.07] rounded-2xl px-5 py-4 text-[20px]">
                  <FaEnvelope style={{color:'#00D4FF'}}/>
                  <div>
                    <div className="text-[11px] font-semibold tracking-[1px] uppercase text-[#4B5563] mb-1">Email Address</div>
                    <a href={`mailto:${job.contactEmail}`}
                      className="text-[0.97rem] font-semibold text-[#00D4FF] no-underline transition-opacity duration-200 hover:opacity-75">
                      {job.contactEmail}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="flex flex-col gap-[18px] sticky top-6 max-[900px]:static max-[900px]:order-first">

            {/* Apply Card */}
            <div className="bg-[#111827] border border-white/[0.07] rounded-[20px] overflow-hidden">
              <div className="h-[3px]" style={{background:'linear-gradient(135deg,#00D4FF,#7C3AED)'}}/>
              <div className="px-[26px] max-sm:px-[18px]">
                <h3 className="font-['Syne',sans-serif] text-[1.15rem] font-extrabold text-[#F0F6FF] mt-[26px] mb-2.5">
                  Interested in this position?
                </h3>
                <p className="text-[0.88rem] text-[#8B9AB5] leading-[1.6] mb-[22px]">
                  Submit your application to kickstart your career journey
                </p>
              </div>

              {hasApplied ? (
                <button disabled
                  className="flex items-center justify-content-center gap-2.5 w-[calc(100%-52px)] max-sm:w-[calc(100%-36px)] mx-[26px] max-sm:mx-[18px] mb-[22px] py-3.5 rounded-2xl bg-[rgba(16,185,129,0.1)] text-[#10B981] border border-[rgba(16,185,129,0.25)] font-['Space_Grotesk',sans-serif] text-[15px] font-bold cursor-not-allowed justify-center">
                  <FaCheckCircle/> Already Applied
                </button>
              ) : (
                <button onClick={handleApplyClick}
                  className="flex items-center justify-center gap-2.5 w-[calc(100%-52px)] max-sm:w-[calc(100%-36px)] mx-[26px] max-sm:mx-[18px] mb-[22px] py-3.5 rounded-2xl text-white border-none font-['Space_Grotesk',sans-serif] text-[15px] font-bold cursor-pointer transition-all duration-300 shadow-[0_4px_20px_rgba(0,212,255,0.2)] hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_8px_28px_rgba(0,212,255,0.35)]"
                  style={{background:'linear-gradient(135deg,#00D4FF,#7C3AED)'}}>
                  <FaRocket/> Apply Now
                </button>
              )}

              <div className="h-px bg-white/[0.07] mb-[18px]"/>

              {/* Share */}
              <div className="pb-6 px-[26px] max-sm:px-[18px]">
                <div className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#4B5563] mb-3">Share this job</div>
                <div className="flex gap-2.5">
                  {[
                    { href:`mailto:?subject=Job: ${job.title}&body=${window.location.href}`, label:<><FaEnvelope/> Email</> },
                    { onClick:handleCopyLink, label:<><FaLink/> {copied?'Copied!':'Copy Link'}</> },
                  ].map((s,i) => {
                    const cls = "flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-[9px] rounded-[10px] bg-white/[0.04] border border-white/[0.07] text-[#8B9AB5] font-['Space_Grotesk',sans-serif] text-[13px] font-semibold cursor-pointer no-underline transition-all duration-300 hover:border-[rgba(0,212,255,0.3)] hover:text-[#00D4FF]";
                    return s.href
                      ? <a key={i} href={s.href} className={cls}>{s.label}</a>
                      : <button key={i} onClick={s.onClick} className={cls}>{s.label}</button>;
                  })}
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-[#111827] border border-white/[0.07] rounded-[20px] p-6">
              <div className="font-['Syne',sans-serif] text-base font-extrabold text-[#F0F6FF] mb-[18px] pb-3.5 border-b border-white/[0.07]">
                Job Overview
              </div>
              {[
                { icon:<FaBriefcase/>,   label:'Job Type',   value:job.jobType,    color:tp.color },
                job.experience && { icon:<FaBriefcase/>,   label:'Experience', value:job.experience, color:'#00D4FF' },
                job.salary     && { icon:<FaRupeeSign/>,   label:'Salary',     value:job.salary,     color:'#10B981' },
                job.deadline   && { icon:<FaCalendarAlt/>, label:'Deadline',   value:new Date(job.deadline).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}), color:'#F59E0B' },
                { icon:<FaMapMarkerAlt/>, label:'Location',  value:job.location,   color:'#A78BFA' },
              ].filter(Boolean).map((item,i) => (
                <div key={i} className="flex items-center gap-3.5 py-2.5 border-b border-white/[0.07] last:border-b-0 last:pb-0">
                  <div className="w-9 h-9 rounded-[10px] flex items-center justify-center text-sm shrink-0"
                    style={{color:item.color, background:`${item.color}15`}}>
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold tracking-[0.8px] uppercase text-[#4B5563] mb-0.5">{item.label}</div>
                    <div className="text-[0.92rem] font-semibold text-[#F0F6FF]">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showApplyModal && (
        <ApplyModal job={job} user={user} onClose={()=>setShowApplyModal(false)} onSuccess={handleApplySuccess}/>
      )}

      <style>{`
        @keyframes fadeInUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
};

export default JobDetail;