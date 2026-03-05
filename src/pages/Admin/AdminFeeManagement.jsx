/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

const BG = 'linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%)';
const inputCls = "w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/[0.12] rounded-lg text-sm text-white font-['Inter',sans-serif] placeholder-white/30 transition-all duration-200 focus:outline-none focus:border-[rgba(167,139,250,0.5)] focus:shadow-[0_0_0_3px_rgba(167,139,250,0.1)]";
const selectCls = inputCls + " cursor-pointer";

const statusConfig = {
  paid:    { bg: 'bg-[rgba(52,211,153,0.15)]',  text: 'text-[#34d399]',  border: 'border-[rgba(52,211,153,0.3)]',  label: '✓ Fully Paid' },
  partial: { bg: 'bg-[rgba(251,191,36,0.15)]',  text: 'text-[#fbbf24]',  border: 'border-[rgba(251,191,36,0.3)]',  label: '◑ Partial'    },
  pending: { bg: 'bg-[rgba(248,113,113,0.15)]', text: 'text-[#f87171]',  border: 'border-[rgba(248,113,113,0.3)]', label: '○ Pending'    },
  'no-fees':{ bg: 'bg-white/[0.06]',            text: 'text-white/45',   border: 'border-white/10',                label: '— No Fees'    },
};

const StatusBadge = ({ status }) => {
  const c = statusConfig[status] || statusConfig['no-fees'];
  return (
    <span className={`inline-block px-3 py-0.5 rounded-full text-[.75rem] font-bold whitespace-nowrap border ${c.bg} ${c.text} ${c.border}`}>
      {c.label}
    </span>
  );
};

const AdminFeeManagement = () => {
  const navigate = useNavigate();
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
    { label:'Total Fees',     value: formatCurrency(statistics.totalFees),    icon:'💰', bar:'linear-gradient(180deg,#a78bfa,#7c3aed)' },
    { label:'Total Paid',     value: formatCurrency(statistics.totalPaid),     icon:'✅', bar:'linear-gradient(180deg,#34d399,#059669)' },
    { label:'Total Pending',  value: formatCurrency(statistics.totalPending),  icon:'⏳', bar:'linear-gradient(180deg,#f87171,#dc2626)' },
    { label:'Total Students', value: statistics.totalStudents,                 icon:'👥', bar:'linear-gradient(180deg,#60a5fa,#2563eb)' },
  ];

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center font-['Inter',sans-serif]" style={{ background: BG }}>
      <div className="w-12 h-12 rounded-full border-[3px] border-[rgba(167,139,250,0.2)] border-t-[#a78bfa] animate-spin mb-4" />
      <p className="text-white/50 text-base">Loading fee management data...</p>
    </div>
  );

  const paymentModes = ['Cash','Online','Card','UPI','Cheque'];

  return (
    <div className="min-h-screen px-12 py-8 max-md:px-4 font-['Inter',sans-serif]" style={{ background: BG }}>

      {/* ── Header ── */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-[2.4rem] font-extrabold m-0 mb-1.5"
            style={{ background:'linear-gradient(90deg,#a78bfa,#60a5fa,#34d399)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
            Fee Management
          </h1>
          <p className="text-base text-white/45 m-0">Manage student fees and payments</p>
        </div>
        <div className="flex gap-3 flex-wrap max-md:w-full max-md:flex-col">
          <button onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 rounded-xl text-white font-bold text-[.9rem] border-none cursor-pointer transition-all duration-250 hover:-translate-y-[3px] hover:shadow-[0_12px_30px_rgba(52,211,153,0.45)] max-md:w-full max-md:text-center"
            style={{ background:'linear-gradient(135deg,#34d399,#059669)', boxShadow:'0 8px 20px rgba(52,211,153,0.3)' }}>
            + Create Fee Record
          </button>
          <button onClick={() => navigate('/admin/dashboard')}
            className="px-6 py-3 rounded-xl text-white/80 font-semibold text-[.9rem] cursor-pointer backdrop-blur-[10px] border border-white/15 transition-all duration-250 hover:bg-white/[0.12] hover:text-white hover:-translate-y-0.5 max-md:w-full max-md:text-center"
            style={{ background:'rgba(255,255,255,0.06)' }}>
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5 mb-6">
        {statCards.map((s, i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-[22px] rounded-[20px] border border-white/10 backdrop-blur-xl relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] hover:border-white/[0.18]"
            style={{ background:'rgba(255,255,255,0.06)' }}>
            <div className="absolute top-0 left-0 w-1 h-full rounded-l-[20px]" style={{ background: s.bar }} />
            <div className="text-[2rem] shrink-0">{s.icon}</div>
            <div>
              <h3 className="text-[.72rem] text-white/45 m-0 mb-1.5 font-semibold uppercase tracking-[1px]">{s.label}</h3>
              <p className="text-[1.7rem] text-white font-extrabold m-0 leading-none">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Status Summary ── */}
      <div className="flex flex-wrap gap-6 max-sm:gap-3.5 bg-white/[0.05] border border-white/[0.08] px-6 py-3.5 rounded-2xl mb-6 backdrop-blur-[10px]">
        {[
          { dot:'bg-[#34d399] shadow-[0_0_6px_rgba(52,211,153,0.6)]',   label:`Fully Paid: ${statistics.fullyPaid}` },
          { dot:'bg-[#fbbf24] shadow-[0_0_6px_rgba(251,191,36,0.6)]',   label:`Partial: ${statistics.partiallyPaid}` },
          { dot:'bg-[#f87171] shadow-[0_0_6px_rgba(248,113,113,0.6)]',  label:`Pending: ${statistics.pending}` },
        ].map((s,i) => (
          <div key={i} className="flex items-center gap-2 text-white/65 text-[.88rem] font-medium">
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${s.dot}`} />
            {s.label}
          </div>
        ))}
      </div>

      {/* ── Search & Filter ── */}
      <div className="flex flex-wrap gap-3.5 mb-6 max-sm:flex-col">
        <div className="flex-1 relative min-w-[260px] max-sm:min-w-0">
          <input type="text" placeholder="Search by student name, email or phone..."
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className={inputCls + " pl-11"}
          />
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base pointer-events-none">🔍</span>
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className={selectCls + " min-w-[180px] max-sm:w-full"}
          style={{ background:'rgba(255,255,255,0.07)' }}>
          <option value="all" style={{ background:'#302b63' }}>All Status</option>
          <option value="paid" style={{ background:'#302b63' }}>Fully Paid</option>
          <option value="partial" style={{ background:'#302b63' }}>Partial</option>
          <option value="pending" style={{ background:'#302b63' }}>Pending</option>
          <option value="no-fees" style={{ background:'#302b63' }}>No Fees</option>
        </select>
      </div>

      {/* ── Table ── */}
      <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-[20px] overflow-hidden overflow-x-auto mb-8">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-16 px-5">
            <div className="text-[4rem] mb-3 opacity-50">📋</div>
            <h3 className="text-[1.3rem] text-white/70 m-0 mb-2">No students found</h3>
            <p className="text-white/35 text-[.95rem] m-0">Try adjusting your search or filter</p>
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {['Student','Contact','Total Fee','Paid','Pending','Status','Actions'].map(h => (
                  <th key={h} className="text-left px-[18px] py-3.5 bg-white/[0.05] text-white/45 font-semibold text-[.72rem] uppercase tracking-[1px] border-b border-white/[0.08] whitespace-nowrap">
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
                  <tr key={student._id} className="border-b border-white/[0.05] transition-colors duration-200 hover:bg-white/[0.04] last:border-b-0">
                    <td className="px-[18px] py-3.5 text-white/85 text-[.9rem]">
                      <div className="flex items-center gap-3">
                        <div className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-white font-bold text-base shrink-0"
                          style={{ background:'linear-gradient(135deg,#667eea,#764ba2)' }}>
                          {student.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{student.name}</div>
                          <div className="text-[.75rem] text-white/35">ID: {student._id.slice(-6)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-[18px] py-3.5 text-white/85 text-[.88rem]">
                      <div>{student.email}</div>
                      <div className="text-[.78rem] text-white/40 mt-0.5">{student.phone}</div>
                    </td>
                    <td className="px-[18px] py-3.5 font-bold text-white/85">{formatCurrency(totalFee)}</td>
                    <td className="px-[18px] py-3.5 font-bold text-[#34d399]">{formatCurrency(paidFee)}</td>
                    <td className="px-[18px] py-3.5 font-bold text-[#f87171]">{formatCurrency(pendingFee)}</td>
                    <td className="px-[18px] py-3.5"><StatusBadge status={status} /></td>
                    <td className="px-[18px] py-3.5">
                      <button onClick={() => { setSelectedStudent(student); setShowPaymentModal(true); }}
                        className="px-4 py-[7px] bg-[rgba(167,139,250,0.18)] border border-[rgba(167,139,250,0.3)] rounded-lg text-[#a78bfa] text-[.82rem] font-semibold cursor-pointer whitespace-nowrap transition-all duration-250 hover:bg-[rgba(167,139,250,0.35)] hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(167,139,250,0.25)]">
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
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000] backdrop-blur-[6px] p-4"
          onClick={() => setShowCreateModal(false)}>
          <div className="bg-[#1a1535] border border-white/[0.12] rounded-3xl w-full max-w-[580px] max-h-[90vh] overflow-y-auto shadow-[0_30px_80px_rgba(0,0,0,0.6)] scrollbar-thin"
            onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex justify-between items-center px-7 py-[22px] border-b border-white/[0.08] sticky top-0 bg-[#1a1535] z-10 rounded-t-3xl">
              <h2 className="text-[1.2rem] text-white font-bold m-0">Create New Fee Record</h2>
              <button onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 flex items-center justify-center bg-white/[0.08] border border-white/[0.12] rounded-lg text-[1.3rem] cursor-pointer text-white/60 transition-all duration-200 hover:bg-[rgba(248,113,113,0.2)] hover:border-[rgba(248,113,113,0.4)] hover:text-[#f87171]">
                ×
              </button>
            </div>
            <div className="px-7 py-6">
              <form onSubmit={e => { e.preventDefault(); handleCreateFee(); }}>
                {[
                  { label:'Select Student *', required: true, el:
                    <select value={createFeeData.studentId} onChange={e=>setCreateFeeData({...createFeeData,studentId:e.target.value})} required className={selectCls} style={{background:'rgba(255,255,255,0.07)'}}>
                      <option value="" style={{background:'#1a1535'}}>Choose a student</option>
                      {students.map(s=><option key={s._id} value={s._id} style={{background:'#1a1535'}}>{s.name} - {s.email}</option>)}
                    </select> },
                  { label:'Select Course *', required: true, el:
                    <select value={createFeeData.courseId} onChange={e=>{const c=courses.find(x=>x._id===e.target.value);setCreateFeeData({...createFeeData,courseId:e.target.value,totalFees:c?.fees||''})}} required className={selectCls} style={{background:'rgba(255,255,255,0.07)'}}>
                      <option value="" style={{background:'#1a1535'}}>Choose a course</option>
                      {courses.map(c=><option key={c._id} value={c._id} style={{background:'#1a1535'}}>{c.courseName} - {c.courseCode} (₹{c.fees})</option>)}
                    </select> },
                  { label:'Total Fees (₹) *', el:
                    <input type="number" value={createFeeData.totalFees} onChange={e=>setCreateFeeData({...createFeeData,totalFees:e.target.value})} required min="1" step="1" placeholder="Enter total fees" className={inputCls} /> },
                  { label:'Initial Payment Amount (₹) (Optional)', el:
                    <><input type="number" value={createFeeData.paidAmount} onChange={e=>setCreateFeeData({...createFeeData,paidAmount:e.target.value})} min="0" step="1" placeholder="Enter initial payment" className={inputCls} />
                    {createFeeData.paidAmount&&parseFloat(createFeeData.paidAmount)>parseFloat(createFeeData.totalFees)&&<p className="text-[#f87171] text-xs mt-1">Paid amount cannot exceed total fees</p>}</> },
                ].map((f,i) => (
                  <div key={i} className="mb-[18px]">
                    <label className="block mb-[7px] font-semibold text-white/75 text-[.85rem] uppercase tracking-[.6px]">{f.label}</label>
                    {f.el}
                  </div>
                ))}

                {createFeeData.paidAmount && parseFloat(createFeeData.paidAmount) > 0 && (
                  <>
                    <div className="mb-[18px]">
                      <label className="block mb-[7px] font-semibold text-white/75 text-[.85rem] uppercase tracking-[.6px]">Payment Mode</label>
                      <select value={createFeeData.paymentMode} onChange={e=>setCreateFeeData({...createFeeData,paymentMode:e.target.value})} className={selectCls} style={{background:'rgba(255,255,255,0.07)'}}>
                        {paymentModes.map(m=><option key={m} value={m} style={{background:'#1a1535'}}>{m}</option>)}
                      </select>
                    </div>
                    <div className="mb-[18px]">
                      <label className="block mb-[7px] font-semibold text-white/75 text-[.85rem] uppercase tracking-[.6px]">Transaction ID (Optional)</label>
                      <input type="text" value={createFeeData.transactionId} onChange={e=>setCreateFeeData({...createFeeData,transactionId:e.target.value})} placeholder="Enter transaction ID" className={inputCls} />
                    </div>
                  </>
                )}

                <div className="mb-[18px]">
                  <label className="block mb-[7px] font-semibold text-white/75 text-[.85rem] uppercase tracking-[.6px]">Remarks (Optional)</label>
                  <textarea value={createFeeData.remarks} onChange={e=>setCreateFeeData({...createFeeData,remarks:e.target.value})} rows="3" placeholder="Enter any remarks"
                    className={inputCls + " resize-y min-h-[90px]"} />
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-white/[0.08]">
                  <button type="button" onClick={() => setShowCreateModal(false)}
                    className="px-6 py-3 rounded-[10px] bg-white/[0.07] border border-white/[0.12] text-white/70 font-semibold text-[.9rem] cursor-pointer transition-all duration-200 hover:bg-white/[0.12] hover:text-white">
                    Cancel
                  </button>
                  <button type="submit" disabled={!!(createFeeData.paidAmount&&parseFloat(createFeeData.paidAmount)>parseFloat(createFeeData.totalFees))}
                    className="px-6 py-3 rounded-[10px] text-white font-bold text-[.9rem] border-none cursor-pointer transition-all duration-250 disabled:opacity-45 disabled:cursor-not-allowed hover:not-disabled:-translate-y-0.5 hover:not-disabled:shadow-[0_10px_24px_rgba(124,58,237,0.5)]"
                    style={{ background:'linear-gradient(135deg,#a78bfa,#7c3aed)', boxShadow:'0 6px 16px rgba(124,58,237,0.35)' }}>
                    Create Fee Record
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ── Student Details Modal ── */}
      {showPaymentModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000] backdrop-blur-[6px] p-4"
          onClick={() => setShowPaymentModal(false)}>
          <div className="bg-[#1a1535] border border-white/[0.12] rounded-3xl w-full max-w-[800px] max-h-[90vh] overflow-y-auto shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
            onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center px-7 py-[22px] border-b border-white/[0.08] sticky top-0 bg-[#1a1535] z-10 rounded-t-3xl">
              <h2 className="text-[1.2rem] text-white font-bold m-0">Fee Details — {selectedStudent.name}</h2>
              <button onClick={() => setShowPaymentModal(false)}
                className="w-8 h-8 flex items-center justify-center bg-white/[0.08] border border-white/[0.12] rounded-lg text-[1.3rem] cursor-pointer text-white/60 transition-all duration-200 hover:bg-[rgba(248,113,113,0.2)] hover:border-[rgba(248,113,113,0.4)] hover:text-[#f87171]">
                ×
              </button>
            </div>

            <div className="px-7 py-6">
              {/* Student info */}
              <div className="bg-white/[0.05] border border-white/[0.08] rounded-xl p-4 mb-5">
                <p className="my-1.5 text-white/65 text-[.9rem]"><strong className="text-white/90">Email:</strong> {selectedStudent.email}</p>
                <p className="my-1.5 text-white/65 text-[.9rem]"><strong className="text-white/90">Phone:</strong> {selectedStudent.phone}</p>
              </div>

              <h3 className="text-base text-white/80 font-bold mb-4">Course-wise Fee Breakdown</h3>

              <div className="flex flex-col gap-4">
                {getStudentFees(selectedStudent._id).map(fee => (
                  <div key={fee._id} className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-base text-white font-semibold m-0">{fee.course?.courseName||'Course'}</h4>
                      <StatusBadge status={fee.status} />
                    </div>

                    {/* Fee rows */}
                    <div className="bg-white/[0.03] rounded-[10px] p-3.5 mb-3">
                      {[
                        { label:'Total Fee:',    val: formatCurrency(fee.totalFees),    cls:'text-white/90' },
                        { label:'Paid Amount:',  val: formatCurrency(fee.paidAmount),   cls:'text-[#34d399]' },
                        { label:'Pending Amount:',val:formatCurrency(fee.pendingAmount),cls:'text-[#f87171]' },
                      ].map((r,i)=>(
                        <div key={i} className="flex justify-between py-[7px] border-b border-white/[0.06] last:border-b-0 text-[.88rem] text-white/55">
                          <span>{r.label}</span>
                          <strong className={r.cls}>{r.val}</strong>
                        </div>
                      ))}
                    </div>

                    {/* Payment history */}
                    {fee.payments?.length > 0 && (
                      <div className="mb-3">
                        <h5 className="text-[.82rem] text-white/45 font-semibold uppercase tracking-[.8px] m-0 mb-2">Payment History</h5>
                        {fee.payments.map((p,i) => (
                          <div key={i} className="flex flex-wrap items-center gap-3 px-3 py-2 bg-white/[0.04] rounded-lg mb-1.5 text-[.83rem]">
                            <span className="text-white/45 min-w-[90px]">{new Date(p.paymentDate).toLocaleDateString()}</span>
                            <span className="text-[#34d399] font-bold min-w-[90px]">{formatCurrency(p.amount)}</span>
                            <span className="text-white/60">{p.paymentMode}</span>
                            {p.transactionId && <span className="text-white/35 text-[.78rem]">ID: {p.transactionId}</span>}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add payment */}
                    <div className="bg-white/[0.04] border border-[rgba(167,139,250,0.2)] rounded-xl p-4">
                      <h5 className="text-[.82rem] text-white/45 font-semibold uppercase tracking-[.8px] m-0 mb-3">Add Payment</h5>
                      <div className="flex gap-2.5 mb-2.5 max-sm:flex-col">
                        <input type="number" placeholder="Amount" value={paymentData.amount}
                          onChange={e=>setPaymentData({...paymentData,amount:e.target.value})} className={inputCls} />
                        <select value={paymentData.paymentMode} onChange={e=>setPaymentData({...paymentData,paymentMode:e.target.value})}
                          className={selectCls} style={{background:'rgba(255,255,255,0.06)'}}>
                          {paymentModes.map(m=><option key={m} value={m} style={{background:'#1a1535'}}>{m}</option>)}
                        </select>
                      </div>
                      <input type="text" placeholder="Transaction ID (optional)" value={paymentData.transactionId}
                        onChange={e=>setPaymentData({...paymentData,transactionId:e.target.value})} className={inputCls + " mb-2.5"} />
                      <input type="text" placeholder="Remarks (optional)" value={paymentData.remarks}
                        onChange={e=>setPaymentData({...paymentData,remarks:e.target.value})} className={inputCls + " mb-3"} />
                      <button onClick={() => handleAddPayment(fee._id)}
                        className="w-full py-3 rounded-[10px] text-white font-bold text-[.9rem] border-none cursor-pointer mt-1 transition-all duration-250 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(124,58,237,0.5)]"
                        style={{ background:'linear-gradient(135deg,#a78bfa,#7c3aed)', boxShadow:'0 6px 16px rgba(124,58,237,0.35)' }}>
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