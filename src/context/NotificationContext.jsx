import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { customerApi } from '../services/api';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const loadNotifications = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setNotifications([]);
      setLoaded(true);
      return [];
    }
    const { data } = await customerApi.getNotifications();
    const next = data.notifications || [];
    setNotifications(next);
    setLoaded(true);
    return next;
  }, []);

  useEffect(() => {
    loadNotifications().catch(() => { setNotifications([]); setLoaded(true); });
    const refresh = () => { if (document.visibilityState === 'visible') loadNotifications().catch(() => {}); };
    const interval = window.setInterval(refresh, 30000);
    document.addEventListener('visibilitychange', refresh);
    return () => { window.clearInterval(interval); document.removeEventListener('visibilitychange', refresh); };
  }, [loadNotifications]);

  const markRead = useCallback(async (id) => {
    const { data } = await customerApi.markNotificationRead(id);
    setNotifications((current) => current.map((item) => item._id === id ? (data.notification || { ...item, read: true }) : item));
  }, []);

  const markAllRead = useCallback(async () => {
    await customerApi.markNotificationsRead();
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
  }, []);

  const deleteNotification = useCallback(async (id) => {
    await customerApi.deleteNotification(id);
    setNotifications((current) => current.filter((item) => item._id !== id));
  }, []);

  const unreadCount = useMemo(() => notifications.filter((item) => item.read === false).length, [notifications]);
  const value = useMemo(() => ({ notifications, loaded, unreadCount, loadNotifications, markRead, markAllRead, deleteNotification }), [notifications, loaded, unreadCount, loadNotifications, markRead, markAllRead, deleteNotification]);
  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
}
