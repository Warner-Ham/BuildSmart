import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import BudgetingTab from './BudgetingTab';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './App.scss';

// App.js - Main React application file for BuildSmart
// This file contains the main app structure, navigation, routing, and global logic.
// Comments are provided throughout to explain both simply and technically.

// ProtectedRoute component: Protects routes based on authentication and role requirements
// Props:
// - children: The component to render if access is allowed
// - requireAuth: boolean indicating if authentication is required
// - allowedRoles: array of roles that can access this route
// - loggedInUser: current logged in username
// - loggedInRole: current user's role
function ProtectedRoute({ children, requireAuth = false, allowedRoles = [], loggedInUser, loggedInRole }) {
  // If authentication is required but user is not logged in, redirect to home
  if (requireAuth && !loggedInUser) {
    return <Navigate to="/" replace />;
  }
  
  // If specific roles are required but user doesn't have the right role, redirect to home
  if (allowedRoles.length > 0 && (!loggedInRole || !allowedRoles.includes(loggedInRole))) {
    return <Navigate to="/" replace />;
  }
  
  // If all checks pass, render the protected component
  return children;
}

// AboutUs component: Formal About Us page with sample text
function AboutUs() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef(null);

  // This effect listens to scroll events to trigger animations and parallax.
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.pageYOffset);

      if (containerRef.current) {
        const top = containerRef.current.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (top < windowHeight * 0.85) {
          setIsVisible(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); 

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const paragraphs = [
    // --- Introduction / About Us ---
    <h2 key="h1" style={{marginTop: '1.5rem', color: '#333'}}>Who Are We</h2>,
    <p key="p1" style={{fontSize: '1.15rem', marginBottom: '1.2rem'}}>
      <strong>Construction & Property Solutions (Pvt) Ltd (CPS)</strong> was founded in <em>2017</em> to bridge the gap between Sri Lanka’s local construction industry and modern engineering technology. We specialize in delivering <strong>end‑to‑end solutions</strong> across civil, mechanical, and electrical engineering, from industrial and commercial building design to turnkey project management.
    </p>,
    <p key="p1b" style={{fontSize: '1.15rem', marginBottom: '1.2rem'}}>
      Since its inception, CPS has steadily grown from a small-scale service provider into a trusted name in Sri Lanka’s construction sector. Over the years, we have expanded our portfolio to include <em>infrastructure development, steel fabrication, and specialized MEP solutions</em>, while maintaining a strong reputation for reliability and innovation.
    </p>,

    // --- Team & Leadership ---
    <h2 key="h2" style={{marginTop: '1.5rem', color: '#333'}}>Our Team & Leadership</h2>,
    <p key="p2" style={{fontSize: '1.15rem', marginBottom: '1.2rem'}}>
      Our team is led by highly experienced <strong>Chartered Engineers</strong> and supported by skilled professionals in civil, mechanical, and electrical disciplines. With decades of combined expertise, we have successfully delivered projects ranging from <em>steel structures, RCC buildings, and roadworks</em> to <em>factory floor design, machinery installation, and MEP solutions</em>.
    </p>,
    <p key="p2b" style={{fontSize: '1.15rem', marginBottom: '1.2rem'}}>
      At the helm, our directors bring over 20–25 years of proven industry experience. Their leadership is complemented by a dedicated team of <strong>quantity surveyors, site supervisors, and skilled craftsmen</strong> who ensure that every project is executed with precision. This blend of strategic vision and hands‑on expertise allows CPS to take on complex challenges with confidence.
    </p>,

    // --- Manufacturing & Capabilities ---
    <h2 key="h3" style={{marginTop: '1.5rem', color: '#333'}}>Manufacturing & Capabilities</h2>,
    <p key="p3" style={{fontSize: '1.15rem', marginBottom: '1.2rem'}}>
      Beyond construction services, CPS also manufactures <strong>cement cellular blocks, solid blocks, and interlock paving blocks</strong> to SLS standards, with plans to expand into eco‑friendly and lightweight building materials. Backed by a fully equipped mechanical workshop and modern fabrication facilities, we are capable of handling complex steel and concrete projects with precision and reliability.
    </p>,

    // --- Vision & Mission ---
    <h2 key="h4" style={{marginTop: '1.5rem', color: '#333'}}>Vision & Mission</h2>,
    <p key="p4" style={{fontSize: '1.15rem', marginBottom: '1.2rem'}}>
      At CPS, our vision is to <em>uphold engineering standards in every aspect of construction</em>, while our mission is to achieve <strong>ICTAD Category 1 contractor grading with ISO certification</strong> in the near future. With a commitment to quality, innovation, and trust, we continue to build lasting solutions for Sri Lanka’s evolving construction landscape.
    </p>,

    // --- Client Focus ---
    <h2 key="h5" style={{marginTop: '1.5rem', color: '#333'}}>Client Commitment</h2>,
    <p key="p5" style={{fontSize: '1.15rem', marginBottom: '1.2rem'}}>
      We also place strong emphasis on <strong>client satisfaction and sustainability</strong>. Every project is approached with a focus on safety, efficiency, and environmental responsibility. By integrating modern technologies with proven engineering practices, we ensure that our solutions are not only durable but also aligned with the future needs of communities and industries. This dedication to excellence has made CPS a trusted partner for organizations seeking reliable, forward‑thinking construction solutions.
    </p>,

    // --- Closing ---
    <p key="p6" align="center" style={{fontSize: '1.15rem', fontWeight: 'bold', marginTop: '1.5rem', color: '#555'}}>
      <em>For more information, please contact us or visit our office.</em>
    </p>
  ];

  return (
    <div style={{ position: 'relative', padding: '3rem 0' }}>
      <div
        ref={containerRef}
        className="aboutus-formal-container"
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 850,
          margin: '0 auto',
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 2px 16px #e0e0e0',
          padding: '2.5rem 2rem 3rem 3rem',
          fontFamily: 'Segoe UI, Arial, sans-serif',
          color: '#1a2a1a',
          lineHeight: 1.7,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'
        }}
      >
        <h1 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: '1.5rem', color: '#205c20', textAlign: 'center', letterSpacing: '0.02em' }}>
          About
        </h1>
        {paragraphs.map((p, index) => (
          <div
            key={index}
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
              transitionDelay: `${0.2 + index * 0.1}s`
            }}
          >
            {p}
          </div>
        ))}
        <p align="center" style={{marginTop: '1.5rem', opacity: isVisible ? 1 : 0, transition: 'opacity 0.6s ease-out', transitionDelay: '0.9s'}}>
          <a href={process.env.PUBLIC_URL + '/Updated CPS Profile.pdf'} target="_blank" rel="noopener noreferrer" className="cta-btn" style={{padding: '10px 20px', fontSize: '1.1rem'}}>View Profile (PDF)</a>
        </p>
        
        {/* --- Parallax Image Wrapper 1 --- */}
        <div style={{
            position: 'absolute', top: '500px', right: '-375px', width: '400px',
            // CHANGED: Use isVisible to trigger the animation
            transform: `translateX(${isVisible ? '0' : '100px'})`,
            opacity: isVisible ? 1 : 0,
            transition: 'transform 1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.4s, opacity 0.8s ease-out 0.4s'
        }}>
            <img 
              src={process.env.PUBLIC_URL + '/frontend-show.png'} 
              alt="Construction Site" 
              style={{
                width: '100%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
                transform: `translateY(calc(-50% + ${scrollY * 0.15}px)) rotate(${1 + 6 * Math.cos(scrollY * 0.003)}deg)`,
              }}
            />
        </div>

        {/* --- Parallax Image Wrapper 2 --- */}
        <div style={{
            position: 'absolute', top:'900px', left: '-390px', width: '400px',
            // CHANGED: Use isVisible to trigger the animation
            transform: `translateX(${isVisible ? '0' : '-100px'})`,
            opacity: isVisible ? 1 : 0,
            transition: 'transform 1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.4s, opacity 0.8s ease-out 0.4s'
        }}>
            <img 
              src={process.env.PUBLIC_URL + '/frontend-show(2).png'} 
              alt="Construction Engineers" 
              style={{
                width: '100%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
                transform: `translateY(calc(80% - ${scrollY * 0.15}px)) rotate(${2 - 6 * Math.cos(scrollY * 0.003 - 1)}deg)`,
              }}
            />
        </div>
      </div>
      
      {/* Background Girder Image */}
      <img 
        src={process.env.PUBLIC_URL + '/suspended_girder.png'} 
        alt="Suspended Girder" 
        style={{
          position: 'absolute',
          bottom: '50%',
          left: '50%',
          width: '1800px',
          filter: 'brightness(0.75) opacity(0.35)',
          zIndex: 1,
          pointerEvents: 'none',
          transform: `translateX(-50%) translateY(${scrollY * 0.85}px) rotate(3deg)`
        }}
      />
    </div>
  );
}

// Load logo images from the public folder
const logo = process.env.PUBLIC_URL + '/logo.png'; // Main logo image
const logoFooter = process.env.PUBLIC_URL + '/logo_footer.png'; // Footer logo image
const logoText = process.env.PUBLIC_URL + '/logo_text.png'; // Logo text image


// Navbar component: Displays the top navigation bar and account menu
// Props:
// - onLoginClick: function to open login popup
// - loggedInUser: current logged in username
// - loggedInRole: current user's role
// - loginTime: timestamp of login
// - onLogoutClick: function to trigger logout
function Navbar({ onLoginClick, loggedInUser, loggedInRole, loginTime, onLogoutClick }) {
  // State for navigation menu and account dropdown
  const [navOpen, setNavOpen] = useState(false); // Is nav menu open?
  const [accountOpen, setAccountOpen] = useState(false); // Is account dropdown open?
  const accountRef = useRef(); // Ref for account dropdown (for outside click detection)

  // Close dropdown on outside click
  // Effect: Close account dropdown if user clicks outside
  useEffect(() => {
    if (!accountOpen) return;
    function handleClick(e) {
      // If click is outside the account dropdown, close it
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [accountOpen]);

  // Render navigation bar
  return (
    <nav className="navbar sleek-navbar">
      <div className="navbar-left">
        {/* Logo text on the left */}
        <img src={logoText} alt="BuildSmart Logo Text" className="navbar-logo-text" style={{height: '30px'}} />
      </div>
      {/* Hamburger menu for mobile navigation */}
      <button className="nav-toggle" onClick={() => setNavOpen(!navOpen)} aria-label="Toggle navigation">
        <span className={navOpen ? 'bar open' : 'bar'}></span>
        <span className={navOpen ? 'bar open' : 'bar'}></span>
        <span className={navOpen ? 'bar open' : 'bar'}></span>
      </button>
      {/* Navigation links and account menu */}
      <div className={navOpen ? 'nav-links open' : 'nav-links'}>
        {/* Home link */}
        <Link to="/" onClick={() => setNavOpen(false)}>Home</Link>
        {/* About tab for all users */}
        <Link to="/about" onClick={() => setNavOpen(false)}>About</Link>
        {/* Budgeting tab only for staff roles */}
        {(loggedInUser && ["Site Manager", "Document Control Manager", "Admin"].includes(loggedInRole)) && (
          <Link to="/budget" onClick={() => setNavOpen(false)}>Budgeting</Link>
        )}
        {/* Project request tab for all users */}
        <Link to="/request" onClick={() => setNavOpen(false)}>Request</Link>
        {/* Account menu for logged in users */}
        {loggedInUser ? (
          <div className="account-menu-wrapper" ref={accountRef} style={{ position: 'relative', display: 'inline-block' }}>
            {/* Account button shows username and dropdown arrow */}
            <button
              className="account-btn"
              onClick={() => setAccountOpen((open) => !open)}
              style={{
                background: '#ffffffff',
                color: '#205c20',
                border: '4px solid #ffffffff',
                borderRadius: 8,
                padding: '4px 18px',
                fontWeight: 700,
                fontFamily: 'Segoe UI, Arial, sans-serif',
                fontSize: '1.1rem',
                cursor: 'pointer',
                // boxShadow: '0 1px 4px #e0f2e9',
                minWidth: 120,
                transition: 'background 0.2s'
              }}
            >{loggedInUser} {accountOpen ? '\u25B2' : '\u25BC'}</button>
            {/* Dropdown menu for account actions */}
            {accountOpen && <AccountDropdown loggedInUser={loggedInUser} loggedInRole={loggedInRole} loginTime={loginTime} onLogoutClick={onLogoutClick} />}
          </div>
        ) : (
          // Login button for guests
          <button className="staff-login-btn" onClick={onLoginClick}>Staff Login</button>
        )}
      </div>
    </nav>
  );
}

// AccountDropdown component: Shows user info and logout button
// Props:
// - loggedInUser: username
// - loggedInRole: role
// - loginTime: timestamp
// - onLogoutClick: function to log out
function AccountDropdown({ loggedInUser, loggedInRole, loginTime, onLogoutClick }) {
  // State for how long user has been active
  const [activeTime, setActiveTime] = useState('0s');
  useEffect(() => {
    if (!loginTime) return;
    // Helper to format duration in h m s
    function formatDuration(ms) {
      const sec = Math.floor(ms / 1000) % 60;
      const min = Math.floor(ms / 60000) % 60;
      const hr = Math.floor(ms / 3600000);
      return `${hr > 0 ? hr + 'h ' : ''}${min > 0 ? min + 'm ' : ''}${sec}s`;
    }
    // Update active time every 100ms
    const update = () => setActiveTime(formatDuration(Date.now() - loginTime));
    const interval = setInterval(update, 100);
    update();
    return () => clearInterval(interval);
  }, [loginTime]);
  // Render dropdown with user info and logout button
  return (
    <div className="account-dropdown" style={{
      position: 'absolute',
      top: '110%',
      right: 0,
      background: '#fff',
      border: '1px solid #e0e0e0',
      borderRadius: 8,
      // boxShadow: '0 2px 8px #e0f2e9',
      minWidth: 200,
      zIndex: 1000,
      fontFamily: 'Segoe UI, Arial, sans-serif',
      fontSize: '1.1rem',
      fontWeight: 500,
      padding: '8px 0',
      textAlign: 'left'
    }}>
      <div style={{
        padding: '8px 18px',
        color: '#205c20',
        borderBottom: '1px solid #e0e0e0',
        fontWeight: 700
      }}>
        <div>{loggedInUser}</div>
        <div style={{ fontSize: '0.9rem', color: '#555' }}>Role: {loggedInRole}</div>
        <div style={{ fontSize: '0.9rem', color: '#555' }}>Active: {activeTime}</div>
      </div>
      <button
        className="logout-btn"
        onClick={onLogoutClick}
        style={{
          width: '100%',
          background: '#e74c3c',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          padding: '10px 0',
          fontWeight: 700,
          fontFamily: 'Segoe UI, Arial, sans-serif',
          fontSize: '1rem',
          cursor: 'pointer',
          marginTop: 4
        }}
      >Logout</button>
    </div>
  );
}

// ConfirmationModal component: Shows a popup dialog for confirming critical actions
// Props:
// - open: whether modal is visible
// - onClose: function to close modal
// - onConfirm: function to confirm action
// - title: modal title
// - message: modal message
// - confirmText: confirm button text
// - cancelText: cancel button text
function ConfirmationModal({ open, onClose, onConfirm, title, message, confirmText = "Yes", cancelText = "No" }) {
  if (!open) return null;

  // Render modal dialog
  return (
    <div className="login-popup-overlay">
      <div className="login-popup" style={{ maxWidth: '400px', textAlign: 'center' }}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h3 style={{ margin: '0 0 1rem 0', color: '#205c20' }}>{title}</h3>
        <p style={{ margin: '0 0 1.5rem 0', color: '#555', lineHeight: '1.4' }}>{message}</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            onClick={onConfirm}
            style={{
              background: '#27ae60',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              fontWeight: '600',
              cursor: 'pointer',
              minWidth: '80px'
            }}
          >{confirmText}</button>
          <button
            onClick={onClose}
            style={{
              background: '#e74c3c',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              fontWeight: '600',
              cursor: 'pointer',
              minWidth: '80px'
            }}
          >{cancelText}</button>
        </div>
      </div>
    </div>
  );
}

function LoginPopup({ open, onClose, onLogin }) {
  // LoginPopup component: Handles staff login authentication
  // Props:
  // - open: boolean to show/hide popup
  // - onClose: function to close popup
  // - onLogin: function to handle successful login (passes username and role)
  const [id, setId] = useState(''); // Staff ID input value
  const [username, setUsername] = useState(''); // Username input value
  const [password, setPassword] = useState(''); // Password input value
  const [error, setError] = useState(''); // Error message for login failures

  if (!open) return null; // Don't render if popup is closed

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      // Fetch staff data from backend API
      // Technically: Makes HTTP GET request to /api/staff endpoint
      const res = await fetch('http://localhost:8080/api/staff');
      const staffData = await res.json(); // Parse JSON response
      // Find matching staff record by ID, username, and password
      // Technically: Uses Array.find() to search for exact match
      const found = staffData.find(
        (staff) => staff.id === id && staff.username === username && staff.password === password
      );
      if (found) {
        // Login successful: call parent onLogin with username and role
        onLogin(username, found.role); // Pass role to parent
        // Clear form fields and error
        setId(''); setUsername(''); setPassword(''); setError('');
      } else {
        // No matching staff found
        setError('Invalid credentials.');
      }
    } catch {
      // Network or API error
      setError('Unable to connect to staff API.');
    }
  };

  return (
    <div className="login-popup-overlay">
      <div className="login-popup">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>Staff Login</h2>
        <form onSubmit={handleSubmit}>
          {/* Input fields for login credentials */}
          <input type="text" placeholder="Staff ID" value={id} onChange={e => setId(e.target.value)} required />
          <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="staff-login-btn">Login</button>
        </form>
        {/* Show error message if login failed */}
        {error && <div className="login-error">{error}</div>}
      </div>
    </div>
  );
}

function AnimatedPage({ children }) {
  // AnimatedPage component: Wraps page content for smooth transitions
  // Simple: Makes pages fade in/out when navigating
  // Technical: Uses React Router's location.pathname as key to trigger re-mount on route change
  const location = useLocation();
  return (
    <div key={location.pathname} className="animated-page">
      {children}
    </div>
  );
}


function Home() {
  const [projects, setProjects] = useState([]); // Array of project data from backend
  const aboutRef = useRef(); // Ref for about section to detect visibility
  const [aboutVisible, setAboutVisible] = useState(false); // Is about section visible on screen?
  const servicesRef = useRef(); // Ref for services section
  const [servicesVisible, setServicesVisible] = useState(false); // Is services section visible?
  const specialitiesRef = useRef(); // Ref for specialities section
  const [specialitiesVisible, setSpecialitiesVisible] = useState(false); // Is specialities section visible?

  useEffect(() => {
    // Fetch projects data on component mount
    // Simple: Loads project list from server
    // Technical: Makes async HTTP GET to /api/projects, handles response as JSON array
    fetch('http://localhost:8080/api/projects')
      .then(res => res.json())
      .then(data => {
        // Ensure projects is always an array
        if (Array.isArray(data)) {
          setProjects(data);
        } else if (data && typeof data === 'object') {
          setProjects([data]);
        } else {
          setProjects([]);
        }
      })
      .catch(() => setProjects([])); // On error, set empty array
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Check if about section is in viewport
      // Simple: Detects when user scrolls to about section
      // Technical: Uses getBoundingClientRect() to check if top < window height and bottom > 0
      if (aboutRef.current) {
        const rect = aboutRef.current.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        setAboutVisible(inView);
      }
      // Check if services section is in viewport
      if (servicesRef.current) {
        const rect = servicesRef.current.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        setServicesVisible(inView);
      }
      // Check if specialities section is in viewport
      if (specialitiesRef.current) {
        const rect = specialitiesRef.current.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        setSpecialitiesVisible(inView);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper to get correct image path for public folder
  const getImageSrc = (imgPath) => {
    const parts = imgPath.replace(/\\/g, '/').split('/');
    const subfolder = parts[2];
    const filename = parts[3];
    return process.env.PUBLIC_URL + `/project_images/${subfolder}/${filename}`;
  };

  // Services and Specialities data
  const services = [
    {
      title: "Project Management",
      description: "End-to-end management of construction projects, ensuring quality and timely delivery.",
      img: process.env.PUBLIC_URL + "/service_project_management.png",
      animation: "fadeInUp"
    },
    {
      title: "Design & Engineering",
      description: "Innovative architectural and engineering solutions tailored to client needs.",
      img: process.env.PUBLIC_URL + "/service_design_engineering.png",
      animation: "fadeInLeft"
    },
    {
      title: "Site Supervision",
      description: "On-site supervision and safety management for flawless execution.",
      img: process.env.PUBLIC_URL + "/service_site_supervision.png",
      animation: "fadeInRight"
    },
    {
      title: "Consultancy",
      description: "Expert advice and consultancy for project planning, budgeting, and risk management.",
      img: process.env.PUBLIC_URL + "/service_consultancy.png",
      animation: "fadeInUp"
    }
  ];
  const specialities = [
    {
      title: "Steel Work",
      description: "High-quality steel fabrication and installation for industrial and commercial projects.",
      img: process.env.PUBLIC_URL + "/speciality_steel_work.png",
      animation: "fadeInUp"
    },
    {
      title: "Bridge Construction",
      description: "Expertise in building durable and safe bridges for all environments.",
      img: process.env.PUBLIC_URL + "/speciality_bridge_construction.png",
      animation: "fadeInLeft"
    },
    {
      title: "Road Development",
      description: "Comprehensive road development solutions from planning to execution.",
      img: process.env.PUBLIC_URL + "/speciality_road_development.png",
      animation: "fadeInRight"
    },
    {
      title: "Roofing Solutions",
      description: "Advanced roofing systems for residential, commercial, and industrial steel buildings.",
      img: process.env.PUBLIC_URL + "/speciality_roofing_solutions.png",
      animation: "fadeInUp"
    },
    {
      title: "Drainage Systems",
      description: "Efficient drainage system design and installation for all project types.",
      img: process.env.PUBLIC_URL + "/speciality_drainage_systems.png",
      animation: "fadeInLeft"
    },
    {
      title: "Boundary Installations",
      description: "Secure and aesthetic boundary and retaining wall installations for properties.",
      img: process.env.PUBLIC_URL + "/speciality_boundary_wall.png",
      animation: "fadeInRight"
    }
  ];

  return (
    <AnimatedPage>
      {/* Hero section: Main landing area with logo and welcome message */}
      {/* Simple: Shows the company logo and tagline to greet visitors */}
      {/* Technical: Uses global logo constant and Link component for navigation */}
      <section className="hero">
        <div className="hero-content">
          <img src={logo} alt="BuildSmart Logo" className="hero-logo" />
          <h1>Welcome to <span className="highlight">BuildSmart</span></h1>
          <p className="subtitle">Your smart solution for building management and innovation.</p>
          <Link to="" className="cta-btn-2">Get Started</Link>
        </div>
      </section>
      {/* About section: Company description with scroll-triggered animation */}
      {/* Simple: Displays information about the company when scrolled into view */}
      {/* Technical: Uses ref for visibility detection, conditional class for fade-in animation */}
      <section
        ref={aboutRef}
        className={`about-section${aboutVisible ? ' animated-fade-in' : ''}`}
      >
      <h2 className="about-title">Brief Overview</h2>
      <div className="about-content">
        <p>
          <strong>Construction & Property Solutions (Pvt) Ltd (CPS)</strong> is a trusted name in Sri Lanka’s construction industry, delivering <em>innovative, reliable, and sustainable solutions</em> since 2017. Our expert team of Chartered Engineers and skilled professionals specialize in industrial, commercial, and residential projects, from <strong>steel structures and RCC buildings</strong> to <strong>MEP solutions and turnkey project management</strong>.
        </p>
        <p>
          Backed by decades of experience and a fully equipped fabrication workshop, we combine <em>engineering excellence, modern technology, and client-focused service</em> to ensure every project is completed with quality, safety, and precision.
        </p>
        <p>
          <strong>BuildSmart</strong> is the unofficial <em>web project of CPS</em>, created to showcase our capabilities, highlight our portfolio, and connect with clients seeking reliable construction and property solutions. Through BuildSmart, we bring our vision of engineering excellence and client‑focused service into the digital space, making it easier than ever to explore how CPS can transform your ideas into reality.
        </p>
        <br/>
        <Link to="/about" className="cta-btn">Learn More</Link>
      </div>
      </section>
      {/* <img 
          src={process.env.PUBLIC_URL + '/construction_tape.png'} 
          alt="Construction Tape" 
          style={{
            position: 'absolute',
            top: '2150px',
            left: '0%',
            transform: 'translateX(-10%)',
            zIndex: -10,
            pointerEvents: 'none',
            filter: 'brightness(0.85) blur(4px)',
            scale: '1.2',
            opacity: 0.65
          }}
      /> */}
      {/* Services and Specialities Section */}
      <div 
        className="container services-container" 
        style={{ position: 'relative', overflow: 'hidden' }} // 1. Add position: relative. 'overflow: hidden' is good practice to prevent the rotated image from sticking out.
      >
        {/* 2. Move the image INSIDE the container */}
        <img 
            src={process.env.PUBLIC_URL + '/construction_tape.png'} 
            alt="Construction Tape" 
            style={{
              position: 'absolute',
              // 3. Update styles to center the image
              top: '50%',
              left: '50%',
              // This transform first moves the image back by 50% of its own width/height to perfectly center it, then applies your rotation.
              transform: 'translate(-50%, -50%)', 
              zIndex: 0, // Keep this to ensure it's in the background
              pointerEvents: 'none',
              filter: 'saturate(0.9)',
              // The image might need to be wider than the container to look right when rotated.
              // Use width instead of scale for better control.
              width: '160%', 
              opacity: 0.05
            }}
        />

        {/* The rest of your content stays exactly the same */}
        <div
          ref={servicesRef}
          className={`services-section${servicesVisible ? ' services-visible' : ''}`}
        >
          {/* ... services content ... */}
          <h1 className="services-title">Our Services</h1>
          <div className="services-list">
            {services.map((service, idx) => (
              <div key={idx} className={`service-card animated ${service.animation}${servicesVisible ? ' card-visible' : ''}`} style={{marginBottom: '0rem', animationDelay: `${idx * 0.15}s`}}>
                <img src={service.img} alt={service.title} className="service-img" style={{width: '80px', height: '80px', borderWidth: '0px', borderRadius: '0px'}} />
                <br></br><h2 style={{margin: '0 0 0 0'}}>{service.title}</h2>
                <p style={{fontSize: '1.15rem', color: '#205c20'}}>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div
          ref={specialitiesRef}
          className={`specialities-section${specialitiesVisible ? ' specialities-visible' : ''}`}
        >
          {/* ... specialities content ... */}
          <h1 className="services-title" style={{marginTop: '3rem'}}>Our Specialities</h1>
          <div className="services-list">
            {specialities.map((spec, idx) => (
              <div key={idx} className={`service-card animated ${spec.animation}${specialitiesVisible ? ' card-visible' : ''}`} style={{marginBottom: '0rem', animationDelay: `${idx * 0.15}s`}}>
                <img src={spec.img} alt={spec.title} className="service-img" style={{width: '80px', height: '80px', borderWidth: '0px', borderRadius: '0px'}} />
                <br></br><h2 style={{margin: '0 0 0 0'}}>{spec.title}</h2>
                <p style={{fontSize: '1.15rem', color: '#205c20'}}>{spec.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Projects section: Displays featured projects from backend */}
      {/* Simple: Shows a list of completed projects with images and details */}
      {/* Technical: Conditionally renders loading or project list, maps over projects array */}
      <section className="projects-section full-width-section">
        <h2 className="projects-title">Featured Construction Projects</h2>
        <div className="projects-grouped">
          {projects.length === 0 ? (
            <div className="projects-loading">Loading projects...</div>
          ) : (
            projects.map((proj, idx) => (
              <div key={idx} className="project-container">
                <h3 className="project-name">{proj.name}</h3>
                <div className="project-meta">
                  <span><strong>Client:</strong> {proj.client}</span> | <span><strong>Location:</strong> {proj.location}</span> | <span><strong>Status:</strong> {proj.status}</span>
                </div>
                <div className="project-dates-budget">
                  <span className="project-date"><strong>Start:</strong> {proj.start_date ? proj.start_date : 'N/A'}</span>
                  <span className="project-date"><strong>End:</strong> {proj.end_date ? proj.end_date : 'N/A'}</span>
                  <span className="project-budget"><strong>Budget:</strong> {proj.curr_budget ? `Rs. ${Number(proj.curr_budget).toLocaleString()}` : 'N/A'}</span>
                </div>
                <div className="project-images-row">
                  {proj.images && proj.images.length > 0 ? (
                    proj.images.split(';').map((img, i) => (
                      <img
                        key={i}
                        src={getImageSrc(img)}
                        alt={proj.name + ' image ' + (i+1)}
                        className="project-img"
                        style={{width: '440px', height: '240px', margin: '8px', borderRadius: '8px', boxShadow: '0 2px 8px #ccc'}}
                        onError={e => {e.target.onerror=null; e.target.src=process.env.PUBLIC_URL + '/logo.jpg';}}
                      />
                    ))
                  ) : (
                    <span className="no-images">No images available.</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </AnimatedPage>
  );
}

// function Page1() {
//   return (
//     <AnimatedPage>
//       <div className="container">
//         <h1>Budgeting section</h1>
//         <p>This section allows you to manage and track project budgets effectively. Right now it is empty.</p>
//       </div>
//     </AnimatedPage>
//   );
// }

function RequestForm() {
  // RequestForm component: Allows users to submit project requests
  // Simple: A form where visitors can request construction projects
  // Technical: Manages form state, handles submission with confirmation modal
  const [formData, setFormData] = useState({ client: '', email: '', location: '', description: '' }); // Form input values
  const [showConfirmation, setShowConfirmation] = useState(false); // Whether to show confirmation modal

  const handleChange = (e) => {
    // Handle input changes: Update formData state
    // Simple: Updates the form field when user types
    // Technical: Uses event.target.name and value to update specific field in state object
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    // Handle form submission: Prevent default and show confirmation
    // Simple: Shows a popup asking if user wants to submit
    // Technical: Prevents browser form submission, triggers confirmation modal
    e.preventDefault();
    setShowConfirmation(true);
  };

  const confirmSubmit = async () => {
    // Confirm submission: Send request to backend API
    // Simple: Submits the form data to the server
    // Technical: Makes HTTP POST to /api/project-requests with JSON payload, includes current date
    setShowConfirmation(false);
    try {
      const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
      const payload = { ...formData, request_date: today }; // Add date to form data
      const response = await fetch('http://localhost:8080/api/project-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload), // Convert object to JSON string
      });
      if (response.ok) {
        alert('Project request submitted successfully!');
        setFormData({ client: '', email: '', location: '', description: '' }); // Reset form
      } else {
        alert('Failed to submit project request.');
      }
    } catch (error) {
      alert('An error occurred while submitting the request.');
    }
  };

  return (
    <>
      {/* Form container: Main form UI */}
      <div className="request-form-container">
        <h2>Project Request Form</h2>
        <form onSubmit={handleSubmit}>
          {/* Client name input */}
          <label>
            Client:
            <input type="text" name="client" value={formData.client} onChange={handleChange} required />
          </label>
          {/* Email input */}
          <label>
            Email Address:
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </label>
          {/* Location input */}
          <label>
            Location:
            <input type="text" name="location" value={formData.location} onChange={handleChange} required />
          </label>
          {/* Description textarea */}
          <label>
            Project Description:
            <textarea name="description" value={formData.description} onChange={handleChange} required />
          </label>
          {/* Submit button */}
          <button type="submit">Submit</button>
        </form>
      </div>
      {/* Confirmation modal: Asks user to confirm submission */}
      <ConfirmationModal
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={confirmSubmit}
        title="Confirm Submission"
        message={`Are you sure you want to submit this project request as ${formData.client}?`}
        confirmText="Submit"
        cancelText="Cancel"
      />
    </>
  );
}

function App() {
  useEffect(() => {
    // Fetch budget alerts from the backend
    fetch("/api/budget-alerts")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch budget alerts");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Budget Alerts:", data);
      })
      .catch((error) => {
        console.error("Error fetching budget alerts:", error);
      });
  }, []);

  // App component: Main application component managing global state and routing
  // Simple: The root component that handles login, navigation, and page switching
  // Technical: Uses React Router for routing, manages authentication state, handles page transitions
  const [loginOpen, setLoginOpen] = useState(false); // Is login popup visible?
  const [loggedInUser, setLoggedInUser] = useState(null); // Current logged in username
  const [loggedInRole, setLoggedInRole] = useState(null); // Current user's role
  const [loginTime, setLoginTime] = useState(null); // Timestamp when user logged in
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // Is logout confirmation modal visible?
  const location = useLocation(); // Current route location from React Router
  const navigate = require('react-router-dom').useNavigate(); // Navigation function

  // Load login state from localStorage on app initialization
  useEffect(() => {
    const savedUser = localStorage.getItem('buildsmart_user');
    const savedRole = localStorage.getItem('buildsmart_role');
    const savedLoginTime = localStorage.getItem('buildsmart_login_time');
    
    if (savedUser && savedRole && savedLoginTime) {
      setLoggedInUser(savedUser);
      setLoggedInRole(savedRole);
      setLoginTime(parseInt(savedLoginTime, 10));
    }
  }, []);

  const handleLogoutClick = () => {
    // Handle logout button click: Show confirmation modal
    // Simple: Asks user if they really want to log out
    // Technical: Sets state to show ConfirmationModal component
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    // Confirm logout: Clear user data and redirect to home
    // Simple: Logs out the user and goes back to homepage
    // Technical: Resets all authentication state and navigates to root route
    setLoggedInUser(null);
    setLoggedInRole(null);
    setLoginTime(null);
    setLoginOpen(false);
    setShowLogoutConfirm(false);
    
    // Clear login data from localStorage
    localStorage.removeItem('buildsmart_user');
    localStorage.removeItem('buildsmart_role');
    localStorage.removeItem('buildsmart_login_time');
    
    navigate('/');
  };

  useEffect(() => {
    // Smooth scroll to top on route change
    // Simple: Scrolls to top of page when navigating to new route
    // Technical: Uses requestAnimationFrame for smooth cubic easing animation over 750ms
    const scrollToTop = () => {
      const start = window.pageYOffset; // Current scroll position
      const duration = 750; // Animation duration in ms
      const startTime = performance.now(); // High-precision timestamp
      
      const animateScroll = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1); // Progress from 0 to 1
        // Cubic ease-in-out formula for smooth animation
        const easeInOutCubic = progress < 0.5 
          ? 4 * progress ** 3 
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        window.scrollTo(0, start * (1 - easeInOutCubic)); // Update scroll position
        
        if (progress < 1) {
          requestAnimationFrame(animateScroll); // Continue animation
        }
      };
      
      requestAnimationFrame(animateScroll); // Start animation
    };
    
    scrollToTop(); // Execute scroll animation
  }, [location.pathname]); // Run when route changes

  const handleLogin = (username, role) => {
    // Handle successful login: Set user data and close popup
    // Simple: Records that user is now logged in
    // Technical: Updates authentication state with username, role, and current timestamp
    const currentTime = Date.now();
    setLoggedInUser(username);
    setLoggedInRole(role);
    setLoginTime(currentTime); // Record login time
    setLoginOpen(false); // Close login popup
    
    // Save login data to localStorage for persistence
    localStorage.setItem('buildsmart_user', username);
    localStorage.setItem('buildsmart_role', role);
    localStorage.setItem('buildsmart_login_time', currentTime.toString());
  };

  const [footerAnimated, setFooterAnimated] = useState(false); // Is footer animation active?

  useEffect(() => {
    // Footer animation effect: Delay footer animation to match page transition
    // Simple: Makes footer appear with animation after page loads
    // Technical: Sets footerAnimated to false, then true after 750ms timeout
    setFooterAnimated(false);
    const timer = setTimeout(() => {
      setFooterAnimated(true);
    }, 750); // Match page transition duration
    return () => clearTimeout(timer); // Cleanup on unmount
  }, [location.pathname]); // Run on route change

  function applyRandomMovements() {
    // Apply subtle random movements to project images
    // Simple: Makes project images wiggle slightly for visual interest
    // Technical: Updates custom properties on DOM elements for smooth CSS transforms
    const images = document.querySelectorAll('.project-img');
    if (images.length === 0) {
      console.warn('No images found for the project carousel. Ensure the selector matches the DOM structure.');
      return;
    }

    images.forEach((image) => {
      // Initialize custom properties for offsets if not set
      if (!image._xOffset) image._xOffset = 0; // Horizontal offset
      if (!image._yOffset) image._yOffset = 0; // Vertical offset
      if (!image._angOffset) image._angOffset = 0; // Rotation angle

      // Apply small random changes to offsets
      image._xOffset += (Math.random() - 0.5) * 1.75; // Random step between -0.75 and 0.75
      image._yOffset += (Math.random() - 0.5) * 1.75;
      image._angOffset += (Math.random() - 0.5) * 0.45; // Smaller rotation change

      // Clamp values to prevent excessive movement
      image._xOffset = Math.max(-4, Math.min(4, image._xOffset)); // Limit to -4px to 4px
      image._yOffset = Math.max(-4, Math.min(4, image._yOffset));
      image._angOffset = Math.max(-1.5, Math.min(1.5, image._angOffset)); // Limit to -1.5deg to 1.5deg

      // Apply transform without CSS transition for instant effect
      image.style.transition = 'none';
      image.style.transform = `translate(${image._xOffset}px, ${image._yOffset}px) rotate(${image._angOffset}deg)`;
    });
  }

  useEffect(() => {
    // Image movement effect: Only on homepage, apply random movements periodically
    // Simple: Makes images move slightly on the home page
    // Technical: Sets interval to call applyRandomMovements every 0.5-1 seconds
    if (location.pathname === "/") { // Only on homepage
      const interval = setInterval(applyRandomMovements, Math.random() * 50 + 50); // Random interval
      return () => clearInterval(interval); // Cleanup interval on unmount
    }
    // If not homepage, do nothing
    return undefined;
  }, [location.pathname]); // Run when route changes

  // Use nodeRef for CSSTransition to avoid findDOMNode warning
  // Simple: Helps with smooth page transitions
  // Technical: Creates refs for each route to avoid React warnings in CSSTransition
  const nodeRefs = useRef({}); // Object to store refs for each route
  
  const getNodeRef = (pathname) => {
    // Get or create ref for specific route path
    // Simple: Gets a reference for the current page
    // Technical: Returns existing ref or creates new React ref for pathname
    if (!nodeRefs.current[pathname]) {
      nodeRefs.current[pathname] = React.createRef();
    }
    return nodeRefs.current[pathname];
  };

  return (
    <div className="App" style={{ minHeight: '100vh' }}>
      {/* Navbar: Top navigation with login/account menu */}
      <Navbar 
        onLoginClick={() => setLoginOpen(true)} 
        loggedInUser={loggedInUser} 
        loggedInRole={loggedInRole} 
        loginTime={loginTime} 
        onLogoutClick={handleLogoutClick}
      />
      <div style={{ position: 'relative' }}>
        {/* Login popup: Shows when user clicks login */}
        <LoginPopup open={loginOpen} onClose={() => setLoginOpen(false)} onLogin={handleLogin} />
        {/* Logout confirmation modal */}
        <ConfirmationModal
          open={showLogoutConfirm}
          onClose={() => setShowLogoutConfirm(false)}
          onConfirm={confirmLogout}
          title="Confirm Logout"
          message="Are you sure you want to log out? You will need to log in again to access staff features."
          confirmText="Logout"
          cancelText="Cancel"
        />
        {/* Page transitions: Wraps route content with smooth animations */}
        <TransitionGroup component={null} childFactory={(child) => 
          React.cloneElement(child, {
            classNames: "page",
            timeout: { enter: 400, exit: 400 }
          })
        }>
          <CSSTransition 
            key={location.pathname} 
            classNames="page" 
            timeout={{ enter: 400, exit: 400 }}
            nodeRef={getNodeRef(location.pathname)}
            mountOnEnter
            unmountOnExit
          >
            <div className="page-transition-wrapper" ref={getNodeRef(location.pathname)}>
              {/* Routes: Define which component to show for each path */}
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/budget" element={
                  <ProtectedRoute 
                    requireAuth={true} 
                    allowedRoles={["Site Manager", "Document Control Manager", "Admin"]}
                    loggedInUser={loggedInUser}
                    loggedInRole={loggedInRole}
                  >
                    <BudgetingTab loggedInRole={loggedInRole} />
                  </ProtectedRoute>
                } />
                <Route path="/request" element={<RequestForm />} />
              </Routes>
            </div>
          </CSSTransition>
        </TransitionGroup>
      </div>
      {/* Footer: Bottom section with links and branding */}
      {/* MODIFIED: Added position and zIndex to ensure footer is on top of page elements like the girder. */}
      <footer className={`footer-enhanced footer-animate-${location.pathname.replace('/', '') || 'home'}${footerAnimated ? ' footer-animated' : ''}`} style={{ position: 'relative', zIndex: 2 }}>
        <div className="footer-main">
          <div className="footer-brand">
            <img src={logoFooter} alt="BuildSmart Logo" className="footer-logo" />
            <div className="footer-brand-text">
              <strong>BuildSmart</strong><br />
              <span style={{opacity: 0.85}}>Your smart solution for building management and innovation.</span>
            </div>
          </div>
          <div className="footer-links">
            <div className="footer-section">
              <h4>General</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/request">Request</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <ul>
                <li>
                  <a href="mailto:info@buildsmart.lk">info@buildsmart.lk</a>
                </li>
                <li>
                  <a href="https://www.google.com/maps/search/?api=1&query=Construction+Property+Solution+Pvt+Ltd+371%2F14B+Samagi+Mawatha+Himbutana+Rd+Mulleriyawa" target="_blank" rel="noopener noreferrer">
                    371/14B, Samagi Mawatha, Himbutana Rd, Mulleriyawa
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 BuildSmart. All rights reserved.</span>
          <span className="footer-policy-links">
            <a href="#">Terms & Conditions</a> | <a href="#">Privacy Policy</a>
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;