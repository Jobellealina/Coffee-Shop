import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordType, setPasswordType] = useState('password');
  const [loading, setLoading] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [tokenSent, setTokenSent] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      Swal.fire('Oops...', 'Please enter both email and password.', 'error');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify({ name: data.name || 'Jane Doe', email }));
        Swal.fire('Success', 'Login successful', 'success').then(() => {
          setLoading(false);
          navigate('/dashboard');
        });
      } else {
        Swal.fire('Login failed', data.message || 'Invalid Email or Password', 'error');
        setLoading(false);
      }
    } catch (error) {
      console.error('Login Error:', error);
      Swal.fire('Error', 'There was an error during login.', 'error');
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordType(passwordType === 'password' ? 'text' : 'password');
  };

  const handleForgotPassword = async () => {
    if (!forgotPasswordEmail) {
      Swal.fire('Warning', 'Please enter your email address', 'warning');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire('Success', 'Password reset token has been sent to your email', 'success').then(() => {
          setTokenSent(true);
        });
      } else {
        Swal.fire('Error', data.message || 'Failed to send reset token', 'error');
      }
    } catch (error) {
      console.error('Forgot Password Error:', error);
      Swal.fire('Error', 'There was an error sending the password reset link', 'error');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!forgotPasswordEmail || !resetToken || !newPassword) {
      Swal.fire('Error', 'Please enter all required fields (Email, Token, and New Password)', 'error');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotPasswordEmail, newPassword, resetToken }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire('Success', 'Your password has been reset successfully', 'success').then(() => {
          navigate('/login');
        });
      } else {
        Swal.fire('Error', data.message || 'Failed to reset password', 'error');
      }
    } catch (error) {
      console.error('Reset Password Error:', error);
      Swal.fire('Error', 'There was an error resetting your password', 'error');
    }
  };

  return (
    <>
      <div className={`modal-overlay ${forgotPasswordMode ? 'show' : ''}`}>
        <div className="forgot-password-modal">
          {!forgotPasswordMode ? (
            <>
              <form onSubmit={handleLogin} className="signup-form">
                <h2 style={{ fontSize: '2rem', color: '#6f4f37', textAlign: 'center', marginBottom: '50px' }}>Login</h2>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="signup-input"
                  aria-label="Email Address"
                />

                <div className="password-wrapper">
                  <input
                    type={passwordType}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="signup-input"
                    aria-label="Password"
                  />
                  <span onClick={togglePasswordVisibility} className="toggle-password" aria-label="Toggle password visibility">
                    <i className={`fas ${passwordType === 'password' ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                  </span>
                </div>

                <button type="submit" disabled={loading} className="signup-button">
                  {loading ? 'Logging in...' : 'Login'}
                </button>

                <p className="form-link">
                  <a href="#" onClick={() => setForgotPasswordMode(true)}>
                    Forgot Password?
                  </a>
                </p>
              </form>
            </>
          ) : (
            <>
              <h2 style={{ fontSize: '1.5rem', color: '#6f4f37', textAlign: 'center' }}>
                {tokenSent ? 'Enter Your Reset Token and New Password' : 'Request Password Reset Token'}
              </h2>

              {!tokenSent ? (
                <>
                  <input
                    type="email"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="signup-input"
                    aria-label="Email"
                  />
                  <button type="button" onClick={handleForgotPassword} className="signup-button">
                    Send Token
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    placeholder="Enter the reset token"
                    required
                    className="signup-input"
                    aria-label="Reset Token"
                  />

                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password"
                    required
                    className="signup-input"
                    aria-label="New Password"
                  />

                  <button type="submit" onClick={handleResetPassword} className="signup-button">
                    Reset Password
                  </button>
                </>
              )}

              <p className="form-link">
                <a href="#" onClick={() => setForgotPasswordMode(false)}>
                  Back to Login
                </a>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Login;
