/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import ApplyModal from '../components/ApplyModal';
import {
  FaArrowLeft, FaMapMarkerAlt, FaBriefcase, FaRupeeSign,
  FaCalendarAlt, FaCheckCircle, FaEnvelope, FaLink,
  FaClock, FaRocket, FaExclamationTriangle
} from 'react-icons/fa';
import '../styles/JobDetail.css';

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
      const response = await axios.get(`/api/jobs/${id}`);
      if (response.data.success) setJob(response.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch job details');
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    try {
      const response = await axios.get('/api/applications/my-applications');
      setHasApplied(response.data.data.some(app => app.jobId._id === id));
    } catch {}
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      toast.info('Please login to apply for this job');
      navigate('/login', { state: { from: `/jobs/${id}` } });
      return;
    }
    setShowApplyModal(true);
  };

  const handleApplySuccess = () => {
    setHasApplied(true);
    setShowApplyModal(false);
    toast.success('Application submitted successfully!');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const typePalette = {
    'Full-time':  { bg: 'rgba(16,185,129,0.1)',  color: '#10B981', border: 'rgba(16,185,129,0.25)' },
    'Part-time':  { bg: 'rgba(0,212,255,0.1)',   color: '#00D4FF', border: 'rgba(0,212,255,0.25)' },
    'Internship': { bg: 'rgba(245,158,11,0.1)',  color: '#F59E0B', border: 'rgba(245,158,11,0.25)' },
    'Contract':   { bg: 'rgba(124,58,237,0.1)',  color: '#A78BFA', border: 'rgba(124,58,237,0.25)' },
  };
  const p = typePalette[job?.jobType] || { bg: 'rgba(139,154,181,0.1)', color: '#8B9AB5', border: 'rgba(139,154,181,0.2)' };

  if (loading) return (
    <div className="jd-page">
      <div className="jd-center-state">
        <div className="jd-spinner" />
        <p>Loading job details...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="jd-page">
      <div className="jd-center-state">
        <FaExclamationTriangle className="jd-err-icon" />
        <h3>Something went wrong</h3>
        <p>{error}</p>
        <button onClick={() => navigate('/jobs')} className="jd-retry-btn">← Back to Jobs</button>
      </div>
    </div>
  );

  if (!job) return (
    <div className="jd-page">
      <div className="jd-center-state">
        <h3>Job not found</h3>
        <button onClick={() => navigate('/jobs')} className="jd-retry-btn">← Back to Jobs</button>
      </div>
    </div>
  );

  return (
    <div className="jd-page">
      <div className="jd-bg-mesh" />

      <div className="jd-container">
        {/* Back */}
        <button onClick={() => navigate('/jobs')} className="jd-back">
          <FaArrowLeft /> Back to Jobs
        </button>

        {/* Hero Header */}
        <div className="jd-hero">
          <div className="jd-hero-bar" />
          <div className="jd-hero-inner">
            <div className="jd-hero-left">
              <div className="jd-hero-top">
                <span className="jd-eyebrow">Job Listing</span>
                <span className="jd-type-badge" style={{ background: p.bg, color: p.color, border: `1px solid ${p.border}` }}>
                  {job.jobType}
                </span>
              </div>
              <h1 className="jd-title">{job.title}</h1>
              <div className="jd-company-row">
                <span className="jd-company">{job.company}</span>
                <span className="jd-sep">·</span>
                <span className="jd-location"><FaMapMarkerAlt /> {job.location}</span>
              </div>
              {/* Meta pills */}
              <div className="jd-meta-row">
                {job.experience && (
                  <div className="jd-meta-pill">
                    <FaBriefcase style={{ color: '#00D4FF' }} />
                    <span>{job.experience}</span>
                  </div>
                )}
                {job.salary && (
                  <div className="jd-meta-pill">
                    <FaRupeeSign style={{ color: '#10B981' }} />
                    <span>{job.salary}</span>
                  </div>
                )}
                {job.deadline && (
                  <div className="jd-meta-pill">
                    <FaCalendarAlt style={{ color: '#F59E0B' }} />
                    <span>Apply by {new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                )}
              </div>
            </div>
            {/* Posted */}
            <div className="jd-hero-right">
              <div className="jd-posted-card">
                <FaClock className="jd-posted-icon" />
                <div>
                  <div className="jd-posted-label">Posted on</div>
                  <div className="jd-posted-date">{new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="jd-body">
          {/* LEFT — Sections */}
          <div className="jd-main">

            {/* Description */}
            <div className="jd-section">
              <div className="jd-section-head">
                <div className="jd-section-dot" />
                <h3>Job Description</h3>
              </div>
              <p className="jd-desc-text">{job.description}</p>
            </div>

            {/* Requirements */}
            {job.requirements?.length > 0 && (
              <div className="jd-section">
                <div className="jd-section-head">
                  <div className="jd-section-dot" style={{ background: '#10B981' }} />
                  <h3>Requirements</h3>
                </div>
                <ul className="jd-req-list">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="jd-req-item">
                      <FaCheckCircle className="jd-req-icon" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills */}
            {job.skills?.length > 0 && (
              <div className="jd-section">
                <div className="jd-section-head">
                  <div className="jd-section-dot" style={{ background: '#A78BFA' }} />
                  <h3>Required Skills</h3>
                </div>
                <div className="jd-skills-wrap">
                  {job.skills.map((sk, i) => (
                    <span key={i} className="jd-skill-tag">{sk}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && (
              <div className="jd-section">
                <div className="jd-section-head">
                  <div className="jd-section-dot" style={{ background: '#F59E0B' }} />
                  <h3>Benefits</h3>
                </div>
                <p className="jd-desc-text">{job.benefits}</p>
              </div>
            )}

            {/* Contact */}
            {job.contactEmail && (
              <div className="jd-section">
                <div className="jd-section-head">
                  <div className="jd-section-dot" style={{ background: '#06B6D4' }} />
                  <h3>Contact Information</h3>
                </div>
                <div className="jd-contact-card">
                  <FaEnvelope style={{ color: '#00D4FF' }} />
                  <div>
                    <div className="jd-contact-label">Email Address</div>
                    <a href={`mailto:${job.contactEmail}`} className="jd-contact-email">{job.contactEmail}</a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — Sidebar */}
          <div className="jd-sidebar">
            {/* Apply card */}
            <div className="jd-apply-card">
              <div className="jd-apply-bar" />
              <h3 className="jd-apply-title">Interested in this position?</h3>
              <p className="jd-apply-sub">Submit your application to kickstart your career journey</p>

              {hasApplied ? (
                <button className="jd-applied-btn" disabled>
                  <FaCheckCircle /> Already Applied
                </button>
              ) : (
                <button className="jd-apply-btn" onClick={handleApplyClick}>
                  <FaRocket /> Apply Now
                </button>
              )}

              <div className="jd-apply-divider" />

              {/* Share */}
              <div className="jd-share-section">
                <div className="jd-share-label">Share this job</div>
                <div className="jd-share-btns">
                  <a href={`mailto:?subject=Job: ${job.title}&body=${window.location.href}`} className="jd-share-btn">
                    <FaEnvelope /> Email
                  </a>
                  <button className="jd-share-btn" onClick={handleCopyLink}>
                    <FaLink /> {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Info card */}
            <div className="jd-info-card">
              <div className="jd-info-title">Job Overview</div>
              {[
                { icon: <FaBriefcase />, label: 'Job Type', value: job.jobType, color: p.color },
                job.experience && { icon: <FaBriefcase />, label: 'Experience', value: job.experience, color: '#00D4FF' },
                job.salary && { icon: <FaRupeeSign />, label: 'Salary', value: job.salary, color: '#10B981' },
                job.deadline && { icon: <FaCalendarAlt />, label: 'Deadline', value: new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }), color: '#F59E0B' },
                { icon: <FaMapMarkerAlt />, label: 'Location', value: job.location, color: '#A78BFA' },
              ].filter(Boolean).map((item, i) => (
                <div key={i} className="jd-info-row">
                  <div className="jd-info-icon" style={{ color: item.color, background: `${item.color}15` }}>{item.icon}</div>
                  <div>
                    <div className="jd-info-label">{item.label}</div>
                    <div className="jd-info-value">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showApplyModal && (
        <ApplyModal
          job={job}
          user={user}
          onClose={() => setShowApplyModal(false)}
          onSuccess={handleApplySuccess}
        />
      )}
    </div>
  );
};

export default JobDetail;