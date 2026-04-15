import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const AuthScreen = () => {
  const { loginWithGoogle, signupWithEmail, loginWithEmail } = useAuth();
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
    } catch (err) {
      setError('Failed to sign in with Google. Ensure configuration is correct.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      if (isSignUp) {
        await signupWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') setError('Email already exists. Try logging in.');
      else if (err.code === 'auth/invalid-credential') setError('Incorrect email or password.');
      else setError(err.message || 'Failed to authenticate.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="premium-card text-center" style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="branding" style={{ marginBottom: '24px', justifyContent: 'center' }}>
           <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="brand-logo" style={{ color: 'var(--primary)' }}>
             <path d="M12 2L4 7V17L12 22L20 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
             <path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
             <path d="M12 12L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
             <path d="M12 12L4 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
           </svg>
        </div>
        
        <h1 className="brand-name" style={{ marginBottom: '8px' }}>Qaza Namaz Tracker</h1>
        <p className="section-subtitle" style={{ marginBottom: '24px' }}>Track your spiritual journey</p>

        {error && <div className="error-message" style={{ color: '#ef4444', marginBottom: '16px', fontSize: '0.9rem' }}>{error}</div>}

        <form onSubmit={handleEmailAuth} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          <input 
            type="email" 
            placeholder="Email address" 
            className="modern-input" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
            style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border)' }}
          />
          <input 
            type="password" 
            placeholder="Password (min 6 chars)" 
            className="modern-input" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
            style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border)' }}
          />
          <button type="submit" disabled={loading} className="calculate-btn" style={{ width: '100%', padding: '14px', marginTop: '8px', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Processing...' : (isSignUp ? 'Sign Up with Email' : 'Login')}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', width: '100%', margin: '0 0 24px 0', opacity: 0.5 }}>
          <div style={{ flex: 1, borderBottom: '1px solid var(--border)' }}></div>
          <span style={{ margin: '0 10px', fontSize: '0.9rem' }}>OR</span>
          <div style={{ flex: 1, borderBottom: '1px solid var(--border)' }}></div>
        </div>

        <button type="button" disabled={loading} className="calculate-btn" onClick={handleGoogleSignIn} style={{ width: '100%', padding: '14px', display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center', background: 'white', color: 'var(--text-main)', border: '1px solid var(--border)', marginBottom: '24px', opacity: loading ? 0.7 : 1 }}>
          <svg style={{ width: '20px' }} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continue with Google
        </button>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{' '}
          <span 
            onClick={() => { setIsSignUp(!isSignUp); setError(''); setPassword(''); }} 
            style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {isSignUp ? "Login" : "Sign Up"}
          </span>
        </p>

      </div>
    </div>
  );
};
