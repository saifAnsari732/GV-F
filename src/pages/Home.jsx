import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaGraduationCap, FaBriefcase, FaCertificate, FaUsers,
  FaChalkboardTeacher, FaLaptopCode, FaChevronLeft, FaChevronRight,
  FaAward, FaTrophy, FaRocket, FaStar
} from 'react-icons/fa';
import api from '../services/api';
import ReviewHelper from './ReviewHelper';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      title: "Master Computer Skills For Learn",
      subtitle: "Transform Your Career with Quality Education",
      description: "From basics to advanced programming — comprehensive training for the digital world",
      image: "https://lh3.googleusercontent.com/p/AF1QipNK8VcJQcHE_SJ_kha7LKc1dupOfUF0JCEnsR1j=s1360-w1360-h1020-rw",
    },
    {
      title: "Industry-Ready Training Center Fazilnagar",
      subtitle: "Learn from Expert Instructors",
      description: "Get hands-on experience with real-world projects and industry-standard tools",
      image: "https://lh3.googleusercontent.com/p/AF1QipNMkrseX8xzuibzEe-xNj3R2Hn9Z8AY_0ouYTgR=s1360-w1360-h1020-rw",
    },
    {
      title: "Build Your Future In GV Computer",
      subtitle: "Job-Ready Skills & Placement Support",
      description: "Join 10,000+ successful students who launched their tech careers with us",
      image: "https://lh3.googleusercontent.com/p/AF1QipMb4ZlWmVbsmBG6ISfQUkls3tjWIMw4Y5mo6TlR=s1360-w1360-h1020-rw",
    },
    {
      title: "Start Your Journey Today IN Your ",
      subtitle: "Certified Computer Courses",
      description: "Government recognized certificates, placement support and expert faculty",
      image: "https://lh3.googleusercontent.com/p/AF1QipM2y9wQDNPd3r9nf-3VzUV-pAGpRhXKOCbaf2az=s1360-w1360-h1020-rw",
    }
  ];

  useEffect(() => {
    fetchCourses();
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/api/courses');
      setCourses(response.data.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  const features = [
    { icon: <FaChalkboardTeacher className="text-3xl" />, title: 'Expert Instructors', description: 'Learn from industry professionals with 10+ years of experience', gradient: 'from-violet-500 to-purple-600' },
    { icon: <FaCertificate className="text-3xl" />, title: 'Certified Programs', description: 'Get recognized certifications valued by top companies', gradient: 'from-pink-500 to-rose-600' },
    { icon: <FaLaptopCode className="text-3xl" />, title: 'Practical Training', description: 'Hands-on learning with real-world projects and assignments', gradient: 'from-cyan-500 to-blue-600' },
    { icon: <FaBriefcase className="text-3xl" />, title: '100% Job Support', description: 'Career guidance, resume building, and placement assistance', gradient: 'from-emerald-500 to-teal-600' }
  ];

  const stats = [
    { icon: <FaUsers />, number: '10,000+', label: 'Students Trained', gradient: 'from-blue-500 to-indigo-600' },
    { icon: <FaAward />, number: '50+', label: 'Courses Completed', gradient: 'from-purple-500 to-pink-600' },
    { icon: <FaTrophy />, number: '90%', label: 'Success Rate', gradient: 'from-amber-500 to-orange-600' },
    { icon: <FaStar />, number: '4.8/5', label: 'Student Rating', gradient: 'from-emerald-500 to-teal-600' }
  ];

  const getCourseIcon = (courseName) => {
    const name = courseName.toUpperCase();
    if (name.includes('DCA') || name.includes('ADCA')) return FaLaptopCode;
    return FaGraduationCap;
  };

  const getCourseColor = (courseName) => {
    const name = courseName.toUpperCase();
    if (name.includes('DCA'))   return { gradient: 'from-emerald-500 to-teal-600',  glow: 'hover:shadow-emerald-500/20', border: 'hover:border-emerald-500/60' };
    if (name.includes('ADCA'))  return { gradient: 'from-cyan-500 to-blue-600',     glow: 'hover:shadow-cyan-500/20',    border: 'hover:border-cyan-500/60' };
    if (name.includes('BTECH')) return { gradient: 'from-blue-500 to-indigo-600',   glow: 'hover:shadow-blue-500/20',    border: 'hover:border-blue-500/60' };
    if (name.includes('MTECH')) return { gradient: 'from-purple-500 to-indigo-600', glow: 'hover:shadow-purple-500/20',  border: 'hover:border-purple-500/60' };
    return { gradient: 'from-blue-500 to-purple-600', glow: 'hover:shadow-blue-500/20', border: 'hover:border-blue-500/60' };
  };

  return (
    <div className="bg-white">

      {/* ─── HERO SECTION ─── */}
      <section className="relative overflow-hidden">

        {/* ── Desktop Carousel ── */}
        <div className="hidden md:flex items-center justify-center bg-slate-950 h-[650px] py-3 px-4">
          <div className="relative w-full h-full max-w-6xl mx-auto">

            {heroSlides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-700 rounded-2xl overflow-hidden shadow-2xl
                  ${index === currentSlide ? 'opacity-80 z-10' : 'opacity-0 z-0'}`}
              >
                {/* Full opacity image */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover object-center"
                  onError={e => { e.target.onerror = null; e.target.style.background = '#1e293b'; }}
                />

                {/* Dark gradient overlay — heavier on left for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10 rounded-2xl" />

                {/* Text + Buttons */}
                <div className="absolute inset-0 flex flex-col justify-center items-center px-14 z-10">
                  <span className="inline-block bg-white/15 backdrop-blur-sm text-white text-[11px] font-bold px-4 py-1.5 rounded-full mb-5 border border-white/25 w-fit tracking-[2px] uppercase">
                    🎓 GV Computer Center — Fazilnagar
                  </span>

                  <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-2 max-w-xl drop-shadow-lg">
                    {slide.title}
                  </h1>

                  <p className="text-white font-semibold text-lg mb-2">{slide.subtitle}</p>

                  <p className="text-white text-sm mb-8 max-w-md leading-relaxed">
                    {slide.description}
                  </p>

                  <div className="flex gap-4">
                    <Link
                      to="/register"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold px-7 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40 text-sm"
                    >
                      <FaRocket /> Enroll Now
                    </Link>
                    <Link
                      to="/courses"
                      className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 hover:border-white/50 text-white font-bold px-7 py-3 rounded-xl transition-all duration-300 hover:scale-105 text-sm"
                    >
                      <FaGraduationCap /> View Courses
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* Prev Button */}
            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-black/40 hover:bg-black/70 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all duration-200 border border-white/20 shadow-lg"
            >
              <FaChevronLeft />
            </button>

            {/* Next Button */}
            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-black/40 hover:bg-black/70 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all duration-200 border border-white/20 shadow-lg"
            >
              <FaChevronRight />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'w-8 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Mobile Hero ── */}
        <div className="md:hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 px-6 pt-16 pb-12 text-center">
          <span className="inline-flex items-center gap-2 bg-white/10 text-white text-sm font-medium px-4 py-2 rounded-full mb-6 border border-white/20">
            <FaGraduationCap /> GV Computer Center
          </span>
          <h1 className="text-3xl font-extrabold text-white leading-tight mb-4">
            Transform Your Future with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              Quality Education
            </span>
          </h1>
          <p className="text-white/70 text-sm leading-relaxed mb-8">
            Master computer skills from basics to advanced. Join 10,000+ students with industry-recognized certifications.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/courses" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold px-6 py-3 rounded-xl hover:scale-105 transition-transform">
              <FaGraduationCap /> Explore Courses
            </Link>
            <Link to="/register" className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white font-bold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors">
              Enroll Now
            </Link>
          </div>
        </div>
      </section>

      {/* ─── STATS SECTION ─── */}
      <section className="py-12 bg-gradient-to-r from-slate-900 to-blue-950">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white text-xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-1">{stat.number}</h3>
                <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COURSES SECTION ─── */}
      <section className="py-2 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block text-cyan-400 font-semibold text-sm uppercase tracking-widest mb-3">Our Programs</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">Popular Courses</h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-slate-800/50 rounded-3xl h-52 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {courses.map((course) => {
                const CourseIcon = getCourseIcon(course.courseName);
                const colors = getCourseColor(course.courseName);
                return (
                  <Link
                    key={course._id}
                    to={`/courses/${course._id}`}
                    className={`group relative bg-slate-800/50 backdrop-blur-sm border-2 border-slate-700/50 rounded-3xl overflow-hidden ${colors.border} transition-all duration-300 hover:scale-105 hover:shadow-2xl ${colors.glow} flex flex-col`}
                  >
                    <div className={`h-1.5 bg-gradient-to-r ${colors.gradient}`} />
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    <div className="relative p-6 flex flex-col flex-1">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <CourseIcon className="text-2xl text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-1">{course.courseName}</h3>
                      <p className="text-slate-400 text-xs mb-5">Master this in-demand course</p>
                      <div className={`flex items-center justify-between w-full px-4 py-2.5 bg-gradient-to-r ${colors.gradient} text-white text-sm font-semibold rounded-xl group-hover:shadow-lg transition-all duration-300`}>
                        <span>Explore</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                );
              })}
            </div>
          )}

          <div className="text-center mt-10">
            <Link to="/courses" className="inline-flex items-center gap-2 border-2 border-slate-600 hover:border-cyan-400 text-slate-300 hover:text-cyan-400 font-semibold px-8 py-3 rounded-xl transition-all duration-300">
              View All Courses →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FEATURES SECTION ─── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block text-indigo-600 font-semibold text-sm uppercase tracking-widest mb-3">Why Choose Us</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Why Choose GV Computer Center</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">Your success is our mission — we provide everything you need to thrive</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-100 hover:border-transparent transition-all duration-300 hover:-translate-y-1 group">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA SECTION ─── */}
      <section className="py-20 bg-gradient-to-r from-blue-800 via-indigo-900 to-purple-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <span className="inline-block bg-white/15 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-white/20">🚀 Start Today</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-5 leading-tight">Ready to Start Your Learning Journey?</h2>
          <p className="text-white/75 text-lg mb-10 max-w-2xl mx-auto">Join thousands of students who transformed their careers with quality education and hands-on training</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-white text-indigo-700 font-bold px-8 py-3.5 rounded-xl hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-xl">
              <FaRocket /> Enroll Now
            </Link>
            <Link to="/courses" className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-white/10 hover:border-white transition-all duration-300">
              Browse Courses
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FLOATING RATING BUTTON ─── */}
      <ReviewHelper />
    </div>
  );
};

export default Home;