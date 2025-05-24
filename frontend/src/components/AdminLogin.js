import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://coffee-shop-3r1z.onrender.com/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('admin', 'true');
        await Swal.fire('Success', 'Admin login successful', 'success');

        navigate('/admin/orders');
      } else {
        Swal.fire('Error', data.message || 'Invalid credentials', 'error');
      }
    } catch (error) {
      console.error('Login Error:', error);
      Swal.fire('Error', 'Server error during login.', 'error');
    }
  };

  return (
    <div style={{
      maxWidth: 400,
      margin: '100px auto',
      padding: '2rem',
      background: 'white',
      borderRadius: 8,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    }}>
      <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', marginBottom: 10, padding: 8 }}
        />
        <input
          type="password"
          placeholder="Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', marginBottom: 10, padding: 8 }}
        />
        <button type="submit" style={{ width: '100%', padding: 10, cursor: 'pointer' }}>
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
