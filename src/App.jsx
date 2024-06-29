import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './components/login.jsx';
import Register from './components/register.jsx';
import OCR from './components/OCR.jsx';
import './App.css';

const Welcome = () => {
  const navigate = useNavigate();

  const navigateToLogin = () => {
    navigate('/login');
  };

  const navigateToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="welcome-container">
      <h1>Welcome to OCR App!</h1>
      <div className="welcome-buttons">
        <button onClick={navigateToLogin}>Login</button>
        <h4> </h4>
        <button onClick={navigateToRegister}>Register</button>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/ocr" element={<OCR />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
