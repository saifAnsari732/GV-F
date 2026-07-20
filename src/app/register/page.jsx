"use client";
import Link from "next/link";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaHome, FaCalendar, FaUserPlus, FaBook, FaGraduationCap } from 'react-icons/fa';
import api from '../../services/api';

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
  const navigate = useRouter();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoadingCourses(true);
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/api/courses', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
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
    if (result.success) {
      toast.success('Registration successful!');
      navigate.push('/login');
    } else {
      toast.error(result.message || 'Registration failed');
    }
    setLoading(false);
  };

  const inputClass = "w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all";
  const labelClass = "flex items-center gap-2 text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide";

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans selection:bg-cyan-500/30 pt-16">
      
      {/* ── LEFT: Branding Section ── */}
      <div className="hidden lg:flex w-1/3 xl:w-2/5 relative bg-gray-50 border-r border-gray-200 overflow-hidden flex-col items-center justify-center p-12 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 to-blue-900/10 mix-blend-overlay z-10" />
        <div className="absolute inset-0 bg-[url('/uploads/hero-pattern.svg')] opacity-10" />
        
        <div className="relative z-20 flex flex-col items-center">
          {/* Large GV Logo */}
          <div className="mb-6 rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-white p-2 w-48 h-auto transition-transform duration-300 hover:scale-105">
            <img src="/gv-logo.jpg" alt="GV Logo" className="w-full h-auto object-contain rounded-xl" />
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 mb-4 leading-tight">Start Your Journey</h2>

          <p className="text-sm text-gray-600 leading-relaxed mb-8 max-w-xs">
            Join our community of learners and transform your career with industry-relevant skills.
          </p>
          
          <div className="flex flex-col gap-4 w-full max-w-xs text-left">
            <div className="flex items-center gap-4 bg-white/70 backdrop-blur border border-gray-200/50 p-3.5 rounded-xl shadow-sm">
              <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0">
                <FaBook className="text-cyan-600" />
              </div>
              <div>
                <h4 className="text-gray-900 font-bold text-sm">Expert Courses</h4>
                <p className="text-gray-500 text-xs">Learn from the best in the industry</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white/70 backdrop-blur border border-gray-200/50 p-3.5 rounded-xl shadow-sm">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                <FaUserPlus className="text-blue-600" />
              </div>
              <div>
                <h4 className="text-gray-900 font-bold text-sm">Placement Support</h4>
                <p className="text-gray-500 text-xs">100% job assistance guaranteed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT: Form Section ── */}
      <div className="w-full lg:w-2/3 xl:w-3/5 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
        <div className="w-full max-w-2xl bg-gray-50/80 backdrop-blur-xl rounded-3xl border border-gray-200 p-8 sm:p-10 my-auto shadow-2xl">
          
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-600">Fill in your details below to get started.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}><FaUser className="text-cyan-500" /> Full Name</label>
                <input type="text" name="name" className={inputClass} value={formData.name} onChange={handleChange} placeholder="John Doe" required />
              </div>
              <div>
                <label className={labelClass}><FaEnvelope className="text-cyan-500" /> Email</label>
                <input type="email" name="email" className={inputClass} value={formData.email} onChange={handleChange} placeholder="john@example.com" required />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}><FaLock className="text-cyan-500" /> Password</label>
                <input type="password" name="password" className={inputClass} value={formData.password} onChange={handleChange} placeholder="••••••••" minLength="6" required />
              </div>
              <div>
                <label className={labelClass}>
                  <FaBook className="text-cyan-500" /> Select Course
                </label>
                <select name="course" className={inputClass} value={formData.course} onChange={handleChange} required disabled={loadingCourses}>
                  <option value="" className="bg-gray-50">{loadingCourses ? 'Loading courses...' : 'Select a course'}</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id} className="bg-gray-50">
                      {course.courseName} ({course.courseCode})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}><FaPhone className="text-cyan-500" /> Phone Number</label>
                <input type="tel" name="phone" className={inputClass} value={formData.phone} onChange={handleChange} placeholder="+91 9876543210" required />
              </div>
              <div>
                <label className={labelClass}><FaCalendar className="text-cyan-500" /> Date of Birth</label>
                <input type="date" name="dateOfBirth" className={`${inputClass} [color-scheme:dark]`} value={formData.dateOfBirth} onChange={handleChange} required />
              </div>
            </div>

            <div>
              <label className={labelClass}><FaHome className="text-cyan-500" /> Address</label>
              <textarea name="address" className={inputClass} value={formData.address} onChange={handleChange} placeholder="Full address details..." rows="2" required />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:shadow-cyan-500/40 hover:-translate-y-0.5 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><FaUserPlus /> Create Account</>}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-8">
            Already have an account?{' '}
            <Link href="/login" className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors">
              Sign in here
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;