import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './App.scss';
// import staffData from './staff_db.json';
const logo = process.env.PUBLIC_URL + '/logo.png';
const logoText = process.env.PUBLIC_URL + '/logo_text.png';


function Navbar({ onLoginClick, loggedInUser }) {
  const [navOpen, setNavOpen] = useState(false);
  return (
    <nav className="navbar sleek-navbar">
      <div className="navbar-left">
        <img src={logoText} alt="BuildSmart Logo Text" className="navbar-logo-text" style={{height: '30px'}} />
      </div>
      <button className="nav-toggle" onClick={() => setNavOpen(!navOpen)} aria-label="Toggle navigation">
        <span className={navOpen ? 'bar open' : 'bar'}></span>
        <span className={navOpen ? 'bar open' : 'bar'}></span>
        <span className={navOpen ? 'bar open' : 'bar'}></span>
      </button>
      <div className={navOpen ? 'nav-links open' : 'nav-links'}>
        <Link to="/" onClick={() => setNavOpen(false)}>Home</Link>
        <Link to="/page1" onClick={() => setNavOpen(false)}>Budgeting</Link>
        <Link to="/request" onClick={() => setNavOpen(false)}>Request</Link>
        {loggedInUser ? (
          <span className="welcome-user">Welcome {loggedInUser}</span>
        ) : (
          <button className="staff-login-btn" onClick={onLoginClick}>Staff Login</button>
        )}
      </div>
    </nav>
  );
}
function LoginPopup({ open, onClose, onLogin }) {
  const [id, setId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
  const res = await fetch('http://localhost:8080/api/staff');
      const staffData = await res.json();
      const found = staffData.find(
        (staff) => staff.id === id && staff.username === username && staff.password === password
      );
      if (found) {
        onLogin(username);
        setId(''); setUsername(''); setPassword(''); setError('');
      } else {
        setError('Invalid credentials.');
      }
    } catch {
      setError('Unable to connect to staff API.');
    }
  };

  return (
    <div className="login-popup-overlay">
      <div className="login-popup">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>Staff Login</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Staff ID" value={id} onChange={e => setId(e.target.value)} required />
          <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="staff-login-btn">Login</button>
        </form>
        {error && <div className="login-error">{error}</div>}
      </div>
    </div>
  );
}

function AnimatedPage({ children }) {
  const location = useLocation();
  return (
    <div key={location.pathname} className="animated-page">
      {children}
    </div>
  );
}


function Home() {
  const [projects, setProjects] = useState([]);
  const aboutRef = useRef();
  const [aboutVisible, setAboutVisible] = useState(false);
  const servicesRef = useRef();
  const [servicesVisible, setServicesVisible] = useState(false);
  const specialitiesRef = useRef();
  const [specialitiesVisible, setSpecialitiesVisible] = useState(false);

  useEffect(() => {
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
      .catch(() => setProjects([]));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (aboutRef.current) {
        const rect = aboutRef.current.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        setAboutVisible(inView);
      }
      if (servicesRef.current) {
        const rect = servicesRef.current.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        setServicesVisible(inView);
      }
      if (specialitiesRef.current) {
        const rect = specialitiesRef.current.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        setSpecialitiesVisible(inView);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
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
      description: "End-to-end management of construction projects, from planning to completion, ensuring quality and timely delivery.",
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
      description: "Advanced roofing systems for residential, commercial, and industrial buildings.",
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
      title: "Boundary Wall Installations",
      description: "Secure and aesthetic boundary wall construction for properties.",
      img: process.env.PUBLIC_URL + "/speciality_boundary_wall.png",
      animation: "fadeInRight"
    }
  ];

  return (
    <AnimatedPage>
      <section className="hero">
        <div className="hero-content">
          <img src={logo} alt="BuildSmart Logo" className="hero-logo" />
          <h1>Welcome to <span className="highlight">BuildSmart</span></h1>
          <p className="subtitle">Your smart solution for building management and innovation.</p>
          <Link to="/page1" className="cta-btn">Get Started</Link>
        </div>
      </section>
      <section
        ref={aboutRef}
        className={`about-section${aboutVisible ? ' animated-fade-in' : ''}`}
      >
        <h2 className="about-title">About Us</h2>
        <div className="about-content">
          <p>
            <strong>BuildSmart</strong> is a leading construction and project management company dedicated to delivering innovative, sustainable, and high-quality solutions for clients across Sri Lanka. With decades of experience, our team excels in engineering, design, and execution of large-scale industrial, commercial, and residential projects.
          </p>
          <p>
            We have been responsible for the construction of major distilleries, state-of-the-art warehouses, and luxury holiday bungalows for renowned clients such as DCSL. Our expertise also includes project planning, site management, and the implementation of advanced safety protocols.
          </p>
          <p>
            We pride ourselves on our commitment to safety, integrity, and client satisfaction. At BuildSmart, we leverage cutting-edge technology and a skilled workforce to ensure every project is completed on time and within budget.
          </p>
          <p>
            <em>Discover how BuildSmart can transform your vision into reality.</em>
          </p>
        </div>
      </section>
      {/* Services and Specialities Section */}
      <div className="container services-container">
        <div
          ref={servicesRef}
          className={`services-section${servicesVisible ? ' services-visible' : ''}`}
        >
          <h1 className="services-title">Our Services</h1>
          <div className="services-list">
            {services.map((service, idx) => (
              <div key={idx} className={`service-card animated ${service.animation}${servicesVisible ? ' card-visible' : ''}`} style={{marginBottom: '0rem', animationDelay: `${idx * 0.15}s`}}>
                <img src={service.img} alt={service.title} className="service-img" style={{width: '100px', height: '100px', borderWidth: '0px', borderRadius: '0px'}} />
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
          <h1 className="services-title" style={{marginTop: '3rem'}}>Our Specialities</h1>
          <div className="services-list">
            {specialities.map((spec, idx) => (
              <div key={idx} className={`service-card animated ${spec.animation}${specialitiesVisible ? ' card-visible' : ''}`} style={{marginBottom: '0rem', animationDelay: `${idx * 0.15}s`}}>
                <img src={spec.img} alt={spec.title} className="service-img" style={{width: '100px', height: '100px', borderWidth: '0px', borderRadius: '0px'}} />
                <br></br><h2 style={{margin: '0 0 0 0'}}>{spec.title}</h2>
                <p style={{fontSize: '1.15rem', color: '#205c20'}}>{spec.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* ...existing code... */}
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

function Page1() {
  return (
    <AnimatedPage>
      <div className="container">
        <h1>Budgeting section</h1>
        <p>This section allows you to manage and track project budgets effectively. Right now it is empty.</p>
      </div>
    </AnimatedPage>
  );
}

function RequestForm() {
  const [formData, setFormData] = useState({ client: '', email: '', location: '', description: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/project-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Project request submitted successfully!');
        setFormData({ client: '', email: '', location: '', description: '' });
      } else {
        alert('Failed to submit project request.');
      }
    } catch (error) {
      alert('An error occurred while submitting the request.');
    }
  };

  return (
    <div className="request-form-container">
      <h2>Project Request Form</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Client:
          <input type="text" name="client" value={formData.client} onChange={handleChange} required />
        </label>
        <label>
          Email Address:
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>
        <label>
          Location:
          <input type="text" name="location" value={formData.location} onChange={handleChange} required />
        </label>
        <label>
          Project Description:
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

function App() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const handleLogin = (username) => {
    setLoggedInUser(username);
    setLoginOpen(false);
  };

  return (
    <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar onLoginClick={() => setLoginOpen(true)} loggedInUser={loggedInUser} />
      <div style={{ flex: 1 }}>
        <LoginPopup open={loginOpen} onClose={() => setLoginOpen(false)} onLogin={handleLogin} />
        <TransitionGroup>
          <CSSTransition key={location.pathname} classNames="page" timeout={400}>
            <div className="page-transition-wrapper">
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/page1" element={<Page1 />} />
                <Route path="/request" element={<RequestForm />} />
              </Routes>
            </div>
          </CSSTransition>
        </TransitionGroup>
      </div>
      <footer className="footer-address">
        <a
          href="https://www.google.com/maps/search/?api=1&query=Construction+Property+Solution+Pvt+Ltd+371%2F14B+Samagi+Mawatha+Himbutana+Rd+Mulleriyawa"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div>
            Construction Property Solution Pvt Ltd<br />
            371/14B, Samagi Mawatha,<br />
            Himbutana Rd, Mulleriyawa.
          </div>
        </a>
      </footer>
    </div>
  );
}

export default App;