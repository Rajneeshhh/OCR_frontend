import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import './Register.css';

const registerUrl = `http://localhost:8000/api/register/`;

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(registerUrl, { username, email, password });
      const { token } = response.data;
      const cookies = new Cookies();
      cookies.set('token', token, { path: '/' });
      navigate('/ocr');
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data);
      } else {
        setError({ general: 'An error occurred during registration.' });
      }
    }
  };

  const navigateToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
          {error?.username && <p className="error-message">{error.username[0]}</p>}
        </div>
        <div className="form-group">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          {error?.email && <p className="error-message">{error.email[0]}</p>}
        </div>
        <div className="form-group">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          {error?.password && <p className="error-message">{error.password[0]}</p>}
        </div>
        {error?.general && <p className="error-message">{error.general}</p>}
        <button type="submit">Register</button>
      </form>
      <br>
      </br>
      <div className="login-link">
        <button onClick={navigateToLogin}>Already have an account? Login</button>
      </div>
    </div>
  );
};

export default Register;
