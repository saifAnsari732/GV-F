"use client";
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import api from '../../../../services/api';

const inputCls = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all";
const selectCls = inputCls + " cursor-pointer";

const statusConfig = {
  paid:    { bg: 'bg-emerald-50',  text: 'text-emerald-700',  border: 'border-emerald-200/60',  label: '✓ Fully Paid' },
  partial: { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200/60',   label: '◑ Partial'    },
  pending: { bg: 'bg-rose-50',    text: 'text-rose-700',    border: 'border-rose-200/60',    label: '○ Pending'    },
  'no-fees':{ bg: 'bg-gray-50',    text: 'text-gray-500',    border: 'border-gray-200',        label: '— No Fees'    },
};

const StatusBadge = ({ status }) => {
  const c = statusConfig[status] || statusConfig['no-fees'];
  return (
    <span className={`inline-block px-3 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap border ${c.bg} ${c.text} ${c.border}`}>
      {c.label}
    </span>
  );
};

const AdminFeeManagement = () => {
  const navigate = useRouter();
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [paymentData, setPaymentData] = useState({ amount: '', paymentMode: 'Cash', transactionId: '', remarks: '' });
  const [createFeeData, setCreateFeeData] = useState({ studentId: '', courseId: '', totalFees: '', paidAmount: '', paymentMode: 'Cash', transactionId: '', remarks: '' });
  const [statistics, setStatistics] = useState({ totalFees: 0, totalPaid: 0, totalPending: 0, totalStudents: 0, fullyPaid: 0, partiallyPaid: 0, pending: 0 });

  useEffect(() => { fetchData(); fetchCourses(); }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const studentsRes = await api.get('/api/students', { headers: { Authorization: `Bearer ${token}` } });
      if (studentsRes.data.success) {
        const sd = studentsRes.data.data;
        setStudents(sd);
        const feesRes = await api.get('/api/fees', { headers: { Authorization: `Bearer ${token}` } });
        if (feesRes.data.success) { setFees(feesRes.data.data); calculateStatistics(feesRes.data.data, sd); }
      }
    } catch (e) { toast.error('Failed to fetch data'); }
    finally { setLoading(false); }
  };

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/api/courses', { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) setCourses(res.data.data);
    } catch (e) { console.error(e); }
  };

  const calculateStatistics = (feesData, studentsData) => {
    let totalFees = 0, totalPaid = 0, totalPending = 0;
    feesData.forEach(f => { totalFees += Number(f.totalFees)||0; totalPaid += Number(f.paidAmount)||0; totalPending += Number(f.pendingAmount)||0; });
    setStatistics({ totalFees, totalPaid, totalPending, totalStudents: studentsData.length,
      fullyPaid: feesData.filter(f=>f.status==='paid').length,
      partiallyPaid: feesData.filter(f=>f.status==='partial').length,
      pending: feesData.filter(f=>f.status==='pending').length });
  };

  const handleAddPayment = async (feeId) => {
    if (!paymentData.amount || paymentData.amount <= 0) { toast.error('Please enter a valid amount'); return; }
    try {
      const token = localStorage.getItem('token');
      const res = await api.post(`/api/fees/${feeId}/payment`,
        { amount: parseFloat(paymentData.amount), paymentMode: paymentData.paymentMode, transactionId: paymentData.transactionId||undefined, remarks: paymentData.remarks||undefined },
        { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) { toast.success('Payment added successfully'); setShowPaymentModal(false); setPaymentData({ amount:'', paymentMode:'Cash', transactionId:'', remarks:'' }); fetchData(); }
    } catch (e) { toast.error(e.response?.data?.message||'Failed to add payment'); }
  };

  const handleCreateFee = async () => {
    if (!createFeeData.studentId||!createFeeData.courseId||!createFeeData.totalFees) { toast.error('Please fill all required fields'); return; }
    const totalFees = parseFloat(createFeeData.totalFees);
    if (isNaN(totalFees)||totalFees<=0) { toast.error('Please enter a valid total fees amount'); return; }
    let paidAmount = 0;
    if (createFeeData.paidAmount) {
      paidAmount = parseFloat(createFeeData.paidAmount);
      if (isNaN(paidAmount)||paidAmount<0) { toast.error('Please enter a valid paid amount'); return; }
      if (paidAmount>totalFees) { toast.error('Paid amount cannot be greater than total fees'); return; }
    }
    try {
      const token = localStorage.getItem('token');
      const res = await api.post('/api/fees', { studentId: createFeeData.studentId, courseId: createFeeData.courseId, totalFees, paidAmount, paymentMode: paidAmount>0?createFeeData.paymentMode:undefined, transactionId: paidAmount>0?createFeeData.transactionId:undefined, remarks: createFeeData.remarks||undefined }, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) { toast.success('Fee record created successfully'); setShowCreateModal(false); setCreateFeeData({ studentId:'', courseId:'', totalFees:'', paidAmount:'', paymentMode:'Cash', transactionId:'', remarks:'' }); fetchData(); }
    } catch (e) { toast.error(e.response?.data?.message||'Failed to create fee record'); }
  };

  const getStudentFees = (id) => fees.filter(f => (f.student?._id||f.student)===id);
  const getStudentTotalFees = (id) => getStudentFees(id).reduce((s,f)=>s+(Number(f.totalFees)||0),0);
  const getStudentPaidFees  = (id) => getStudentFees(id).reduce((s,f)=>s+(Number(f.paidAmount)||0),0);
  const getStudentPendingFees=(id) => getStudentFees(id).reduce((s,f)=>s+(Number(f.pendingAmount)||0),0);
  const getStudentFeeStatus = (id) => {
    const sf = getStudentFees(id);
    if (!sf.length) return 'no-fees';
    if (sf.every(f=>f.status==='paid')) return 'paid';
    if (sf.some(f=>f.status==='pending')) return 'pending';
    return 'partial';
  };

  const formatCurrency = (v) => {
    if (v===undefined||v===null||isNaN(v)) return '₹0';
    return new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',minimumFractionDigits:0}).format(v);
  };

  const filteredStudents = students.filter(s => {
    const match = s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || s.email?.toLowerCase().includes(searchTerm.toLowerCase()) || s.phone?.includes(searchTerm);
    return statusFilter==='all' ? match : match && getStudentFeeStatus(s._id)===statusFilter;
  });

  const statCards = [
    { label:'Total Fees',     value: formatCurrency(statistics.totalFees),    icon:'💰', bar:'linear-gradient(180deg,#06b6d4,#3b82f6)' },
    { label:'Total Paid',     value: formatCurrency(statistics.totalPaid),     icon:'✅', bar:'linear-gradient(180deg,#10b981,#059669)' },
    { label:'Total Pending',  value: formatCurrency(statistics.totalPending),  icon:'⏳', bar:'linear-gradient(180deg,#f43f5e,#e11d48)' },
    { label:'Total Students', value: statistics.totalStudents,                 icon:'👥', bar:'linear-gradient(180deg,#6366f1,#4f46e5)' },
  ];

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

  if (loading) return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-['Space_Grotesk',sans-serif] relative overflow-x-hidden flex items-center justify-center pt-20">
      {BG_MESH}
      <div className="flex flex-col items-center gap-4 relative z-10">
        <div className="w-11 h-11 rounded-full border-[3px] border-cyan-500/20 border-t-cyan-500 animate-spin" />
        <p className="text-gray-500 font-medium">Loading fee management data...</p>
      </div>
    </div>
  );

  const paymentModes = ['Cash','Online','Card','UPI','Cheque'];

  return (
    <div className="min-h-screen bg-gray-50/50 px-12 py-8 max-md:px-4 font-['Space_Grotesk',sans-serif] text-gray-900 pt-24">
      {BG_MESH}

      {/* ── Header ── */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8 max-w-[1400px] mx-auto">
        <div>
          <span className="block text-[11px] font-bold tracking-[2.5px] uppercase text-cyan-600 mb-1.5 font-sans">Billing Portal</span>
          <h1 className="font-['Syne',sans-serif] text-3xl font-extrabold leading-tight text-gray-900">
            Fee Management
          </h1>
        </div>
        <div className="flex gap-3 flex-wrap max-md:w-full max-md:flex-col">
          <button onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 rounded-xl text-white font-bold text-sm border-none cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-cyan-500/20 max-md:w-full max-md:text-center shadow-md"
            style={{ background:'linear-gradient(135deg,#00d4ff,#7c3aed)' }}>
            + Create Fee Record
          </button>
          <button onClick={() => navigate.push('/admin/dashboard')}
            className="px-6 py-3 rounded-xl text-gray-700 bg-white border border-gray-200 font-bold text-sm cursor-pointer transition-all duration-200 hover:bg-gray-50 max-md:w-full max-md:text-center shadow-sm">
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 max-w-[1400px] mx-auto">
        {statCards.map((s, i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-5 rounded-2xl border border-gray-200/70 shadow-sm bg-white relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div className="absolute top-0 left-0 w-1.5 h-full" style={{ background: s.bar }} />
            <div className="text-[2rem] shrink-0">{s.icon}</div>
            <div>
              <h3 className="text-[10px] text-gray-400 m-0 mb-1 font-bold uppercase tracking-wider">{s.label}</h3>
              <p className="font-['Syne',sans-serif] text-xl font-extrabold text-gray-900 m-0 leading-none">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Status Summary ── */}
      <div className="flex flex-wrap gap-6 bg-white border border-gray-200/80 px-6 py-3.5 rounded-2xl mb-6 shadow-sm max-w-[1400px] mx-auto">
        {[
          { dot:'bg-emerald-500 shadow-sm shadow-emerald-500/30',   label:`Fully Paid: ${statistics.fullyPaid}` },
          { dot:'bg-amber-500 shadow-sm shadow-amber-500/30',     label:`Partial: ${statistics.partiallyPaid}` },
          { dot:'bg-rose-500 shadow-sm shadow-rose-500/30',       label:`Pending: ${statistics.pending}` },
        ].map((s,i) => (
          <div key={i} className="flex items-center gap-2 text-gray-600 text-xs font-bold">
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${s.dot}`} />
            {s.label}
          </div>
        ))}
      </div>

      {/* ── Search & Filter ── */}
      <div className="flex flex-wrap gap-4 mb-6 max-sm:flex-col max-w-[1400px] mx-auto">
        <div className="flex-1 relative min-w-[260px] max-sm:min-w-0">
          <input type="text" placeholder="Search by student name, email or phone..."
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className={inputCls + " pl-11"}
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm pointer-events-none text-gray-400">🔍</span>
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className={selectCls + " min-w-[180px] max-sm:w-full"}>
          <option value="all">All Status</option>
          <option value="paid">Fully Paid</option>
          <option value="partial">Partial</option>
          <option value="pending">Pending</option>
          <option value="no-fees">No Fees</option>
        </select>
      </div>

      {/* ── Table ── */}
      <div className="bg-white border border-gray-200/80 shadow-sm rounded-2xl overflow-hidden overflow-x-auto mb-8 max-w-[1400px] mx-auto">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-16 px-5">
            <div className="text-[4rem] mb-3 opacity-55">📋</div>
            <h3 className="font-['Syne',sans-serif] text-xl font-bold text-gray-800 m-0 mb-1">No students found</h3>
            <p className="text-gray-400 text-sm m-0">Try adjusting your search or filter</p>
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {['Student','Contact','Total Fee','Paid','Pending','Status','Actions'].map(h => (
                  <th key={h} className="text-left px-[18px] py-4 text-gray-500 font-bold text-[10px] uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => {
                const totalFee   = getStudentTotalFees(student._id);
                const paidFee    = getStudentPaidFees(student._id);
                const pendingFee = getStudentPendingFees(student._id);
                const status     = getStudentFeeStatus(student._id);
                return (
                  <tr key={student._id} className="border-b border-gray-100 transition-colors duration-200 hover:bg-gray-50 last:border-b-0">
                    <td className="px-[18px] py-3.5 text-gray-700 text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-[36px] h-[36px] rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm"
                          style={{ background:'linear-gradient(135deg,#06b6d4,#3b82f6)' }}>
                          {student.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{student.name}</div>
                          <div className="text-[11px] text-gray-400 font-medium">ID: {student._id.slice(-6)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-[18px] py-3.5 text-gray-600 text-[13px] font-medium">
                      <div>{student.email}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{student.phone}</div>
                    </td>
                    <td className="px-[18px] py-3.5 font-bold text-gray-900 text-sm">{formatCurrency(totalFee)}</td>
                    <td className="px-[18px] py-3.5 font-bold text-emerald-600 text-sm">{formatCurrency(paidFee)}</td>
                    <td className="px-[18px] py-3.5 font-bold text-rose-600 text-sm">{formatCurrency(pendingFee)}</td>
                    <td className="px-[18px] py-3.5"><StatusBadge status={status} /></td>
                    <td className="px-[18px] py-3.5">
                      <button onClick={() => { setSelectedStudent(student); setShowPaymentModal(true); }}
                        className="px-4 py-2 bg-cyan-50 border border-cyan-200 rounded-xl text-cyan-700 text-[12px] font-bold cursor-pointer whitespace-nowrap transition-all hover:bg-cyan-100/60">
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Create Fee Modal ── */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] backdrop-blur-sm p-4"
          onClick={() => setShowCreateModal(false)}>
          <div className="bg-white border border-gray-200/80 rounded-3xl w-full max-w-[560px] max-h-[90vh] overflow-y-auto shadow-2xl p-7"
            onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="font-['Syne',sans-serif] text-xl font-extrabold text-gray-900">Create New Fee Record</h2>
              <button onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg text-lg cursor-pointer text-gray-400 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 font-bold">
                ×
              </button>
            </div>
            <form onSubmit={e => { e.preventDefault(); handleCreateFee(); }} className="flex flex-col gap-4">
              {[
                { label:'Select Student *', required: true, el:
                  <select value={createFeeData.studentId} onChange={e=>setCreateFeeData({...createFeeData,studentId:e.target.value})} required className={selectCls}>
                    <option value="">Choose a student</option>
                    {students.map(s=><option key={s._id} value={s._id}>{s.name} - {s.email}</option>)}
                  </select> },
                { label:'Select Course *', required: true, el:
                  <select value={createFeeData.courseId} onChange={e=>{const c=courses.find(x=>x._id===e.target.value);setCreateFeeData({...createFeeData,courseId:e.target.value,totalFees:c?.fees||''})}} required className={selectCls}>
                    <option value="">Choose a course</option>
                    {courses.map(c=><option key={c._id} value={c._id}>{c.courseName} - {c.courseCode} (₹{c.fees})</option>)}
                  </select> },
                { label:'Total Fees (₹) *', el:
                  <input type="number" value={createFeeData.totalFees} onChange={e=>setCreateFeeData({...createFeeData,totalFees:e.target.value})} required min="1" step="1" placeholder="Enter total fees" className={inputCls} /> },
                { label:'Initial Payment Amount (₹) (Optional)', el:
                  <><input type="number" value={createFeeData.paidAmount} onChange={e=>setCreateFeeData({...createFeeData,paidAmount:e.target.value})} min="0" step="1" placeholder="Enter initial payment" className={inputCls} />
                  {createFeeData.paidAmount&&parseFloat(createFeeData.paidAmount)>parseFloat(createFeeData.totalFees)&&<p className="text-rose-600 text-xs mt-1 font-bold">Paid amount cannot exceed total fees</p>}</> },
              ].map((f,i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">{f.label}</label>
                  {f.el}
                </div>
              ))}

              {createFeeData.paidAmount && parseFloat(createFeeData.paidAmount) > 0 && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Payment Mode</label>
                    <select value={createFeeData.paymentMode} onChange={e=>setCreateFeeData({...createFeeData,paymentMode:e.target.value})} className={selectCls}>
                      {paymentModes.map(m=><option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Transaction ID (Optional)</label>
                    <input type="text" value={createFeeData.transactionId} onChange={e=>setCreateFeeData({...createFeeData,transactionId:e.target.value})} placeholder="Enter transaction ID" className={inputCls} />
                  </div>
                </>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Remarks (Optional)</label>
                <textarea value={createFeeData.remarks} onChange={e=>setCreateFeeData({...createFeeData,remarks:e.target.value})} rows="3" placeholder="Enter any remarks"
                  className={inputCls + " resize-y min-h-[90px]"} />
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-600 text-sm font-bold cursor-pointer transition-all hover:bg-gray-200/80">
                  Cancel
                </button>
                <button type="submit" disabled={!!(createFeeData.paidAmount&&parseFloat(createFeeData.paidAmount)>parseFloat(createFeeData.totalFees))}
                  className="px-6 py-2.5 rounded-xl text-white font-bold text-sm border-none cursor-pointer min-w-[140px] transition-all disabled:opacity-50 shadow-md shadow-cyan-500/10"
                  style={{ background:'linear-gradient(135deg,#00d4ff,#7c3aed)' }}>
                  Create Fee Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Student Details Modal ── */}
      {showPaymentModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] backdrop-blur-sm p-4"
          onClick={() => setShowPaymentModal(false)}>
          <div className="bg-white border border-gray-200/80 rounded-3xl w-full max-w-[760px] max-h-[90vh] overflow-y-auto shadow-2xl p-7"
            onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="font-['Syne',sans-serif] text-xl font-extrabold text-gray-900">Fee Details — {selectedStudent.name}</h2>
              <button onClick={() => setShowPaymentModal(false)}
                className="w-8 h-8 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg text-lg cursor-pointer text-gray-400 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 font-bold">
                ×
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {/* Student info */}
              <div className="bg-gray-50 border border-gray-200/60 rounded-xl p-4">
                <p className="my-1 text-gray-600 text-sm"><strong className="text-gray-900">Email:</strong> {selectedStudent.email}</p>
                <p className="my-1 text-gray-600 text-sm"><strong className="text-gray-900">Phone:</strong> {selectedStudent.phone}</p>
              </div>

              <h3 className="font-['Syne',sans-serif] text-base font-bold text-gray-900 mb-2">Course-wise Fee Breakdown</h3>

              <div className="flex flex-col gap-5">
                {getStudentFees(selectedStudent._id).map(fee => (
                  <div key={fee._id} className="border border-gray-200 rounded-2xl p-4 bg-white shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-['Syne',sans-serif] text-[15px] font-bold text-gray-900 m-0">{fee.course?.courseName||'Course'}</h4>
                      <StatusBadge status={fee.status} />
                    </div>

                    {/* Fee rows */}
                    <div className="bg-gray-50 rounded-xl p-3 mb-4">
                      {[
                        { label:'Total Fee:',    val: formatCurrency(fee.totalFees),    cls:'text-gray-900' },
                        { label:'Paid Amount:',  val: formatCurrency(fee.paidAmount),   cls:'text-emerald-600' },
                        { label:'Pending Amount:',val:formatCurrency(fee.pendingAmount),cls:'text-rose-600' },
                      ].map((r,i)=>(
                        <div key={i} className="flex justify-between py-1.5 border-b border-gray-200/50 last:border-b-0 text-[13px] text-gray-500 font-semibold">
                          <span>{r.label}</span>
                          <strong className={r.cls}>{r.val}</strong>
                        </div>
                      ))}
                    </div>

                    {/* Payment history */}
                    {fee.payments?.length > 0 && (
                      <div className="mb-4">
                        <h5 className="text-[10px] text-gray-400 font-bold uppercase tracking-wider m-0 mb-2">Payment History</h5>
                        {fee.payments.map((p,i) => (
                          <div key={i} className="flex flex-wrap items-center gap-3 px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg mb-1.5 text-xs font-semibold">
                            <span className="text-gray-400 min-w-[90px]">{new Date(p.paymentDate).toLocaleDateString()}</span>
                            <span className="text-emerald-600 font-bold min-w-[90px]">{formatCurrency(p.amount)}</span>
                            <span className="text-gray-600">{p.paymentMode}</span>
                            {p.transactionId && <span className="text-gray-400 text-[11px] font-medium ml-auto">ID: {p.transactionId}</span>}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add payment */}
                    <div className="bg-gray-50 border border-gray-200/60 rounded-2xl p-4">
                      <h5 className="text-[10px] text-gray-400 font-bold uppercase tracking-wider m-0 mb-3">Add Payment</h5>
                      <div className="flex gap-3 mb-3 max-sm:flex-col">
                        <input type="number" placeholder="Amount" value={paymentData.amount}
                          onChange={e=>setPaymentData({...paymentData,amount:e.target.value})} className={inputCls} />
                        <select value={paymentData.paymentMode} onChange={e=>setPaymentData({...paymentData,paymentMode:e.target.value})}
                          className={selectCls}>
                          {paymentModes.map(m=><option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>
                      <input type="text" placeholder="Transaction ID (optional)" value={paymentData.transactionId}
                        onChange={e=>setPaymentData({...paymentData,transactionId:e.target.value})} className={inputCls + " mb-3"} />
                      <input type="text" placeholder="Remarks (optional)" value={paymentData.remarks}
                        onChange={e=>setPaymentData({...paymentData,remarks:e.target.value})} className={inputCls + " mb-4"} />
                      <button onClick={() => handleAddPayment(fee._id)}
                        className="w-full py-2.5 rounded-xl text-white font-bold text-sm border-none cursor-pointer transition-all shadow-md shadow-cyan-500/10"
                        style={{ background:'linear-gradient(135deg,#00d4ff,#7c3aed)' }}>
                        Add Payment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFeeManagement;