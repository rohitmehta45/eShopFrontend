import { useEffect, useRef, useState } from 'react';
import logo from '../../../assets/LoGo.png'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';

import {
  Bell,
  ChevronDown,
  Heart,
  LogOut,
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useNotifications } from '../../context/NotificationContext';
import UserAvatar from './UserAvatar';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/products' },
  { label: 'Support', to: '/support' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState('');

  const profileRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout, isAuthenticated } = useAuth();
  const { totalItems } = useCart();
  const { unreadCount } = useNotifications();

  // --------------------------------------------------
  // Handle navbar shadow/background on scroll
  // --------------------------------------------------
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };

    onScroll();

    window.addEventListener('scroll', onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // --------------------------------------------------
  // Close profile menu when clicking outside / Escape
  // --------------------------------------------------
  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!profileRef.current?.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  // --------------------------------------------------
  // Close mobile/profile menus when route changes
  // --------------------------------------------------
  useEffect(() => {
    setProfileOpen(false);
    setIsOpen(false);
  }, [location.pathname]);

  // --------------------------------------------------
  // Logout
  // --------------------------------------------------
  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setIsOpen(false);
  };

  // --------------------------------------------------
  // Product search
  // --------------------------------------------------
  const submitSearch = (event) => {
    event.preventDefault();

    const value = query.trim();

    if (!value) {
      navigate('/products');
      return;
    }

    navigate(`/products?search=${encodeURIComponent(value)}`);
    setIsOpen(false);
  };

  // --------------------------------------------------
  // Common account menu link style
  // --------------------------------------------------
  const menuLink =
    'flex items-center gap-3 rounded-[10px] px-3 py-2 text-sm text-mocha transition hover:bg-ivory hover:text-accent';

  // --------------------------------------------------
  // Account dropdown
  // --------------------------------------------------
  const accountMenu = (
    <div
      role="menu"
      className="dropdown-premium absolute right-0 top-12 z-50 w-64 rounded-[14px] border border-[var(--color-border)] bg-surface p-3 shadow-soft"
    >
      {/* User information */}
      <div className="flex items-center gap-3 border-b border-[var(--color-border)] px-3 pb-3">
        <UserAvatar user={user} className="h-10 w-10" />

        <div className="min-w-0">
          <p className="truncate font-semibold text-espresso">
            {user?.name || 'User'}
          </p>

          <p className="truncate text-xs text-[var(--color-text-secondary)]">
            {user?.email}
          </p>
        </div>
      </div>

      {/* Account links */}
      <div className="py-2">
        <Link
          role="menuitem"
          to="/profile"
          className={menuLink}
        >
          <User className="h-4 w-4" />
          Profile
        </Link>

        <Link
          role="menuitem"
          to="/orders"
          className={menuLink}
        >
          <ShoppingCart className="h-4 w-4" />
          My Orders
        </Link>

        <Link
          role="menuitem"
          to="/wishlist"
          className={menuLink}
        >
          <Heart className="h-4 w-4" />
          Wishlist
        </Link>

        <Link
          role="menuitem"
          to="/notifications"
          className={menuLink}
        >
          <Bell className="h-4 w-4" />
          Notifications
        </Link>
      </div>

      {/* Logout */}
      <button
        type="button"
        role="menuitem"
        onClick={handleLogout}
        className="flex w-full items-center gap-3 border-t border-[var(--color-border)] px-3 pt-3 text-left text-sm text-danger"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </div>
  );

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-all duration-300 ${
        scrolled
          ? 'border-[var(--color-border)] bg-ivory/95 shadow-soft backdrop-blur-sm'
          : 'border-transparent bg-ivory'
      }`}
    >
      <div className="container-custom flex h-[72px] items-center justify-between gap-4">

        {/* ==================================================
            VELMORA LOGO
        ================================================== */}
        <Link
          to="/"
          className="flex shrink-0 items-center"
          aria-label="Velmora Home"
        >
          <img
            src={logo}
            alt="Velmora"
            className="h-20 w-auto object-contain"
          />
        </Link>

        {/* ==================================================
            DESKTOP NAVIGATION
        ================================================== */}
        <nav className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `nav-link-premium text-sm font-medium transition ${
                  isActive
                    ? 'text-accent'
                    : 'text-mocha hover:text-accent'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* ==================================================
            DESKTOP ACTIONS
        ================================================== */}
        <div className="hidden items-center gap-2 lg:flex">

          {/* Search */}
          <form
            onSubmit={submitSearch}
            className="flex h-10 w-56 items-center gap-2 rounded-full border border-[var(--color-border)] bg-surface px-3"
          >
            <Search className="h-4 w-4 shrink-0 text-[var(--color-text-secondary)]" />

            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full border-0 bg-transparent text-sm outline-none"
              placeholder="Search products"
              aria-label="Search products"
            />
          </form>

          {/* Wishlist */}
          {isAuthenticated && (
            <Link
              to="/wishlist"
              className="icon-hover rounded-full p-2 text-mocha hover:bg-ivory"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
            </Link>
          )}

          {/* Notifications */}
          {isAuthenticated && (
            <Link
              to="/notifications"
              className="icon-hover relative rounded-full p-2 text-mocha hover:bg-ivory"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />

              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </Link>
          )}

          {/* Cart */}
          <Link
            to="/cart"
            className="icon-hover relative rounded-full p-2 text-mocha hover:bg-ivory"
            aria-label="Cart"
          >
            <ShoppingCart className="h-5 w-5" />

            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-espresso px-1 text-[10px] font-bold text-ivory">
                {totalItems}
              </span>
            )}
          </Link>

          {/* ==================================================
              AUTHENTICATED USER
          ================================================== */}
          {isAuthenticated ? (
            <div
              ref={profileRef}
              className="relative"
            >
              <button
                type="button"
                onClick={() =>
                  setProfileOpen((open) => !open)
                }
                aria-expanded={profileOpen}
                aria-haspopup="menu"
                aria-label="Open profile menu"
                className="avatar-hover flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-surface px-2 py-1.5"
              >
                <UserAvatar
                  user={user}
                  className="h-7 w-7"
                />

                <ChevronDown
                  className={`h-4 w-4 text-mocha transition-transform ${
                    profileOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {profileOpen && accountMenu}
            </div>
          ) : (
            /* ==================================================
                GUEST USER
            ================================================== */
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="btn-secondary px-3 py-2"
              >
                Sign in
              </Link>

              <Link
                to="/register"
                className="btn-primary px-3 py-2"
              >
                Join
              </Link>
            </div>
          )}
        </div>

        {/* ==================================================
            MOBILE MENU BUTTON
        ================================================== */}
        <button
          type="button"
          className="icon-hover rounded-[10px] p-2 text-mocha md:hidden"
          onClick={() => setIsOpen((open) => !open)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* ==================================================
          MOBILE MENU
      ================================================== */}
      {isOpen && (
        <div className="mobile-menu-premium border-t border-[var(--color-border)] bg-surface md:hidden">
          <div className="container-custom flex flex-col gap-3 py-4">

            {/* Mobile Search */}
            <form
              onSubmit={submitSearch}
              className="flex h-11 items-center gap-2 rounded-[12px] border border-[var(--color-border)] px-3"
            >
              <Search className="h-4 w-4 shrink-0" />

              <input
                type="text"
                value={query}
                onChange={(event) =>
                  setQuery(event.target.value)
                }
                className="w-full border-0 bg-transparent text-sm outline-none"
                placeholder="Search products"
                aria-label="Search products"
              />
            </form>

            {/* Mobile Navigation */}
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `text-sm font-medium ${
                    isActive
                      ? 'text-accent'
                      : 'text-mocha'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            {/* Cart */}
            <Link
              to="/cart"
              className="text-sm font-medium text-mocha"
            >
              Cart
              {totalItems > 0
                ? ` (${totalItems})`
                : ''}
            </Link>

            {/* Notifications */}
            {isAuthenticated && (
              <Link
                to="/notifications"
                className="text-sm font-medium text-mocha"
              >
                Notifications
                {unreadCount > 0
                  ? ` (${unreadCount})`
                  : ''}
              </Link>
            )}

            {/* ==================================================
                MOBILE AUTHENTICATED MENU
            ================================================== */}
            {isAuthenticated ? (
              <div className="border-t border-[var(--color-border)] pt-3">

                <Link
                  to="/profile"
                  className="block py-2 text-sm"
                >
                  Profile
                </Link>

                <Link
                  to="/orders"
                  className="block py-2 text-sm"
                >
                  Orders
                </Link>

                <Link
                  to="/wishlist"
                  className="block py-2 text-sm"
                >
                  Wishlist
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-2 flex items-center gap-2 text-sm text-danger"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              /* ==================================================
                  MOBILE GUEST MENU
              ================================================== */
              <div className="flex gap-2 pt-2">
                <Link
                  to="/login"
                  className="btn-secondary flex-1"
                >
                  Sign in
                </Link>

                <Link
                  to="/register"
                  className="btn-primary flex-1"
                >
                  Join
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}