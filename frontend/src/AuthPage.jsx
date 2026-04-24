import React, { useState } from 'react';
import axios from 'axios';
import { User, Lock, ArrowRight, UserPlus, LogIn, Mail } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    
    try {
      const res = await axios.post(`${API_URL}${endpoint}`, formData);
      if (isLogin) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('username', res.data.username);
        onLogin(res.data.username);
      } else {
        alert("Registration successful! Please login.");
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '80vh',
      animation: 'fadeIn 0.8s ease'
    }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            background: 'var(--accent-color)', 
            width: '60px', 
            height: '60px', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 1rem auto',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
          }}>
            {isLogin ? <LogIn color="white" size={30} /> : <UserPlus color="white" size={30} />}
          </div>
          <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            {isLogin ? 'Enter your details to manage expenses' : 'Start tracking your pocket money today'}
          </p>
        </div>

        {error && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid var(--danger)', 
            color: 'var(--danger)',
            padding: '0.8rem',
            borderRadius: '10px',
            marginBottom: '1rem',
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.2rem' }}>
          <div style={{ position: 'relative' }}>
            <User style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
            <input 
              style={{ paddingLeft: '40px', width: '100%' }}
              type="text" placeholder="Username" 
              value={formData.username} 
              onChange={e => setFormData({...formData, username: e.target.value})} 
              required 
            />
          </div>
          {!isLogin && (
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
              <input 
                style={{ paddingLeft: '40px', width: '100%' }}
                type="email" placeholder="Email (example@gmail.com)" 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
                required 
              />
            </div>
          )}
          <div style={{ position: 'relative' }}>
            <Lock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
            <input 
              style={{ paddingLeft: '40px', width: '100%' }}
              type="password" placeholder="Password" 
              value={formData.password} 
              onChange={e => setFormData({...formData, password: e.target.value})} 
              required 
            />
          </div>
          
          <button type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--accent-color)', 
              fontWeight: '600',
              marginLeft: '5px',
              padding: '0',
              textDecoration: 'underline'
            }}
          >
            {isLogin ? 'Register Now' : 'Login here'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
