import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../services/api';

const BG = 'linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%)';
const inputCls = "w-full px-4 py-[11px] bg-white/[0.07] border border-white/[0.12] rounded-[10px] text-[.92rem] text-white font-['Inter',sans-serif] placeholder-white/25 transition-all duration-250 focus:outline-none focus:border-[rgba(167,139,250,0.6)] focus:bg-white/10 focus:shadow-[0_0_0_3px_rgba(167,139,250,0.15)]";
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
    'linear-gradient(90deg,#a78bfa,#7c3aed)',
    'linear-gradient(90deg,#f093fb,#f5576c)',
    'linear-gradient(90deg,#4facfe,#00f2fe)',
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center font-['Inter',sans-serif]" style={{background:BG}}>
      <p className="text-white/50 text-lg">Loading courses...</p>
    </div>
  );

  return (
    <div className="min-h-screen px-12 py-8 max-md:px-4 font-['Inter',sans-serif]" style={{background:BG}}>
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      {/* ── Header ── */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8 max-md:flex-col max-md:items-start">
        <h1 className="text-[2.4rem] font-extrabold m-0"
          style={{background:'linear-gradient(90deg,#a78bfa,#60a5fa,#34d399)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>
          Course Management
        </h1>
        <button onClick={handleCreateClick}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-[.9rem] border-none cursor-pointer transition-all duration-250 hover:-translate-y-[3px] hover:shadow-[0_14px_28px_rgba(52,211,153,0.45)] max-md:w-full max-md:justify-center"
          style={{background:'linear-gradient(135deg,#34d399,#059669)',boxShadow:'0 8px 20px rgba(52,211,153,0.3)'}}>
          <span className="text-[1.1rem] font-black">+</span> Create New Course
        </button>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="bg-[rgba(248,113,113,0.1)] border border-[rgba(248,113,113,0.3)] border-l-4 border-l-[#f87171] text-[#f87171] px-[18px] py-3.5 rounded-xl mb-6 text-[.9rem]">
          {error}
        </div>
      )}

      {/* ── Search & Filter ── */}
      <div className="flex flex-wrap gap-4 mb-7 bg-white/[0.05] backdrop-blur-xl border border-white/10 px-5 py-[18px] rounded-[18px]">
        <div className="flex-[2] relative min-w-[240px] max-sm:min-w-0 max-sm:flex-none max-sm:w-full">
          <input type="text" placeholder="Search courses by name or code..." value={searchTerm}
            onChange={e=>setSearchTerm(e.target.value)} className={inputCls + " pr-11"} />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">🔍</span>
        </div>
        <div className="flex-1 min-w-[180px] max-sm:w-full">
          <select value={filterCategory} onChange={e=>setFilterCategory(e.target.value)}
            className={selectCls} style={{background:'rgba(255,255,255,0.07)'}}>
            <option value="all" style={{background:'#302b63'}}>All Categories</option>
            {categories.map(c=><option key={c} value={c} style={{background:'#302b63'}}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 max-md:grid-cols-1 gap-[18px] mb-[30px]">
        {[
          { label:'Total Courses',          value: courses.length },
          { label:'Courses with Students',  value: courses.filter(c=>c.totalStudents>0).length },
          { label:'Total Enrollments',      value: courses.reduce((s,c)=>s+(c.totalStudents||0),0) },
        ].map((s,i) => (
          <div key={i} className="relative bg-white/[0.06] backdrop-blur-xl border border-white/10 px-5 py-[22px] rounded-[18px] text-center overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
            <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{background:statBars[i]}} />
            <span className="block text-[2rem] font-extrabold text-white mb-1.5 leading-none">{s.value}</span>
            <span className="text-[.78rem] text-white/45 font-semibold uppercase tracking-[.8px]">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Courses Grid ── */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] max-md:grid-cols-1 gap-[22px]">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-16 px-5 bg-white/[0.03] border border-dashed border-white/[0.12] rounded-[20px] text-white/35 text-base">
            No courses found. Click "Create New Course" to add one.
          </div>
        ) : filtered.map(course => (
          <div key={course._id}
            className="group bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-[20px] overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(0,0,0,0.45)] hover:border-white/20">
            {/* Image */}
            <div className="h-[180px] overflow-hidden relative" style={{background:'linear-gradient(135deg,rgba(167,139,250,0.2),rgba(96,165,250,0.2))'}}>
              {course.courseImage ? (
                <img src={course.courseImage} alt={course.courseName}
                  className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-[1.06]"
                  onError={e => { e.target.onerror=null; }} />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{background:'linear-gradient(135deg,rgba(167,139,250,0.08),rgba(96,165,250,0.08))'}}>
                  <span className="text-[.9rem] text-white/25 font-medium">No Image</span>
                </div>
              )}
            </div>
            {/* Details */}
            <div className="p-5">
              <div className="flex justify-between items-start gap-2.5 mb-3.5">
                <h3 className="text-[1.05rem] text-white font-bold leading-[1.3] flex-1 m-0">{course.courseName}</h3>
                <span className="text-[.7rem] text-[#60a5fa] bg-[rgba(96,165,250,0.15)] px-2.5 py-1 rounded-full border border-[rgba(96,165,250,0.3)] font-bold whitespace-nowrap shrink-0">
                  {course.courseCode}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2.5 mb-4 p-3.5 bg-white/[0.04] rounded-xl border border-white/[0.06]">
                {[
                  ['Duration',course.duration],
                  ['Fees',`₹${course.fees.toLocaleString()}`],
                  ['Category',course.category],
                  ['Students',course.totalStudents||0],
                ].map(([lbl,val])=>(
                  <div key={lbl} className="flex flex-col gap-0.5">
                    <span className="text-[.67rem] text-white/35 font-semibold uppercase tracking-[.6px]">{lbl}</span>
                    <span className="text-[.88rem] text-white/85 font-semibold">{val}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2.5">
                <button onClick={() => handleEditClick(course)}
                  className="flex-[2] py-2.5 bg-[rgba(167,139,250,0.18)] border border-[rgba(167,139,250,0.3)] rounded-[10px] text-[#a78bfa] text-[.85rem] font-bold cursor-pointer transition-all duration-250 hover:bg-[rgba(167,139,250,0.35)] hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(167,139,250,0.25)]">
                  Update Course
                </button>
                <button onClick={() => handleDelete(course._id)}
                  className="flex-1 py-2.5 bg-[rgba(248,113,113,0.12)] border border-[rgba(248,113,113,0.25)] rounded-[10px] text-[#f87171] text-[.85rem] font-bold cursor-pointer transition-all duration-250 hover:bg-[rgba(248,113,113,0.28)] hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(248,113,113,0.2)]">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[1000] backdrop-blur-[6px] p-4 animate-[fadeIn_.2s_ease]"
          onClick={() => { setShowModal(false); resetForm(); }}>
          <div className="bg-[#1a1535] border border-white/[0.12] rounded-3xl w-full max-w-[820px] max-h-[90vh] overflow-y-auto p-[30px] max-md:p-5 shadow-[0_30px_80px_rgba(0,0,0,0.6)] animate-[slideIn_.25s_ease]"
            onClick={e => e.stopPropagation()}>

            {/* Modal Header */}
            <div className="flex justify-between items-center mb-7 pb-[18px] border-b border-white/[0.08]">
              <h2 className="text-[1.3rem] font-extrabold m-0"
                style={{background:'linear-gradient(90deg,#a78bfa,#60a5fa)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>
                {modalMode==='edit'?'Update Course':'Create New Course'}
              </h2>
              <button onClick={() => { setShowModal(false); resetForm(); }}
                className="w-[34px] h-[34px] flex items-center justify-center bg-white/[0.07] border border-white/[0.12] rounded-[9px] text-[1.4rem] leading-none cursor-pointer text-white/50 transition-all duration-200 hover:bg-[rgba(248,113,113,0.18)] hover:border-[rgba(248,113,113,0.4)] hover:text-[#f87171]">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
              {/* Row 1 */}
              <div className="grid grid-cols-2 max-md:grid-cols-1 gap-[18px]">
                {[['courseName','Course Name *','text','Enter course name'],['courseCode','Course Code *','text','e.g., CS101']].map(([name,lbl,type,ph])=>(
                  <div key={name} className="flex flex-col gap-2">
                    <label className="text-[.78rem] font-bold text-white/55 uppercase tracking-[.7px]">{lbl}</label>
                    <input type={type} name={name} value={formData[name]} onChange={handleInputChange} required placeholder={ph} className={inputCls} />
                  </div>
                ))}
              </div>
              {/* Row 2 */}
              <div className="grid grid-cols-2 max-md:grid-cols-1 gap-[18px]">
                {[['duration','Duration *','text','e.g., 3 months'],['fees','Fees (₹) *','number','Enter fees amount']].map(([name,lbl,type,ph])=>(
                  <div key={name} className="flex flex-col gap-2">
                    <label className="text-[.78rem] font-bold text-white/55 uppercase tracking-[.7px]">{lbl}</label>
                    <input type={type} name={name} value={formData[name]} onChange={handleInputChange} required placeholder={ph} className={inputCls} />
                  </div>
                ))}
              </div>
              {/* Row 3 - category + image */}
              <div className="grid grid-cols-2 max-md:grid-cols-1 gap-[18px]">
                <div className="flex flex-col gap-2">
                  <label className="text-[.78rem] font-bold text-white/55 uppercase tracking-[.7px]">Category</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} className={selectCls} style={{background:'rgba(255,255,255,0.07)'}}>
                    {categories.map(c=><option key={c} value={c} style={{background:'#1a1535'}}>{c}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[.78rem] font-bold text-white/55 uppercase tracking-[.7px]">Course Image</label>
                  <input type="file" id="courseImage" name="courseImage" accept="image/*" onChange={handleImageChange} className="hidden" />
                  <label htmlFor="courseImage"
                    className="inline-block px-[18px] py-2.5 bg-[rgba(96,165,250,0.15)] border border-dashed border-[rgba(96,165,250,0.4)] rounded-[10px] text-[#60a5fa] text-[.88rem] font-semibold cursor-pointer text-center transition-all duration-250 hover:bg-[rgba(96,165,250,0.25)] hover:border-[rgba(96,165,250,0.6)]">
                    {imagePreview ? 'Change Image' : 'Choose Image'}
                  </label>
                  <p className="text-[.72rem] text-white/30 m-0">Supported: JPG, PNG, GIF. Max: 5MB</p>
                  {imagePreview && (
                    <div className="mt-2.5 text-center">
                      <img src={imagePreview} alt="Preview" className="max-w-[160px] max-h-[160px] rounded-[10px] border-2 border-white/[0.12] object-cover inline-block" />
                    </div>
                  )}
                </div>
              </div>

              {/* Syllabus */}
              <div className="flex flex-col gap-2">
                <label className="text-[.78rem] font-bold text-white/55 uppercase tracking-[.7px]">Syllabus</label>
                {formData.syllabus.map((topic, ti) => (
                  <div key={ti} className="bg-white/[0.04] border border-white/[0.08] border-l-[3px] border-l-[#a78bfa] rounded-xl p-3.5 mb-3">
                    <div className="flex gap-2.5 mb-2.5 items-center">
                      <input type="text" placeholder={`Topic ${ti+1}`} value={topic.topic}
                        onChange={e=>handleSyllabusChange(ti,'topic',e.target.value)}
                        className="flex-1 px-3.5 py-[9px] bg-white/[0.07] border border-white/[0.12] rounded-[9px] text-[.9rem] text-white font-['Inter',sans-serif] placeholder-white/25 focus:outline-none focus:border-[rgba(167,139,250,0.5)]" />
                      <div className="flex gap-1.5">
                        <button type="button" onClick={()=>addSubtopic(ti)}
                          className="w-8 h-8 bg-[rgba(52,211,153,0.18)] border border-[rgba(52,211,153,0.3)] rounded-lg text-[#34d399] text-xl flex items-center justify-center font-bold cursor-pointer transition-all duration-200 hover:bg-[rgba(52,211,153,0.32)] hover:scale-110">+</button>
                        <button type="button" onClick={()=>removeTopic(ti)} disabled={formData.syllabus.length===1}
                          className="w-8 h-8 bg-[rgba(248,113,113,0.15)] border border-[rgba(248,113,113,0.3)] rounded-lg text-[#f87171] text-xl flex items-center justify-center font-bold cursor-pointer transition-all duration-200 hover:bg-[rgba(248,113,113,0.3)] hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100">×</button>
                      </div>
                    </div>
                    <div className="ml-[18px] flex flex-col gap-2">
                      {topic.subtopics.map((sub, si) => (
                        <div key={si} className="flex gap-2 items-center">
                          <input type="text" placeholder={`Subtopic ${si+1}`} value={sub}
                            onChange={e=>handleSyllabusChange(ti,'subtopics',e.target.value,si)}
                            className="flex-1 px-3 py-2 bg-white/[0.05] border border-white/[0.09] rounded-lg text-[.85rem] text-white/80 font-['Inter',sans-serif] placeholder-white/20 focus:outline-none focus:border-[rgba(167,139,250,0.4)]" />
                          <button type="button" onClick={()=>removeSubtopic(ti,si)} disabled={topic.subtopics.length===1}
                            className="w-7 h-7 bg-[rgba(251,191,36,0.12)] border border-[rgba(251,191,36,0.25)] rounded-[7px] text-[#fbbf24] text-[.95rem] flex items-center justify-center font-bold cursor-pointer shrink-0 transition-all duration-200 hover:bg-[rgba(251,191,36,0.25)] hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100">×</button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <button type="button" onClick={addTopic}
                  className="w-full py-3 bg-[rgba(96,165,250,0.12)] border border-dashed border-[rgba(96,165,250,0.35)] rounded-[10px] text-[#60a5fa] text-[.88rem] font-bold cursor-pointer transition-all duration-250 mt-1 hover:bg-[rgba(96,165,250,0.22)] hover:border-[rgba(96,165,250,0.55)] hover:-translate-y-px">
                  + Add New Topic
                </button>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 mt-2 pt-5 border-t border-white/[0.08]">
                <button type="button" onClick={()=>{setShowModal(false);resetForm();}} disabled={submitting}
                  className="px-[26px] py-3 bg-white/[0.07] border border-white/[0.12] rounded-[10px] text-white/65 text-[.9rem] font-semibold cursor-pointer transition-all duration-200 hover:bg-white/[0.12] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="px-[26px] py-3 rounded-[10px] text-white text-[.9rem] font-bold border-none cursor-pointer min-w-[140px] transition-all duration-250 disabled:opacity-45 disabled:cursor-not-allowed hover:enabled:-translate-y-0.5 hover:enabled:shadow-[0_10px_24px_rgba(52,211,153,0.45)]"
                  style={{background:'linear-gradient(135deg,#34d399,#059669)',boxShadow:'0 6px 16px rgba(52,211,153,0.3)'}}>
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