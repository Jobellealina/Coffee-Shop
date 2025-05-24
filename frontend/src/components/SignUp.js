import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

const SignUp = ({ closeModal }) => {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    otp: '',
    fullName: '',
    gender: '',
    dob: '',
  });

  const [passwordType, setPasswordType] = useState('password');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const togglePasswordVisibility = () => {
    setPasswordType(passwordType === 'password' ? 'text' : 'password');
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      Swal.fire('Warning', 'Please enter your email first', 'warning');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (response.ok) {
        setOtpSent(true);
        Swal.fire('Success', 'OTP sent to your email', 'success');
      } else {
        Swal.fire('Error', data.message || 'Failed to send OTP', 'error');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      Swal.fire('Error', 'There was an error sending OTP', 'error');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { email, phone, password, confirmPassword, otp, fullName, gender, dob } = formData;

    if (!email || !phone || !password || !confirmPassword || !otp || !fullName || !gender || !dob) {
      Swal.fire('Warning', 'Please fill all fields', 'warning');
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire('Warning', 'Passwords do not match', 'warning');
      return;
    }

    setLoading(true);

    try {
      const verifyResponse = await fetch('http://localhost:5000/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        Swal.fire('Error', verifyData.message || 'Invalid OTP', 'error');
        setLoading(false);
        return;
      }

      const registerResponse = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const registerData = await registerResponse.json();

      if (registerResponse.ok) {
        localStorage.setItem('user', JSON.stringify({ email, fullName })); 
        Swal.fire('Success', 'User registered successfully!', 'success');
        closeModal(); 
        navigate('/dashboard'); 
      } else {
        Swal.fire('Error', registerData.message || 'Registration failed', 'error');
      }
    } catch (error) {
      console.error('Registration error:', error);
      Swal.fire('Error', 'Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="signup-form">
      <h2 className="signup-title" style={{ fontSize: '2rem', color: '#6f4f37', textAlign: 'center', marginBottom: '50px' }}>
        Sign Up
      </h2>

      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
        className="signup-input"
      />

      <input
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Phone Number"
        pattern="09\\d{9}$"
        required
        className="signup-input"
        onInvalid={(e) => e.target.setCustomValidity("Please enter a valid Ph number (e.g. 09123456789)")}
        onInput={(e) => e.target.setCustomValidity("")}
      />

      <input
        type="text"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        placeholder="Full Name"
        required
        className="signup-input"
      />

      <input
        type="date"
        name="dob"
        value={formData.dob}
        onChange={handleChange}
        required
        className="signup-input"
      />

      <div className="password-wrapper">
        <input
          type={passwordType}
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="signup-input"
        />
        <span onClick={togglePasswordVisibility} className="toggle-password">
          <i className={`fas ${passwordType === 'password' ? 'fa-eye' : 'fa-eye-slash'}`}></i>
        </span>
      </div>

      <input
        type={passwordType}
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm Password"
        required
        className="signup-input"
      />

      <div className="otp-row">
        <input
          type="text"
          name="otp"
          value={formData.otp}
          onChange={handleChange}
          placeholder="OTP"
          required
          className="signup-input"
        />
        <button
          type="button"
          onClick={handleSendOtp}
          disabled={otpSent}
          className="otp-button"
        >
          {otpSent ? 'Sent' : 'Send OTP'}
        </button>
      </div>

      <select
        name="gender"
        value={formData.gender}
        onChange={handleChange}
        required
        className="signup-select"
      >
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>

      <button type="submit" className="signup-button" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
};

export default SignUp;
