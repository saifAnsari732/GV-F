"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import api from '../../../services/api';

export default function PayFeesPage() {
  const [coursesList, setCoursesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [amount, setAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [myRequests, setMyRequests] = useState([]);
  const fileRef = useRef(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const meRes = await api.get('/api/auth/me');
      const studentId = meRes.data.data._id;
      
      const feeRes = await api.get(`/api/fees/student/${studentId}`);
      const feeData = feeRes.data.data || [];
      
      const coursesRes = await api.get('/api/courses');
      const allCourses = coursesRes.data.data || [];
      
      // Merge all courses and fee data
      const mergedCourses = allCourses.map(c => {
        const matchingFee = feeData.find(f => f.course?._id === c._id);
        return {
          courseId: c._id,
          courseName: c.courseName || 'Course',
          pendingAmount: matchingFee ? matchingFee.pendingAmount : (c.fees || 0),
          hasFeeRecord: !!matchingFee,
          feeId: matchingFee?._id || null
        };
      });
      setCoursesList(mergedCourses);

      // Collect all payment requests
      const allReqs = [];
      feeData.forEach(f => {
        (f.paymentRequests || []).forEach(r => {
          allReqs.push({ ...r, courseName: f.course?.courseName || 'Course', feeId: f._id });
        });
      });
      setMyRequests(allReqs.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)));
    } catch (err) {
      if (err.response?.status !== 404) toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleScreenshot = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please upload an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('File must be under 5MB'); return; }
    setScreenshot(file);
    const reader = new FileReader();
    reader.onloadend = () => setScreenshotPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourse) { toast.error('Please select a course'); return; }
    if (!amount || Number(amount) <= 0) { toast.error('Please enter a valid amount'); return; }
    if (!screenshot) { toast.error('Please upload a payment screenshot'); return; }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('amount', amount);
      fd.append('transactionId', transactionId);
      fd.append('screenshot', screenshot);
      
      await api.post(`/api/fees/course/${selectedCourse.courseId}/payment-request`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setSubmitted(true);
      toast.success('Payment request submitted! Admin will verify and update your record.');
      setTimeout(() => { setSubmitted(false); setAmount(''); setTransactionId(''); setScreenshot(null); setScreenshotPreview(null); setSelectedCourse(null); fetchData(); }, 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(n || 0);

  const statusConfig = {
    pending: { cls: 'bg-amber-100 text-amber-700 border border-amber-200', label: '⏳ Pending Verification' },
    approved: { cls: 'bg-emerald-100 text-emerald-700 border border-emerald-200', label: '✅ Approved' },
    rejected: { cls: 'bg-red-100 text-red-700 border border-red-200', label: '❌ Rejected' },
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-cyan-200 border-t-cyan-500 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-3xl">📲</span>
              <h1 className="text-2xl font-extrabold">Pay Fees via QR</h1>
            </div>
            <p className="text-indigo-200 text-sm">Scan QR code, pay, upload screenshot — Admin will verify and update your record.</p>
          </div>
        </div>

        {/* QR Code Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 text-sm">1</span>
            Scan & Pay
          </h2>
          <div className="flex flex-col items-center gap-4">
            {/* QR Code */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-52 h-52 border-4 border-dashed border-indigo-300 rounded-2xl flex items-center justify-center bg-white p-2 shadow-sm">
                <img
                  src="/qr-code.jpeg"
                  alt="Payment QR Code"
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
              <a 
                href="/qr-code.jpeg" 
                download="GV_Computer_QR.jpeg" 
                className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-full transition-colors"
              >
                <span>⬇️</span> Download QR Code
              </a>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-gray-700">GV Computer Center</p>
              <p className="text-xs text-gray-500">Google Pay / PhonePe / Paytm / UPI</p>
              <p className="text-xs text-indigo-600 font-mono mt-1 font-bold">UPI ID: 9905234866@fam</p>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
            <span className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 text-sm">2</span>
            Submit Payment Details
          </h2>

          {submitted ? (
            <div className="text-center py-10">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-emerald-600 mb-2">Request Submitted!</h3>
              <p className="text-gray-500 text-sm">Admin will verify your payment and update your record within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Course Select */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Course *</label>
                <div className="grid gap-2">
                  {coursesList.length === 0 ? (
                    <p className="text-gray-500 text-sm py-3 text-center bg-gray-50 rounded-xl">No courses found. Contact admin.</p>
                  ) : coursesList.map(course => (
                    <button
                      type="button"
                      key={course.courseId}
                      onClick={() => { setSelectedCourse(course); setAmount(String(course.pendingAmount || '')); }}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all duration-200 ${selectedCourse?.courseId === course.courseId ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300 bg-gray-50'}`}
                    >
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{course.courseName}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Pending: <span className="text-red-500 font-bold">{fmt(course.pendingAmount)}</span></p>
                      </div>
                      {selectedCourse?.courseId === course.courseId && <span className="text-indigo-600 text-lg">✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Amount Paid (₹) *</label>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="Enter amount you paid"
                  min="1"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800 text-base"
                  required
                />
              </div>

              {/* Transaction ID */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Transaction ID (Optional)</label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={e => setTransactionId(e.target.value)}
                  placeholder="UPI transaction reference number"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-700 text-sm"
                />
              </div>

              {/* Screenshot Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Screenshot *</label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className={`cursor-pointer border-2 border-dashed rounded-2xl p-5 text-center transition-all duration-200 ${screenshotPreview ? 'border-emerald-400 bg-emerald-50' : 'border-indigo-300 bg-indigo-50/50 hover:border-indigo-500 hover:bg-indigo-50'}`}
                >
                  {screenshotPreview ? (
                    <div className="space-y-3">
                      <img src={screenshotPreview} alt="Preview" className="w-40 h-40 object-cover rounded-xl mx-auto shadow-md" />
                      <p className="text-xs text-emerald-600 font-semibold">✓ Screenshot selected — Click to change</p>
                    </div>
                  ) : (
                    <div>
                      <span className="text-4xl block mb-2">📸</span>
                      <p className="text-sm font-semibold text-indigo-600">Click to upload screenshot</p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — Max 5MB</p>
                    </div>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleScreenshot} className="hidden" />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || !screenshot || !amount || !selectedCourse}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed text-base"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </span>
                ) : '🚀 Submit Payment Request'}
              </button>
            </form>
          )}
        </div>

        {/* My Requests History */}
        {myRequests.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-xl">📋</span> My Payment Requests
            </h2>
            <div className="space-y-3">
              {myRequests.map(req => (
                <div key={req._id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-3">
                    {req.screenshotUrl && (
                      <img src={req.screenshotUrl} alt="ss" className="w-10 h-10 rounded-lg object-cover border border-gray-200 cursor-pointer" onClick={() => window.open(req.screenshotUrl, '_blank')} />
                    )}
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">₹{req.amount?.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{req.courseName} • {new Date(req.submittedAt).toLocaleDateString('en-IN')}</p>
                      {req.adminNote && <p className="text-xs text-gray-400 italic mt-0.5">"{req.adminNote}"</p>}
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig[req.status]?.cls}`}>
                    {statusConfig[req.status]?.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center">
          <Link href="/student/fees" className="text-indigo-600 text-sm hover:underline">← Back to Fee Details</Link>
        </div>
      </div>
    </div>
  );
}
