import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaHome, FaCalendar, FaCamera, FaUserPlus, FaUserTag, FaBook } from 'react-icons/fa';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    role: 'student',
    course: '',
    profileImage: null
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoadingCourses(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/courses', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      console.log("object", response.courseName);
      if (response.data.success) {
        setCourses(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch courses:', err);
      setCourses([
        { _id: 'dca', courseName: 'DCA', courseCode: 'DCA001' },
        { _id: 'adca', courseName: 'ADCA', courseCode: 'ADCA001' },
        { _id: 'tally', courseName: 'Tally-prime', courseCode: 'TALLY001' }
      ]);
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profileImage: file });
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.role === 'student' && !formData.course) {
      toast.error('Please select a course');
      return;
    }
    setLoading(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('phone', formData.phone);
    data.append('address', formData.address);
    data.append('dateOfBirth', formData.dateOfBirth);
    data.append('role', formData.role);
    data.append('course', formData.course);
    if (formData.role === 'student' && formData.course) {
      data.append('courseIds', formData.course);
    }
    if (formData.profileImage) {
      data.append('profileImage', formData.profileImage);
    }

    const result = await register(data);
    console.log(formData);
    if (result.success) {
      toast.success('Registration successful!');
      navigate(formData.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
    } else {
      toast.error(result.message || 'Registration failed');
    }
    setLoading(false);
  };

  const inputClass = "w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition";
  const labelClass = "flex items-center gap-2 text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="min-h-[calc(100vh-70px)] flex items-center justify-center px-5 py-10 bg-gradient-to-br from-indigo-500/10 to-purple-700/10">
      <div className="w-full max-w-2xl animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-lg p-10">

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
            <p className="text-sm text-gray-500">Join GV Computer Center today</p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* Profile Upload */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-28 h-28 rounded-full border-4 border-indigo-500 flex items-center justify-center overflow-hidden bg-gray-100 mb-4">
                {preview ? (
                  <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <FaUser className="text-5xl text-gray-400" />
                )}
              </div>
              <label
                htmlFor="profileImage"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg cursor-pointer transition duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <FaCamera /> Upload Photo
              </label>
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Row 1: Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelClass}>
                  <FaUser className="text-indigo-500" /> Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  className={inputClass}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <label className={labelClass}>
                  <FaEnvelope className="text-indigo-500" /> Email
                </label>
                <input
                  type="email"
                  name="email"
                  className={inputClass}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Row 2: Password & Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelClass}>
                  <FaLock className="text-indigo-500" /> Password
                </label>
                <input
                  type="password"
                  name="password"
                  className={inputClass}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create password"
                  minLength="6"
                  required
                />
              </div>
              <div>
                <label className={labelClass}>
                  <FaUserTag className="text-indigo-500" /> Role
                </label>
                <select
                  name="role"
                  className={inputClass}
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            {/* Course Selection */}
            {formData.role === 'student' && (
              <div className="mb-4">
                <label className={labelClass}>
                  <FaBook className="text-indigo-500" /> Select Course
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                <select
                  name="course"
                  className={inputClass}
                  value={formData.course}
                  onChange={handleChange}
                  required
                  disabled={loadingCourses}
                >
                  <option value="">
                    {loadingCourses ? 'Loading courses...' : '-- Select a course --'}
                  </option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id}>
                      {course.courseName} ({course.courseCode})
                    </option>
                  ))}
                </select>
                {loadingCourses && (
                  <small className="text-gray-400 text-xs mt-1 block">Loading available courses...</small>
                )}
              </div>
            )}

            {/* Row 3: Phone & DOB */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelClass}>
                  <FaPhone className="text-indigo-500" /> Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  className={inputClass}
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                />
              </div>
              <div>
                <label className={labelClass}>
                  <FaCalendar className="text-indigo-500" /> Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  className={inputClass}
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div className="mb-6">
              <label className={labelClass}>
                <FaHome className="text-indigo-500" /> Address
              </label>
              <textarea
                name="address"
                className={inputClass}
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
                rows="3"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200"
            >
              {loading ? 'Loading...' : <><FaUserPlus /> Register</>}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center pt-6 mt-2 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Already have an account?
              <Link to="/login" className="text-indigo-600 font-semibold ml-1 hover:underline">
                Login here
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;