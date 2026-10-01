import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UtensilsCrossed,
  CheckCircle2,
  Image,
  Clock,
  CalendarCheck,
  Sparkles,
  ArrowRight,
  Plus,
  Edit,
  ExternalLink,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import api from '../../services/api';
import { Toast } from '../../components/common/Toast';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/reservations/dashboard-stats');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await api.patch(`/reservations/${id}/status`, { status: newStatus });
      if (res.data.success) {
        setToast({ message: `Reservation marked as ${newStatus}`, type: 'success' });
        fetchStats();
      }
    } catch (err) {
      setToast({ message: 'Failed to update reservation status', type: 'error' });
    }
  };

  if (isLoading && !stats) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-burgundy-700" />
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Menu Items',
      value: stats?.totalMenuItems || 0,
      icon: UtensilsCrossed,
      color: 'bg-coffee-100 text-coffee-800',
      link: '/admin/menu',
    },
    {
      title: 'Available Items',
      value: stats?.availableItems || 0,
      icon: CheckCircle2,
      color: 'bg-emerald-100 text-emerald-800',
      link: '/admin/menu',
    },
    {
      title: 'Pending Reservations',
      value: stats?.pendingReservations || 0,
      icon: Clock,
      color: 'bg-amber-100 text-amber-800',
      link: '/admin/reservations',
    },
    {
      title: "Today's Bookings",
      value: stats?.todayReservations || 0,
      icon: CalendarCheck,
      color: 'bg-blue-100 text-blue-800',
      link: '/admin/reservations',
    },
    {
      title: 'Confirmed Bookings',
      value: stats?.confirmedReservations || 0,
      icon: Sparkles,
      color: 'bg-burgundy-100 text-burgundy-800',
      link: '/admin/reservations',
    },
    {
      title: 'Gallery Photos',
      value: stats?.totalGalleryImages || 0,
      icon: Image,
      color: 'bg-purple-100 text-purple-800',
      link: '/admin/gallery',
    },
  ];

  return (
    <div className="space-y-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Top Banner / Welcome */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-coffee-200/80 shadow-warm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-burgundy-700 bg-burgundy-50 px-3 py-1 rounded-full border border-burgundy-200 inline-block mb-2">
            Overview
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
            Welcome to Village Cafe Control Center
          </h2>
          <p className="text-charcoal-600 text-xs sm:text-sm mt-1">
            Real-time management for menu items, customer bookings, bakery showcases, and homepage content.
          </p>
        </div>

        {/* Quick Actions Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/admin/menu"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Menu Item</span>
          </Link>

          <Link
            to="/admin/gallery"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Image className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
          </Link>

          <Link
            to="/admin/homepage"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-coffee-300 text-charcoal-800 hover:bg-coffee-50 text-xs font-bold transition-colors"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Homepage</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.link}
              className="bg-white p-5 rounded-2xl border border-coffee-200/80 shadow-warm hover:shadow-warm-xl transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`p-2 rounded-xl ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </span>
                <span className="text-[11px] text-charcoal-400 group-hover:text-burgundy-700 transition-colors">
                  →
                </span>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-900">
                  {card.value}
                </p>
                <p className="text-xs font-medium text-charcoal-600 mt-0.5 truncate">
                  {card.title}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Two Column Layout: Recent Reservations & Recent Menu Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Recent Reservations */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-coffee-200/80 shadow-warm space-y-4">
          <div className="flex items-center justify-between border-b border-coffee-100 pb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-charcoal-900">
                Recent Reservations
              </h3>
              <p className="text-xs text-charcoal-500">Latest customer booking requests</p>
            </div>
            <Link
              to="/admin/reservations"
              className="text-xs font-bold text-burgundy-700 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {stats?.recentReservations?.length > 0 ? (
            <div className="space-y-3">
              {stats.recentReservations.map((res) => (
                <div
                  key={res._id || res.id}
                  className="p-4 rounded-xl border border-coffee-100 hover:border-coffee-300 bg-cream-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-charcoal-900">{res.fullName}</span>
                      <span className="font-mono text-[10px] text-charcoal-500 bg-white px-1.5 py-0.5 rounded border border-coffee-200">
                        {res.referenceId}
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-600 mt-0.5">
                      📅 {res.date} at {res.time} • 👥 {res.guests} Guests • 📞 {res.phone}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        res.status === 'CONFIRMED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : res.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {res.status}
                    </span>

                    {res.status === 'PENDING' && (
                      <button
                        onClick={() => handleUpdateStatus(res._id || res.id, 'CONFIRMED')}
                        className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-sm"
                      >
                        Confirm
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-charcoal-500 text-xs">
              No recent reservations logged.
            </div>
          )}
        </div>

        {/* Right: Recent Menu Updates */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-coffee-200/80 shadow-warm space-y-4">
          <div className="flex items-center justify-between border-b border-coffee-100 pb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-charcoal-900">
                Recent Menu Updates
              </h3>
              <p className="text-xs text-charcoal-500">Latest menu items added or modified</p>
            </div>
            <Link
              to="/admin/menu"
              className="text-xs font-bold text-burgundy-700 hover:underline flex items-center gap-1"
            >
              <span>Manage Menu</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {stats?.recentMenuUpdates?.length > 0 ? (
            <div className="space-y-3">
              {stats.recentMenuUpdates.map((item) => (
                <div
                  key={item._id || item.id}
                  className="flex items-center gap-3 p-2.5 rounded-xl border border-coffee-100 hover:bg-cream-50/50 transition-colors"
                >
                  <img
                    src={item.imageUrl || '/uploads/village_counter.jpg'}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover border border-coffee-200 shrink-0"
                    onError={(e) => {
                      e.currentTarget.src = '/uploads/village_counter.jpg';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-xs sm:text-sm text-charcoal-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-charcoal-500 truncate">
                      {item.category?.name || 'Delicacy'} • {item.isAvailable ? 'Available' : 'Unavailable'}
                    </p>
                  </div>
                  <span className="font-serif font-bold text-sm text-burgundy-700 shrink-0">
                    ₹{item.price}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-charcoal-500 text-xs">
              No menu items found.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
