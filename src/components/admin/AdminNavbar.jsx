import { Bell, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';

export default function AdminNavbar({ onMenu }) {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  return (
    <header className="flex items-center justify-between border-b border-[var(--color-border)] bg-surface px-5 py-4 lg:px-10">
      <div className="flex items-center gap-3">
        <button onClick={onMenu} className="rounded-[10px] border border-[var(--color-border)] p-2 text-mocha lg:hidden" aria-label="Open admin menu"><Menu size={20} /></button>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">Admin</p>
          <h1 className="font-display text-xl text-espresso">Workspace</h1>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/admin/notifications" className="relative rounded-[10px] p-2 text-mocha hover:bg-ivory" aria-label="Notifications">
          <Bell size={19} />
          {unreadCount > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-accent px-1.5 text-xs font-bold text-white">{unreadCount}</span>}
        </Link>
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold">{user?.name || 'Admin'}</p>
          <p className="text-xs text-[var(--color-text-secondary)]">{user?.email}</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ivory font-semibold text-espresso">{user?.name?.charAt(0)?.toUpperCase() || 'A'}</div>
      </div>
    </header>
  );
}
