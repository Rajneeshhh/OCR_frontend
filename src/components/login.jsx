import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import fetchAction from '../services/fetchApi';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const isInvalid = username === '' || password === '';

  const onLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAction('/api/login/', { username, password }, 'POST');
      const cookies = new Cookies();
      cookies.remove('token');
      const expireDate = new Date();
      expireDate.setTime(expireDate.getTime() + 60 * 60 * 1000);
      cookies.set('token', res.token, { expires: expireDate });
      navigate('/ocr');
    } catch (error) {
      setError('An error occurred during the login process.');
    }
    setLoading(false);
  };

  const navigateToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <div className="form-group">
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="form-control"
          placeholder="Enter username"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control"
          placeholder="Enter password"
          required
        />
      </div>
      {error && <p className="error-message">{error}</p>}
      <button onClick={onLogin} disabled={isInvalid || isLoading}>
        {isLoading ? 'LOGGING IN...' : 'LOGIN'}
      </button>
      <h4>
        
      </h4>
      <div className="register-link">
        <button onClick={navigateToRegister}>Register</button>
      </div>
    </div>
  );
};

export default Login;
