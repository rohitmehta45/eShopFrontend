import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      return alert('Please enter your name');
    }

    if (!email.trim()) {
      return alert('Please enter your email');
    }

    if (password.length < 6) {
      return alert(
        'Password must be at least 6 characters'
      );
    }

    if (password !== confirmPassword) {
      return alert('Passwords do not match');
    }

    setLoading(true);

    try {
      const result = await register(
        name,
        email,
        password
      );

      if (result.success) {
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-[80vh] lg:grid-cols-2">
      {/* LEFT IMAGE */}
      <div className="relative hidden overflow-hidden bg-espresso lg:block">
        <img
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=80"
          alt=""
          className="h-full w-full object-cover opacity-70"
        />

        <div className="absolute inset-0 flex flex-col justify-end p-12 text-ivory">
          <p className="font-display text-4xl">
            Velmora
          </p>

          <p className="mt-3 max-w-sm text-ivory/75">
            Join a quieter, more considered storefront.
          </p>
        </div>
      </div>

      {/* REGISTER FORM */}
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <h2 className="font-display text-4xl">
            Create your account
          </h2>

          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-accent"
            >
              Sign in
            </Link>
          </p>

          <form
            className="mt-8 space-y-4"
            onSubmit={handleSubmit}
          >
            {/* NAME */}
            <label className="block text-sm font-medium">
              Name

              <input
                id="name"
                required
                autoComplete="name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                className="admin-input"
              />
            </label>

            {/* EMAIL */}
            <label className="block text-sm font-medium">
              Email

              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="admin-input"
              />
            </label>

            {/* PASSWORD */}
            <label className="block text-sm font-medium">
              Password

              <div className="relative mt-2">
                <input
                  id="password"
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className="admin-input w-full pr-12"
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-gray-800"
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </label>

            {/* CONFIRM PASSWORD */}
            <label className="block text-sm font-medium">
              Confirm password

              <div className="relative mt-2">
                <input
                  id="confirmPassword"
                  type={
                    showConfirmPassword
                      ? 'text'
                      : 'password'
                  }
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  className="admin-input w-full pr-12"
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-gray-800"
                  aria-label={
                    showConfirmPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </label>

            {/* REGISTER BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? 'Creating account...'
                : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

