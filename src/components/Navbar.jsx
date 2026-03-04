/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaBars, FaTimes, FaGraduationCap, FaBriefcase, FaChartBar, FaSignOutAlt, FaHome, FaBook, FaCertificate } from 'react-icons/fa';
import '../styles/Navbar.css';

const Navbar = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuOpen &&
        menuRef.current &&
        toggleRef.current &&
        !menuRef.current.contains(event.target) &&
        !toggleRef.current.contains(event.target)
      ) {
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

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }

    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [menuOpen]);

  // Check if link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <FaGraduationCap className="brand-icon" />
          <span>GV Computer Center</span>
        </Link>

        <button
          ref={toggleRef}
          className="menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div
          ref={menuRef}
          className={`navbar-menu ${menuOpen ? 'active' : ''}`}
        >
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            <FaHome /> <span>Home</span>
          </Link>
          <Link
            to="/courses"
            className={`nav-link ${isActive('/courses') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            <FaBook /> <span>Courses</span>
          </Link>
          <Link
            to="/jobs"
            className={`nav-link ${isActive('/jobs') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            <FaBriefcase /> <span>Jobs</span>
          </Link>
          {/* varified  */}
          {
          isAdmin ? "":
          
          <Link
            to="/verify-certificate"
            className={`nav-link ${isActive('/verify-certificate') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            <FaCertificate /> <span>Verify</span>
          </Link>
}
          {isAuthenticated ? (
            <>
              <Link
                to={isAdmin ? "/admin/dashboard" : "/student/dashboard"}
                className={`nav-link ${isActive('/admin/dashboard') || isActive('/student/dashboard') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                <FaChartBar /> <span>Dashboard</span>
              </Link>
              {isAdmin && (
                <Link
                  to="/admin/certificates"
                  className={`nav-link ${isActive('/admin/certificates') ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  <FaCertificate /> <span>Certificates</span>
                </Link>
              )}
              <Link
                to="/profile"
                className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                <FaUser /> <span>Profile</span>
              </Link>
              <button className="btn btn-danger nav-btn" onClick={handleLogout}>
                <FaSignOutAlt /> <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`nav-link ${isActive('/login') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                className="btn btn-primary nav-btn"
                onClick={closeMenu}
              >
                <span>Register</span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {menuOpen && <div className="menu-overlay" onClick={closeMenu}></div>}
    </nav>
  );
};

export default Navbar;