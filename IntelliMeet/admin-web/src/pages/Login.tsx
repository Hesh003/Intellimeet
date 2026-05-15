import React, { useState } from 'react';
import axios from 'axios';
import { Lock, Mail, ShieldCheck, Loader2 } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

interface LoginProps {
  onLogin: (token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, { 
        email: trimmedEmail, 
        password: trimmedPassword 
      });
      
      if (res.data.user.role !== 'admin') {
        setError('Access Denied: Only administrators can log in here.');
        setIsLoading(false);
        return;
      }

      onLogin(res.data.token);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container" style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at top right, #1e1e1e, #050505)'
    }}>
      <div className="glass-card fade-in" style={{
        width: '400px',
        padding: '40px',
        textAlign: 'center'
      }}>
        <div style={{
          background: 'rgba(22, 163, 74, 0.15)',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px'
        }}>
          <ShieldCheck size={32} color="#16A34A" />
        </div>
        
        <h1 style={{ fontSize: '28px', marginBottom: '8px', color: '#FFF' }}>Admin Portal</h1>
        <p style={{ color: '#A1A1AA', marginBottom: '32px' }}>Secure access to IntelliMeet Management</p>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#EF4444',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#A1A1AA', marginBottom: '8px', fontWeight: '600' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#555" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              <input 
                type="email" 
                required
                placeholder="admin@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  height: '46px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  paddingLeft: '40px',
                  color: 'white',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '32px', textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#A1A1AA', marginBottom: '8px', fontWeight: '600' }}>Secure Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#555" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              <input 
                type="password" 
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  height: '46px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  paddingLeft: '40px',
                  color: 'white',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="primary-btn" 
            style={{ width: '100%', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Login to Dashboard'}
          </button>
        </form>

        <p style={{ marginTop: '24px', fontSize: '12px', color: '#555' }}>
          &copy; 2026 IntelliMeet Intelligent System. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
