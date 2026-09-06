import { useState } from 'react';

import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom';

import { toast } from 'react-hot-toast';

import { authAPI } from '../services/api';

export default function ResetPassword() {
  const {
    token,
  } = useParams();

  const navigate = useNavigate();

  const [password, setPassword] = useState('');

  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      toast.error('Please enter a new password');
      return;
    }

    if (password.length < 6) {
      toast.error(
        'Password must be at least 6 characters'
      );
      return;
    }

    if (!confirmPassword) {
      toast.error(
        'Please confirm your password'
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error(
        'Passwords do not match'
      );
      return;
    }

    setLoading(true);

    try {
      const response =
        await authAPI.resetPassword(
          token,
          password
        );

      setSuccess(true);

      toast.success(
        response.data?.message ||
          'Password reset successfully'
      );

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Unable to reset password'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6">

      <div className="w-full max-w-md">

        <h1 className="font-display text-4xl">
          Create New Password
        </h1>

        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          Choose a new password for your
          Velmora account.
        </p>

        {success ? (

          /* =========================
             SUCCESS
          ========================= */

          <div className="mt-8 rounded-lg border p-6">

            <div className="mb-4 text-3xl">
              ✅
            </div>

            <h2 className="font-semibold">
              Password Reset Successful
            </h2>

            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              Your password has been changed
              successfully.
            </p>

            <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
              Redirecting you to login...
            </p>

            <Link
              to="/login"
              className="mt-6 inline-block font-semibold text-accent hover:underline"
            >
              Login now
            </Link>

          </div>

        ) : (

          /* =========================
             RESET FORM
          ========================= */

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >

            {/* NEW PASSWORD */}

            <label className="block text-sm font-medium">

              New Password

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="admin-input mt-2"
                placeholder="••••••••"
                autoComplete="new-password"
              />

              <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                Minimum 6 characters
              </p>

            </label>

            {/* CONFIRM PASSWORD */}

            <label className="block text-sm font-medium">

              Confirm Password

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                className="admin-input mt-2"
                placeholder="••••••••"
                autoComplete="new-password"
              />

            </label>

            {/* BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3"
            >
              {loading
                ? 'Resetting...'
                : 'Reset Password'}
            </button>

          </form>

        )}

      </div>

    </div>
  );
}