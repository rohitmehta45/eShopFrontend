import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const nextErrors = {};

    if (!form.email.trim()) {
      nextErrors.email = 'Email is required';
    }

    if (!form.password) {
      nextErrors.password = 'Password is required';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const result = await login(
        form.email,
        form.password
      );

      if (result.success) {
        navigate(
          result.user?.role === 'admin'
            ? '/admin'
            : '/'
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Login failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-[80vh] lg:grid-cols-2">
      {/* LEFT IMAGE */}
      <div className="relative hidden overflow-hidden bg-espresso lg:block">
        <img
          src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=80"
          alt=""
          className="h-full w-full object-cover opacity-70"
        />

        <div className="absolute inset-0 flex flex-col justify-end p-12 text-ivory">
          <p className="font-display text-4xl">
            Velmora
          </p>

          <p className="mt-3 max-w-sm text-ivory/75">
            Welcome back to a calmer way to shop.
          </p>
        </div>
      </div>

      {/* LOGIN FORM */}
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <h1 className="font-display text-4xl">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Sign in to continue shopping
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-4"
          >
            {/* EMAIL */}
            <label className="block text-sm font-medium">
              Email

              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                className="admin-input"
                placeholder="you@example.com"
                autoComplete="email"
              />

              {errors.email && (
                <p className="mt-1 text-sm text-danger">
                  {errors.email}
                </p>
              )}
            </label>

            {/* PASSWORD */}
            <label className="block text-sm font-medium">
              Password

              <div className="relative mt-2">
                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
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

              {errors.password && (
                <p className="mt-1 text-sm text-danger">
                  {errors.password}
                </p>
              )}
            </label>

            {/* FORGOT PASSWORD */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-accent hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* SUPPORT */}
            <p className="text-xs text-[var(--color-text-secondary)]">
              Need help with your account? Visit{' '}
              <Link
                to="/support"
                className="font-semibold text-accent"
              >
                Support
              </Link>
              .
            </p>

            {/* LOGIN BUTTON */}
            <button
              disabled={loading}
              className="btn-primary w-full py-3"
              type="submit"
            >
              {loading
                ? 'Signing in...'
                : 'Sign in'}
            </button>
          </form>

          {/* REGISTER */}
          <p className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
            Don’t have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-accent"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

