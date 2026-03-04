import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  FaCertificate, FaPlus, FaTrash, FaSearch,
  FaCheckCircle, FaTimesCircle, FaEye,
  FaDownload
} from 'react-icons/fa';
import { useParams } from 'react-router-dom';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-10 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FaCertificate className="text-3xl text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">Issue Certificate / Marksheet</h1>
          <p className="text-slate-400 mt-2">Create and issue certificates for students</p>
        </div>

        {success && (
          <div className="mb-6 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 px-5 py-4 rounded-xl flex items-center gap-3">
            <FaCheckCircle /> {success}
          </div>
        )}
        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-500/50 text-red-400 px-5 py-4 rounded-xl flex items-center gap-3">
            <FaTimesCircle /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Info */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg mb-5">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label className="text-slate-400 text-sm mb-1 block">Student *</label>
                <select
                  value={form.student}
                  onChange={handleStudentChange}
                  required
                  className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500"
                >
                  <option value="">Select Student</option>
                  {students.map(s => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 text-sm mb-1 block">Course *</label>
                <select
                  value={form.course}
                  onChange={handleCourseChange}
                  required
                  className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500"
                >
                  <option value="">Select Course</option>
                  {courses.map(c => (
                    <option key={c._id} value={c._id}>{c.courseName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 text-sm mb-1 block">Type *</label>
                <select
                  value={form.type}
                  onChange={e => setForm(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500"
                >
                  <option value="both">Both (Marksheet + Certificate)</option>
                  <option value="marksheet">Marksheet Only</option>
                  <option value="certificate">Certificate Only</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 text-sm mb-1 block">Issue Date *</label>
                <input
                  type="date"
                  value={form.issueDate}
                  onChange={e => setForm(prev => ({ ...prev, issueDate: e.target.value }))}
                  className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-slate-400 text-sm mb-1 block">Remarks</label>
                <input
                  type="text"
                  value={form.remarks}
                  onChange={e => setForm(prev => ({ ...prev, remarks: e.target.value }))}
                  placeholder="Optional remarks..."
                  className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Marksheet Section */}
          {(form.type === 'marksheet' || form.type === 'both') && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-white font-bold text-lg">Marksheet / Subjects</h2>
                <button
                  type="button"
                  onClick={addSubject}
                  className="flex items-center gap-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/50 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
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
                        className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500 text-sm"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="number"
                        placeholder="Obtained"
                        value={sub.marksObtained}
                        onChange={e => updateSubject(i, 'marksObtained', e.target.value)}
                        className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500 text-sm"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="number"
                        placeholder="Total"
                        value={sub.totalMarks}
                        onChange={e => updateSubject(i, 'totalMarks', e.target.value)}
                        className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500 text-sm"
                      />
                    </div>
                    <div className="col-span-1 flex justify-center">
                      {form.marksheet.subjects.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSubject(i)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Live Stats */}
              <div className="grid grid-cols-4 gap-4 bg-slate-900/50 rounded-xl p-4">
                <div className="text-center">
                  <p className="text-slate-400 text-xs mb-1">Obtained</p>
                  <p className="text-white font-bold">{stats.obtained || 0}/{stats.total || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-slate-400 text-xs mb-1">Percentage</p>
                  <p className="text-cyan-400 font-bold">{stats.percentage}%</p>
                </div>
                <div className="text-center">
                  <p className="text-slate-400 text-xs mb-1">Grade</p>
                  <p className="text-yellow-400 font-bold">{stats.grade}</p>
                </div>
                <div className="text-center">
                  <p className="text-slate-400 text-xs mb-1">Result</p>
                  <p className={`font-bold ${stats.result === 'Fail' ? 'text-red-400' : 'text-emerald-400'}`}>
                    {stats.result}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Certificate Section */}
          {(form.type === 'certificate' || form.type === 'both') && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
              <h2 className="text-white font-bold text-lg mb-5">Certificate Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-slate-400 text-sm mb-1 block">Achievement</label>
                  <input
                    type="text"
                    value={form.certificate.achievement}
                    onChange={e => setForm(prev => ({ ...prev, certificate: { ...prev.certificate, achievement: e.target.value } }))}
                    placeholder="e.g. Successfully completed DCA course"
                    className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-sm mb-1 block">Description</label>
                  <textarea
                    value={form.certificate.description}
                    onChange={e => setForm(prev => ({ ...prev, certificate: { ...prev.certificate, description: e.target.value } }))}
                    placeholder="Certificate description..."
                    rows={3}
                    className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-4 rounded-xl transition-all duration-300 hover:scale-[1.01] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-lg"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white">All Certificates</h1>
            <p className="text-slate-400 mt-1">{filtered.length} certificates found</p>
          </div>
          <a href="/admin/certificates/create"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:scale-105 transition-transform">
            <FaPlus /> Issue New
          </a>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, course, certificate number..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500"
          >
            <option value="">All Types</option>
            <option value="marksheet">Marksheet</option>
            <option value="certificate">Certificate</option>
            <option value="both">Both</option>
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-slate-800/50 rounded-2xl h-36 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">No certificates found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(cert => (
              <div key={cert._id} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 hover:border-cyan-500/50 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-bold text-lg">{cert.studentName}</h3>
                    <p className="text-slate-400 text-sm">{cert.courseName}</p>
                    <p className="text-cyan-400 text-xs mt-1 font-mono">{cert.certificateNumber}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                    cert.type === 'both' ? 'bg-purple-500/20 text-purple-400' :
                    cert.type === 'marksheet' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {cert.type}
                  </span>
                </div>

                {cert.marksheet?.percentage && (
                  <div className="flex gap-3 mb-3">
                    <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-lg">
                      {cert.marksheet.percentage}%
                    </span>
                    <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-lg">
                      Grade: {cert.marksheet.grade}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-lg ${
                      cert.marksheet.result === 'Fail' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {cert.marksheet.result}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-xs">
                    {new Date(cert.issueDate).toLocaleDateString('en-IN')}
                  </span>
                  <div className="flex gap-2">
                    <a href={`/certificates/${cert._id}`}
                      className="text-cyan-400 hover:text-cyan-300 p-2 rounded-lg hover:bg-cyan-500/10 transition-all">
                      <FaEye />
                    </a>
                    <button
                      onClick={() => handleDelete(cert._id)}
                      className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/10 transition-all">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
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
    } catch (err) {
        console.log(err);
      setError('Certificate not found or invalid');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FaCheckCircle className="text-3xl text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">Verify Certificate</h1>
          <p className="text-slate-400 mt-2">Enter certificate number to verify authenticity</p>
        </div>

        <form onSubmit={handleVerify} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <input
            type="text"
            value={certNumber}
            onChange={e => setCertNumber(e.target.value)}
            placeholder="e.g. GV-1234567890-0001"
            required
            className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-3 rounded-xl hover:scale-[1.01] transition-all disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify Certificate'}
          </button>
        </form>

        {error && (
          <div className="mt-4 bg-red-500/20 border border-red-500/50 text-red-400 px-5 py-4 rounded-xl flex items-center gap-3">
            <FaTimesCircle /> {error}
          </div>
        )}

        {result && (
          <div className="mt-4 bg-emerald-500/20 border border-emerald-500/50 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <FaCheckCircle className="text-emerald-400 text-xl" />
              <span className="text-emerald-400 font-bold text-lg">Certificate Valid ✓</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Student</span>
                <span className="text-white font-semibold">{result.data.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Course</span>
                <span className="text-white font-semibold">{result.data.courseName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Issue Date</span>
                <span className="text-white font-semibold">{new Date(result.data.issueDate).toLocaleDateString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Type</span>
                <span className="text-cyan-400 font-semibold capitalize">{result.data.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status</span>
                <span className="text-emerald-400 font-semibold capitalize">{result.data.status}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// cirtificate details 

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

  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </div>
  );

  if (!cert) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-red-400 text-xl">Certificate not found</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-10 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Certificate Card */}
        <div className="bg-slate-800/50 border-2 border-cyan-500/30 rounded-3xl overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-8 text-center">
            <FaCertificate className="text-5xl text-white mx-auto mb-3" />
            <h1 className="text-3xl font-extrabold text-white">Certificate of Completion</h1>
            <p className="text-white/80 mt-1">GV Computer Center</p>
          </div>

          <div className="p-8">
            {/* Student Info */}
            <div className="text-center mb-8">
              <p className="text-slate-400 text-sm mb-1">This is to certify that</p>
              <h2 className="text-4xl font-extrabold text-white mb-2">{cert.studentName}</h2>
              <p className="text-slate-400">has successfully completed</p>
              <h3 className="text-2xl font-bold text-cyan-400 mt-1">{cert.courseName}</h3>
            </div>

            {/* Certificate Number & Date */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-700/50 rounded-xl p-4 text-center">
                <p className="text-slate-400 text-xs mb-1">Certificate No.</p>
                <p className="text-cyan-400 font-mono font-bold text-sm">{cert.certificateNumber}</p>
              </div>
              <div className="bg-slate-700/50 rounded-xl p-4 text-center">
                <p className="text-slate-400 text-xs mb-1">Issue Date</p>
                <p className="text-white font-bold">{new Date(cert.issueDate).toLocaleDateString('en-IN')}</p>
              </div>
            </div>

            {/* Marksheet */}
            {cert.marksheet?.subjects?.length > 0 && (
              <div className="mb-8">
                <h3 className="text-white font-bold text-lg mb-4">Marksheet</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-700/50">
                        <th className="text-left text-slate-400 px-4 py-3 rounded-l-xl">Subject</th>
                        <th className="text-center text-slate-400 px-4 py-3">Obtained</th>
                        <th className="text-center text-slate-400 px-4 py-3">Total</th>
                        <th className="text-center text-slate-400 px-4 py-3 rounded-r-xl">%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cert.marksheet.subjects.map((sub, i) => (
                        <tr key={i} className="border-b border-slate-700/50">
                          <td className="text-white px-4 py-3">{sub.subject}</td>
                          <td className="text-center text-white px-4 py-3">{sub.marksObtained}</td>
                          <td className="text-center text-slate-400 px-4 py-3">{sub.totalMarks}</td>
                          <td className="text-center text-cyan-400 px-4 py-3">
                            {((sub.marksObtained / sub.totalMarks) * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Result Summary */}
                <div className="grid grid-cols-4 gap-3 mt-4">
                  <div className="bg-slate-700/50 rounded-xl p-3 text-center">
                    <p className="text-slate-400 text-xs">Total</p>
                    <p className="text-white font-bold">{cert.marksheet.obtainedMarks}/{cert.marksheet.totalMarks}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-xl p-3 text-center">
                    <p className="text-slate-400 text-xs">Percentage</p>
                    <p className="text-cyan-400 font-bold">{cert.marksheet.percentage}%</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-xl p-3 text-center">
                    <p className="text-slate-400 text-xs">Grade</p>
                    <p className="text-yellow-400 font-bold">{cert.marksheet.grade}</p>
                  </div>
                  <div className={`rounded-xl p-3 text-center ${cert.marksheet.result === 'Fail' ? 'bg-red-500/20' : 'bg-emerald-500/20'}`}>
                    <p className="text-slate-400 text-xs">Result</p>
                    <p className={`font-bold ${cert.marksheet.result === 'Fail' ? 'text-red-400' : 'text-emerald-400'}`}>
                      {cert.marksheet.result}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="border-t border-slate-700 pt-6 flex justify-between items-center">
              <div>
                <p className="text-slate-400 text-xs">Verify at</p>
                <p className="text-cyan-400 text-sm font-mono">{cert.certificateNumber}</p>
              </div>
              <div className="text-right">
                <div className="w-24 border-t border-slate-500 mb-1" />
                <p className="text-slate-400 text-xs">Authorized Signature</p>
              </div>
            </div>
          </div>
        </div>

        {/* Print Button */}
        <div className="text-center mt-6">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:scale-105 transition-transform"
          >
            <FaDownload /> Download / Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCertificate;