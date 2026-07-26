"use client";
import React, { useState } from 'react';
import { FaTimes, FaPaperPlane, FaUser, FaPhoneAlt, FaGraduationCap, FaMapMarkerAlt } from 'react-icons/fa';
import api from '../services/api';
import { toast } from 'react-toastify';

const EnquiryModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    course: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Validations
    if (formData.name.trim().length < 3) {
      toast.error('Name must be at least 3 characters long');
      setLoading(false);
      return;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      setLoading(false);
      return;
    }
    if (formData.address.trim().length < 10) {
      toast.error('Please enter a complete address (min 10 characters)');
      setLoading(false);
      return;
    }

    try {
      const res = await api.post('/api/enquiries', formData);
      if (res.data.success) {
        toast.success("Enquiry submitted! We'll contact you soon.");
        setFormData({ name: '', phone: '', course: '', address: '' });
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit enquiry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-700 to-indigo-800 p-6 text-white text-center">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <FaTimes />
          </button>
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm shadow-inner">
            <FaGraduationCap className="text-3xl text-blue-100" />
          </div>
          <h2 className="text-2xl font-bold font-['Syne',sans-serif]">Student Enquiry</h2>
          <p className="text-blue-100 text-sm mt-1">Fill the form below and we will get back to you.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Full Name</label>
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Phone Number</label>
            <div className="relative">
              <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                required
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Course of Interest</label>
            <div className="relative">
              <FaGraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <select 
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-sm appearance-none cursor-pointer"
              >
                <option value="">Select a course</option>
                <option value="DCA">DCA - Diploma in Computer Application</option>
                <option value="ADCA">ADCA - Advance Diploma in Computer Application</option>
                <option value="Tally">Tally Prime with GST</option>
                <option value="CCC">CCC</option>
                <option value="O-Level">O-Level</option>
                <option value="Typing">Typing (Hindi/English)</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Address</label>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-4 top-3 text-gray-400" />
              <textarea 
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Your full address"
                required
                rows="2"
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-sm resize-none"
              ></textarea>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><FaPaperPlane /> Submit Enquiry</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EnquiryModal;
