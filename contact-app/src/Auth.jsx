import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './context/authContext'; // Assuming you have AuthContext
import 'bootstrap/dist/css/bootstrap.min.css';

const Auth = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await login(formData.email, formData.password);
    if (success) navigate('/app'); // Redirect to App page after login
  };

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    const success = await register(formData.name, formData.email, formData.password);
    if (success) {
      setActiveTab('login'); // Switch to login tab after successful registration
      setFormData({ name: '', email: '', password: '' }); // Clear form
    }
  };

  return (
    <div className="container mt-5">
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'login' ? 'active' : ''}`} onClick={() => setActiveTab('login')}>
            Login
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'register' ? 'active' : ''}`} onClick={() => setActiveTab('register')}>
            Register
          </button>
        </li>
      </ul>

      <div className="tab-content mt-3">
        {activeTab === 'login' && (
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary w-100">Login</button>
          </form>
        )}

        {activeTab === 'register' && (
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-success w-100">Register</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth;
