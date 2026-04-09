import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const AuthScreen = () => {
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      await loginWithGoogle();
    } catch (err) {
      setError('Failed to sign in with Google. Ensure configuration is correct.');
      console.error(err);
    }
  };

  return (
    <div className="container app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="premium-card text-center" style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="branding" style={{ marginBottom: '32px', justifyContent: 'center' }}>
           <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="brand-logo" style={{ color: 'var(--primary)' }}>
             <path d="M12 2L4 7V17L12 22L20 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
             <path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
             <path d="M12 12L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
             <path d="M12 12L4 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
           </svg>
        </div>
        
        <h1 className="brand-name" style={{ marginBottom: '8px' }}>Al-Mihrab</h1>
        <p className="section-subtitle" style={{ marginBottom: '32px' }}>Track your spiritual journey</p>

        {error && <div className="error-message" style={{ color: '#ef4444', marginBottom: '16px', fontSize: '0.9rem' }}>{error}</div>}

        <button className="calculate-btn" onClick={handleGoogleSignIn} style={{ width: '100%', padding: '16px', display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center', background: 'white', color: 'var(--text-main)', border: '1px solid var(--border)' }}>
          <svg style={{ width: '20px' }} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continue with Google
        </button>

      </div>
    </div>
  );
};
