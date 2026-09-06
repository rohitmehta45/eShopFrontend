import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert('Please enter your name');
    if (!email.trim()) return alert('Please enter your email');
    if (password.length < 6) return alert('Password must be at least 6 characters');
    if (password !== confirmPassword) return alert('Passwords do not match');
    setLoading(true);
    try {
      const result = await register(name, email, password);
      if (result.success) navigate('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-[80vh] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-espresso lg:block">
        <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=80" alt="" className="h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 flex flex-col justify-end p-12 text-ivory">
          <p className="font-display text-4xl">Velmora</p>
          <p className="mt-3 max-w-sm text-ivory/75">Join a quieter, more considered storefront.</p>
        </div>
      </div>
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <h2 className="font-display text-4xl">Create your account</h2>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Already have an account? <Link to="/login" className="font-semibold text-accent">Sign in</Link>
          </p>
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium">Name<input id="name" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className="admin-input" /></label>
            <label className="block text-sm font-medium">Email<input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="admin-input" /></label>
            <label className="block text-sm font-medium">Password<input id="password" type="password" required minLength={6} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className="admin-input" /></label>
            <label className="block text-sm font-medium">Confirm password<input id="confirmPassword" type="password" required minLength={6} autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="admin-input" /></label>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:cursor-not-allowed disabled:opacity-50">{loading ? 'Creating account...' : 'Register'}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
