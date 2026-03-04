import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

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
    console.log(result);
    if (result.success) {
      toast.success('Login successful!');
      if (result.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-70px)] flex items-center justify-center px-5 py-10 bg-gradient-to-br from-indigo-500/10 to-purple-700/10">
      <div className="w-full max-w-md animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-lg p-10">

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-sm text-gray-500">Login to access your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="mb-4">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <FaEnvelope className="text-indigo-500" /> Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
              />
            </div>

            <div className="mb-4">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <FaLock className="text-indigo-500" /> Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200"
            >
              {loading ? (
                'Loading...'
              ) : (
                <>
                  <FaSignInAlt /> Login
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Don't have an account?
              <Link to="/register" className="text-indigo-600 font-semibold ml-1 hover:underline">
                Register here
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;