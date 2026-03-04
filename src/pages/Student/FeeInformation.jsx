/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const FeeInformation = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentInfo, setStudentInfo] = useState(null);
  const [selectedFee, setSelectedFee] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [statistics, setStatistics] = useState({
    totalFees: 0,
    totalPaid: 0,
    totalPending: 0,
    paidPercentage: 0
  });

  useEffect(() => {
    fetchFeeData();
  }, []);

  const fetchFeeData = async () => {
    try {
      const token = localStorage.getItem('token');
      const studentResponse = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (studentResponse.data.success) {
        const student = studentResponse.data.data;
        setStudentInfo(student);
        const studentId = student._id;
        const feeResponse = await axios.get(`/api/fees/student/${studentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        let feeData = [];
        if (feeResponse.data.success && feeResponse.data.data) {
          feeData = feeResponse.data.data;
        } else if (feeResponse.data.data) {
          feeData = feeResponse.data.data;
        }

        setFees(feeData);

        if (feeData.length > 0) {
          const totalFees = feeData.reduce((sum, fee) => sum + (fee.totalFees || 0), 0);
          const totalPaid = feeData.reduce((sum, fee) => sum + (fee.paidAmount || 0), 0);
          const totalPending = feeData.reduce((sum, fee) => sum + (fee.pendingAmount || 0), 0);
          const paidPercentage = totalFees > 0 ? (totalPaid / totalFees) * 100 : 0;
          setStatistics({ totalFees, totalPaid, totalPending, paidPercentage });
        } else {
          setStatistics({ totalFees: 0, totalPaid: 0, totalPending: 0, paidPercentage: 0 });
        }
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setFees([]);
        setStatistics({ totalFees: 0, totalPaid: 0, totalPending: 0, paidPercentage: 0 });
      } else {
        toast.error('Failed to fetch fee information');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      paid: { cls: 'bg-emerald-100 text-emerald-700 border border-emerald-200', label: '✅ Paid' },
      partial: { cls: 'bg-amber-100 text-amber-700 border border-amber-200', label: '⏳ Partial' },
      pending: { cls: 'bg-red-100 text-red-700 border border-red-200', label: '❌ Pending' }
    }[status] || { cls: 'bg-red-100 text-red-700 border border-red-200', label: '❌ Pending' };

    return (
      <span className={`${config.cls} px-3 py-1 rounded-full text-xs font-semibold`}>
        {config.label}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const getPaymentModeIcon = (mode) => {
    return { Cash: '💵', Online: '🌐', Card: '💳', UPI: '📱', Cheque: '📝' }[mode] || '💰';
  };

  // ── LOADING ──
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-indigo-600 font-medium text-lg">Loading fee information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* ── HEADER BANNER ── */}
        <div className="bg-gradient-to-r from-gray-900 via-black to-violet-800 rounded-2xl shadow-xl p-6 relative overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-16 -translate-y-16 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-10 translate-y-10 pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">💰</div>
              <h1 className="text-2xl font-extrabold text-white">Fee Information</h1>
            </div>
            <p className="text-indigo-200 text-sm mb-6 ml-13">
              {studentInfo ? `Hello, ${studentInfo.name} 👋` : 'Track your fee payments & history'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Total Fees', value: formatCurrency(statistics.totalFees), icon: '🏷️', color: 'bg-white/10' },
                { label: 'Paid Amount', value: formatCurrency(statistics.totalPaid), icon: '✅', color: 'bg-emerald-500/20' },
                { label: 'Pending', value: formatCurrency(statistics.totalPending), icon: '⏳', color: 'bg-red-400/20' }
              ].map((stat, i) => (
                <div key={i} className={`${stat.color} backdrop-blur-sm rounded-xl p-4 border border-white/20`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span>{stat.icon}</span>
                    <p className="text-white/80 text-xs font-medium">{stat.label}</p>
                  </div>
                  <p className="text-white text-xl font-extrabold">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── PROGRESS SECTION ── */}
        {fees.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Progress Bar Card */}
            <div className="sm:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-gray-800">Overall Payment Progress</h3>
                <span className="text-2xl font-extrabold text-indigo-600">
                  {Math.round(statistics.paidPercentage)}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 mb-4 overflow-hidden">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-700"
                  style={{ width: `${statistics.paidPercentage}%` }}
                />
              </div>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                  <span className="text-sm text-gray-500">Paid: <strong className="text-gray-700">{formatCurrency(statistics.totalPaid)}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full" />
                  <span className="text-sm text-gray-500">Pending: <strong className="text-gray-700">{formatCurrency(statistics.totalPending)}</strong></span>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="flex flex-col gap-4">
              <div className="flex-1 bg-emerald-50 rounded-2xl border border-emerald-100 p-4 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-200">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-2xl">✅</div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Total Paid</p>
                  <p className="text-lg font-extrabold text-emerald-600">{formatCurrency(statistics.totalPaid)}</p>
                </div>
              </div>
              <div className="flex-1 bg-red-50 rounded-2xl border border-red-100 p-4 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-200">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-2xl">⏳</div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Total Pending</p>
                  <p className="text-lg font-extrabold text-red-600">{formatCurrency(statistics.totalPending)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── FEE RECORDS ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-7 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full" />
            <h2 className="text-xl font-bold text-gray-800">Fee Records</h2>
          </div>

          {fees.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4 opacity-40">📋</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Fee Records Found</h3>
              <p className="text-gray-400 text-sm">You don't have any fee records yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {fees.map((fee) => {
                const courseName = fee.course?.courseName || fee.courseName || 'Course';
                const courseCode = fee.course?.courseCode || fee.courseCode || 'N/A';
                const totalFees = fee.totalFees || 0;
                const paidAmount = fee.paidAmount || 0;
                const pendingAmount = fee.pendingAmount || 0;
                const paidPercentage = totalFees > 0 ? (paidAmount / totalFees) * 100 : 0;

                return (
                  <div
                    key={fee._id}
                    className="bg-gray-50 border border-gray-100 rounded-2xl p-5 hover:shadow-lg hover:-translate-y-1 hover:border-indigo-200 transition-all duration-300"
                  >
                    {/* Card Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-base font-bold text-gray-800">{courseName}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Code: {courseCode}</p>
                      </div>
                      {getStatusBadge(fee.status)}
                    </div>

                    {/* Amounts */}
                    <div className="bg-white rounded-xl p-4 mb-4 grid grid-cols-3 gap-3 border border-gray-100">
                      <div className="text-center">
                        <p className="text-xs text-gray-400 mb-1">Total</p>
                        <p className="text-sm font-bold text-gray-700">{formatCurrency(totalFees)}</p>
                      </div>
                      <div className="text-center border-x border-gray-100">
                        <p className="text-xs text-gray-400 mb-1">Paid</p>
                        <p className="text-sm font-bold text-emerald-600">{formatCurrency(paidAmount)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-400 mb-1">Pending</p>
                        <p className="text-sm font-bold text-red-500">{formatCurrency(pendingAmount)}</p>
                      </div>
                    </div>

                    {/* Mini Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                        <span>Progress</span>
                        <span className="text-indigo-600 font-semibold">{Math.round(paidPercentage)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500"
                          style={{ width: `${paidPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Recent Payments */}
                    {fee.payments?.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Recent Payments</p>
                        <div className="space-y-2">
                          {fee.payments.slice(0, 2).map((payment, index) => (
                            <div key={index} className="flex items-center justify-between bg-white rounded-xl px-3 py-2 border border-gray-100">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{getPaymentModeIcon(payment.paymentMode)}</span>
                                <div>
                                  <p className="text-sm font-semibold text-gray-700">{formatCurrency(payment.amount)}</p>
                                  <p className="text-xs text-gray-400">{formatDate(payment.paymentDate)}</p>
                                </div>
                              </div>
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">{payment.paymentMode}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* View Details Button */}
                    <button
                      onClick={() => { setSelectedFee(fee); setShowPaymentModal(true); }}
                      className="w-full py-2.5 border-2 border-indigo-200 text-indigo-600 font-semibold text-sm rounded-xl hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-300"
                    >
                      View Full Details →
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── MODAL ── */}
      {showPaymentModal && selectedFee && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">

            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center rounded-t-2xl z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">💳</div>
                <h2 className="text-lg font-bold text-gray-800">Payment Details</h2>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors text-lg font-bold"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {/* Course Info */}
              <div className="mb-5 pb-5 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-800">
                  {selectedFee.course?.courseName || selectedFee.courseName || 'Course'}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  Code: {selectedFee.course?.courseCode || selectedFee.courseCode || 'N/A'}
                </p>
              </div>

              {/* Summary Grid */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                  <p className="text-xs text-gray-400 mb-1">Total Fee</p>
                  <p className="text-sm font-bold text-gray-700">{formatCurrency(selectedFee.totalFees || 0)}</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-100">
                  <p className="text-xs text-gray-400 mb-1">Paid</p>
                  <p className="text-sm font-bold text-emerald-600">{formatCurrency(selectedFee.paidAmount || 0)}</p>
                </div>
                <div className="bg-red-50 rounded-xl p-3 text-center border border-red-100">
                  <p className="text-xs text-gray-400 mb-1">Pending</p>
                  <p className="text-sm font-bold text-red-500">{formatCurrency(selectedFee.pendingAmount || 0)}</p>
                </div>
              </div>

              {/* Payment History */}
              <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Payment History</h4>
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {selectedFee.payments?.length > 0 ? (
                  selectedFee.payments.map((payment, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-4 border-l-4 border-indigo-500">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-lg font-medium">
                          {formatDate(payment.paymentDate)}
                        </span>
                        <span className="text-base font-extrabold text-emerald-600">
                          {formatCurrency(payment.amount)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">
                          {getPaymentModeIcon(payment.paymentMode)} {payment.paymentMode}
                        </span>
                        {payment.transactionId && (
                          <span className="text-xs text-gray-400 font-mono">Txn: {payment.transactionId}</span>
                        )}
                      </div>
                      {payment.remarks && (
                        <p className="text-xs text-gray-500 mt-2 pt-2 border-t border-dashed border-gray-200 italic">
                          📝 {payment.remarks}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <div className="text-4xl mb-2 opacity-40">💸</div>
                    <p className="text-sm">No payments recorded yet</p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 mt-6 pt-5 border-t border-gray-100">
                <button
                  onClick={() => window.print()}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  🖨️ Download Summary
                </button>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-4 rounded-xl transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeInformation;