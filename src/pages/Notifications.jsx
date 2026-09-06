import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Bell, Check, CheckCheck, CreditCard, MoreVertical, ShoppingBag, Trash2, Truck, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNotifications } from '../context/NotificationContext';
import AccountNav from '../components/layout/AccountNav';
import EmptyState from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';


function notificationIcon(item) {
  const key = `${item.type || ''} ${item.title || ''} ${item.message || ''}`.toLowerCase();
  if (key.includes('fail') || key.includes('error')) return AlertCircle;
  if (key.includes('pay') || key.includes('payment') || item.type === 'PAYMENT') return CreditCard;
  if (key.includes('ship') || key.includes('deliver') || item.type === 'SHIPPING') return Truck;
  if (key.includes('user') || item.type === 'USER' || item.type === 'ACCOUNT') return UserPlus;
  if (item.order || key.includes('order')) return ShoppingBag;
  if (key.includes('success')) return Check;
  return Bell;
}

export default function Notifications() {
  const { notifications, loaded, unreadCount, markRead, markAllRead, deleteNotification } = useNotifications();
  const [openMenu, setOpenMenu] = useState(null);
  const [busy, setBusy] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const close = (event) => { if (!menuRef.current?.contains(event.target)) setOpenMenu(null); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const markOne = async (id) => { try { await markRead(id); } catch { toast.error('Failed to update notification.'); } };
  const markAll = async () => { if (!unreadCount || busy) return; setBusy(true); try { await markAllRead(); toast.success('All notifications marked as read.'); } catch { toast.error('Failed to update notifications.'); } finally { setBusy(false); } };
  const remove = async (id) => { setBusy(true); try { await deleteNotification(id); toast.success('Notification deleted.'); } catch { toast.error('Failed to delete notification.'); } finally { setBusy(false); setOpenMenu(null); } };

  if (!loaded) return <div className="container-custom py-16"><Skeleton className="mx-auto h-40 max-w-3xl" /></div>;
 return (
    <div className="container-custom grid gap-8 py-10 lg:grid-cols-[240px_minmax(0,1fr)]">
      <AccountNav />
      <div>
        <div className="flex flex-col gap-5 border-b border-[var(--color-border)] pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Updates</p>
            <h1 className="font-display mt-2 text-4xl">Notifications</h1>
            <p className="mt-2 text-[var(--color-text-secondary)]">{unreadCount ? `${unreadCount} unread update${unreadCount === 1 ? '' : 's'}` : 'You are all caught up.'}</p>
          </div>
          <button disabled={!unreadCount || busy} onClick={markAll} className="btn-secondary gap-2 disabled:opacity-50"><CheckCheck size={17} /> Mark all as read</button>
        </div>
        <div className="mt-8 space-y-3">
          {notifications.length ? notifications.map((item) => {
            const Icon = notificationIcon(item);
            return (
              <article key={item._id} onClick={() => !item.read && markOne(item._id)} className={`card relative cursor-pointer overflow-visible p-5 ${item.read ? 'bg-surface' : 'border-accent/40 bg-ivory'}`}>
                <div className="flex gap-4">
                  <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] ${item.read ? 'bg-ivory text-mocha' : 'bg-espresso text-ivory'}`}>
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 pr-8 sm:flex-row sm:items-center sm:justify-between">
                      <h2 className="font-semibold">{item.title}</h2>
                      <time className="text-xs text-[var(--color-text-secondary)]">{new Date(item.createdAt).toLocaleString()}</time>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-mocha">{item.message}</p>
                    {item.order && <Link onClick={(event) => event.stopPropagation()} to={`/orders/${item.order}`} className="mt-3 inline-flex text-sm font-semibold text-accent">View order →</Link>}
                  </div>
                </div>
                {!item.read && <span className="absolute left-5 top-5 h-2.5 w-2.5 rounded-full bg-accent" aria-label="Unread" />}
                <div ref={openMenu === item._id ? menuRef : null} className="absolute right-3 top-3">
                  <button type="button" onClick={(event) => { event.stopPropagation(); setOpenMenu((current) => current === item._id ? null : item._id); }} className="rounded-[10px] p-2 text-[var(--color-text-secondary)] hover:bg-ivory" aria-label="Notification actions">
                    <MoreVertical size={18} />
                  </button>
                  {openMenu === item._id && (
                    <div className="dropdown-premium absolute right-0 top-10 z-20 w-48 rounded-[12px] border border-[var(--color-border)] bg-surface p-1.5 shadow-soft">
                      <button type="button" disabled={busy} onClick={(event) => { event.stopPropagation(); remove(item._id); }} className="flex w-full items-center gap-2 rounded-[10px] px-3 py-2.5 text-left text-sm font-semibold text-danger hover:bg-red-50">
                        <Trash2 size={16} /> Delete notification
                      </button>
                    </div>
                  )}
                </div>
                {item.read && <span className="absolute bottom-4 right-5 inline-flex items-center gap-1 text-xs text-[var(--color-text-secondary)]"><Check size={14} /> Read</span>}
              </article>
            );
          }) : <EmptyState icon={Bell} title="All caught up" description="New order and account updates will appear here." />}
        </div>
      </div>
    </div>
  );
}
