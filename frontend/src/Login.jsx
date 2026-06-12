import React, { useState } from 'react';
// ✅ FIXED: Using your custom configured API instance instead of raw axios
import api from './api'; 
import './Login.css';

function Login() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // ✅ FIXED: Changed endpoint path from '/api/auth/signup' to '/api/auth/register'
    const endpoint = isSignIn ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const response = await api.post(endpoint, {
        email,
        password
      });

      // Securely store the returned JWT authentication token inside browser storage
      localStorage.setItem('token', response.data.token);
      
      // Send the user onto the browse dashboard layout by reloading the application
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.msg || "An unexpected error occurred.");
    }
  };

  return (
    <div className="login">
      <div className="login__background">
        <img 
          className="login__logo" 
          src="https://www.aha.video/favicon.ico" 
          alt="aha Logo" 
        />
        <div className="login__gradient" />
      </div>

      <div className="login__body">
        <form onSubmit={handleSubmit}>
          <h1>{isSignIn ? "Sign In" : "Sign Up"}</h1>
          {error && <p className="login__error">{error}</p>}
          
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button type="submit">{isSignIn ? "Sign In" : "Sign Up"}</button>
          
          <h4>
            <span className="login__gray">
              {isSignIn ? "New to aha ? " : "Already have an account? "}
            </span>
            <span className="login__link" onClick={() => setIsSignIn(!isSignIn)}>
              {isSignIn ?  "Re-gister now." : "Sign in now."}
            </span>
          </h4>
        </form>
      </div>
    </div>
  );
}

export default Login;