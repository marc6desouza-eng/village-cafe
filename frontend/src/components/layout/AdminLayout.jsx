import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Home,
  FileText,
  UtensilsCrossed,
  Layers,
  Image,
  CalendarCheck,
  Mail,
  PhoneCall,
  Clock,
  Settings,
  User,
  LogOut,
  ExternalLink,
  Menu as MenuIcon,
  X,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { OpenStatusBadge } from '../common/OpenStatusBadge';

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
  { name: 'Homepage CMS', path: '/admin/homepage', icon: Home },
  { name: 'About CMS', path: '/admin/about', icon: FileText },
  { name: 'Menu Items', path: '/admin/menu', icon: UtensilsCrossed },
  { name: 'Menu Categories', path: '/admin/categories', icon: Layers },
  { name: 'Gallery CMS', path: '/admin/gallery', icon: Image },
  { name: 'Reservations', path: '/admin/reservations', icon: CalendarCheck },
  { name: 'Inquiries', path: '/admin/inquiries', icon: Mail },
  { name: 'Contact CMS', path: '/admin/contact', icon: PhoneCall },
  { name: 'Opening Hours', path: '/admin/hours', icon: Clock },
  { name: 'Site Settings', path: '/admin/settings', icon: Settings },
  { name: 'Admin Profile', path: '/admin/profile', icon: User },
];

export const AdminLayout = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-burgundy-700 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-coffee-800">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const currentTitle =
    navItems.find((item) =>
      item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path)
    )?.name || 'Admin Panel';

  return (
    <div className="min-h-screen bg-[#F4EFEA] flex flex-col lg:flex-row text-charcoal-900">
      
      {/* Mobile Header Bar */}
      <div className="lg:hidden bg-charcoal-950 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-1.5 rounded-lg hover:bg-charcoal-800 text-cream-200"
            aria-label="Open sidebar"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
          <div className="w-7 h-7 rounded-full bg-burgundy-700 border border-cafeYellow-500 flex items-center justify-center text-xs font-serif font-bold text-white">
            VC
          </div>
          <span className="font-serif font-bold text-sm tracking-wide">VILLAGE CAFE CMS</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg bg-charcoal-850 hover:bg-charcoal-700 text-cream-200 text-xs flex items-center gap-1"
            title="Preview Live Website"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Desktop / Responsive Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-charcoal-950 text-cream-100 flex flex-col border-r border-charcoal-800 transition-transform duration-300 lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-charcoal-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-burgundy-700 border-2 border-cafeYellow-500 flex items-center justify-center font-serif font-bold text-white shadow">
              VC
            </div>
            <div>
              <h2 className="font-serif font-bold text-base tracking-wide text-white leading-tight">
                VILLAGE CAFE
              </h2>
              <p className="text-[10px] text-coffee-400 font-medium tracking-wider uppercase">
                Admin CMS • Curtorim
              </p>
            </div>
          </div>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-charcoal-400 hover:text-white hover:bg-charcoal-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cafe Status Banner */}
        <div className="px-5 py-3 bg-charcoal-900/60 border-b border-charcoal-900 flex items-center justify-between">
          <span className="text-xs text-charcoal-300">Live Status:</span>
          <OpenStatusBadge showHours={false} />
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                onClick={() => setMobileSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-burgundy-700 text-white shadow-sm font-semibold'
                      : 'text-charcoal-300 hover:text-white hover:bg-charcoal-900'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0 text-coffee-300" />
                  <span>{item.name}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
              </NavLink>
            );
          })}
        </nav>

        {/* User Info & Footer */}
        <div className="p-4 border-t border-charcoal-900 space-y-3 bg-charcoal-950">
          <div className="flex items-center justify-between text-xs">
            <div className="truncate pr-2">
              <p className="font-semibold text-white truncate">{user?.name || 'Administrator'}</p>
              <p className="text-[11px] text-coffee-400 truncate">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-charcoal-900 hover:bg-charcoal-800 text-cream-200 text-xs font-medium transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Site</span>
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 text-xs font-medium transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-charcoal-950/70 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top Desktop Bar */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md border-b border-coffee-200/80 sticky top-0 z-20">
          <div>
            <h1 className="text-xl font-bold font-serif text-charcoal-900">{currentTitle}</h1>
            <p className="text-xs text-coffee-700">Village Cafe Management Console • Real-time DB Persistence</p>
          </div>

          <div className="flex items-center gap-4">
            <OpenStatusBadge />

            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-coffee-300 text-coffee-800 hover:bg-coffee-50 text-xs font-semibold transition-colors shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Public Website</span>
            </Link>

            <div className="h-6 w-px bg-coffee-200"></div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-burgundy-700 text-white flex items-center justify-center text-xs font-bold font-serif">
                {user?.name ? user.name[0].toUpperCase() : 'A'}
              </div>
              <div className="text-left text-xs">
                <span className="font-semibold text-charcoal-800 block leading-tight">{user?.name}</span>
                <span className="text-[11px] text-coffee-600">{user?.role || 'Admin'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Routed Admin Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>

    </div>
  );
};
