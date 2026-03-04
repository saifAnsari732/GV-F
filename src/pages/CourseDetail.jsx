import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaClock, FaUsers, FaRupeeSign, FaRocket, FaEnvelope, FaCheckCircle, FaChalkboardTeacher, FaListUl } from 'react-icons/fa';
import '../styles/CourseDetail.css';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchCourseDetail(); }, [id]);

  const fetchCourseDetail = async () => {
    try {
      const response = await axios.get(`/api/courses/${id}`);
      if (response.data.success) setCourse(response.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch course details');
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="cd-page">
      <div className="cd-loading">
        <div className="cd-spinner" />
        <p>Loading course details...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="cd-page">
      <div className="cd-error-state">
        <div className="cd-error-icon">⚠</div>
        <h3>Something went wrong</h3>
        <p>{error}</p>
        <button onClick={() => navigate('/courses')} className="cd-back-btn">← Back to Courses</button>
      </div>
    </div>
  );

  if (!course) return (
    <div className="cd-page">
      <div className="cd-error-state">
        <div className="cd-error-icon">🔍</div>
        <h3>Course Not Found</h3>
        <button onClick={() => navigate('/courses')} className="cd-back-btn">← Back to Courses</button>
      </div>
    </div>
  );

  return (
    <div className="cd-page">
      <div className="cd-bg-mesh" />

      <div className="cd-container">
        {/* Back button */}
        <button onClick={() => navigate('/courses')} className="cd-back">
          <FaArrowLeft /> Back to Courses
        </button>

        {/* Hero Header */}
        <div className="cd-hero">
          <div className="cd-hero-image">
            <img src={`${course.courseImage}`} alt={course.courseName}
              onError={e => e.target.src = '/uploads/default-course.jpg'} />
            <div className="cd-hero-img-overlay" />
          </div>

          <div className="cd-hero-info">
            <div className="cd-hero-top">
              <span className="cd-eyebrow">Course Details</span>
              {course.courseCode && (
                <span className="cd-code-badge">{course.courseCode}</span>
              )}
            </div>
            <h1 className="cd-title">{course.courseName}</h1>
            <p className="cd-description">{course.description}</p>

            <div className="cd-stats">
              <div className="cd-stat">
                <div className="cd-stat-icon" style={{ background: 'rgba(0,212,255,0.1)', color: '#00D4FF' }}>
                  <FaClock />
                </div>
                <div>
                  <div className="cd-stat-label">Duration</div>
                  <div className="cd-stat-value">{course.duration}</div>
                </div>
              </div>
              <div className="cd-stat">
                <div className="cd-stat-icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981' }}>
                  <FaUsers />
                </div>
                <div>
                  <div className="cd-stat-label">Students Enrolled</div>
                  <div className="cd-stat-value">{course.totalStudents || 0}</div>
                </div>
              </div>
              <div className="cd-stat">
                <div className="cd-stat-icon" style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B' }}>
                  <FaRupeeSign />
                </div>
                <div>
                  <div className="cd-stat-label">Course Fee</div>
                  <div className="cd-stat-value cd-fee">₹{course.fees?.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="cd-content">
          {/* Syllabus */}
          {course.syllabus && course.syllabus.length > 0 && (
            <div className="cd-section">
              <div className="cd-section-header">
                <div className="cd-section-icon"><FaListUl /></div>
                <h2>Course Syllabus</h2>
              </div>
              <div className="cd-syllabus-list">
                {course.syllabus.map((item, index) => (
                  <div key={index} className="cd-syllabus-item" style={{ animationDelay: `${index * 0.07}s` }}>
                    <div className="cd-module-badge">
                      <span>{String(index + 1).padStart(2, '0')}</span>
                    </div>
                    <div className="cd-module-body">
                      <div className="cd-module-header">
                        <span className="cd-module-label">Module {index + 1}</span>
                        {item.duration && <span className="cd-module-dur"><FaClock /> {item.duration}</span>}
                      </div>
                      <h3 className="cd-module-title">{item.topic}</h3>
                      {item.description && <p className="cd-module-desc">{item.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructor */}
          {course.instructor && (
            <div className="cd-section">
              <div className="cd-section-header">
                <div className="cd-section-icon"><FaChalkboardTeacher /></div>
                <h2>Instructor</h2>
              </div>
              <div className="cd-instructor-card">
                <div className="cd-instructor-avatar">
                  {course.instructor.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="cd-instructor-name">{course.instructor}</div>
                  <div className="cd-instructor-role">Course Instructor</div>
                </div>
              </div>
            </div>
          )}

          {/* Prerequisites */}
          {course.prerequisites && (
            <div className="cd-section">
              <div className="cd-section-header">
                <div className="cd-section-icon"><FaCheckCircle /></div>
                <h2>Prerequisites</h2>
              </div>
              <p className="cd-prereq-text">{course.prerequisites}</p>
            </div>
          )}

          {/* CTA */}
          <div className="cd-cta">
            <div className="cd-cta-inner">
              <div className="cd-cta-bar" />
              <span className="cd-eyebrow" style={{ display: 'inline-block', marginBottom: 12 }}>Get Started</span>
              <h2 className="cd-cta-title">Ready to Enroll?</h2>
              <p className="cd-cta-sub">
                Join <strong style={{ color: '#00D4FF' }}>{course.totalStudents || 0} students</strong> already learning this course
              </p>
              <div className="cd-cta-actions">
                <button className="cd-enroll-btn"><FaRocket /> Enroll Now</button>
                <button className="cd-contact-btn"><FaEnvelope /> Contact Us</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CourseDetail;