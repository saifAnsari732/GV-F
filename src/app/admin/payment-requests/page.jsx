"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../../services/api';

export default function PaymentRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectNote, setRejectNote] = useState('');

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/api/fees/payment-requests');
      setRequests(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load payment requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (req) => {
    setProcessing(req.requestId);
    try {
      await api.put(`/api/fees/${req.feeId}/payment-request/${req.requestId}/approve`, {
        adminNote: 'Payment verified and approved'
      });
      toast.success(`✅ ₹${req.amount?.toLocaleString()} approved for ${req.student?.name}`);
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Approval failed');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async () => {
    if (!rejectModal) return;
    setProcessing(rejectModal.requestId);
    try {
      await api.put(`/api/fees/${rejectModal.feeId}/payment-request/${rejectModal.requestId}/reject`, {
        adminNote: rejectNote || 'Payment rejected by admin'
      });
      toast.error(`❌ Request rejected for ${rejectModal.student?.name}`);
      setRejectModal(null);
      setRejectNote('');
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Rejection failed');
    } finally {
      setProcessing(null);
    }
  };

  const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(n || 0);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-500">Loading payment requests...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-6 text-white mb-8 relative overflow-hidden shadow-xl">
          <div className="absolute -top-8 -right-8 w-36 h-36 bg-white/10 rounded-full" />
          <div className="relative z-10">
            <h1 className="text-2xl font-extrabold mb-1 flex items-center gap-3">
              <span className="text-3xl">💳</span> Payment Requests
            </h1>
            <p className="text-indigo-200 text-sm">
              {requests.length} pending request{requests.length !== 1 ? 's' : ''} — verify screenshot and approve or reject
            </p>
          </div>
        </div>

        {requests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
            <span className="text-6xl block mb-4">🎉</span>
            <h2 className="text-xl font-bold text-gray-700 mb-2">All Caught Up!</h2>
            <p className="text-gray-500 text-sm">No pending payment requests at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req, i) => (
              <div key={req.requestId} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow duration-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  
                  {/* Screenshot thumbnail */}
                  <div
                    className="relative shrink-0 cursor-pointer group"
                    onClick={() => setPreviewImg(req.screenshotUrl)}
                  >
                    <img
                      src={req.screenshotUrl}
                      alt="Payment Screenshot"
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border-2 border-gray-100 group-hover:border-indigo-400 transition-colors"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-xl transition-all duration-200 flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 text-xs font-bold">🔍 View</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 text-base">{req.student?.name}</h3>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{req.student?.phone}</span>
                    </div>
                    <p className="text-gray-500 text-sm mb-2">{req.course?.courseName} — {req.course?.courseCode}</p>
                    
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="flex items-center gap-1.5 font-bold text-emerald-600">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                        Paying: {fmt(req.amount)}
                      </span>
                      <span className="text-gray-400">|</span>
                      <span className="text-gray-500">Total: {fmt(req.totalFees)}</span>
                      <span className="text-gray-400">|</span>
                      <span className="text-red-500">Pending: {fmt(req.pendingAmount)}</span>
                    </div>

                    {req.transactionId && (
                      <p className="text-xs text-gray-400 mt-1.5 font-mono">Txn ID: {req.transactionId}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-0.5">
                      Submitted: {new Date(req.submittedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-row sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
                    <button
                      onClick={() => handleApprove(req)}
                      disabled={processing === req.requestId}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 text-white font-bold px-5 py-2.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/30 text-sm"
                    >
                      {processing === req.requestId ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : '✅'} Approve
                    </button>
                    <button
                      onClick={() => setRejectModal(req)}
                      disabled={processing === req.requestId}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-red-50 hover:bg-red-500 border-2 border-red-200 hover:border-red-500 text-red-600 hover:text-white font-bold px-5 py-2.5 rounded-xl transition-all duration-200 text-sm"
                    >
                      ❌ Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Screenshot Preview Modal */}
      {previewImg && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewImg(null)}>
          <div className="relative max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <img src={previewImg} alt="Payment Screenshot" className="w-full rounded-2xl shadow-2xl" />
            <button onClick={() => setPreviewImg(null)}
              className="absolute top-3 right-3 w-9 h-9 bg-black/50 hover:bg-black/80 rounded-full text-white flex items-center justify-center text-xl font-bold transition-colors">
              ×
            </button>
          </div>
        </div>
      )}

      {/* Reject Note Modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="font-bold text-gray-900 text-lg mb-2">Reject Payment?</h3>
            <p className="text-gray-500 text-sm mb-4">
              Rejecting ₹{rejectModal.amount?.toLocaleString()} from <strong>{rejectModal.student?.name}</strong>.
              Add a note for the student:
            </p>
            <textarea
              value={rejectNote}
              onChange={e => setRejectNote(e.target.value)}
              placeholder="Reason for rejection (e.g. Screenshot unclear, wrong amount...)"
              rows="3"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-400 mb-4 resize-none"
            />
            <div className="flex gap-3">
              <button onClick={handleReject} disabled={processing === rejectModal.requestId}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-xl transition-colors text-sm">
                {processing === rejectModal.requestId ? 'Rejecting...' : '❌ Confirm Reject'}
              </button>
              <button onClick={() => { setRejectModal(null); setRejectNote(''); }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl transition-colors text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
