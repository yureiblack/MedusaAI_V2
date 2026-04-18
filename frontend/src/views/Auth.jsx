import React, { useState } from 'react';
import catImage from '../assets/cat-auth.png';
import { supabase } from '../supabaseClient';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onLogin({ name: data.user.user_metadata?.full_name || email, email: data.user.email, token: data.session.access_token });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } }
        });
        if (error) throw error;
        // Auto login after signup if session exists
        if (data.session) {
          onLogin({ name, email, token: data.session.access_token });
        } else {
          setError("Check your email to confirm your account.");
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass">
        <div className="auth-hero">
          <img src={catImage} alt="MedusaAI Hero" />
        </div>

        <div className="auth-form-side">
          <div className="auth-header">
            <div className="auth-logo">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <span>medusaAi</span>
            </div>
            <h2>{isLogin ? 'WELCOME BACK' : 'CREATE ACCOUNT'}</h2>
            <p className="auth-subtitle">
              {isLogin
                ? 'Enter your email and password to access your account'
                : 'Join us and start your agentic AI journey today'}
            </p>
          </div>

          {error && (
            <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#" className="forgot-link">Forgot Password?</a>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
            </button>

            <button type="button" className="google-btn" onClick={handleGoogle}>
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
              Sign in with Google
            </button>
          </form>

          <div className="auth-footer">
            <p>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button className="toggle-btn" onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* All your existing styles stay exactly the same */}
      <style jsx>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background-color: var(--bg);
        }
        .auth-card {
          width: 1000px;
          max-width: 100%;
          min-height: 600px;
          display: flex;
          border-radius: 40px;
          overflow: hidden;
          box-shadow: 0 40px 100px rgba(0,0,0,0.1);
          border: 1px solid rgba(255,255,255,0.8);
        }
        .auth-hero {
          flex: 1.1;
          position: relative;
          background: #F8FBFF;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .auth-hero img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          top: 0;
          left: 0;
        }
        .auth-form-side {
          flex: 0.9;
          background: white;
          padding: 60px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .auth-header { margin-bottom: 40px; }
        .auth-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 800;
          font-size: 18px;
          margin-bottom: 32px;
          color: #333;
        }
        .auth-header h2 { font-size: 32px; font-weight: 800; margin-bottom: 12px; color: #000; }
        .auth-subtitle { color: #666; font-size: 14px; }
        .auth-form { display: flex; flex-direction: column; gap: 20px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group label { font-size: 13px; font-weight: 600; color: #333; }
        .form-group input {
          padding: 14px 16px;
          border-radius: 12px;
          border: 1px solid #eee;
          background: #FCFCFC;
          font-size: 14px;
          transition: all 0.2s;
        }
        .form-group input:focus { border-color: #000; background: white; }
        .form-options { display: flex; justify-content: space-between; align-items: center; font-size: 12px; }
        .checkbox-label { display: flex; align-items: center; gap: 8px; cursor: pointer; color: #666; }
        .forgot-link { color: #666; text-decoration: none; font-weight: 600; }
        .submit-btn {
          margin-top: 10px;
          padding: 16px;
          border-radius: 12px;
          background: #000;
          color: white;
          font-weight: 600;
          font-size: 15px;
          transition: transform 0.2s;
        }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
        .google-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 14px;
          border-radius: 12px;
          background: white;
          border: 1px solid #eee;
          font-weight: 600;
          font-size: 14px;
          color: #333;
          cursor: pointer;
        }
        .google-btn img { width: 18px; height: 18px; }
        .auth-footer { margin-top: 32px; text-align: center; font-size: 14px; color: #666; }
        .toggle-btn {
          background: none;
          color: #000;
          font-weight: 800;
          padding: 0;
          margin-left: 6px;
          border-bottom: 2px solid transparent;
          cursor: pointer;
        }
        .toggle-btn:hover { border-bottom-color: #000; }
        @media (max-width: 900px) {
          .auth-hero { display: none; }
          .auth-card { width: 450px; }
          .auth-form-side { flex: 1; padding: 40px; }
        }
      `}</style>
    </div>
  );
};

export default Auth;