/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AdminApplications = () => {
  const navigate = useNavigate();
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
    const token=localStorage.getItem('token')
    console.log("ssss",token);
    try {
      const response = await axios.get('/api/applications/admin/all',{
        headers: { Authorization: `Bearer ${token}` }
      
      });
      console.log("job",response.data);
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
      const response = await axios.put(`/api/applications/admin/${applicationId}/status`, {
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
        return 'bg-green-400 text-yellow-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      case 'shortlisted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'hired':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Job Applications</h1>
            <p className="text-gray-600 mt-1">Manage and review candidate applications</p>
          </div>
          <button
            onClick={() => navigate('/admin/jobs')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Jobs
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-gray-500">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
            <p className="text-sm text-gray-600">Reviewed</p>
            <p className="text-2xl font-bold text-blue-600">{stats.reviewed}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
            <p className="text-sm text-gray-600">Shortlisted</p>
            <p className="text-2xl font-bold text-green-600">{stats.shortlisted}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
            <p className="text-sm text-gray-600">Hired</p>
            <p className="text-2xl font-bold text-purple-600">{stats.hired}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
            <p className="text-sm text-gray-600">Rejected</p>
            <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'all'
                ? 'bg-gray-800 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Applications
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'pending'
                ? 'bg-yellow-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('reviewed')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'reviewed'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Reviewed
          </button>
          <button
            onClick={() => setFilter('shortlisted')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'shortlisted'
                ? 'bg-green-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Shortlisted
          </button>
          <button
            onClick={() => setFilter('hired')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'hired'
                ? 'bg-purple-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Hired
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'rejected'
                ? 'bg-red-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Rejected
          </button>
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-800 to-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Applicant</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Job Details</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Experience</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Applied On</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-lg">No applications found</p>
                      <p className="text-sm mt-1">Applications will appear here when candidates apply</p>
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app) => (
                    <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(app.status)}`}>
                          True
                          {/* {app.status.charAt(0).toUpperCase() + app.status.slice(1)} */}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{app.applicantName}</div>
                        <div className="text-sm text-gray-500">ID: {app.userId?._id?.slice(-6) || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{app.applicantEmail}</div>
                        <div className="text-sm text-gray-500">{app.applicantPhone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{app.jobId?.title || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{app.jobId?.company || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{app.jobId?.location || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{app.experience}</div>
                        <div className="text-sm text-gray-500">Exp. Salary: {app.expectedSalary || 'Not specified'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(app.appliedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-col space-y-2">
                          <select
                            value={app.status}
                            onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
                          >
                            {/* <option value="pending">Pending</option> */}
                            <option value="reviewed">Reviewed</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="hired">Hired</option>
                            <option value="rejected">Rejected</option>
                          </select>
                          <button
                            onClick={() => setSelectedApplication(app)}
                            className="text-indigo-600 hover:text-indigo-900 text-xs font-medium"
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Application Details</h2>
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Personal Information */}
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Personal Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-medium">{selectedApplication.applicantName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{selectedApplication.applicantEmail}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium">{selectedApplication.applicantPhone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">User ID</p>
                        <p className="font-medium">{selectedApplication.userId?._id || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Job Information */}
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Job Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Position</p>
                        <p className="font-medium">{selectedApplication.jobId?.title || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Company</p>
                        <p className="font-medium">{selectedApplication.jobId?.company || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-medium">{selectedApplication.jobId?.location || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Job Type</p>
                        <p className="font-medium">{selectedApplication.jobId?.jobType || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Professional Information</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Experience</p>
                        <p className="font-medium">{selectedApplication.experience}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Qualifications</p>
                        <p className="font-medium">{selectedApplication.qualifications}</p>
                      </div>
                      {selectedApplication.expectedSalary && (
                        <div>
                          <p className="text-sm text-gray-600">Expected Salary</p>
                          <p className="font-medium">{selectedApplication.expectedSalary}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Documents</h3>
                    <div>
                      <p className="text-sm text-gray-600">Resume</p>
                      <a 
                        href={selectedApplication.resume} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        View Resume
                      </a>
                    </div>
                    {selectedApplication.coverLetter && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600">Cover Letter</p>
                        <p className="mt-1 p-3 bg-gray-50 rounded-lg text-gray-700">
                          {selectedApplication.coverLetter}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Application Status */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Application Status</h3>
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadgeClass(selectedApplication.status)}`}>
                        {selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}
                      </span>
                      <p className="text-sm text-gray-500">
                        Applied: {formatDate(selectedApplication.appliedAt)}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={() => setSelectedApplication(null)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
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