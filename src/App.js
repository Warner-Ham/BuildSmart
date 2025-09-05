import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';

const logo = process.env.PUBLIC_URL + '/logo.jpg';

function Navbar() {
  return (
    <nav className="navbar">
      <img src={logo} alt="BuildSmart Logo" className="navbar-logo" />
      <span className="navbar-title">BuildSmart</span>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/page1">Page 1</Link>
        <Link to="/page2">Page 2</Link>
      </div>
    </nav>
  );
}

function Home() {
  return (
    <div className="container">
      <h1>Welcome to BuildSmart</h1>
      <p>Your smart solution for building management and innovation.</p>
    </div>
  );
}

function Page1() {
  return (
    <div className="container">
      <h1>Page 1</h1>
      <p>This is Page 1 of BuildSmart.</p>
    </div>
  );
}

function Page2() {
  return (
    <div className="container">
      <h1>Page 2</h1>
      <p>This is Page 2 of BuildSmart.</p>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/page1" element={<Page1 />} />
        <Route path="/page2" element={<Page2 />} />
      </Routes>
    </div>
  );
}

export default App;