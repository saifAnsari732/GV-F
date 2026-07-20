"use client";
import Link from "next/link";
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  FaCertificate, FaPlus, FaTrash, FaSearch,
  FaCheckCircle, FaTimesCircle, FaEye,
  FaDownload, FaExclamationTriangle, FaEdit
} from 'react-icons/fa';
import { useParams } from 'next/navigation';
import confetti from 'canvas-confetti';

const G = 'linear-gradient(135deg,#00D4FF,#7C3AED)';

// ─── CREATE CERTIFICATE FORM ───────────────────────────────
export const CreateCertificate = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    student: '',
    course: '',
    studentName: '',
    courseName: '',
    type: 'both',
    issueDate: new Date().toISOString().split('T')[0],
    remarks: '',
    marksheet: {
      subjects: [{ subject: '', marksObtained: '', totalMarks: 100 }]
    },
    certificate: {
      achievement: '',
      description: ''
    }
  });

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get('/api/students');
      setStudents(res.data.data || []);
    } catch (e) { console.error(e); }
  };

  const fetchCourses = async () => {
    try {
      const res = await api.get('/api/courses');
      setCourses(res.data.data || []);
    } catch (e) { console.error(e); }
  };

  const handleStudentChange = (e) => {
    const student = students.find(s => s._id === e.target.value);
    setForm(prev => ({
      ...prev,
      student: e.target.value,
      studentName: student ? student.name : ''
    }));
  };

  const handleCourseChange = (e) => {
    const course = courses.find(c => c._id === e.target.value);
    setForm(prev => ({
      ...prev,
      course: e.target.value,
      courseName: course ? course.courseName : ''
    }));
  };

  const addSubject = () => {
    setForm(prev => ({
      ...prev,
      marksheet: {
        ...prev.marksheet,
        subjects: [...prev.marksheet.subjects, { subject: '', marksObtained: '', totalMarks: 100 }]
      }
    }));
  };

  const removeSubject = (index) => {
    setForm(prev => ({
      ...prev,
      marksheet: {
        ...prev.marksheet,
        subjects: prev.marksheet.subjects.filter((_, i) => i !== index)
      }
    }));
  };

  const updateSubject = (index, field, value) => {
    setForm(prev => {
      const subjects = [...prev.marksheet.subjects];
      subjects[index] = { ...subjects[index], [field]: value };
      return { ...prev, marksheet: { ...prev.marksheet, subjects } };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/api/certificates', form);
      setSuccess('Certificate created successfully!');
      setForm({
        student: '', course: '', studentName: '', courseName: '',
        type: 'both', issueDate: new Date().toISOString().split('T')[0], remarks: '',
        marksheet: { subjects: [{ subject: '', marksObtained: '', totalMarks: 100 }] },
        certificate: { achievement: '', description: '' }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Live percentage calculation
  const calcPercentage = () => {
    const subjects = form.marksheet.subjects;
    const total = subjects.reduce((s, sub) => s + Number(sub.totalMarks || 0), 0);
    const obtained = subjects.reduce((s, sub) => s + Number(sub.marksObtained || 0), 0);
    if (!total) return { percentage: 0, grade: '-', result: '-' };
    const pct = (obtained / total) * 100;
    let grade = 'F', result = 'Fail';
    if (pct >= 75) { grade = 'A+'; result = 'Distinction'; }
    else if (pct >= 60) { grade = 'A'; result = 'First Class'; }
    else if (pct >= 50) { grade = 'B'; result = 'Second Class'; }
    else if (pct >= 33) { grade = 'C'; result = 'Pass'; }
    return { percentage: pct.toFixed(1), grade, result, obtained, total };
  };

  const stats = calcPercentage();

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 pt-24 relative overflow-hidden">
      {/* Mesh decorative BG */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: 'radial-gradient(ellipse at 10% 15%,rgba(6,182,212,0.05) 0%,transparent 50%),radial-gradient(ellipse at 90% 80%,rgba(124,58,237,0.05) 0%,transparent 50%)'
      }} />

      <div className="max-w-4xl mx-auto relative z-10 font-['Space_Grotesk',sans-serif]">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/25">
            <FaCertificate className="text-3xl text-white animate-pulse" />
          </div>
          <h1 className="font-['Syne',sans-serif] text-3xl font-extrabold text-gray-900">Issue Certificate / Marksheet</h1>
          <p className="text-gray-500 mt-2 text-sm font-medium">Create and issue certificates for students</p>
        </div>

        {success && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200/60 text-emerald-700 px-5 py-4 rounded-xl flex items-center gap-3 font-semibold text-sm">
            <FaCheckCircle className="text-emerald-500 text-lg" /> {success}
          </div>
        )}
        {error && (
          <div className="mb-6 bg-rose-50 border border-rose-200/60 text-rose-700 px-5 py-4 rounded-xl flex items-center gap-3 font-semibold text-sm">
            <FaTimesCircle className="text-rose-500 text-lg" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Info */}
          <div className="bg-white border border-gray-200/80 rounded-3xl p-6 shadow-sm">
            <h2 className="font-['Syne',sans-serif] text-lg font-extrabold text-gray-900 mb-5">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Student *</label>
                <select
                  value={form.student}
                  onChange={handleStudentChange}
                  required
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all text-sm cursor-pointer font-semibold"
                >
                  <option value="">Select Student</option>
                  {students.map(s => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Course *</label>
                <select
                  value={form.course}
                  onChange={handleCourseChange}
                  required
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all text-sm cursor-pointer font-semibold"
                >
                  <option value="">Select Course</option>
                  {courses.map(c => (
                    <option key={c._id} value={c._id}>{c.courseName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Type *</label>
                <select
                  value={form.type}
                  onChange={e => setForm(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all text-sm cursor-pointer font-semibold"
                >
                  <option value="both">Both (Marksheet + Certificate)</option>
                  <option value="marksheet">Marksheet Only</option>
                  <option value="certificate">Certificate Only</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Issue Date *</label>
                <input
                  type="date"
                  value={form.issueDate}
                  onChange={e => setForm(prev => ({ ...prev, issueDate: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all text-sm font-semibold"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Remarks</label>
                <input
                  type="text"
                  value={form.remarks}
                  onChange={e => setForm(prev => ({ ...prev, remarks: e.target.value }))}
                  placeholder="Optional remarks..."
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all text-sm"
                />
              </div>
            </div>
          </div>

          {/* Marksheet Section */}
          {(form.type === 'marksheet' || form.type === 'both') && (
            <div className="bg-white border border-gray-200/80 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-['Syne',sans-serif] text-lg font-extrabold text-gray-900">Marksheet / Subjects</h2>
                <button
                  type="button"
                  onClick={addSubject}
                  className="flex items-center gap-2 bg-cyan-50 border border-cyan-200 text-cyan-600 hover:bg-cyan-100/60 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm"
                >
                  <FaPlus /> Add Subject
                </button>
              </div>

              <div className="space-y-3 mb-5">
                {form.marksheet.subjects.map((sub, i) => (
                  <div key={i} className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-5">
                      <input
                        type="text"
                        placeholder="Subject name"
                        value={sub.subject}
                        onChange={e => updateSubject(i, 'subject', e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500 text-sm"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="number"
                        placeholder="Obtained"
                        value={sub.marksObtained}
                        onChange={e => updateSubject(i, 'marksObtained', e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500 text-sm"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="number"
                        placeholder="Total"
                        value={sub.totalMarks}
                        onChange={e => updateSubject(i, 'totalMarks', e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500 text-sm"
                      />
                    </div>
                    <div className="col-span-1 flex justify-center">
                      {form.marksheet.subjects.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSubject(i)}
                          className="text-rose-500 hover:text-rose-700 transition-colors"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Live Stats */}
              <div className="grid grid-cols-4 gap-4 bg-gray-50 border border-gray-200/80 rounded-2xl p-4">
                <div className="text-center border-r border-gray-200 last:border-r-0">
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Obtained</p>
                  <p className="text-gray-900 font-extrabold text-base">{stats.obtained || 0}/{stats.total || 0}</p>
                </div>
                <div className="text-center border-r border-gray-200 last:border-r-0">
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Percentage</p>
                  <p className="text-cyan-600 font-extrabold text-base">{stats.percentage}%</p>
                </div>
                <div className="text-center border-r border-gray-200 last:border-r-0">
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Grade</p>
                  <p className="text-amber-500 font-extrabold text-base">{stats.grade}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Result</p>
                  <p className={`font-extrabold text-base ${stats.result === 'Fail' ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {stats.result}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Certificate Section */}
          {(form.type === 'certificate' || form.type === 'both') && (
            <div className="bg-white border border-gray-200/80 rounded-3xl p-6 shadow-sm">
              <h2 className="font-['Syne',sans-serif] text-lg font-extrabold text-gray-900 mb-5">Certificate Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Achievement</label>
                  <input
                    type="text"
                    value={form.certificate.achievement}
                    onChange={e => setForm(prev => ({ ...prev, certificate: { ...prev.certificate, achievement: e.target.value } }))}
                    placeholder="e.g. Successfully completed DCA course"
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Description</label>
                  <textarea
                    value={form.certificate.description}
                    onChange={e => setForm(prev => ({ ...prev, certificate: { ...prev.certificate, description: e.target.value } }))}
                    placeholder="Certificate description..."
                    rows={3}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-[15px]"
          >
            {loading ? 'Creating...' : '🎓 Issue Certificate'}
          </button>
        </form>
      </div>
    </div>
  );
};

// ─── ALL CERTIFICATES LIST (ADMIN) ─────────────────────────
export const CertificateList = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');

  // Edit Certificate modal states
  const [editingCert, setEditingCert] = useState(null);
  const [editForm, setEditForm] = useState({
    studentName: '',
    courseName: '',
    certificateNumber: '',
    type: 'both',
    issueDate: '',
    remarks: '',
    marksheet: {
      subjects: []
    }
  });

  const handleEditClick = (cert) => {
    setEditingCert(cert);
    setEditForm({
      studentName: cert.studentName || '',
      courseName: cert.courseName || '',
      certificateNumber: cert.certificateNumber || '',
      type: cert.type || 'both',
      issueDate: cert.issueDate ? cert.issueDate.split('T')[0] : '',
      remarks: cert.remarks || '',
      marksheet: {
        subjects: cert.marksheet?.subjects || []
      }
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/api/certificates/${editingCert._id}`, editForm);
      if (response.data.success) {
        setCertificates(prev => prev.map(c => c._id === editingCert._id ? response.data.data : c));
        setEditingCert(null);
        alert('Certificate updated successfully!');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update certificate');
    }
  };

  const addEditSubject = () => {
    setEditForm(prev => ({
      ...prev,
      marksheet: {
        ...prev.marksheet,
        subjects: [...prev.marksheet.subjects, { subject: '', marksObtained: '', totalMarks: 100 }]
      }
    }));
  };

  const removeEditSubject = (index) => {
    setEditForm(prev => ({
      ...prev,
      marksheet: {
        ...prev.marksheet,
        subjects: prev.marksheet.subjects.filter((_, i) => i !== index)
      }
    }));
  };

  const updateEditSubject = (index, field, value) => {
    setEditForm(prev => {
      const subjects = [...prev.marksheet.subjects];
      subjects[index] = { ...subjects[index], [field]: value };
      return { ...prev, marksheet: { ...prev.marksheet, subjects } };
    });
  };

  useEffect(() => { fetchCertificates(); }, []);

  const fetchCertificates = async () => {
    try {
      const res = await api.get('/api/certificates');
      setCertificates(res.data.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this certificate?')) return;
    try {
      await api.delete(`/api/certificates/${id}`);
      setCertificates(prev => prev.filter(c => c._id !== id));
    } catch (e) { console.error(e); }
  };

  const filtered = certificates.filter(c => {
    const matchSearch = !search ||
      c.studentName?.toLowerCase().includes(search.toLowerCase()) ||
      c.courseName?.toLowerCase().includes(search.toLowerCase()) ||
      c.certificateNumber?.toLowerCase().includes(search.toLowerCase());
    const matchType = !filterType || c.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 pt-24 relative overflow-hidden">
      {/* Mesh decorative BG */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: 'radial-gradient(ellipse at 10% 15%,rgba(6,182,212,0.05) 0%,transparent 50%),radial-gradient(ellipse at 90% 80%,rgba(124,58,237,0.05) 0%,transparent 50%)'
      }} />

      <div className="max-w-6xl mx-auto relative z-10 font-['Space_Grotesk',sans-serif]">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="block text-[11px] font-bold tracking-[2.5px] uppercase text-cyan-600 mb-1.5 font-sans">Certificate Records</span>
            <h1 className="font-['Syne',sans-serif] text-3xl font-extrabold leading-tight text-gray-900">All Issued Certificates</h1>
            <p className="text-gray-500 mt-1 text-sm font-medium">{filtered.length} certificates found</p>
          </div>
          <Link href="/admin/certificates/create"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:scale-[1.01] transition-transform shadow-md hover:shadow-cyan-500/20">
            <FaPlus /> Issue New
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, course, certificate number..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all shadow-sm placeholder-gray-400 text-sm"
            />
          </div>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="bg-white border border-gray-200 text-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all shadow-sm text-sm cursor-pointer font-bold"
          >
            <option value="">All Types</option>
            <option value="marksheet">Marksheet</option>
            <option value="certificate">Certificate</option>
            <option value="both">Both</option>
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl h-36 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400 font-bold bg-white border border-gray-200/85 rounded-3xl shadow-sm">No certificates found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map(cert => (
              <div key={cert._id} className="bg-white border border-gray-200/80 rounded-2xl p-5 hover:shadow-md transition-all shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-cyan-500 to-blue-600" />
                <div className="flex items-start justify-between mb-3 pl-2">
                  <div>
                    <h3 className="text-gray-900 font-bold text-base leading-tight font-['Syne',sans-serif]">{cert.studentName}</h3>
                    <p className="text-gray-500 text-xs font-semibold mt-0.5">{cert.courseName}</p>
                    <p className="text-cyan-700 text-xs mt-1.5 font-mono font-bold tracking-wide">{cert.certificateNumber}</p>
                  </div>
                  <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider border shrink-0 ${
                    cert.type === 'both' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                    cert.type === 'marksheet' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {cert.type}
                  </span>
                </div>

                {cert.marksheet?.percentage && (
                  <div className="flex gap-2 mb-3 pl-2 flex-wrap">
                    <span className="text-[11px] bg-gray-50 border border-gray-200 text-gray-700 px-2 py-0.5 rounded-lg font-bold">
                      {cert.marksheet.percentage}%
                    </span>
                    <span className="text-[11px] bg-gray-50 border border-gray-200 text-gray-700 px-2 py-0.5 rounded-lg font-bold">
                      Grade: {cert.marksheet.grade}
                    </span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-lg font-bold border ${
                      cert.marksheet.result === 'Fail' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {cert.marksheet.result}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-2 pl-2">
                  <span className="text-gray-400 text-[11px] font-bold">
                    Issued: {new Date(cert.issueDate).toLocaleDateString('en-IN')}
                  </span>
                  <div className="flex gap-2">
                    <Link href={`/certificates/${cert._id}`}
                      className="text-cyan-600 hover:text-cyan-800 bg-cyan-50 hover:bg-cyan-100 p-2 rounded-lg transition-all border border-cyan-200/50">
                      <FaEye className="text-sm" />
                    </Link>
                    <button
                      onClick={() => handleEditClick(cert)}
                      className="text-amber-600 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 p-2 rounded-lg transition-all border border-amber-200/50">
                      <FaEdit className="text-sm" />
                    </button>
                    <button
                      onClick={() => handleDelete(cert._id)}
                      className="text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 p-2 rounded-lg transition-all border border-rose-200/50">
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Certificate Modal */}
      {editingCert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                <h2 className="font-['Syne',sans-serif] text-xl font-extrabold text-gray-900">Edit Certificate Details</h2>
                <button
                  onClick={() => setEditingCert(null)}
                  className="w-8 h-8 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg text-lg cursor-pointer text-gray-400 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 font-bold"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Student Name</label>
                    <input
                      type="text"
                      value={editForm.studentName}
                      onChange={e => setEditForm(prev => ({ ...prev, studentName: e.target.value }))}
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-cyan-500 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Course Name</label>
                    <input
                      type="text"
                      value={editForm.courseName}
                      onChange={e => setEditForm(prev => ({ ...prev, courseName: e.target.value }))}
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-cyan-500 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Certificate Number</label>
                    <input
                      type="text"
                      value={editForm.certificateNumber}
                      onChange={e => setEditForm(prev => ({ ...prev, certificateNumber: e.target.value }))}
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-cyan-500 font-mono text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Issue Date</label>
                    <input
                      type="date"
                      value={editForm.issueDate}
                      onChange={e => setEditForm(prev => ({ ...prev, issueDate: e.target.value }))}
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-cyan-500 text-gray-900"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Remarks</label>
                    <input
                      type="text"
                      value={editForm.remarks}
                      onChange={e => setEditForm(prev => ({ ...prev, remarks: e.target.value }))}
                      placeholder="Remarks..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500 text-gray-900"
                    />
                  </div>
                </div>

                {/* Marksheet Subjects Edit Section */}
                {(editForm.type === 'marksheet' || editForm.type === 'both') && (
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-['Syne',sans-serif] text-sm font-bold text-gray-900">Marksheet / Subjects</h4>
                      <button
                        type="button"
                        onClick={addEditSubject}
                        className="bg-cyan-50 border border-cyan-200 text-cyan-600 px-3 py-1.5 rounded-lg text-xs font-bold"
                      >
                        + Add Subject
                      </button>
                    </div>
                    <div className="space-y-2.5 max-h-[200px] overflow-y-auto pr-1">
                      {editForm.marksheet?.subjects?.map((sub, i) => (
                        <div key={i} className="grid grid-cols-12 gap-2.5 items-center">
                          <div className="col-span-6">
                            <input
                              type="text"
                              placeholder="Subject"
                              value={sub.subject}
                              onChange={e => updateEditSubject(i, 'subject', e.target.value)}
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-semibold text-gray-900"
                            />
                          </div>
                          <div className="col-span-3">
                            <input
                              type="number"
                              placeholder="Obtained"
                              value={sub.marksObtained}
                              onChange={e => updateEditSubject(i, 'marksObtained', e.target.value)}
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-semibold text-gray-900"
                            />
                          </div>
                          <div className="col-span-2">
                            <input
                              type="number"
                              placeholder="Total"
                              value={sub.totalMarks}
                              onChange={e => updateEditSubject(i, 'totalMarks', e.target.value)}
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-semibold text-gray-900"
                            />
                          </div>
                          <div className="col-span-1 text-center">
                            <button
                              type="button"
                              onClick={() => removeEditSubject(i)}
                              className="text-rose-500 hover:text-rose-700 text-sm"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2.5 border-t border-gray-100 pt-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setEditingCert(null)}
                    className="px-5 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-600 font-bold text-sm hover:bg-gray-200/80"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl text-sm shadow-md"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


// ─── VERIFY CERTIFICATE (PUBLIC) ───────────────────────────
export const VerifyCertificate = () => {
  const [certNumber, setCertNumber] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await api.get(`/api/certificates/verify/${certNumber}`);
      setResult(res.data);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00D4FF', '#7C3AED', '#10B981', '#F59E0B']
      });
    } catch (err) {
        console.log(err);
      setError('Certificate not found or invalid');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex items-center justify-center px-4 pt-24 pb-12 relative overflow-hidden">
      {/* Mesh decorative BG */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: 'radial-gradient(ellipse at 10% 15%,rgba(6,182,212,0.05) 0%,transparent 50%),radial-gradient(ellipse at 90% 80%,rgba(124,58,237,0.05) 0%,transparent 50%)'
      }} />

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/20">
            <FaCertificate className="text-3xl text-white animate-pulse" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 font-['Syne',sans-serif]">Verify Certificate</h1>
          <p className="text-gray-500 mt-2 font-medium">Enter certificate number to verify authenticity</p>
        </div>

        <form onSubmit={handleVerify} className="bg-white border border-gray-200/80 shadow-md shadow-gray-100 rounded-3xl p-7">
          <input
            type="text"
            value={certNumber}
            onChange={e => setCertNumber(e.target.value)}
            placeholder="e.g. GV-1234567890-0001"
            required
            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all mb-4"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl shadow-md transition-all hover:shadow-cyan-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Verifying...' : 'Verify Certificate'}
          </button>
        </form>

        {error && (
          <div className="mt-4 bg-rose-50 border border-rose-200/60 text-rose-700 px-5 py-4 rounded-2xl flex items-center gap-3 font-semibold text-sm">
            <FaTimesCircle className="text-rose-500 text-lg shrink-0" /> {error}
          </div>
        )}

        {result && (
          <div className="mt-4 bg-white border border-gray-200/85 rounded-3xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <FaCheckCircle className="text-emerald-500 text-xl" />
              <span className="text-emerald-600 font-bold text-lg">Certificate Valid ✓</span>
            </div>
            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500 font-semibold">Student</span>
                <span className="text-gray-900 font-bold">{result.data.studentName}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500 font-semibold">Course</span>
                <span className="text-gray-900 font-bold">{result.data.courseName}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500 font-semibold">Issue Date</span>
                <span className="text-gray-900 font-bold">{new Date(result.data.issueDate).toLocaleDateString('en-IN')}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500 font-semibold">Type</span>
                <span className="text-cyan-700 bg-cyan-50 border border-cyan-200/60 px-2 py-0.5 rounded-full text-xs font-bold capitalize">{result.data.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-semibold">Status</span>
                <span className="text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full text-xs font-bold capitalize">{result.data.status}</span>
              </div>
            </div>
            <div className="mt-5 pt-5 border-t border-gray-100">
              <Link href={`/certificates/${result.data._id}`}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold py-3.5 rounded-xl shadow-md transition-all hover:shadow-emerald-500/20 flex items-center justify-center gap-2">
                <FaDownload /> View & Download
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const CertificateDetail = () => {
  const { id } = useParams();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/api/certificates/${id}`);
        setCert(res.data.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, [id]);

  const getMarksheetStats = () => {
    if (!cert || !cert.marksheet || !cert.marksheet.subjects) {
      return { obtained: 0, total: 0, percentage: 0, grade: '-', result: '-' };
    }
    const subjects = cert.marksheet.subjects;
    const total = cert.marksheet.totalMarks || subjects.reduce((sum, s) => sum + Number(s.totalMarks || 0), 0);
    const obtained = cert.marksheet.obtainedMarks || subjects.reduce((sum, s) => sum + Number(s.marksObtained || 0), 0);
    
    let percentage = cert.marksheet.percentage;
    if (percentage === undefined || percentage === null || isNaN(percentage)) {
      percentage = total > 0 ? ((obtained / total) * 100).toFixed(1) : 0;
    }
    
    let grade = cert.marksheet.grade;
    if (!grade || grade === '-') {
      const pct = Number(percentage);
      if (pct >= 75) grade = 'A+';
      else if (pct >= 60) grade = 'A';
      else if (pct >= 50) grade = 'B';
      else if (pct >= 33) grade = 'C';
      else grade = 'F';
    }

    let result = cert.marksheet.result;
    if (!result || result === '-') {
      const pct = Number(percentage);
      if (pct >= 75) result = 'Distinction';
      else if (pct >= 60) result = 'First Class';
      else if (pct >= 50) result = 'Second Class';
      else if (pct >= 33) result = 'Pass';
      else result = 'Fail';
    }

    return { obtained, total, percentage, grade, result };
  };

  const finalStats = getMarksheetStats();

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
      <div className="flex flex-col items-center gap-4">
        <div className="w-11 h-11 rounded-full border-[3px] border-cyan-500/20 border-t-cyan-500 animate-spin" />
        <p className="text-gray-500 font-medium">Loading certificate details...</p>
      </div>
    </div>
  );

  if (!cert) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
      <div className="flex flex-col items-center gap-3 text-center px-4">
        <FaExclamationTriangle className="text-rose-500 text-4xl mb-1" />
        <h3 className="text-xl font-bold text-gray-900">Certificate not found</h3>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100/60 py-12 px-4 pt-24 relative overflow-hidden print:overflow-visible print:p-0 print:bg-white print:pt-0">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;800&family=Playfair+Display:ital,wght@0,600;0,800;1,500&family=Great+Vibes&display=swap');
        
        .cert-card {
          font-family: 'Playfair Display', serif;
          border: 12px double #d4af37;
          background: #fdfbf7;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          position: relative;
        }

        .cert-title-font {
          font-family: 'Cinzel', serif;
          letter-spacing: 2px;
        }

        .cert-name-font {
          font-family: 'Great Vibes', cursive;
        }

        @media print {
          @page {
            size: portrait;
            margin: 10mm !important;
          }
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
          }
          nav, header, footer, .no-print {
            display: none !important;
          }
          .print-m-0 {
            margin: 0 auto !important;
            padding: 40px !important;
            box-shadow: none !important;
            border: 4px solid #d4af37 !important;
            border-radius: 0 !important;
            background: white !important;
            min-height: auto !important;
            display: block !important;
            overflow: visible !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .cert-card {
            box-shadow: none !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>

      <div className="max-w-4xl mx-auto relative z-10 print:overflow-visible">

        <div className="cert-card bg-white rounded-3xl p-8 sm:p-12 relative overflow-hidden print:overflow-visible print-m-0">
          
          <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-[#d4af37] print:hidden" />
          <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-[#d4af37] print:hidden" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-[#d4af37] print:hidden" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-[#d4af37] print:hidden" />

          <div className="flex flex-col items-center text-center pb-4 print:pb-2 border-b border-[#d4af37]/30 mb-6 print:mb-3">
            <img src="/gv-logo.jpg" alt="GV Logo" className="h-20 w-20 print:h-12 print:w-12 object-contain rounded-full border border-gray-200 shadow-sm mb-2.5 print:mb-1.5" />
            <h1 className="cert-title-font text-3xl sm:text-4xl print:text-2xl font-extrabold text-[#111827] uppercase">
              GV Computer Center
            </h1>
            <p className="text-[10px] sm:text-xs print:text-[9.5px] font-bold text-gray-500 uppercase tracking-widest mt-1.5 print:mt-0.5 font-sans">
              An ISO 9001:2015 Certified Institution • Regd. Under Govt. of India
            </p>
            <p className="text-[9px] font-bold text-[#b4902d] uppercase tracking-wider mt-1 print:mt-0.5 font-sans">
              ISO certificate no: QMS/02345/0723
            </p>
            <p className="text-[9.5px] print:text-[8.5px] font-bold text-gray-800 uppercase tracking-wider mt-2.5 print:mt-1 font-sans max-w-lg leading-relaxed">
              Sarda Complex, Babu Bazar Rd, Fazilnagar, Dhanauji Kalon, Uttar Pradesh 274401
            </p>
            <p className="text-[9.5px] print:text-[8.5px] font-bold text-gray-800 uppercase tracking-wider mt-0.5 font-sans">
              Contact: 098385 31365
            </p>
          </div>

          <div className="text-center mb-6 print:mb-3">
            <h2 className="cert-title-font text-xl sm:text-2xl print:text-lg font-bold text-[#b4902d] tracking-[3px] uppercase">
              {cert.type === 'marksheet' ? 'Marksheet Certificate' : 'Certificate of Completion'}
            </h2>
            <div className="w-24 h-0.5 bg-[#d4af37] mx-auto mt-2 print:mt-1" />
          </div>

          <div className="text-center mb-6 print:mb-3">
            <p className="text-gray-500 italic text-base sm:text-lg print:text-sm">This is to certify that</p>
            <h3 className="cert-name-font text-4xl sm:text-5xl print:text-3xl font-bold text-[#111827] my-2 print:my-1 leading-none">
              {cert.studentName}
            </h3>
            <p className="text-gray-500 italic text-base sm:text-lg print:text-sm mb-2 print:mb-1">has successfully completed the prescribed course</p>
            <h4 className="cert-title-font text-xl sm:text-2xl print:text-lg font-extrabold text-cyan-600 uppercase tracking-wide">
              {cert.courseName}
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-4 print:gap-2 max-w-md mx-auto mb-6 print:mb-3 text-center font-sans text-xs">
            <div className="bg-white border border-gray-200/80 rounded-xl p-3 print:py-1.5 shadow-sm">
              <span className="block text-[10px] print:text-[8px] font-bold text-gray-400 uppercase tracking-wide">Certificate No.</span>
              <span className="text-cyan-700 font-mono font-bold text-[13px] print:text-xs">{cert.certificateNumber}</span>
            </div>
            <div className="bg-white border border-gray-200/80 rounded-xl p-3 print:py-1.5 shadow-sm">
              <span className="block text-[10px] print:text-[8px] font-bold text-gray-400 uppercase tracking-wide">Issue Date</span>
              <span className="text-gray-900 font-bold text-[13px] print:text-xs">{new Date(cert.issueDate).toLocaleDateString('en-IN')}</span>
            </div>
          </div>

          {cert.marksheet?.subjects?.length > 0 && (
            <div className="mb-6 print:mb-3 font-sans">
              <h3 className="cert-title-font text-sm print:text-xs font-bold text-[#b4902d] uppercase tracking-wider mb-2 print:mb-1.5 pl-1">
                Academic Performance
              </h3>
              <div className="overflow-x-auto border border-gray-200 rounded-2xl shadow-sm bg-white">
                <table className="w-full text-xs sm:text-sm print:text-[11px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold">
                      <th className="text-left px-4 py-3 print:py-2">Subject / Paper</th>
                      <th className="text-center px-4 py-3 print:py-2">Marks Obtained</th>
                      <th className="text-center px-4 py-3 print:py-2">Max Marks</th>
                      <th className="text-center px-4 py-3 print:py-2">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cert.marksheet.subjects.map((sub, i) => (
                      <tr key={i} className="border-b border-gray-100 last:border-b-0 font-semibold text-gray-700">
                        <td className="px-4 py-3 print:py-1.5 text-gray-900 font-bold uppercase">{sub.subject}</td>
                        <td className="text-center px-4 py-3 print:py-1.5">{sub.marksObtained}</td>
                        <td className="text-center px-4 py-3 print:py-1.5 text-gray-400">{sub.totalMarks}</td>
                        <td className="text-center text-cyan-600 px-4 py-3 print:py-1.5">
                          {((sub.marksObtained / sub.totalMarks) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-4 gap-3 print:gap-2 mt-3 text-center">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 print:py-1.5">
                  <span className="block text-[9px] print:text-[8px] font-bold text-gray-400 uppercase tracking-wide">Aggregate</span>
                  <span className="text-gray-900 font-extrabold text-sm print:text-xs mt-0.5 block">{finalStats.obtained}/{finalStats.total}</span>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 print:py-1.5">
                  <span className="block text-[9px] print:text-[8px] font-bold text-gray-400 uppercase tracking-wide">Percentage</span>
                  <span className="text-cyan-600 font-extrabold text-sm print:text-xs mt-0.5 block">{finalStats.percentage}%</span>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 print:py-1.5">
                  <span className="block text-[9px] print:text-[8px] font-bold text-gray-400 uppercase tracking-wide">Grade</span>
                  <span className="text-amber-600 font-extrabold text-sm print:text-xs mt-0.5 block">{finalStats.grade}</span>
                </div>
                <div className={`rounded-xl p-3 print:py-1.5 border ${finalStats.result === 'Fail' ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'}`}>
                  <span className="block text-[9px] print:text-[8px] font-bold text-gray-400 uppercase tracking-wide">Result</span>
                  <span className={`font-extrabold text-sm print:text-xs mt-0.5 block ${finalStats.result === 'Fail' ? 'text-rose-700' : 'text-emerald-700'}`}>
                    {finalStats.result}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="border-t-2 border-[#d4af37]/20 pt-6 print:pt-4 flex justify-between items-center mt-8 print:mt-4 font-sans">
            <div>
              <p className="text-gray-400 text-[10px] print:text-[8px] font-bold uppercase tracking-wider mb-0.5">Verification URL</p>
              <p className="text-cyan-600 text-xs print:text-[10px] font-mono font-bold">www.gvcomputer.com/verify</p>
            </div>
            <div className="text-right">
              <div className="h-6" /> {/* Blank space for actual physical signature */}
              <div className="w-32 border-t border-black mb-1.5 ml-auto" />
              <p className="text-black text-[10.5px] print:text-[9.5px] font-bold uppercase tracking-wider">Director</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-6 no-print">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-8 py-3.5 rounded-xl hover:scale-[1.01] transition-transform shadow-md hover:shadow-cyan-500/25"
          >
            <FaDownload /> Download / Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCertificate;