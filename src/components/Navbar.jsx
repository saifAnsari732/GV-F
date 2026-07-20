"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaBars, FaTimes, FaGraduationCap, FaBriefcase, FaChartBar, FaSignOutAlt, FaHome, FaCertificate } from 'react-icons/fa';

const Navbar = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate.push('/login');
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && menuRef.current && toggleRef.current && !menuRef.current.contains(event.target) && !toggleRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [menuOpen]);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    if (menuOpen) document.body.classList.add('overflow-hidden');
    else document.body.classList.remove('overflow-hidden');
    return () => document.body.classList.remove('overflow-hidden');
  }, [menuOpen]);

  const isActive = (path) => pathname === path;

  const NavLink = ({ href, icon: Icon, children, isBtn, danger }) => {
    const active = isActive(href);
    if (isBtn) {
      return (
        <Link href={href} onClick={closeMenu} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-lg ${danger ? 'bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-gray-900 border border-red-500/20 hover:border-red-500' : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-gray-900 hover:shadow-cyan-500/25 hover:scale-105 border border-transparent'}`}>
          <Icon className="text-lg" /> <span>{children}</span>
        </Link>
      );
    }
    return (
      <Link href={href} onClick={closeMenu} className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${active ? 'bg-white/10 text-cyan-400 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] border border-gray-200' : 'text-gray-700 hover:text-gray-900 hover:bg-white/5'}`}>
        <Icon className={`text-lg ${active ? 'text-cyan-400' : 'text-gray-600'}`} /> <span>{children}</span>
      </Link>
    );
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-gray-50/80 backdrop-blur-md border-b border-gray-200 py-3 shadow-2xl' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center max-w-7xl">
        
        {/* Brand */}
        <Link href="/" onClick={closeMenu} className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300 group-hover:scale-105 bg-white flex items-center justify-center">
            <Image src="/gv-logo.jpg" alt="GV Logo" fill className="object-cover" />
          </div>
          <span className="text-xl font-extrabold text-gray-900 tracking-tight">GV <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Computer</span></span>
        </Link>

        {/* Mobile Toggle */}
        <button ref={toggleRef} onClick={toggleMenu} className="md:hidden text-gray-700 hover:text-gray-900 p-2 rounded-lg bg-white/5 border border-gray-200 focus:outline-none">
          {menuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-2">
          <NavLink href="/" icon={FaHome}>Home</NavLink>
          <NavLink href="/courses" icon={FaGraduationCap}>Courses</NavLink>
          <NavLink href="/jobs" icon={FaBriefcase}>Jobs</NavLink>
          {!isAdmin && <NavLink href="/verify-certificate" icon={FaCertificate}>Verify</NavLink>}
          
          <div className="w-px h-6 bg-white/20 mx-2"></div>
          
          {isAuthenticated ? (
            <>
              <NavLink href={isAdmin ? "/admin/dashboard" : "/student/dashboard"} icon={FaChartBar}>Dashboard</NavLink>
              {isAdmin && <NavLink href="/admin/certificates" icon={FaCertificate}>Certificates</NavLink>}
              <NavLink href="/profile" icon={FaUser}>Profile</NavLink>
              <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-gray-900 border border-red-500/20 hover:border-red-500 ml-2">
                <FaSignOutAlt /> Logout
              </button>
            </>
          ) : (
            <>
              <NavLink href="/login" icon={FaUser}>Login</NavLink>
              <NavLink href="/register" icon={FaUser} isBtn>Register</NavLink>
            </>
          )}
        </div>

        {/* Mobile Menu Dropdown */}
        <div ref={menuRef} className={`absolute top-full left-4 right-4 bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-2xl p-4 flex flex-col gap-2 transition-all duration-300 origin-top md:hidden ${menuOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
          <NavLink href="/" icon={FaHome}>Home</NavLink>
          <NavLink href="/courses" icon={FaGraduationCap}>Courses</NavLink>
          <NavLink href="/jobs" icon={FaBriefcase}>Jobs</NavLink>
          {!isAdmin && <NavLink href="/verify-certificate" icon={FaCertificate}>Verify</NavLink>}
          
          <div className="h-px w-full bg-white/10 my-2"></div>
          
          {isAuthenticated ? (
            <>
              <NavLink href={isAdmin ? "/admin/dashboard" : "/student/dashboard"} icon={FaChartBar}>Dashboard</NavLink>
              {isAdmin && <NavLink href="/admin/certificates" icon={FaCertificate}>Certificates</NavLink>}
              <NavLink href="/profile" icon={FaUser}>Profile</NavLink>
              <button onClick={handleLogout} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-gray-900 border border-red-500/20 mt-2">
                <FaSignOutAlt /> Logout
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-3 mt-2">
              <Link href="/login" onClick={closeMenu} className="flex justify-center items-center gap-2 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition-all">
                Login
              </Link>
              <Link href="/register" onClick={closeMenu} className="flex justify-center items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-xl font-semibold transition-all shadow-lg shadow-cyan-500/25">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Menu Backdrop */}
      {menuOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm -z-10 md:hidden" onClick={closeMenu}></div>}
    </nav>
  );
};

export default Navbar;