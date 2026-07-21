import Link from "next/link";
import React from 'react';
import {
  FaGraduationCap, FaBriefcase, FaCertificate, FaUsers,
  FaChalkboardTeacher, FaLaptopCode, FaRocket, FaStar, FaAward, FaTrophy,
  FaFacebook, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope,
  FaCheckCircle, FaArrowRight, FaPlay, FaWhatsapp
} from 'react-icons/fa';
import ReviewHelper from '../components/ReviewHelper';
import TestimonialSlider from '../components/TestimonialSlider';
import { API_URL } from '../helper';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'GV Computer Center | Best Computer Institute in Fazilnagar, Tamkuhi, Kasaya',
  description: 'No.1 computer training institute in Fazilnagar — DCA, ADCA, Tally, CCC, O Level courses + Job Placement assistance. Serving Tamkuhi Raj, Kasaya, Kushinagar, Padrauna & nearby areas.',
  keywords: 'GV Computer Center, Best Computer Institute Fazilnagar, Computer classes Tamkuhi, Top institute Kasaya, DCA ADCA near me, Jobs in Fazilnagar, Computer course Kushinagar, Job placement Fazilnagar, Tally CCC O Level institute, IT course Padrauna, Government job help Fazilnagar',
};

async function getCourses() {
  try {
    const res = await fetch(`${API_URL}/api/courses`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    return [];
  }
}

export default async function Home() {
  const courses = await getCourses();

  const features = [
    { icon: <FaChalkboardTeacher className="text-2xl" />, title: 'Expert Teachers', desc: '10+ years experienced faculty', color: 'bg-violet-100 text-violet-600', border: 'border-violet-200' },
    { icon: <FaCertificate className="text-2xl" />, title: 'Govt. Certified', desc: 'Recognized certificates', color: 'bg-blue-100 text-blue-600', border: 'border-blue-200' },
    { icon: <FaLaptopCode className="text-2xl" />, title: 'Practical Labs', desc: 'Hands-on real projects', color: 'bg-emerald-100 text-emerald-600', border: 'border-emerald-200' },
    { icon: <FaBriefcase className="text-2xl" />, title: 'Job Placement', desc: '100% placement support', color: 'bg-orange-100 text-orange-600', border: 'border-orange-200' },
  ];

  const stats = [
    { icon: '🎓', number: '10,000+', label: 'Students Trained', bg: 'bg-blue-50', text: 'text-blue-600' },
    { icon: '📚', number: '50+', label: 'Courses Offered', bg: 'bg-purple-50', text: 'text-purple-600' },
    { icon: '🏆', number: '90%', label: 'Success Rate', bg: 'bg-amber-50', text: 'text-amber-600' },
    { icon: '⭐', number: '4.8/5', label: 'Student Rating', bg: 'bg-emerald-50', text: 'text-emerald-600' },
  ];

  const courseColors = [
    { grad: 'from-blue-500 to-indigo-600', light: 'bg-blue-50', text: 'text-blue-600', tag: 'bg-blue-100' },
    { grad: 'from-emerald-500 to-teal-600', light: 'bg-emerald-50', text: 'text-emerald-600', tag: 'bg-emerald-100' },
    { grad: 'from-violet-500 to-purple-600', light: 'bg-violet-50', text: 'text-violet-600', tag: 'bg-violet-100' },
    { grad: 'from-rose-500 to-pink-600', light: 'bg-rose-50', text: 'text-rose-600', tag: 'bg-rose-100' },
  ];

  const perks = [
    'DCA, ADCA, Tally, CCC, O-Level courses',
    'Government recognized certificates',
    'Live project & practical training',
    'Job placement assistance',
    'Flexible batch timings',
    'Affordable fee structure',
  ];

  return (
    <div className="bg-white min-h-screen text-gray-900 overflow-x-hidden">

      {/* ══════════════════════════════════════════
          HERO SECTION — Centered, Modern
      ══════════════════════════════════════════ */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-white">
        {/* Background Mesh Gradient */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[600px] opacity-20 blur-[100px] bg-gradient-to-tr from-blue-200 via-red-50 to-blue-200 rounded-[100%]" />
          <div className="absolute bottom-0 left-0 w-full h-[300px] bg-gradient-to-t from-white via-white/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-50/80 border border-blue-200 text-blue-700 text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full mb-8 shadow-sm backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            #1 Computer Institute in Fazilnagar
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-blue-900 leading-[1.1] mb-8 tracking-tight max-w-4xl mx-auto">
            Master Computer Skills & <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500">
              Transform Your Future
            </span>
          </h1>

          {/* Description */}
          <p className="text-gray-500 text-base sm:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            Basic se lekar advanced computer courses (DCA, ADCA, Tally, CCC, O-Level). 
            <span className="text-gray-800 font-semibold"> 10,000+ students </span> ke bharosemand institute se judiye aur apne career ki shuruwat karein!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center w-full sm:w-auto mb-16">
            <Link href="/register"
              className="inline-flex justify-center items-center gap-2 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/30 hover:-translate-y-1 text-lg sm:text-base w-full sm:w-auto">
              <FaRocket /> Enroll Now — Free!
            </Link>
            <Link href="/courses"
              className="inline-flex justify-center items-center gap-2 bg-white hover:bg-gray-50 border-2 border-red-100 hover:border-red-500 text-blue-900 font-bold px-8 py-4 rounded-2xl transition-all duration-300 hover:-translate-y-1 text-lg sm:text-base w-full sm:w-auto shadow-sm">
              <FaGraduationCap className="text-red-600" /> View All Courses
            </Link>
          </div>

          {/* Featured Pills */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-6 max-w-3xl mx-auto">
            {['100% Job Assistance', 'Govt. Certified', 'Practical Labs', 'Experienced Faculty'].map((pill, i) => (
              <div key={i} className="flex items-center gap-2 bg-white border border-gray-100 shadow-sm px-4 py-2 rounded-full text-sm font-semibold text-gray-600">
                <FaCheckCircle className="text-emerald-500 text-xs" /> {pill}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          STATS SECTION
      ══════════════════════════════════════════ */}
      <section className="py-14 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className={`${s.bg} rounded-2xl p-6 text-center border border-gray-100 hover:-translate-y-1 transition-transform duration-300`}>
                <span className="text-4xl block mb-2">{s.icon}</span>
                <p className={`text-3xl font-extrabold ${s.text} mb-1`}>{s.number}</p>
                <p className="text-gray-500 text-sm font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          COURSES SECTION
      ══════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block bg-red-50 text-red-600 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4 border border-red-100">Our Programs</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-blue-900 mb-4">Popular Courses</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-lg">Explore our most in-demand courses designed to make you industry-ready and job-confident.</p>
          </div>

          {courses.length === 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-64 animate-pulse border border-gray-100" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {courses.slice(0, 4).map((course, idx) => {
                const c = courseColors[idx % courseColors.length];
                return (
                  <Link key={course._id} href={`/courses/${course._id}`}
                    className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col">
                    {/* Top gradient bar */}
                    <div className={`h-1.5 bg-gradient-to-r ${c.grad}`} />
                    <div className="p-5 flex flex-col flex-1">
                      {/* Icon */}
                      <div className={`w-12 h-12 ${c.light} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <FaGraduationCap className={`text-xl ${c.text}`} />
                      </div>
                      <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{course.courseName}</h3>
                      <p className="text-gray-400 text-xs mb-4 flex-1 line-clamp-2">Master this in-demand course and elevate your career prospects.</p>
                      {/* Price + CTA */}
                      <div className="flex items-center justify-between mt-auto">
                        <span className={`${c.tag} ${c.text} text-xs font-bold px-3 py-1 rounded-full`}>
                          ₹{course.fees?.toLocaleString() || 'Free'}
                        </span>
                        <span className={`${c.text} text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all`}>
                          Learn <FaArrowRight className="text-[10px]" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="text-center mt-10">
            <Link href="/courses"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-900 to-blue-800 text-white font-bold px-8 py-3.5 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/30 hover:-translate-y-0.5">
              View All Courses <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          WHY CHOOSE US — horizontal scroll pills on mobile
      ══════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <span className="inline-block bg-red-50 border border-red-100 text-red-600 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5">Why Choose Us</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-5 leading-tight">
                The GV Computer<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500">Advantage</span>
              </h2>
              <p className="text-gray-500 text-base leading-relaxed mb-8">
                Fazilnagar ka sabse trusted computer institute — jahan quality education, practical skills, aur career support ek saath milte hain.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((f, i) => (
                  <div key={i} className={`flex items-start gap-4 p-4 rounded-2xl border ${f.border} bg-gray-50/50 hover:-translate-y-0.5 transition-transform duration-200`}>
                    <div className={`w-11 h-11 ${f.color} rounded-xl flex items-center justify-center shrink-0`}>{f.icon}</div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{f.title}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Visual card */}
            <div className="relative hidden lg:block">
              <div className="bg-gradient-to-br from-blue-900 to-blue-950 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-900/30 border border-blue-800">
                <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/20 rounded-full translate-x-16 -translate-y-16 blur-2xl" />
                <div className="absolute bottom-0 left-0 w-36 h-36 bg-blue-500/10 rounded-full -translate-x-10 translate-y-10" />
                <div className="relative z-10">
                  <p className="text-red-400 text-sm font-semibold uppercase tracking-widest mb-2">Student Testimonial</p>
                  <p className="text-white text-lg font-bold leading-relaxed mb-8">
                    "GV Computer Center ne meri life change kar di! DCA course ke baad mujhe ek government job mil gayi. Best institute in Fazilnagar!"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center font-bold text-xl">R</div>
                    <div>
                      <p className="font-bold text-white">Rahul Kumar</p>
                      <p className="text-cyan-100 text-sm">DCA Graduate • Now at Govt. Office</p>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
                    {[['10K+','Students'],['50+','Courses'],['90%','Placement']].map(([n,l],i) => (
                      <div key={i} className="text-center">
                        <p className="text-2xl font-extrabold text-white">{n}</p>
                        <p className="text-gray-400 text-xs">{l}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block bg-emerald-100 text-emerald-600 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">Student Success</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">What Our Students Say</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">Don't just take our word for it — hear from 10,000+ students who built their careers with us.</p>
          </div>
          <TestimonialSlider />
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA SECTION — Deep Blue & Red
      ══════════════════════════════════════════ */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-950" />
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)', backgroundSize: '32px 32px'}} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/20 rounded-full translate-x-48 -translate-y-48 blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/20 rounded-full -translate-x-32 translate-y-32 blur-[80px]" />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <span className="inline-block bg-white/10 text-red-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6 backdrop-blur-sm border border-red-500/30">
            🚀 Limited Seats Available
          </span>
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Start Your Learning<br />Journey Today!
          </h2>
          <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of students who transformed their careers. Register now and get your first class FREE!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register"
              className="inline-flex items-center justify-center gap-2 bg-red-600 text-white hover:bg-red-700 font-extrabold px-10 py-4 rounded-2xl hover:-translate-y-1 transition-all duration-300 shadow-2xl shadow-red-600/30 text-lg">
              <FaRocket /> Enroll Now — Free!
            </Link>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white font-extrabold px-10 py-4 rounded-2xl hover:-translate-y-1 transition-all duration-300 shadow-xl text-lg">
              <FaWhatsapp /> WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          LOCAL SEO SECTION
      ══════════════════════════════════════════ */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Leading Computer Institute in Kushinagar District</h2>
          <p className="text-gray-400 text-sm leading-relaxed max-w-4xl mx-auto">
            GV Computer Center is proud to be the top choice for students searching for the <strong className="text-gray-600">Best Computer Institute in Fazilnagar</strong>, <strong className="text-gray-600">Computer Classes in Tamkuhi Raj</strong>, and <strong className="text-gray-600">Top Computer Coaching in Kasaya</strong>. We also serve students from <strong className="text-gray-600">Kushinagar, Padrauna, Patherwa, Seorahi, and Dudhai</strong>. Whether you are looking for a <em>DCA course near me</em>, <em>ADCA computer center</em>, <em>Tally Prime with GST</em>, <em>CCC certification</em>, or <em>Web Development classes</em>, our expert faculty is here to help you succeed.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer className="bg-gray-950 text-gray-400 pt-16 pb-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div>
              <Link href="/" className="flex items-center gap-3 mb-5">
                <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg bg-white flex items-center justify-center">
                  <span className="font-extrabold text-lg"><span className="text-blue-900">G</span><span className="text-red-600">V</span></span>
                </div>
                <span className="text-xl font-extrabold tracking-tight"><span className="text-blue-500">G</span><span className="text-red-500">V</span> <span className="text-blue-100">Computer</span></span>
              </Link>
              <p className="text-sm leading-relaxed mb-6 text-gray-500">
                Empowering the next generation of tech professionals with industry-leading courses and hands-on training since 2010.
              </p>
              <div className="flex gap-3">
                {[[FaFacebook,'#'],[FaInstagram,'#'],[FaLinkedin,'#'],[FaWhatsapp,'https://wa.me/919876543210']].map(([Icon, href], i) => (
                  <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-blue-600 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200">
                    <Icon className="text-sm" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold text-base mb-5">Quick Links</h4>
              <ul className="space-y-3 text-sm">
                {[['/', 'Home'],['/courses','All Courses'],['/jobs','Job Portal'],['/verify-certificate','Verify Certificate'],['/register','Enroll Now']].map(([to, label]) => (
                  <li key={to}><Link href={to} className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                    <FaArrowRight className="text-[10px] text-blue-500" /> {label}
                  </Link></li>
                ))}
              </ul>
            </div>

            {/* Courses */}
            <div>
              <h4 className="text-white font-bold text-base mb-5">Popular Courses</h4>
              <ul className="space-y-3 text-sm">
                {['DCA — Diploma in Computer App','ADCA — Advanced DCA','Tally Prime with GST','CCC Certification','O Level Program','Web Development'].map(c => (
                  <li key={c}><Link href="/courses" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                    <FaArrowRight className="text-[10px] text-blue-500" /> {c}
                  </Link></li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-bold text-base mb-5">Contact Us</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-blue-400 mt-1 shrink-0" />
                  <span>Main Market, Fazilnagar, Kushinagar, Uttar Pradesh 274401</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaPhoneAlt className="text-blue-400 shrink-0" />
                  <a href="tel:+919876543210" className="hover:text-blue-400 transition-colors">+91 98765 43210</a>
                </li>
                <li className="flex items-center gap-3">
                  <FaEnvelope className="text-blue-400 shrink-0" />
                  <a href="mailto:info@gvcomputer.in" className="hover:text-blue-400 transition-colors">info@gvcomputer.in</a>
                </li>
                <li className="flex items-center gap-3">
                  <FaWhatsapp className="text-green-400 shrink-0" />
                  <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors">WhatsApp Chat</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <p>© {new Date().getFullYear()} GV Computer Center, Fazilnagar. All rights reserved.</p>
            <div className="flex gap-5">
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>

      <ReviewHelper />
    </div>
  );
}