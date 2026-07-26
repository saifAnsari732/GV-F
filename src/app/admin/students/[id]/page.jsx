"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaGraduationCap, FaArrowLeft, FaMoneyBillWave } from 'react-icons/fa';
import api from '../../../../services/api';
import { toast } from 'react-toastify';

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useRouter();
  
  const [student, setStudent] = useState(null);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentData();
  }, [id]);

  const fetchStudentData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch Student Details
      const studentRes = await api.get(`/api/students/${id}`, { headers });
      if (studentRes.data.success) {
        setStudent(studentRes.data.data);
      }

      // Fetch Student Fees
      try {
        const feesRes = await api.get(`/api/fees/student/${id}`, { headers });
        if (feesRes.data.success && feesRes.data.data) {
          setFees(Array.isArray(feesRes.data.data) ? feesRes.data.data : [feesRes.data.data]);
        }
      } catch (feeErr) {
        if (feeErr.response?.status !== 404) {
          console.error("Failed to fetch fees", feeErr);
        }
      }
    } catch (err) {
      toast.error('Failed to load student details');
      navigate.push('/admin/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name = '') => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!student) return null;

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans text-gray-900 pt-24 pb-20 px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate.back()} 
            className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-600 hover:text-cyan-600 hover:border-cyan-200 hover:shadow-sm transition-all"
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Student Details</h1>
            <p className="text-sm text-gray-500">View and manage student profile and records</p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start">
          <div className="shrink-0 flex flex-col items-center">
            {student.profileImage && student.profileImage !== 'default-avatar.jpg' ? (
              <img src={student.profileImage} alt={student.name} className="w-32 h-32 rounded-2xl object-cover shadow-lg border border-gray-100" />
            ) : (
              <div className="w-32 h-32 rounded-2xl flex items-center justify-center text-4xl font-bold text-white shadow-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                {getInitials(student.name)}
              </div>
            )}
            <span className={`mt-4 px-3 py-1 rounded-full text-xs font-bold ${student.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
              {student.isActive ? 'Active Student' : 'Inactive'}
            </span>
          </div>

          <div className="flex-1 w-full">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{student.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mt-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><FaEnvelope /></div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Email Address</p>
                  <p className="text-sm font-semibold text-gray-800">{student.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-green-50 text-green-600 flex items-center justify-center"><FaPhone /></div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Phone Number</p>
                  <p className="text-sm font-semibold text-gray-800">{student.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center"><FaCalendarAlt /></div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Date of Birth</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center"><FaCalendarAlt /></div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Joined Date</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {new Date(student.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:col-span-2">
                <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0"><FaMapMarkerAlt /></div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Address</p>
                  <p className="text-sm font-semibold text-gray-800">{student.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enrolled Courses & Fee Records */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Courses */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <FaGraduationCap className="text-indigo-600 text-xl" />
              <h3 className="text-lg font-bold text-gray-900">Enrolled Courses</h3>
            </div>
            <div className="space-y-4">
              {student.courseNames?.length > 0 ? student.courseNames.map((enr, i) => (
                <div key={i} className="flex justify-between items-center p-4 rounded-xl border border-gray-100 bg-gray-50">
                  <div>
                    <h4 className="font-bold text-gray-800">{enr.course?.courseName || 'Unknown Course'}</h4>
                    <p className="text-xs text-gray-500 mt-1">Code: {enr.course?.courseCode || 'N/A'}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${enr.status === 'active' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-200 text-gray-600'}`}>
                    {enr.status}
                  </span>
                </div>
              )) : (
                <p className="text-sm text-gray-500 text-center py-6">No courses enrolled yet.</p>
              )}
            </div>
          </div>

          {/* Fees */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <FaMoneyBillWave className="text-emerald-600 text-xl" />
              <h3 className="text-lg font-bold text-gray-900">Fee Records</h3>
            </div>
            <div className="space-y-4">
              {fees.length > 0 ? fees.map((fee) => (
                <div key={fee._id} className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-gray-800 text-sm">{fee.course?.courseName || 'Course Fee'}</h4>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      fee.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 
                      fee.status === 'partial' ? 'bg-amber-100 text-amber-700' : 
                      'bg-red-100 text-red-700'
                    }`}>
                      {fee.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center bg-white border border-gray-100 p-2 rounded-lg">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Total</p>
                      <p className="text-sm font-bold text-gray-700">{formatCurrency(fee.totalFees)}</p>
                    </div>
                    <div className="text-center bg-white border border-gray-100 p-2 rounded-lg">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Paid</p>
                      <p className="text-sm font-bold text-emerald-600">{formatCurrency(fee.paidAmount)}</p>
                    </div>
                    <div className="text-center bg-white border border-gray-100 p-2 rounded-lg">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Pending</p>
                      <p className="text-sm font-bold text-red-600">{formatCurrency(fee.pendingAmount)}</p>
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-gray-500 text-center py-6">No fee records found.</p>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default StudentDetails;
