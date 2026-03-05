import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

const ApplyModal = ({ job, user, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    applicantName: user?.name || '',
    applicantEmail: user?.email || '',
    applicantPhone: '',
    coverLetter: '',
    experience: '',
    qualifications: '',
    expectedSalary: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.applicantName.trim()) newErrors.applicantName = 'Name is required';
    if (!formData.applicantEmail.trim()) {
      newErrors.applicantEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.applicantEmail)) {
      newErrors.applicantEmail = 'Email is invalid';
    }
    if (!formData.applicantPhone.trim()) newErrors.applicantPhone = 'Phone number is required';
    // if (!formData.resume.trim()) newErrors.resume = 'Resume link is required';
    if (!formData.experience.trim()) newErrors.experience = 'Experience details are required';
    if (!formData.qualifications.trim()) newErrors.qualifications = 'Qualifications are required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/api/applications/apply', {
        jobId: job._id,
        ...formData
      });
      if (response.data.success) {
        // toast.success('Application submitted successfully!');
        onSuccess();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:bg-white transition ${
      errors[field]
        ? 'border-red-400 focus:ring-red-300'
        : 'border-gray-200 focus:ring-indigo-300 focus:border-indigo-400'
    }`;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center rounded-t-2xl z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Apply for <span className="text-indigo-600">{job.title}</span></h2>
            <p className="text-xs text-gray-400 mt-0.5">{job.company} · {job.location}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 text-xl font-bold transition"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {/* Job Summary Banner */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl px-4 py-3 mb-6 flex items-center justify-between flex-wrap gap-2">
            <div>
              <p className="text-sm font-semibold text-indigo-700">{job.company}</p>
              <p className="text-xs text-gray-500">{job.location}</p>
            </div>
            <span className="text-xs bg-indigo-100 text-indigo-700 font-semibold px-3 py-1 rounded-full">
              💰 {job.salary}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  name="applicantName"
                  value={formData.applicantName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className={inputClass('applicantName')}
                />
                {errors.applicantName && <p className="text-red-500 text-xs mt-1">{errors.applicantName}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address <span className="text-red-400">*</span></label>
                <input
                  type="email"
                  name="applicantEmail"
                  value={formData.applicantEmail}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className={inputClass('applicantEmail')}
                />
                {errors.applicantEmail && <p className="text-red-500 text-xs mt-1">{errors.applicantEmail}</p>}
              </div>
            </div>

            {/* Phone & Expected Salary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone Number <span className="text-red-400">*</span></label>
                <input
                  type="tel"
                  name="applicantPhone"
                  value={formData.applicantPhone}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                  className={inputClass('applicantPhone')}
                />
                {errors.applicantPhone && <p className="text-red-500 text-xs mt-1">{errors.applicantPhone}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Expected Salary <span className="text-gray-400 font-normal">(Optional)</span></label>
                <input
                  type="text"
                  name="expectedSalary"
                  value={formData.expectedSalary}
                  onChange={handleChange}
                  placeholder="e.g. ₹5,000 - ₹7,000"
                  className={inputClass('expectedSalary')}
                />
              </div>
            </div>

            {/* ✅ RESUME FIELD - this was missing, causing validation to always fail */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Resume Link <span className="text-red-400">*</span></label>
              <input
                type="text"
                name="resume"
                value={formData.resume}
                onChange={handleChange}
                placeholder="Paste Google Drive / LinkedIn / portfolio link"
                className={inputClass('resume')}
              />
              {errors.resume && <p className="text-red-500 text-xs mt-1">{errors.resume}</p>}
            </div>

            {/* Cover Letter */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Cover Letter <span className="text-gray-400 font-normal">(Optional)</span></label>
              <textarea
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleChange}
                rows="2"
                placeholder="Write a brief cover letter..."
                className={inputClass('coverLetter')}
              />
            </div>

            {/* Experience */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Work Experience <span className="text-red-400">*</span></label>
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                rows="3"
                placeholder="Describe your relevant work experience..."
                className={inputClass('experience')}
              />
              {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience}</p>}
            </div>

            {/* Qualifications */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Qualifications <span className="text-red-400">*</span></label>
              <textarea
                name="qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                rows="3"
                placeholder="List your educational qualifications and certifications..."
                className={inputClass('qualifications')}
              />
              {errors.qualifications && <p className="text-red-500 text-xs mt-1">{errors.qualifications}</p>}
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Submitting...
                  </span>
                ) : '🚀 Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyModal;