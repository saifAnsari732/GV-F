/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaClock, FaUsers, FaArrowRight, FaBookOpen, FaSearch } from 'react-icons/fa';
import '../styles/Courses.css';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/courses');
      console.log("object",response.data.data);
      if (response.data.success) setCourses(response.data.data);
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

  const cardPalettes = [
    { bar: 'linear-gradient(90deg,#00D4FF,#7C3AED)', icon: { bg: 'rgba(0,212,255,0.12)', color: '#00D4FF' }, fee: '#00D4FF' },
    { bar: 'linear-gradient(90deg,#F59E0B,#EF4444)', icon: { bg: 'rgba(245,158,11,0.12)', color: '#F59E0B' }, fee: '#F59E0B' },
    { bar: 'linear-gradient(90deg,#10B981,#00D4FF)', icon: { bg: 'rgba(16,185,129,0.12)', color: '#10B981' }, fee: '#10B981' },
    { bar: 'linear-gradient(90deg,#7C3AED,#EC4899)', icon: { bg: 'rgba(124,58,237,0.12)', color: '#A78BFA' }, fee: '#A78BFA' },
    { bar: 'linear-gradient(90deg,#EF4444,#F59E0B)', icon: { bg: 'rgba(239,68,68,0.12)', color: '#F87171' }, fee: '#F87171' },
    { bar: 'linear-gradient(90deg,#06B6D4,#10B981)', icon: { bg: 'rgba(6,182,212,0.12)', color: '#06B6D4' }, fee: '#06B6D4' },
  ];

  if (loading) return (
    <div className="courses-page">
      <div className="courses-loading">
        <div className="loading-spinner" />
        <p>Loading courses...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="courses-page">
      <div className="courses-error">
        <div className="error-icon">⚠</div>
        <h3>Something went wrong</h3>
        <p>{error}</p>
        <button onClick={fetchCourses} className="retry-btn">Try Again</button>
      </div>
    </div>
  );

  return (
    <div className="courses-page">
      {/* Ambient background */}
      <div className="courses-bg-mesh" />

      {/* Header */}
      <div className="courses-hero">
        <div className="courses-container">
          <span className="courses-eyebrow">Our Programs</span>
          <h1 className="courses-title">
            Explore Our <span className="courses-title-accent">Courses</span>
          </h1>
          <p className="courses-subtitle">
            Comprehensive training programs designed to launch your tech career
          </p>
          {/* Search */}
          <div className="courses-search-wrap">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="courses-search"
              placeholder="Search courses..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="courses-count">{filtered.length} course{filtered.length !== 1 ? 's' : ''} available</div>
        </div>
      </div>

      {/* Grid */}
      <div className="courses-container">
        {filtered.length === 0 ? (
          <div className="no-courses">
            <FaBookOpen className="no-courses-icon" />
            <h3>No courses found</h3>
            <p>{search ? `No results for "${search}"` : 'Please check back later'}</p>
          </div>
        ) : (
          <div className="courses-grid">
            {filtered.map((course, i) => {
              const p = cardPalettes[i % cardPalettes.length];
              return (
                <div key={course._id} className="course-card" style={{ animationDelay: `${i * 0.08}s` }}>
                  {/* Top bar */}
                  <div className="card-top-bar" style={{ background: p.bar }} />

                  {/* Image */}
                  <div className="course-img-wrap">
                    <img
                      src={course.courseImage}
                      alt={course.courseName}
                      onError={e => e.target.src = '/uploads/default-course.jpg'}
                      className="course-img"
                    />
                    <div className="course-img-overlay" style={{ background: p.bar }} />
                    {course.courseCode && (
                      <span className="course-code-badge" style={{ background: p.icon.bg, color: p.icon.color, border: `1px solid ${p.icon.color}30` }}>
                        {course.courseCode}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="course-body">
                    <h3 className="course-name">{course.courseName}</h3>
                    <p className="course-desc">{course.description}</p>

                    {/* Meta */}
                    <div className="course-meta-row">
                      <div className="meta-pill">
                        <FaClock style={{ color: p.icon.color }} />
                        <span>{course.duration}</span>
                      </div>
                      <div className="meta-pill">
                        <FaUsers style={{ color: p.icon.color }} />
                        <span>{course.totalStudents || 0} students</span>
                      </div>
                    </div>

                    <div className="course-divider" />

                    {/* Footer */}
                    <div className="course-footer">
                      <div className="course-fee">
                        <span className="fee-label">Course Fee</span>
                        <span className="fee-amount" style={{ color: p.fee }}>
                          ₹{course.fees?.toLocaleString()}
                        </span>
                      </div>
                      <Link to={`/courses/${course._id}`} className="view-btn" style={{ background: p.bar }}>
                        View Details <FaArrowRight className="btn-arrow" />
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

export default Courses;