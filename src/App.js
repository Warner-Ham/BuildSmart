import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import MonthlyReportsApp from './components/MonthlyReports/MonthlyReportsApp';
import './App.css';
// import staffData from './staff_db.json';
const logo = process.env.PUBLIC_URL + '/logo.jpg';


function Navbar({ onLoginClick, loggedInUser }) {
  const [navOpen, setNavOpen] = useState(false);
  return (
    <nav className="navbar sleek-navbar">
      <div className="navbar-left">
        <span className="navbar-title">BuildSmart</span>
      </div>
      <button className="nav-toggle" onClick={() => setNavOpen(!navOpen)} aria-label="Toggle navigation">
        <span className={navOpen ? 'bar open' : 'bar'}></span>
        <span className={navOpen ? 'bar open' : 'bar'}></span>
        <span className={navOpen ? 'bar open' : 'bar'}></span>
      </button>
      <div className={navOpen ? 'nav-links open' : 'nav-links'}>
        <Link to="/" onClick={() => setNavOpen(false)}>Home</Link>
        <Link to="/page1" onClick={() => setNavOpen(false)}>Page 1</Link>
        <Link to="/page2" onClick={() => setNavOpen(false)}>Page 2</Link>
        <Link to="/monthly-reports" onClick={() => setNavOpen(false)}>Monthly Reports</Link>
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
  const res = await fetch('http://localhost:8081/api/staff');
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
  useEffect(() => {
  fetch('http://localhost:8081/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(() => setProjects([]));
  }, []);

  // Helper to get correct image path for public folder
  const getImageSrc = (imgPath) => {
    // Remove ../project_images/ and get subfolder + filename
    const parts = imgPath.replace(/\\/g, '/').split('/');
    // e.g. [.., project_images, subfolder, filename]
    const subfolder = parts[2];
    const filename = parts[3];
    return process.env.PUBLIC_URL + `/project_images/${subfolder}/${filename}`;
  };

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
                <div className="project-images-row">
                  {proj.images && proj.images.length > 0 ? (
                    proj.images.split(';').map((img, i) => (
                      <img
                        key={i}
                        src={getImageSrc(img)}
                        alt={proj.name + ' image ' + (i+1)}
                        className="project-img"
                        style={{maxWidth: '200px', margin: '8px', borderRadius: '8px', boxShadow: '0 2px 8px #ccc'}}
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
        <h1>Project Dashboard</h1>
        <p>Track, manage, and optimize your construction projects with ease.</p>
      </div>
    </AnimatedPage>
  );
}

function Page2() {
  return (
    <AnimatedPage>
      <div className="container">
        <h1>Team Collaboration</h1>
        <p>Collaborate with your team in real-time and boost productivity.</p>
      </div>
    </AnimatedPage>
  );
}

function App() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleLogin = (username) => {
    setLoggedInUser(username);
    setLoginOpen(false);
  };

  return (
    <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar onLoginClick={() => setLoginOpen(true)} loggedInUser={loggedInUser} />
      <div style={{ flex: 1 }}>
        <LoginPopup open={loginOpen} onClose={() => setLoginOpen(false)} onLogin={handleLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/page1" element={<Page1 />} />
          <Route path="/page2" element={<Page2 />} />
          <Route path="/monthly-reports" element={<MonthlyReportsApp />} />
        </Routes>
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