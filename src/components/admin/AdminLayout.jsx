import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-ivory">
      {open && <button className="fixed inset-0 z-30 bg-espresso/40 lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu" />}
      <AdminSidebar open={open} onNavigate={() => setOpen(false)} />
      <main className="animate-fade-in min-h-screen lg:pl-64">
        <AdminNavbar onMenu={() => setOpen(true)} />
        <div className="p-5 lg:p-10"><Outlet /></div>
      </main>
    </div>
  );
}
