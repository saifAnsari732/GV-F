import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../styles/Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [message, setMessage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setUser(response.data.data);
        setFormData({
          name: response.data.data.name,
          phone: response.data.data.phone || '',
          address: response.data.data.address || ''
        });
        setImagePreview(
          response.data.data.profileImage
            ? `${response.data.data.profileImage}`
            : null   // null instead of ''
        );
      }
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch profile');
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.match(/image.*/)) { setError('Please upload an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('Image must be under 5MB'); return; }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;
    setUploadingImage(true);
    try {
      const token = localStorage.getItem('token');
      const fd = new FormData();
      fd.append('profileImage', imageFile);
      const response = await axios.put('/api/auth/profile/image', fd, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        setUser(response.data.data);
        setImageFile(null);
        setMessage('Profile image updated!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('/api/auth/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setUser(response.data.data);
        setEditing(false);
        setMessage('Profile updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const getInitials = (name = '') =>
    name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  if (loading) return <div className="profile-loading"><div className="profile-spinner"></div><p>Loading profile...</p></div>;
  if (error && !user) return <div className="profile-error">⚠️ {error}</div>;

  return (
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>Manage your personal information</p>
      </div>

      {message && <div className="success-message">✓ {message}</div>}
      {error && user && <div className="error-banner">⚠️ {error}</div>}

      <div className="profile-content">

        {/* ── Main Card ── */}
        <div className="profile-card">

          {/* Avatar Section */}
          <div className="profile-avatar-section">
            <div className="avatar-wrapper">
              <div className="profile-avatar">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt={user.name}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      // Show initials fallback when image fails to load
                      e.target.parentNode.querySelector('.avatar-initials-fallback').style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className="avatar-initials-fallback"
                  style={{ display: imagePreview ? 'none' : 'flex' }}
                >
                  {getInitials(user.name)}
                </div>
              </div>

              {/* Camera overlay button */}
              <button
                className="avatar-edit-btn"
                onClick={() => fileInputRef.current?.click()}
                title="Change profile photo"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </div>

            {/* Upload confirm bar */}
            {imageFile && (
              <div className="image-upload-bar">
                <span>New photo selected</span>
                <div className="upload-bar-actions">
                  <button
                    className="upload-confirm-btn"
                    onClick={handleImageUpload}
                    disabled={uploadingImage}
                  >
                    {uploadingImage ? 'Uploading...' : '✓ Save Photo'}
                  </button>
                  <button
                    className="upload-cancel-btn"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(user.profileImage ? `/uploads/${user.profileImage}` : null);
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            <div className="profile-basic-info">
              <h2>{user.name}</h2>
              <p className="profile-email">✉ {user.email}</p>
              <span className={`role-badge ${user.role}`}>{user.role}</span>
            </div>
          </div>

          {/* Details / Edit Form */}
          {!editing ? (
            <div className="profile-details">
              {[
                { label: '📞 Phone', value: user.phone || 'Not provided' },
                { label: '📍 Address', value: user.address || 'Not provided' },
                { label: '🎂 Date of Birth', value: user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not provided' },
                { label: '🗓 Member Since', value: new Date(user.createdAt).toLocaleDateString() },
              ].map(({ label, value }) => (
                <div className="detail-row" key={label}>
                  <span className="detail-label">{label}</span>
                  <span className="detail-value">{value}</span>
                </div>
              ))}

              <div className="detail-row">
                <span className="detail-label">⚡ Account Status</span>
                <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                  {user.isActive ? '● Active' : '○ Inactive'}
                </span>
              </div>

              <button onClick={() => setEditing(true)} className="edit-profile-btn">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="profile-edit-form">
              {[
                { label: 'Full Name', name: 'name', type: 'text', required: true },
                { label: 'Phone Number', name: 'phone', type: 'tel', required: false },
              ].map(({ label, name, type, required }) => (
                <div className="form-group" key={name}>
                  <label>{label}</label>
                  <input type={type} name={name} value={formData[name]}
                    onChange={handleChange} required={required}
                    placeholder={`Enter your ${label.toLowerCase()}`} />
                </div>
              ))}
              <div className="form-group">
                <label>Address</label>
                <textarea name="address" value={formData.address}
                  onChange={handleChange} rows="3"
                  placeholder="Enter your address" />
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">✓ Save Changes</button>
                <button type="button" onClick={() => setEditing(false)} className="cancel-btn">✕ Cancel</button>
              </div>
            </form>
          )}
        </div>

        {/* ── Enrolled Courses ── */}
        {user.role === 'student' && user.enrolledCourses?.length > 0 && (
          <div className="enrolled-courses-card">
            <h3>📚 Enrolled Courses</h3>
            <div className="courses-list">
              {user.enrolledCourses.map((enrollment) => (
                <div key={enrollment._id} className="course-item">
                  <div className="course-info">
                    <h4>{enrollment.course.courseName}</h4>
                    <p className="course-code">{enrollment.course.courseCode}</p>
                  </div>
                  <span className={`enrollment-status ${enrollment.status}`}>
                    {enrollment.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;