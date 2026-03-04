import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaMapMarkerAlt, FaBriefcase, FaRupeeSign, FaClock, FaCalendarAlt, FaArrowRight, FaSearch, FaExclamationTriangle } from 'react-icons/fa';
import '../styles/Jobs.css';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get('/api/jobs');
      if (response.data.success) setJobs(response.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch jobs');
      setLoading(false);
    }
  };

  const jobTypes = ['All', 'Full-time', 'Part-time', 'Internship', 'Contract'];

  const typePalette = {
    'Full-time':  { bg: 'rgba(16,185,129,0.1)',  color: '#10B981', border: 'rgba(16,185,129,0.25)' },
    'Part-time':  { bg: 'rgba(0,212,255,0.1)',   color: '#00D4FF', border: 'rgba(0,212,255,0.25)' },
    'Internship': { bg: 'rgba(245,158,11,0.1)',  color: '#F59E0B', border: 'rgba(245,158,11,0.25)' },
    'Contract':   { bg: 'rgba(124,58,237,0.1)',  color: '#A78BFA', border: 'rgba(124,58,237,0.25)' },
    'default':    { bg: 'rgba(139,154,181,0.1)', color: '#8B9AB5', border: 'rgba(139,154,181,0.2)' },
  };

  const cardBars = [
    'linear-gradient(90deg,#00D4FF,#7C3AED)',
    'linear-gradient(90deg,#10B981,#00D4FF)',
    'linear-gradient(90deg,#F59E0B,#EF4444)',
    'linear-gradient(90deg,#7C3AED,#EC4899)',
    'linear-gradient(90deg,#EF4444,#F59E0B)',
    'linear-gradient(90deg,#06B6D4,#10B981)',
  ];

  const getPalette = (type) => typePalette[type] || typePalette.default;

  const filtered = jobs.filter(j => {
    const matchSearch = j.title?.toLowerCase().includes(search.toLowerCase()) ||
      j.company?.toLowerCase().includes(search.toLowerCase()) ||
      j.location?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || j.jobType === filter;
    return matchSearch && matchFilter;
  });

  if (loading) return (
    <div className="jobs-page">
      <div className="jobs-center-state">
        <div className="jobs-spinner" />
        <p>Loading opportunities...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="jobs-page">
      <div className="jobs-center-state">
        <FaExclamationTriangle className="jobs-err-icon" />
        <h3>Something went wrong</h3>
        <p>{error}</p>
        <button onClick={fetchJobs} className="jobs-retry-btn">Try Again</button>
      </div>
    </div>
  );

  return (
    <div className="jobs-page">
      <div className="jobs-bg-mesh" />

      {/* Hero */}
      <div className="jobs-hero">
        <div className="jobs-container">
          <span className="jobs-eyebrow">Career Opportunities</span>
          <h1 className="jobs-title">Find Your Next <span className="jobs-title-accent">Dream Job</span></h1>
          <p className="jobs-subtitle">Placement-assisted opportunities curated for GV Computer Center graduates</p>

          {/* Search */}
          <div className="jobs-search-wrap">
            <FaSearch className="jobs-search-icon" />
            <input
              type="text"
              className="jobs-search"
              placeholder="Search by title, company or location..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="jobs-filters">
            {jobTypes.map(type => (
              <button
                key={type}
                className={`jobs-filter-btn ${filter === type ? 'active' : ''}`}
                onClick={() => setFilter(type)}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="jobs-count">{filtered.length} job{filtered.length !== 1 ? 's' : ''} found</div>
        </div>
      </div>

      {/* List */}
      <div className="jobs-container jobs-list-wrap">
        {filtered.length === 0 ? (
          <div className="jobs-empty">
            <FaBriefcase className="jobs-empty-icon" />
            <h3>No jobs found</h3>
            <p>{search || filter !== 'All' ? 'Try adjusting your search or filters' : 'Check back later for new opportunities'}</p>
          </div>
        ) : (
          <div className="jobs-list">
            {filtered.map((job, i) => {
              const p = getPalette(job.jobType);
              const bar = cardBars[i % cardBars.length];
              return (
                <div key={job._id} className="job-card" style={{ animationDelay: `${i * 0.07}s` }}>
                  {/* Top bar */}
                  <div className="job-card-bar" style={{ background: bar }} />

                  <div className="job-card-inner">
                    {/* LEFT */}
                    <div className="job-main">
                      <div className="job-top-row">
                        <div>
                          <div className="job-title-row">
                            <h3 className="job-title-text">{job.title}</h3>
                            <span className="job-type-badge" style={{ background: p.bg, color: p.color, border: `1px solid ${p.border}` }}>
                              {job.jobType}
                            </span>
                          </div>
                          <div className="job-company-row">
                            <span className="job-company">{job.company}</span>
                            <span className="job-sep">·</span>
                            <span className="job-location"><FaMapMarkerAlt /> {job.location}</span>
                          </div>
                        </div>
                      </div>

                      <p className="job-desc">{job.description}</p>

                      {/* Meta pills */}
                      <div className="job-meta-row">
                        {job.experience && (
                          <div className="job-meta-pill">
                            <FaBriefcase style={{ color: p.color }} />
                            <span>{job.experience}</span>
                          </div>
                        )}
                        {job.salary && (
                          <div className="job-meta-pill">
                            <FaRupeeSign style={{ color: '#10B981' }} />
                            <span>{job.salary}</span>
                          </div>
                        )}
                        {job.deadline && (
                          <div className="job-meta-pill">
                            <FaCalendarAlt style={{ color: '#F59E0B' }} />
                            <span>Apply by {new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                        )}
                      </div>

                      {/* Skills */}
                      {job.skills?.length > 0 && (
                        <div className="job-skills-row">
                          {job.skills.map((sk, idx) => (
                            <span key={idx} className="job-skill-tag">{sk}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* RIGHT */}
                    <div className="job-side">
                      <div className="job-posted">
                        <FaClock />
                        <span>Posted {new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                      </div>
                      <Link to={`/jobs/${job._id}`} className="job-view-btn" style={{ background: bar }}>
                        View Details <FaArrowRight className="job-btn-arrow" />
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
};

export default Jobs;