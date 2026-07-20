"use client";
import Link from "next/link";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaEnvelope, FaLock, FaSignInAlt, FaGraduationCap } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData.email, formData.password);
    if (result.success) {
      toast.success('Login successful!');
      if (result.user.role === 'admin') {
        navigate.push('/admin/dashboard');
      } else {
        navigate.push('/student/dashboard');
      }
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans selection:bg-cyan-500/30 pt-16">
      
      {/* ── LEFT: Form Section ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative z-10">
        
        {/* Glow behind form */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md bg-gray-50/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 p-8 sm:p-10 relative">
          
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/20">
              <FaGraduationCap className="text-3xl text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to continue your learning journey.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FaEnvelope className="text-cyan-500" /> Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="student@example.com"
                required
                className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FaLock className="text-cyan-500" /> Password
                </label>
                <Link href="#" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">Forgot password?</Link>
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:shadow-cyan-500/40 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><FaSignInAlt /> Sign In</>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-8">
            Don't have an account?{' '}
            <Link href="/register" className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors">
              Create one now
            </Link>
          </p>
        </div>
      </div>

      {/* ── RIGHT: Image/Branding Section ── */}
      <div className="hidden lg:flex w-1/2 relative bg-gray-50 border-l border-gray-200 overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-cyan-900/10 mix-blend-overlay z-10" />
        <div className="absolute inset-0 bg-[url('/uploads/hero-pattern.svg')] opacity-10" />
        
        <div className="relative z-20 max-w-lg text-center flex flex-col items-center">
          {/* Large GV Logo */}
          <div className="mb-6 rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-white p-2 w-48 h-auto transition-transform duration-300 hover:scale-105">
            <img src="/gv-logo.jpg" alt="GV Logo" className="w-full h-auto object-contain rounded-xl" />
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 mb-4 leading-tight">
            Empower Your Future with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">GV Computer Center</span>
          </h2>

          <p className="text-base text-gray-700 leading-relaxed max-w-sm">
            Access world-class computer education, track your progress, and take the next step in your career journey.
          </p>
          
          <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-sm">
            <div className="bg-white/70 backdrop-blur border border-gray-200/50 p-3 rounded-2xl shadow-sm">
              <h4 className="text-cyan-600 font-extrabold text-xl mb-0.5">10k+</h4>
              <p className="text-gray-500 text-xs font-semibold">Students Enrolled</p>
            </div>
            <div className="bg-white/70 backdrop-blur border border-gray-200/50 p-3 rounded-2xl shadow-sm">
              <h4 className="text-blue-600 font-extrabold text-xl mb-0.5">98%</h4>
              <p className="text-gray-500 text-xs font-semibold">Placement Rate</p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Login;