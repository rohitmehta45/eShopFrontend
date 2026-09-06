import { NavLink } from 'react-router-dom';


import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  MessageSquare,
  Settings,
  Store,
  LogOut,
  Tags,
  Boxes,
  Warehouse,
  CreditCard,
  Bell,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';

import logo from '../../../assets/LoGo.png';

const links = [
  ['Dashboard', '/admin', LayoutDashboard],
  ['Products', '/admin/products', Package],
  ['Categories', '/admin/categories', Tags],
  ['Inventory', '/admin/inventory', Boxes],
  ['Warehouses', '/admin/warehouses', Warehouse],
  ['Orders', '/admin/orders', ShoppingBag],
  ['Payments', '/admin/payments', CreditCard],
  ['Payment Methods', '/admin/payment-methods', CreditCard],
  ['Users', '/admin/users', Users],
  ['Notifications', '/admin/notifications', Bell],
  ['Reviews', '/admin/reviews', MessageSquare],
  ['Website Feedback', '/admin/feedback', MessageSquare],
  ['Analytics', '/admin/analytics', BarChart3],
  ['Settings', '/admin/settings', Settings],
];

export default function AdminSidebar({ open, onNavigate }) {
  const { logout } = useAuth();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-espresso px-5 py-5 text-ivory transition-transform lg:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* =====================================================
          LOGO + BRAND NAME
      ====================================================== */}
      <div className="mb-6 border-b border-white/10 pb-6">
        {/* Logo - NOT a Link, so it does not navigate */}
        <div
          className="flex cursor-default flex-col items-center justify-center"
          aria-label="Velmora Admin"
        >
          {/* Logo */}
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-white p-1.5 shadow-md">
            <img
              src={logo}
              alt="Velmora Logo"
              className="h-full w-full object-contain"
            />
          </div>

          {/* Brand Name */}
          <p className="mt-3 font-display text-xl font-semibold tracking-wide text-ivory">
            Velmora
          </p>

          {/* Admin Label */}
          <p className="mt-0.5 text-xs text-ivory/50">
            Admin Control
          </p>
        </div>
      </div>

      {/* =====================================================
          NAVIGATION
      ====================================================== */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
        {links.map(([label, to, Icon]) => (
          <NavLink
            key={label}
            to={to}
            end={to === '/admin'}
            onClick={onNavigate}
            className={({ isActive }) =>
              `relative flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? 'bg-white/10 text-ivory before:absolute before:inset-y-2 before:left-0 before:w-[3px] before:rounded-full before:bg-accent'
                  : 'text-ivory/70 hover:bg-white/5 hover:text-ivory'
              }`
            }
          >
            <Icon size={18} strokeWidth={1.8} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* =====================================================
          BOTTOM ACTIONS
      ====================================================== */}
      <div className="mt-4 border-t border-white/10 pt-4">
        {/* Back to Store */}
        <NavLink
          to="/"
          onClick={onNavigate}
          className="mb-1 flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm text-ivory/70 transition-colors hover:bg-white/5 hover:text-ivory"
        >
          <Store size={18} strokeWidth={1.8} />
          <span>Back to Store</span>
        </NavLink>

        {/* Logout */}
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left text-sm text-ivory/70 transition-colors hover:bg-white/5 hover:text-ivory"
        >
          <LogOut size={18} strokeWidth={1.8} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
