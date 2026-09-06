import { NavLink } from 'react-router-dom';
import { Bell, Heart, MapPin, Package, Star, User } from 'lucide-react';

const links = [
  ['Profile', '/profile', User],
  ['Orders', '/orders', Package],
  ['Wishlist', '/wishlist', Heart],
  ['Reviews', '/my-reviews', Star],
  ['Notifications', '/notifications', Bell],
  ['Support', '/support', MapPin],
];

export default function AccountNav() {
  return (
    <aside className="card h-fit p-3 lg:sticky lg:top-24">
      <p className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">Account</p>
      <nav className="space-y-1">
        {links.map(([label, to, Icon]) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm transition ${
                isActive ? 'bg-espresso text-ivory' : 'text-mocha hover:bg-ivory'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
