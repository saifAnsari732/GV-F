"use client";
import Link from "next/link";
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

const AdminApplications = () => {
  const navigate = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewed: 0,
    shortlisted: 0,
    rejected: 0,
    hired: 0
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await api.get('/api/applications/admin/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setApplications(response.data.data);
        calculateStats(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch applications');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (apps) => {
    const newStats = {
      total: apps.length,
      pending: apps.filter(app => app.status === 'pending').length,
      reviewed: apps.filter(app => app.status === 'reviewed').length,
      shortlisted: apps.filter(app => app.status === 'shortlisted').length,
      rejected: apps.filter(app => app.status === 'rejected').length,
      hired: apps.filter(app => app.status === 'hired').length
    };
    setStats(newStats);
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      const response = await api.put(`/api/applications/admin/${applicationId}/status`, {
        status: newStatus
      });
      
      if (response.data.success) {
        toast.success(`Application ${newStatus} successfully`);
        fetchApplications(); // Refresh the list
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200/60';
      case 'reviewed':
        return 'bg-blue-50 text-blue-700 border-blue-200/60';
      case 'shortlisted':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
      case 'rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200/60';
      case 'hired':
        return 'bg-purple-50 text-purple-700 border-purple-200/60';
      default:
        return 'bg-gray-50 text-gray-500 border-gray-200';
    }
  };

  const filteredApplications = filter === 'all' 
    ? applications 
    : applications.filter(app => app.status === filter);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const BG_MESH = (
    <>
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: 'radial-gradient(ellipse at 10% 15%,rgba(6,182,212,0.05) 0%,transparent 50%),radial-gradient(ellipse at 90% 80%,rgba(124,58,237,0.05) 0%,transparent 50%)'
      }} />
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.015) 1px,transparent 1px)',
        backgroundSize: '64px 64px'
      }} />
    </>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        {BG_MESH}
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pt-24 px-12 pb-12 max-md:px-4 font-['Space_Grotesk',sans-serif] text-gray-900">
      {BG_MESH}
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <span className="block text-[11px] font-bold tracking-[2.5px] uppercase text-cyan-600 mb-1.5 font-sans">Placement Portal</span>
            <h1 className="font-['Syne',sans-serif] text-3xl font-extrabold leading-tight text-gray-900">Job Applications</h1>
            <p className="text-gray-500 mt-1 text-sm font-medium">Manage and review candidate applications</p>
          </div>
          <button
            onClick={() => navigate.push('/createjob')}
            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold px-6 py-3 rounded-xl shadow-sm transition-all flex items-center gap-2 max-md:w-full justify-center"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Jobs
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: 'Total', count: stats.total, color: 'border-gray-500', text: 'text-gray-800' },
            { label: 'Pending', count: stats.pending, color: 'border-amber-500', text: 'text-amber-700' },
            { label: 'Reviewed', count: stats.reviewed, color: 'border-blue-500', text: 'text-blue-700' },
            { label: 'Shortlisted', count: stats.shortlisted, color: 'border-emerald-500', text: 'text-emerald-700' },
            { label: 'Hired', count: stats.hired, color: 'border-purple-500', text: 'text-purple-700' },
            { label: 'Rejected', count: stats.rejected, color: 'border-rose-500', text: 'text-rose-700' }
          ].map((s, i) => (
            <div key={i} className={`bg-white rounded-2xl shadow-sm p-4 border-l-4 ${s.color} border border-gray-200/60`}>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{s.label}</p>
              <p className={`text-2xl font-extrabold font-['Syne',sans-serif] mt-1 ${s.text}`}>{s.count}</p>
            </div>
          ))}
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-6 bg-white border border-gray-200/80 p-2 rounded-2xl shadow-sm">
          {[
            { id: 'all', label: 'All Applications', activeClass: 'bg-cyan-50 border-cyan-200 text-cyan-700' },
            { id: 'pending', label: 'Pending', activeClass: 'bg-amber-50 border-amber-200 text-amber-700' },
            { id: 'reviewed', label: 'Reviewed', activeClass: 'bg-blue-50 border-blue-200 text-blue-700' },
            { id: 'shortlisted', label: 'Shortlisted', activeClass: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
            { id: 'hired', label: 'Hired', activeClass: 'bg-purple-50 border-purple-200 text-purple-700' },
            { id: 'rejected', label: 'Rejected', activeClass: 'bg-rose-50 border-rose-200 text-rose-700' }
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                filter === btn.id
                  ? `${btn.activeClass} shadow-sm`
                  : 'bg-transparent border-transparent text-gray-500 hover:bg-gray-155 hover:bg-gray-50'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Status','Applicant','Contact','Job Details','Experience','Applied On','Actions'].map(h => (
                    <th key={h} className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-400">
                      <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-base font-bold text-gray-600">No applications found</p>
                      <p className="text-xs text-gray-400 font-medium mt-1">Applications will appear here when candidates apply</p>
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app) => (
                    <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-0.5 inline-flex text-xs leading-5 font-bold rounded-full border ${getStatusBadgeClass(app.status)}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-900">{app.applicantName}</div>
                        <div className="text-xs text-gray-400 font-medium">ID: {app.userId?._id?.slice(-6) || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-gray-600">
                        <div>{app.applicantEmail}</div>
                        <div className="text-[11px] text-gray-400 mt-0.5">{app.applicantPhone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-900">{app.jobId?.title || 'N/A'}</div>
                        <div className="text-xs text-gray-500 font-semibold">{app.jobId?.company || 'N/A'} — {app.jobId?.location || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-gray-600">
                        <div>{app.experience}</div>
                        <div className="text-[11px] text-gray-400 mt-0.5">Exp. Salary: {app.expectedSalary || 'Not specified'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400 font-bold">
                        {formatDate(app.appliedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-col space-y-2">
                          <select
                            value={app.status}
                            onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                            className="text-xs border border-gray-200 rounded-xl px-2 py-1 focus:outline-none focus:border-cyan-500 bg-gray-50 cursor-pointer text-gray-700 font-bold"
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="hired">Hired</option>
                            <option value="rejected">Rejected</option>
                          </select>
                          <button
                            onClick={() => setSelectedApplication(app)}
                            className="text-cyan-600 hover:text-cyan-800 text-xs font-bold text-left px-2"
                          >
                            View Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Application Details Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                  <h2 className="font-['Syne',sans-serif] text-xl font-extrabold text-gray-900">Application Details</h2>
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="w-8 h-8 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg text-lg cursor-pointer text-gray-400 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 font-bold"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Personal Information */}
                  <div className="border-b border-gray-100 pb-4">
                    <h3 className="font-['Syne',sans-serif] text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Personal Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm font-semibold">
                      <div>
                        <p className="text-xs text-gray-400 uppercase">Name</p>
                        <p className="text-gray-900 font-bold mt-0.5">{selectedApplication.applicantName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase">Email</p>
                        <p className="text-gray-900 font-bold mt-0.5">{selectedApplication.applicantEmail}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase">Phone</p>
                        <p className="text-gray-900 font-bold mt-0.5">{selectedApplication.applicantPhone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase">User ID</p>
                        <p className="text-gray-900 font-bold mt-0.5">{selectedApplication.userId?._id || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Job Information */}
                  <div className="border-b border-gray-100 pb-4">
                    <h3 className="font-['Syne',sans-serif] text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Job Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm font-semibold">
                      <div>
                        <p className="text-xs text-gray-400 uppercase">Position</p>
                        <p className="text-gray-900 font-bold mt-0.5">{selectedApplication.jobId?.title || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase">Company</p>
                        <p className="text-gray-900 font-bold mt-0.5">{selectedApplication.jobId?.company || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase">Location</p>
                        <p className="text-gray-900 font-bold mt-0.5">{selectedApplication.jobId?.location || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase">Job Type</p>
                        <p className="text-gray-900 font-bold mt-0.5">{selectedApplication.jobId?.jobType || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="border-b border-gray-100 pb-4">
                    <h3 className="font-['Syne',sans-serif] text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Professional Information</h3>
                    <div className="space-y-3 text-sm font-semibold">
                      <div>
                        <p className="text-xs text-gray-400 uppercase">Experience</p>
                        <p className="text-gray-900 font-bold mt-0.5">{selectedApplication.experience}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase">Qualifications</p>
                        <p className="text-gray-900 font-bold mt-0.5">{selectedApplication.qualifications}</p>
                      </div>
                      {selectedApplication.expectedSalary && (
                        <div>
                          <p className="text-xs text-gray-400 uppercase">Expected Salary</p>
                          <p className="text-gray-900 font-bold mt-0.5">{selectedApplication.expectedSalary}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="border-b border-gray-100 pb-4">
                    <h3 className="font-['Syne',sans-serif] text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Documents</h3>
                    <div>
                      <p className="text-xs text-gray-400 uppercase mb-1">Resume</p>
                      <Link 
                        href={selectedApplication.resume} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-cyan-600 hover:text-cyan-800 font-bold inline-flex items-center gap-2 bg-cyan-50 border border-cyan-200 px-4 py-2 rounded-xl text-xs"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        View Resume
                      </Link>
                    </div>
                    {selectedApplication.coverLetter && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-400 uppercase mb-1">Cover Letter</p>
                        <p className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 text-sm font-semibold leading-relaxed">
                          {selectedApplication.coverLetter}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Application Status */}
                  <div>
                    <h3 className="font-['Syne',sans-serif] text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Application Status</h3>
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-0.5 inline-flex text-xs leading-5 font-bold rounded-full border ${getStatusBadgeClass(selectedApplication.status)}`}>
                        {selectedApplication.status}
                      </span>
                      <p className="text-xs text-gray-400 font-bold">
                        Applied: {formatDate(selectedApplication.appliedAt)}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button
                      onClick={() => setSelectedApplication(null)}
                      className="px-6 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-600 font-bold text-sm hover:bg-gray-200/80"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminApplications;