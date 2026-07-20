"use client";
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../../services/api';

const inputCls = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all";
const selectCls = inputCls + " cursor-pointer";
const categories = ['Basic Computer','Advanced Computer','Accounting','Programming','Certification','Other'];

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ courseName:'', courseCode:'', duration:'', fees:'', category:'Other', syllabus:[{topic:'',subtopics:['']}], courseImage:null });
  const [imagePreview, setImagePreview] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/api/courses', { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) setCourses(res.data.data);
      setLoading(false);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch courses';
      setError(msg); toast.error(msg); setLoading(false);
    }
  };

  const handleInputChange = e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.match(/image.*/)) { toast.error('Please upload an image file'); e.target.value=''; return; }
    if (file.size > 5*1024*1024) { toast.error('Image size should be less than 5MB'); e.target.value=''; return; }
    setFormData(p => ({ ...p, courseImage: file }));
    const r = new FileReader();
    r.onloadend = () => setImagePreview(r.result);
    r.readAsDataURL(file);
    toast.success('Image selected successfully');
  };

  const handleSyllabusChange = (ti, field, val, si=null) => {
    const s = [...formData.syllabus];
    if (si !== null) s[ti].subtopics[si] = val; else s[ti][field] = val;
    setFormData(p => ({ ...p, syllabus: s }));
  };

  const addTopic    = ()  => { setFormData(p=>({...p,syllabus:[...p.syllabus,{topic:'',subtopics:['']}]})); toast.info('New topic added'); };
  const removeTopic = (i) => { if(formData.syllabus.length>1){ setFormData(p=>({...p,syllabus:p.syllabus.filter((_,x)=>x!==i)})); toast.info('Topic removed'); } };
  const addSubtopic = (ti)=> { const s=[...formData.syllabus]; s[ti].subtopics.push(''); setFormData(p=>({...p,syllabus:s})); toast.info('Subtopic added'); };
  const removeSubtopic=(ti,si)=>{ if(formData.syllabus[ti].subtopics.length>1){ const s=[...formData.syllabus]; s[ti].subtopics=s[ti].subtopics.filter((_,x)=>x!==si); setFormData(p=>({...p,syllabus:s})); toast.info('Subtopic removed'); } };

  const resetForm = () => {
    setFormData({ courseName:'', courseCode:'', duration:'', fees:'', category:'Other', syllabus:[{topic:'',subtopics:['']}], courseImage:null });
    setImagePreview(''); setSelectedCourse(null);
    const fi = document.getElementById('courseImage'); if (fi) fi.value='';
  };

  const handleCreateClick = () => { resetForm(); setModalMode('create'); setShowModal(true); };
  const handleEditClick = (c) => {
    setSelectedCourse(c);
    setFormData({ courseName:c.courseName, courseCode:c.courseCode, duration:c.duration, fees:c.fees, category:c.category||'Other', syllabus:c.syllabus.length>0?c.syllabus:[{topic:'',subtopics:['']}], courseImage:null });
    setImagePreview(c.courseImage||''); setModalMode('edit'); setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    const t = toast.loading('Deleting course...');
    try {
      const token = localStorage.getItem('token');
      const res = await api.delete(`/api/courses/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) { toast.update(t,{render:'Course deleted successfully',type:'success',isLoading:false,autoClose:3000}); fetchCourses(); }
    } catch (err) { toast.update(t,{render:err.response?.data?.message||'Failed to delete course',type:'error',isLoading:false,autoClose:3000}); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); if (submitting) return;
    setSubmitting(true);
    const t = toast.loading(modalMode==='edit'?'Updating course...':'Creating course...');
    try {
      const token = localStorage.getItem('token');
      const fd = new FormData();
      ['courseName','courseCode','duration','fees','category'].forEach(k => fd.append(k,formData[k]));
      fd.append('syllabus', JSON.stringify(formData.syllabus));
      if (formData.courseImage) fd.append('courseImage', formData.courseImage);
      const res = modalMode==='edit' && selectedCourse
        ? await api.put(`/api/courses/${selectedCourse._id}`, fd, { headers:{ Authorization:`Bearer ${token}`,'Content-Type':'multipart/form-data' } })
        : await api.post('/api/courses', fd, { headers:{ Authorization:`Bearer ${token}`,'Content-Type':'multipart/form-data' } });
      if (res.data.success) {
        toast.update(t,{render:modalMode==='edit'?'Course updated successfully!':'Course created successfully!',type:'success',isLoading:false,autoClose:3000});
        setShowModal(false); 
        resetForm();
        fetchCourses();
      }
    } catch (err) {
      toast.update(t,{render:err.response?.data?.message||'Failed to save course',type:'error',isLoading:false,autoClose:3000});
    } finally { setSubmitting(false); }
  };

  const filtered = courses.filter(c => {
    const ms = c.courseName.toLowerCase().includes(searchTerm.toLowerCase()) || c.courseCode.toLowerCase().includes(searchTerm.toLowerCase());
    return ms && (filterCategory==='all' || c.category===filterCategory);
  });

  const statBars = [
    'linear-gradient(90deg,#06b6d4,#3b82f6)',
    'linear-gradient(90deg,#ec4899,#f43f5e)',
    'linear-gradient(90deg,#10b981,#059669)',
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
        <p className="text-gray-500 font-medium">Loading courses...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 px-12 py-8 max-md:px-4 font-['Space_Grotesk',sans-serif] text-gray-900 pt-24">
      {BG_MESH}
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      {/* ── Header ── */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8 max-md:flex-col max-md:items-start max-w-[1400px] mx-auto">
        <div>
          <span className="block text-[11px] font-bold tracking-[2.5px] uppercase text-cyan-600 mb-1.5">Management Portal</span>
          <h1 className="font-['Syne',sans-serif] text-3xl font-extrabold leading-tight text-gray-900">
            Course Management
          </h1>
        </div>
        <button onClick={handleCreateClick}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm border-none cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-cyan-500/20 max-md:w-full max-md:justify-center shadow-md"
          style={{background:'linear-gradient(135deg,#00d4ff,#7c3aed)'}}>
          <span className="text-[1.1rem] font-black">+</span> Create New Course
        </button>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-5 py-3.5 rounded-xl mb-6 text-sm max-w-[1400px] mx-auto font-semibold">
          {error}
        </div>
      )}

      {/* ── Search & Filter ── */}
      <div className="flex flex-wrap gap-4 mb-7 bg-white border border-gray-200/80 shadow-sm px-5 py-4 rounded-2xl max-w-[1400px] mx-auto">
        <div className="flex-[2] relative min-w-[240px] max-sm:min-w-0 max-sm:flex-none max-sm:w-full">
          <input type="text" placeholder="Search courses by name or code..." value={searchTerm}
            onChange={e=>setSearchTerm(e.target.value)} className={inputCls + " pr-11"} />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">🔍</span>
        </div>
        <div className="flex-1 min-w-[180px] max-sm:w-full">
          <select value={filterCategory} onChange={e=>setFilterCategory(e.target.value)}
            className={selectCls}>
            <option value="all">All Categories</option>
            {categories.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 max-w-[1400px] mx-auto">
        {[
          { label:'Total Courses',          value: courses.length },
          { label:'Courses with Students',  value: courses.filter(c=>c.totalStudents>0).length },
          { label:'Total Enrollments',      value: courses.reduce((s,c)=>s+(c.totalStudents||0),0) },
        ].map((s,i) => (
          <div key={i} className="relative bg-white border border-gray-200/70 shadow-sm px-6 py-5 rounded-2xl text-center overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div className="absolute bottom-0 left-0 right-0 h-[3.5px]" style={{background:statBars[i]}} />
            <span className="block font-['Syne',sans-serif] text-3xl font-extrabold text-gray-900 mb-1 leading-none">{s.value}</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Courses Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-[1400px] mx-auto">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-16 px-5 bg-white border border-dashed border-gray-300 rounded-3xl text-gray-400 font-medium">
            No courses found. Click "Create New Course" to add one.
          </div>
        ) : filtered.map(course => (
          <div key={course._id}
            className="group bg-white border border-gray-200/70 shadow-sm rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            {/* Image */}
            <div className="h-[180px] overflow-hidden relative bg-gray-50 border-b border-gray-100">
              {course.courseImage ? (
                <img src={course.courseImage} alt={course.courseName}
                  className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
                  onError={e => { e.target.onerror=null; }} />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50/60">
                  <span className="text-[12px] text-gray-400 font-bold tracking-wider uppercase">No Image</span>
                </div>
              )}
            </div>
            {/* Details */}
            <div className="p-5">
              <div className="flex justify-between items-start gap-2.5 mb-3.5">
                <h3 className="font-['Syne',sans-serif] text-[15px] font-bold leading-tight text-gray-900 flex-1 m-0 truncate" title={course.courseName}>{course.courseName}</h3>
                <span className="text-[10px] text-cyan-700 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0">
                  {course.courseCode}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 border border-gray-100 rounded-xl">
                {[
                  ['Duration',course.duration],
                  ['Fees',`₹${course.fees.toLocaleString()}`],
                  ['Category',course.category],
                  ['Students',course.totalStudents||0],
                ].map(([lbl,val])=>(
                  <div key={lbl} className="flex flex-col gap-0.5">
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.5px]">{lbl}</span>
                    <span className="text-[13px] text-gray-700 font-bold truncate">{val}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2.5">
                <button onClick={() => handleEditClick(course)}
                  className="flex-[2] py-2 bg-cyan-50 border border-cyan-200 rounded-xl text-cyan-700 text-[12px] font-bold cursor-pointer transition-all hover:bg-cyan-100/60">
                  Update Course
                </button>
                <button onClick={() => handleDelete(course._id)}
                  className="flex-1 py-2 bg-rose-50 border border-rose-200/60 rounded-xl text-rose-700 text-[12px] font-bold cursor-pointer transition-all hover:bg-rose-100/60">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] backdrop-blur-sm p-4 animate-[fadeIn_.2s_ease]"
          onClick={() => { setShowModal(false); resetForm(); }}>
          <div className="bg-white border border-gray-200/80 rounded-3xl w-full max-w-[800px] max-h-[90vh] overflow-y-auto p-7 shadow-2xl animate-[slideIn_.25s_ease]"
            onClick={e => e.stopPropagation()}>

            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <h2 className="font-['Syne',sans-serif] text-xl font-extrabold text-gray-900"
                style={{background:'linear-gradient(90deg,#06b6d4,#3b82f6)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>
                {modalMode==='edit'?'Update Course':'Create New Course'}
              </h2>
              <button onClick={() => { setShowModal(false); resetForm(); }}
                className="w-8 h-8 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg text-lg leading-none cursor-pointer text-gray-400 transition-all hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 font-bold">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Row 1 */}
              <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4">
                {[['courseName','Course Name *','text','Enter course name'],['courseCode','Course Code *','text','e.g., CS101']].map(([name,lbl,type,ph])=>(
                  <div key={name} className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">{lbl}</label>
                    <input type={type} name={name} value={formData[name]} onChange={handleInputChange} required placeholder={ph} className={inputCls} />
                  </div>
                ))}
              </div>
              {/* Row 2 */}
              <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4">
                {[['duration','Duration *','text','e.g., 3 months'],['fees','Fees (₹) *','number','Enter fees amount']].map(([name,lbl,type,ph])=>(
                  <div key={name} className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">{lbl}</label>
                    <input type={type} name={name} value={formData[name]} onChange={handleInputChange} required placeholder={ph} className={inputCls} />
                  </div>
                ))}
              </div>
              {/* Row 3 - category + image */}
              <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Category</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} className={selectCls}>
                    {categories.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Course Image</label>
                  <input type="file" id="courseImage" name="courseImage" accept="image/*" onChange={handleImageChange} className="hidden" />
                  <label htmlFor="courseImage"
                    className="inline-block px-5 py-3.5 bg-cyan-50 border border-dashed border-cyan-200 text-cyan-700 text-sm font-bold cursor-pointer text-center rounded-xl transition-all hover:bg-cyan-100/50">
                    {imagePreview ? 'Change Image' : 'Choose Image'}
                  </label>
                  <p className="text-[10px] text-gray-400 m-0 font-medium">Supported: JPG, PNG, GIF. Max: 5MB</p>
                  {imagePreview && (
                    <div className="mt-2 text-center">
                      <img src={imagePreview} alt="Preview" className="max-w-[140px] max-h-[140px] rounded-xl border border-gray-200 object-cover inline-block" />
                    </div>
                  )}
                </div>
              </div>

              {/* Syllabus */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Syllabus</label>
                {formData.syllabus.map((topic, ti) => (
                  <div key={ti} className="bg-gray-50 border border-gray-200 border-l-[4px] border-l-cyan-500 rounded-xl p-4 mb-2">
                    <div className="flex gap-2.5 mb-3 items-center">
                      <input type="text" placeholder={`Topic ${ti+1}`} value={topic.topic}
                        onChange={e=>handleSyllabusChange(ti,'topic',e.target.value)}
                        className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-cyan-500" />
                      <div className="flex gap-1.5">
                        <button type="button" onClick={()=>addSubtopic(ti)}
                          className="w-8 h-8 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-lg flex items-center justify-center font-bold cursor-pointer transition-all hover:bg-emerald-100/60">+</button>
                        <button type="button" onClick={()=>removeTopic(ti)} disabled={formData.syllabus.length===1}
                          className="w-8 h-8 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-lg flex items-center justify-center font-bold cursor-pointer transition-all hover:bg-rose-100/60 disabled:opacity-30 disabled:cursor-not-allowed">×</button>
                      </div>
                    </div>
                    <div className="ml-5 flex flex-col gap-2">
                      {topic.subtopics.map((sub, si) => (
                        <div key={si} className="flex gap-2 items-center">
                          <input type="text" placeholder={`Subtopic ${si+1}`} value={sub}
                            onChange={e=>handleSyllabusChange(ti,'subtopics',e.target.value,si)}
                            className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:border-cyan-500" />
                          <button type="button" onClick={()=>removeSubtopic(ti,si)} disabled={topic.subtopics.length===1}
                            className="w-7 h-7 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-xs flex items-center justify-center font-bold cursor-pointer shrink-0 transition-all hover:bg-amber-100/60 disabled:opacity-30 disabled:cursor-not-allowed">×</button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <button type="button" onClick={addTopic}
                  className="w-full py-2.5 bg-cyan-50 border border-dashed border-cyan-200 rounded-xl text-cyan-700 text-sm font-bold cursor-pointer transition-all hover:bg-cyan-100/50">
                  + Add New Topic
                </button>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 mt-2 pt-4 border-t border-gray-100">
                <button type="button" onClick={()=>{setShowModal(false);resetForm();}} disabled={submitting}
                  className="px-6 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-600 text-sm font-bold cursor-pointer transition-all hover:bg-gray-200/80">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="px-6 py-2.5 rounded-xl text-white text-sm font-bold border-none cursor-pointer min-w-[140px] transition-all disabled:opacity-50 shadow-md shadow-cyan-500/10"
                  style={{background:'linear-gradient(135deg,#00d4ff,#7c3aed)'}}>
                  {submitting?(modalMode==='edit'?'Updating...':'Creating...'):(modalMode==='edit'?'Update Course':'Create Course')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes slideIn { from{transform:translateY(-30px);opacity:0} to{transform:translateY(0);opacity:1} }
      `}</style>
    </div>
  );
};

export default AdminCourses;