import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/CourseManagement.css';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    courseName: '',
    courseCode: '',
    duration: '',
    fees: '',
    category: 'Other',
    syllabus: [{ topic: '', subtopics: [''] }],
    courseImage: null
  });
  const [imagePreview, setImagePreview] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setCourses(response.data.data);
      }
      setLoading(false);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch courses';
      setError(errorMsg);
      toast.error(errorMsg);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.match(/image.*/)) {
        toast.error('Please upload an image file');
        e.target.value = '';
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        e.target.value = '';
        return;
      }

      setFormData(prev => ({ ...prev, courseImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      toast.success('Image selected successfully');
    }
  };

  const handleSyllabusChange = (index, field, value, subtopicIndex = null) => {
    const updatedSyllabus = [...formData.syllabus];
    
    if (subtopicIndex !== null) {
      updatedSyllabus[index].subtopics[subtopicIndex] = value;
    } else {
      updatedSyllabus[index][field] = value;
    }
    
    setFormData(prev => ({ ...prev, syllabus: updatedSyllabus }));
  };

  const addSyllabusTopic = () => {
    setFormData(prev => ({
      ...prev,
      syllabus: [...prev.syllabus, { topic: '', subtopics: [''] }]
    }));
    toast.info('New topic added');
  };

  const removeSyllabusTopic = (index) => {
    if (formData.syllabus.length > 1) {
      const updatedSyllabus = formData.syllabus.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, syllabus: updatedSyllabus }));
      toast.info('Topic removed');
    }
  };

  const addSubtopic = (topicIndex) => {
    const updatedSyllabus = [...formData.syllabus];
    updatedSyllabus[topicIndex].subtopics.push('');
    setFormData(prev => ({ ...prev, syllabus: updatedSyllabus }));
    toast.info('Subtopic added');
  };

  const removeSubtopic = (topicIndex, subtopicIndex) => {
    if (formData.syllabus[topicIndex].subtopics.length > 1) {
      const updatedSyllabus = [...formData.syllabus];
      updatedSyllabus[topicIndex].subtopics = updatedSyllabus[topicIndex].subtopics.filter((_, i) => i !== subtopicIndex);
      setFormData(prev => ({ ...prev, syllabus: updatedSyllabus }));
      toast.info('Subtopic removed');
    }
  };

  const resetForm = () => {
    setFormData({
      courseName: '',
      courseCode: '',
      duration: '',
      fees: '',
      category: 'Other',
      syllabus: [{ topic: '', subtopics: [''] }],
      courseImage: null
    });
    setImagePreview('');
    setSelectedCourse(null);
    const fileInput = document.getElementById('courseImage');
    if (fileInput) fileInput.value = '';
  };

  const handleCreateClick = () => {
    resetForm();
    setModalMode('create');
    setShowModal(true);
  };

  const handleEditClick = (course) => {
    setSelectedCourse(course);
    setFormData({
      courseName: course.courseName,
      courseCode: course.courseCode,
      duration: course.duration,
      fees: course.fees,
      category: course.category || 'Other',
      syllabus: course.syllabus.length > 0 ? course.syllabus : [{ topic: '', subtopics: [''] }],
      courseImage: null
    });
    setImagePreview(course.courseImage || '');
    setModalMode('edit');
    setShowModal(true);
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }

    const loadingToast = toast.loading('Deleting course...');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`/api/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.update(loadingToast, {
          render: 'Course deleted successfully',
          type: 'success',
          isLoading: false,
          autoClose: 3000
        });
        fetchCourses();
      }
    } catch (err) {
      toast.update(loadingToast, {
        render: err.response?.data?.message || 'Failed to delete course',
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (submitting) return;
    
    setSubmitting(true);
    const loadingToast = toast.loading(modalMode === 'edit' ? 'Updating course...' : 'Creating course...');
    
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      
      // Append all form fields
      formDataToSend.append('courseName', formData.courseName);
      formDataToSend.append('courseCode', formData.courseCode);
      formDataToSend.append('duration', formData.duration);
      formDataToSend.append('fees', formData.fees);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('syllabus', JSON.stringify(formData.syllabus));
      
      // Append image if selected
      if (formData.courseImage) {
        formDataToSend.append('courseImage', formData.courseImage);
      }

      let response;
      if (modalMode === 'edit' && selectedCourse) {
        response = await axios.put(`/api/courses/${selectedCourse._id}`, formDataToSend, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await axios.post('/api/courses', formDataToSend, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      if (response.data.success) {
        toast.update(loadingToast, {
          render: modalMode === 'edit' ? 'Course updated successfully!' : 'Course created successfully!',
          type: 'success',
          isLoading: false,
          autoClose: 3000
        });
        setShowModal(false);
        resetForm();
        fetchCourses();
      }
    } catch (err) {
      console.error('Error:', err);
      toast.update(loadingToast, {
        render: err.response?.data?.message || 'Failed to save course',
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.courseCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || course.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <div className="loading">Loading courses...</div>;
  }

  return (
    <div className="admin-courses">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="courses-header">
        <h1>Course Management</h1>
        <div className="header-actions">
          <button className="btn-create" onClick={handleCreateClick}>
            <span className="btn-icon">+</span>
            Create New Course
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="search-filter-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search courses by name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
        
        <div className="filter-box">
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="Basic Computer">Basic Computer</option>
            <option value="Advanced Computer">Advanced Computer</option>
            <option value="Accounting">Accounting</option>
            <option value="Programming">Programming</option>
            <option value="Certification">Certification</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="courses-stats">
        <div className="stat-item">
          <span className="stat-value">{courses.length}</span>
          <span className="stat-label">Total Courses</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{courses.filter(c => c.totalStudents > 0).length}</span>
          <span className="stat-label">Courses with Students</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">
            {courses.reduce((sum, course) => sum + (course.totalStudents || 0), 0)}
          </span>
          <span className="stat-label">Total Enrollments</span>
        </div>
      </div>

      <div className="courses-grid">
        {filteredCourses.length === 0 ? (
          <div className="no-courses">
            <p>No courses found. Click "Create New Course" to add one.</p>
          </div>
        ) : (
          filteredCourses.map(course => (
            <div key={course._id} className="course-card">
              <div className="course-image-container">
                {course.courseImage ? (
                  <img 
                    src={course.courseImage} 
                    alt={course.courseName}
                    className="course-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      // e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="no-image">
                    <span>No Image</span>
                  </div>
                )}
              </div>
              
              <div className="course-details">
                <div className="course-header">
                  <h3>{course.courseName}</h3>
                  <span className="course-code">{course.courseCode}</span>
                </div>
                
                <div className="course-info">
                  <div className="info-item">
                    <span className="info-label">Duration:</span>
                    <span className="info-value">{course.duration}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Fees:</span>
                    <span className="info-value">₹{course.fees.toLocaleString()}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Category:</span>
                    <span className="info-value">{course.category}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Students:</span>
                    <span className="info-value">{course.totalStudents || 0}</span>
                  </div>
                </div>
                
                <div className="course-actions">
                  <button 
                    className="btn-update"
                    onClick={() => handleEditClick(course)}
                  >
                    Update Course
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(course._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{modalMode === 'edit' ? 'Update Course' : 'Create New Course'}</h2>
              <button className="close-btn" onClick={() => { setShowModal(false); resetForm(); }}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="course-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Course Name *</label>
                  <input
                    type="text"
                    name="courseName"
                    value={formData.courseName}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter course name"
                  />
                </div>

                <div className="form-group">
                  <label>Course Code *</label>
                  <input
                    type="text"
                    name="courseCode"
                    value={formData.courseCode}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., CS101"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Duration *</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 3 months"
                  />
                </div>

                <div className="form-group">
                  <label>Fees (₹) *</label>
                  <input
                    type="number"
                    name="fees"
                    value={formData.fees}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter fees amount"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="Basic Computer">Basic Computer</option>
                    <option value="Advanced Computer">Advanced Computer</option>
                    <option value="Accounting">Accounting</option>
                    <option value="Programming">Programming</option>
                    <option value="Certification">Certification</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Course Image</label>
                  <div className="image-upload-container">
                    <input
                      type="file"
                      id="courseImage"
                      name="courseImage"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="image-input"
                    />
                    <label htmlFor="courseImage" className="image-upload-label">
                      {imagePreview ? 'Change Image' : 'Choose Image'}
                    </label>
                    
                    
                    <p className="image-hint">
                      Supported formats: JPG, PNG, GIF. Max size: 5MB
                    </p>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Syllabus</label>
                {formData.syllabus.map((topic, topicIndex) => (
                  <div key={topicIndex} className="syllabus-topic">
                    <div className="topic-header">
                      <input
                        type="text"
                        placeholder={`Topic ${topicIndex + 1}`}
                        value={topic.topic}
                        onChange={(e) => handleSyllabusChange(topicIndex, 'topic', e.target.value)}
                      />
                      <div className="topic-actions">
                        <button 
                          type="button" 
                          className="btn-add-subtopic" 
                          onClick={() => addSubtopic(topicIndex)}
                          title="Add Subtopic"
                        >
                          +
                        </button>
                        <button 
                          type="button" 
                          className="btn-remove-topic" 
                          onClick={() => removeSyllabusTopic(topicIndex)}
                          title="Remove Topic"
                          disabled={formData.syllabus.length === 1}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                    
                    <div className="subtopics">
                      {topic.subtopics.map((subtopic, subtopicIndex) => (
                        <div key={subtopicIndex} className="subtopic-item">
                          <input
                            type="text"
                            placeholder={`Subtopic ${subtopicIndex + 1}`}
                            value={subtopic}
                            onChange={(e) => handleSyllabusChange(topicIndex, 'subtopics', e.target.value, subtopicIndex)}
                          />
                          <button 
                            type="button" 
                            className="btn-remove-subtopic" 
                            onClick={() => removeSubtopic(topicIndex, subtopicIndex)}
                            title="Remove Subtopic"
                            disabled={topic.subtopics.length === 1}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                <button type="button" className="btn-add-topic" onClick={addSyllabusTopic}>
                  + Add New Topic
                </button>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-cancel" 
                  onClick={() => { setShowModal(false); resetForm(); }}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-submit"
                  disabled={submitting}
                >
                  {submitting 
                    ? (modalMode === 'edit' ? 'Updating...' : 'Creating...') 
                    : (modalMode === 'edit' ? 'Update Course' : 'Create Course')
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourses;