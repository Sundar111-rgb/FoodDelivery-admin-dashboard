import { useState } from 'react';
import { ShieldCheck, Eye, EyeOff, Mail, Lock, Utensils } from 'lucide-react';
import { loginUser } from '../services/authService';

export default function Login({ onLoginSuccess, onShowRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await loginUser(email, password);
      onLoginSuccess(user);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Unable to log in. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand-icon">
            <Utensils size={27} />
          </div>
          <div>
            <h1>FoodDash</h1>
            <p>Administration Portal</p>
          </div>
        </div>

        <div className="auth-heading">
          <div className="auth-shield">
            <ShieldCheck size={25} />
          </div>
          <h2>Welcome back</h2>
          <p>Sign in to manage your food delivery platform.</p>
        </div>

        {error && (
          <div className="auth-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="login-email">Email address</label>
          <div className="auth-input-wrap">
            <Mail size={18} />
            <input
              id="login-email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <label htmlFor="login-password">Password</label>
          <div className="auth-input-wrap">
            <Lock size={18} />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((previous) => !previous)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-switch">
          Need an account?{' '}
          <button type="button" onClick={onShowRegister}>
            Register
          </button>
        </p>

        <div className="auth-security">
          <ShieldCheck size={16} />
          Secure administrator access
        </div>
      </section>
    </main>
  );
}
