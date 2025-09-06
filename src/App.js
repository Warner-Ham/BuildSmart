



import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import staffData from './staff_db.json';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = staffData.find(
      (staff) => staff.id === id && staff.username === username && staff.password === password
    );
    if (found) {
      onLogin(username);
      setId(''); setUsername(''); setPassword(''); setError('');
    } else {
      setError('Invalid credentials.');
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
  return (
    <AnimatedPage>
      <section className="hero">
        <div className="hero-content">
          <img src={logo} alt="BuildSmart Logo" className="hero-logo" />
          <h1>Welcome to <span className="highlight">BuildSmart</span></h1>
          <p className="subtitle">Your smart solution for building management and innovation.</p>
          <Link to="/page1" className="cta-btn">Get Started</Link>
        </div>
  {/* Removed hero-bg to prevent background logo duplication */}
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
    <div className="App">
      <Navbar onLoginClick={() => setLoginOpen(true)} loggedInUser={loggedInUser} />
      <LoginPopup open={loginOpen} onClose={() => setLoginOpen(false)} onLogin={handleLogin} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/page1" element={<Page1 />} />
        <Route path="/page2" element={<Page2 />} />
      </Routes>
    </div>
  );
}

export default App;