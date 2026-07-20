import Link from "next/link";
import React from 'react';
import {
  FaGraduationCap, FaBriefcase, FaCertificate, FaUsers,
  FaChalkboardTeacher, FaLaptopCode, FaRocket, FaStar, FaAward, FaTrophy,
  FaQuoteLeft, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope
} from 'react-icons/fa';
import ReviewHelper from '../components/ReviewHelper';
import TestimonialSlider from '../components/TestimonialSlider';
import { API_URL } from '../helper';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Home | GV Computer Center',
  description: 'Master computer skills from basics to advanced. Join 10,000+ students with industry-recognized certifications.',
};

async function getCourses() {
  try {
    const res = await fetch(`${API_URL}/api/courses`, {
      cache: 'no-store'
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
}

export default async function Home() {
  const courses = await getCourses();

  const features = [
    { icon: <FaChalkboardTeacher className="text-3xl" />, title: 'Expert Instructors', description: 'Learn from industry professionals with 10+ years of experience', gradient: 'from-violet-500 to-purple-600' },
    { icon: <FaCertificate className="text-3xl" />, title: 'Certified Programs', description: 'Get recognized certifications valued by top companies', gradient: 'from-cyan-500 to-blue-600' },
    { icon: <FaLaptopCode className="text-3xl" />, title: 'Practical Training', description: 'Hands-on learning with real-world projects and assignments', gradient: 'from-emerald-500 to-teal-600' },
    { icon: <FaBriefcase className="text-3xl" />, title: '100% Job Support', description: 'Career guidance, resume building, and placement assistance', gradient: 'from-blue-500 to-indigo-600' }
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
    <div className="bg-gray-50 min-h-screen text-gray-900 selection:bg-cyan-500/30">
      
      {/* ── Desktop Hero (Typography Focused) ── */}
      <div className="flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-100 pt-32 pb-20 px-4 text-center overflow-hidden relative border-b border-gray-200">
        <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center z-10">
          <span className="inline-flex items-center gap-2 bg-cyan-500/10 text-cyan-400 text-xs sm:text-sm font-bold px-4 sm:px-5 py-2 rounded-full mb-8 border border-cyan-500/20 tracking-wider uppercase shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            🎓 GV Computer Center — Fazilnagar
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-gray-900 leading-[1.15] mb-6 tracking-tight">
            Master Computer Skills & <br className="hidden sm:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500">
              Transform Your Future
            </span>
          </h1>
          <p className="text-gray-600 text-base sm:text-lg lg:text-xl max-w-2xl leading-relaxed mb-10 px-4">
            From basics to advanced programming — join 10,000+ students with industry-recognized certifications and launch your tech career today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4">
            <Link href="/register"
              className="inline-flex justify-center items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] text-lg w-full sm:w-auto"
            >
              <FaRocket /> Enroll Now
            </Link>
            <Link href="/courses"
              className="inline-flex justify-center items-center gap-2 bg-white hover:bg-gray-100 backdrop-blur-md border border-gray-200 hover:border-gray-500 text-gray-900 font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 text-lg w-full sm:w-auto"
            >
              <FaGraduationCap /> View Courses
            </Link>
          </div>
        </div>
        
        {/* Decorative background elements */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      </div>

      {/* ─── STATS SECTION ─── */}
      <section className="py-12 bg-gray-50 border-b border-gray-200 relative z-20 -mt-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 text-center border border-gray-200/50 hover:border-gray-300 transition-colors shadow-xl">
                <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-gray-900 mb-4 text-xl shadow-lg`}>
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-extrabold text-gray-900 mb-1">{stat.number}</h3>
                <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COURSES SECTION ─── */}
      <section className="py-24 bg-gray-50 relative">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block text-cyan-400 font-bold text-sm uppercase tracking-widest mb-3 bg-cyan-500/10 px-4 py-1.5 rounded-full border border-cyan-500/20">Our Programs</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">Popular Courses</h2>
            <p className="text-gray-600 max-w-xl mx-auto text-lg">Explore our most demanded courses designed to make you industry-ready.</p>
          </div>

          {!courses.length ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl sm:rounded-3xl h-64 animate-pulse border border-gray-200" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {courses.slice(0, 4).map((course) => {
                const CourseIcon = getCourseIcon(course.courseName);
                const colors = getCourseColor(course.courseName);
                return (
                  <Link
                    key={course._id}
                    href={`/courses/${course._id}`}
                    className={`group relative bg-white border border-gray-200 rounded-2xl sm:rounded-3xl overflow-hidden ${colors.border} transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${colors.glow} flex flex-col`}
                  >
                    <div className={`h-1.5 w-full bg-gradient-to-r ${colors.gradient}`} />
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    <div className="relative p-4 sm:p-6 flex flex-col flex-1">
                      <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center mb-3 sm:mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <CourseIcon className="text-xl sm:text-2xl text-white" />
                      </div>
                      <h3 className="text-base sm:text-xl font-bold text-gray-900 group-hover:text-cyan-400 transition-colors mb-1 sm:mb-2">{course.courseName}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6 flex-1 line-clamp-2 sm:line-clamp-none">Master this in-demand course and elevate your career.</p>
                      <div className={`flex items-center justify-center sm:justify-between w-full px-2 sm:px-4 py-2 sm:py-3 bg-gray-50/50 group-hover:bg-gradient-to-r ${colors.gradient} text-gray-700 group-hover:text-gray-900 text-[10px] sm:text-sm font-semibold rounded-lg sm:rounded-xl border border-gray-200 group-hover:border-transparent transition-all duration-300`}>
                        <span className="hidden sm:inline">Explore Course</span>
                        <span className="sm:hidden">Explore</span>
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-0 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/courses" className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 border border-gray-300 hover:border-cyan-500/50 text-gray-700 hover:text-cyan-400 font-semibold px-8 py-3.5 rounded-xl transition-all duration-300">
              View All Courses →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FEATURES SECTION ─── */}
      <section className="py-24 bg-gray-50 relative border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block text-blue-400 font-bold text-sm uppercase tracking-widest mb-3 bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20">Why Choose Us</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">The GV Advantage</h2>
            <p className="text-gray-600 text-lg max-w-xl mx-auto">Your success is our mission — we provide everything you need to thrive in the tech industry.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-3xl p-8 shadow-xl border border-gray-200 hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-2 group">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-gray-900 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS SECTION ─── */}
      <section className="py-24 bg-white relative border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block text-emerald-500 font-bold text-sm uppercase tracking-widest mb-3 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">Student Success</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">What Our Students Say</h2>
            <p className="text-gray-600 text-lg max-w-xl mx-auto">Don't just take our word for it. Hear from the students who built their careers with us.</p>
          </div>
          
          <TestimonialSlider />
        </div>
      </section>

      {/* ─── CTA SECTION ─── */}
      <section className="py-24 bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-950 relative overflow-hidden border-t border-gray-200">
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">Ready to Start Your Learning Journey?</h2>
          <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">Join thousands of students who transformed their careers with quality education and hands-on training.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-gray-900 font-bold px-10 py-4 rounded-xl hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.3)] text-lg">
              <FaRocket /> Enroll Now
            </Link>
            <Link href="/courses" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 hover:border-cyan-400/50 text-white font-bold px-10 py-4 rounded-xl transition-all duration-300 hover:scale-105 text-lg">
              Browse Courses
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER SECTION ─── */}
      <footer className="bg-gray-900 text-gray-300 py-16 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            
            {/* Brand */}
            <div>
              <Link href="/" className="flex items-center gap-3 group mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg">
                  <FaGraduationCap className="text-white text-xl" />
                </div>
                <span className="text-2xl font-extrabold text-white tracking-tight">GV <span className="text-cyan-400">Computer</span></span>
              </Link>
              <p className="text-sm leading-relaxed mb-6">
                Empowering the next generation of tech professionals with industry-leading courses and hands-on practical training.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-cyan-500 hover:text-white transition-colors"><FaFacebook /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-cyan-500 hover:text-white transition-colors"><FaTwitter /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-cyan-500 hover:text-white transition-colors"><FaInstagram /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-cyan-500 hover:text-white transition-colors"><FaLinkedin /></a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link></li>
                <li><Link href="/courses" className="hover:text-cyan-400 transition-colors">All Courses</Link></li>
                <li><Link href="/jobs" className="hover:text-cyan-400 transition-colors">Job Portal</Link></li>
                <li><Link href="/verify-certificate" className="hover:text-cyan-400 transition-colors">Verify Certificate</Link></li>
              </ul>
            </div>

            {/* Popular Courses */}
            <div>
              <h4 className="text-white font-bold text-lg mb-6">Popular Courses</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/courses" className="hover:text-cyan-400 transition-colors">Diploma in Computer App (DCA)</Link></li>
                <li><Link href="/courses" className="hover:text-cyan-400 transition-colors">Advance DCA (ADCA)</Link></li>
                <li><Link href="/courses" className="hover:text-cyan-400 transition-colors">Tally Prime with GST</Link></li>
                <li><Link href="/courses" className="hover:text-cyan-400 transition-colors">Web Development</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-white font-bold text-lg mb-6">Contact Us</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-cyan-400 mt-1 shrink-0" />
                  <span>Main Market, Fazilnagar, Kushinagar, Uttar Pradesh 274401</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaPhoneAlt className="text-cyan-400 shrink-0" />
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaEnvelope className="text-cyan-400 shrink-0" />
                  <span>info@gvcomputer.com</span>
                </li>
              </ul>
            </div>
            
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} GV Computer Center. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* ─── FLOATING RATING BUTTON ─── */}
      <ReviewHelper />
    </div>
  );
}