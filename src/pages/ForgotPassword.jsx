import { useState } from 'react';

import {
  Link,
} from 'react-router-dom';

import { toast } from 'react-hot-toast';

import { authAPI } from '../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');

  const [loading, setLoading] = useState(false);

  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);

    try {
      const response =
        await authAPI.forgotPassword(
          email.trim()
        );

      setSent(true);

      toast.success(
        response.data?.message ||
          'Check your email for the reset link'
      );

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Unable to send reset link'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6">

      <div className="w-full max-w-md">

        <h1 className="font-display text-4xl">
          Forgot Password?
        </h1>

        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          Enter your email and we'll send you
          a password reset link.
        </p>

        {sent ? (

          /* =========================
             EMAIL SENT
          ========================= */

          <div className="mt-8 rounded-lg border p-6">

            <div className="mb-4 text-3xl">
              ✉️
            </div>

            <h2 className="font-semibold">
              Check your email
            </h2>

            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              If an account exists with this email,
              we've sent you a password reset link.
            </p>

            <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
              The link will expire in 15 minutes.
            </p>

            <Link
              to="/login"
              className="mt-6 inline-block font-semibold text-accent hover:underline"
            >
              Back to Login
            </Link>

          </div>

        ) : (

          /* =========================
             FORM
          ========================= */

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >

            <label className="block text-sm font-medium">

              Email

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="admin-input mt-2"
                placeholder="you@example.com"
                autoComplete="email"
              />

            </label>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3"
            >
              {loading
                ? 'Sending...'
                : 'Send Reset Link'}
            </button>

            <div className="text-center">

              <Link
                to="/login"
                className="text-sm font-semibold text-accent hover:underline"
              >
                Back to Login
              </Link>

            </div>

          </form>

        )}

      </div>

    </div>
  );
}