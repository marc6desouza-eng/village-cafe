import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Users,
  User,
  Phone,
  Mail,
  MessageSquare,
  CheckCircle2,
  Search,
  AlertCircle,
  Sparkles,
  Loader2,
  Copy,
  Check,
} from 'lucide-react';
import api from '../services/api';
import { useSettings } from '../context/SettingsContext';

const TIME_SLOTS = [
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '01:00 PM',
  '01:30 PM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
  '04:30 PM',
  '05:00 PM',
  '05:30 PM',
  '06:00 PM',
  '06:30 PM',
  '07:00 PM',
  '07:30 PM',
  '08:00 PM',
  '08:30 PM',
  '09:00 PM',
];

export const ReservationsPage = () => {
  const { contact } = useSettings();
  const [activeTab, setActiveTab] = useState('BOOK'); // 'BOOK' | 'LOOKUP'

  // Booking Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    date: new Date().toISOString().split('T')[0],
    time: '04:00 PM',
    guests: '2',
    specialRequest: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(null);
  const [copied, setCopied] = useState(false);

  // Status Lookup State
  const [lookupQuery, setLookupQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [lookupResults, setLookupResults] = useState(null);
  const [lookupError, setLookupError] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!formData.fullName.trim()) {
      setSubmitError('Please enter your full name.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 8) {
      setSubmitError('Please enter a valid phone number so we can reach you.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.post('/reservations', formData);
      if (res.data.success) {
        setSubmissionSuccess(res.data.data);
      } else {
        setSubmitError(res.data.message || 'Failed to submit reservation.');
      }
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || err.message || 'Server error while submitting reservation.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLookupSubmit = async (e) => {
    e.preventDefault();
    if (!lookupQuery.trim()) return;

    try {
      setIsSearching(true);
      setLookupError('');
      setLookupResults(null);

      const res = await api.get(`/reservations/lookup/${encodeURIComponent(lookupQuery.trim())}`);
      if (res.data.success) {
        setLookupResults(res.data.data);
      }
    } catch (err) {
      setLookupError(
        err.response?.data?.message || 'No reservation found for this reference ID or phone number.'
      );
    } finally {
      setIsSearching(false);
    }
  };

  const copyRefId = (id) => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full text-xs font-bold uppercase tracking-wider">
            Confirmed
          </span>
        );
      case 'PENDING':
        return (
          <span className="px-3 py-1 bg-amber-100 text-amber-800 border border-amber-300 rounded-full text-xs font-bold uppercase tracking-wider">
            Pending Confirmation
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="px-3 py-1 bg-red-100 text-red-800 border border-red-300 rounded-full text-xs font-bold uppercase tracking-wider">
            Cancelled
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-3 py-1 bg-charcoal-100 text-charcoal-800 border border-charcoal-300 rounded-full text-xs font-bold uppercase tracking-wider">
            Completed
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-bold">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="pt-24 pb-20">
      
      {/* Header Banner */}
      <section className="bg-charcoal-950 text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cafeYellow-400 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Table Hospitality</span>
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4">
            Reserve Your Table
          </h1>
          <p className="text-cream-200 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Planning a coffee catch-up, family tea-time savouries, or an evening dessert outing? We would be delighted to host you.
          </p>
        </div>
      </section>

      {/* Mode Tabs (Book Table vs Check Status) */}
      <div className="max-w-xl mx-auto px-4 -mt-6 relative z-20">
        <div className="bg-white rounded-2xl shadow-warm-xl border border-coffee-200 p-1.5 flex gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('BOOK')}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'BOOK'
                ? 'bg-burgundy-700 text-white shadow-sm'
                : 'text-charcoal-600 hover:text-charcoal-900 hover:bg-cream-100'
            }`}
          >
            Book a Table
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('LOOKUP')}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'LOOKUP'
                ? 'bg-burgundy-700 text-white shadow-sm'
                : 'text-charcoal-600 hover:text-charcoal-900 hover:bg-cream-100'
            }`}
          >
            Track Existing Booking
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* TAB 1: BOOKING FORM */}
        {activeTab === 'BOOK' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-coffee-200 shadow-warm-xl">
            {submissionSuccess ? (
              /* Success Screen */
              <div className="text-center py-8 space-y-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block mb-2">
                    Request Received
                  </span>
                  <h2 className="font-serif text-3xl font-bold text-charcoal-900">
                    Reservation Request Received!
                  </h2>
                  <p className="text-charcoal-600 text-sm max-w-md mx-auto mt-2 leading-relaxed">
                    Thank you, <span className="font-semibold text-charcoal-900">{submissionSuccess.fullName}</span>. Your reservation request has been submitted successfully to our café manager.
                  </p>
                </div>

                {/* Reference ID Card */}
                <div className="max-w-sm mx-auto p-5 bg-cream-50 rounded-2xl border border-coffee-200 text-left space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Reference ID</span>
                    <button
                      type="button"
                      onClick={() => copyRefId(submissionSuccess.referenceId)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-burgundy-700 hover:underline"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>

                  <p className="font-mono text-xl font-bold text-charcoal-900 tracking-wider">
                    {submissionSuccess.referenceId}
                  </p>

                  <div className="pt-2 border-t border-coffee-100 text-xs text-charcoal-600 space-y-1">
                    <p><span className="font-medium text-charcoal-800">Date:</span> {submissionSuccess.date}</p>
                    <p><span className="font-medium text-charcoal-800">Time:</span> {submissionSuccess.time}</p>
                    <p><span className="font-medium text-charcoal-800">Guests:</span> {submissionSuccess.guests} People</p>
                    <p><span className="font-medium text-charcoal-800">Status:</span> {getStatusBadge(submissionSuccess.status)}</p>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmissionSuccess(null);
                      setFormData({
                        fullName: '',
                        phone: '',
                        email: '',
                        date: todayStr,
                        time: '04:00 PM',
                        guests: '2',
                        specialRequest: '',
                      });
                    }}
                    className="px-6 py-2.5 rounded-full bg-cream-200 hover:bg-cream-300 text-charcoal-800 text-xs font-semibold transition-colors"
                  >
                    Make Another Booking
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLookupQuery(submissionSuccess.referenceId);
                      setActiveTab('LOOKUP');
                    }}
                    className="px-6 py-2.5 rounded-full bg-burgundy-700 hover:bg-burgundy-800 text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    Track This Booking
                  </button>
                </div>
              </div>
            ) : (
              /* Booking Form */
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
                    Book a Table
                  </h2>
                  <p className="text-charcoal-600 text-xs sm:text-sm mt-1">
                    Please provide your booking details. We will reserve your table and prepare fresh refreshments.
                  </p>
                </div>

                {submitError && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Maria Fernandes"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-coffee-200 text-sm focus:outline-none focus:border-burgundy-600 bg-cream-50/50"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-coffee-200 text-sm focus:outline-none focus:border-burgundy-600 bg-cream-50/50"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700">
                      Email Address (Optional)
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. maria@example.com"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-coffee-200 text-sm focus:outline-none focus:border-burgundy-600 bg-cream-50/50"
                      />
                    </div>
                  </div>

                  {/* Number of Guests */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700">
                      Number of Guests *
                    </label>
                    <div className="relative">
                      <Users className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <select
                        value={formData.guests}
                        onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-coffee-200 text-sm focus:outline-none focus:border-burgundy-600 bg-cream-50/50 cursor-pointer"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'Guest (Solo Table)' : 'Guests'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700">
                      Reservation Date *
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="date"
                        required
                        min={todayStr}
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-coffee-200 text-sm focus:outline-none focus:border-burgundy-600 bg-cream-50/50 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Time */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700">
                      Preferred Time *
                    </label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <select
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-coffee-200 text-sm focus:outline-none focus:border-burgundy-600 bg-cream-50/50 cursor-pointer"
                      >
                        {TIME_SLOTS.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700">
                    Special Requests / Dietary Notes (Optional)
                  </label>
                  <div className="relative">
                    <MessageSquare className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
                    <textarea
                      rows={3}
                      value={formData.specialRequest}
                      onChange={(e) => setFormData({ ...formData, specialRequest: e.target.value })}
                      placeholder="e.g. Birthday slice reservation, corner table request, window seat, high chair needed..."
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-coffee-200 text-sm focus:outline-none focus:border-burgundy-600 bg-cream-50/50"
                    ></textarea>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-burgundy-700 hover:bg-burgundy-800 text-white font-bold text-sm sm:text-base shadow-warm hover:shadow-warm-xl transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Submitting Request...</span>
                      </>
                    ) : (
                      <>
                        <Calendar className="w-5 h-5" />
                        <span>Confirm Table Reservation</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: LOOKUP STATUS */}
        {activeTab === 'LOOKUP' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-coffee-200 shadow-warm-xl space-y-6">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
                Track Your Reservation
              </h2>
              <p className="text-charcoal-600 text-xs sm:text-sm mt-1">
                Enter your Reference ID (e.g. <span className="font-mono font-semibold">VC-2026-XXXX</span>) or your phone number to see live status.
              </p>
            </div>

            <form onSubmit={handleLookupSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={lookupQuery}
                  onChange={(e) => setLookupQuery(e.target.value)}
                  placeholder="e.g. VC-2026-AB12 or 9876543210"
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-coffee-200 text-sm focus:outline-none focus:border-burgundy-600 bg-cream-50/50"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="px-6 py-3 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white font-bold text-xs sm:text-sm shadow-sm transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>Check</span>
              </button>
            </form>

            {lookupError && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">No records found</p>
                  <p className="mt-0.5">{lookupError}</p>
                </div>
              </div>
            )}

            {lookupResults && lookupResults.length > 0 && (
              <div className="space-y-4 pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
                  Found {lookupResults.length} booking record(s):
                </p>

                {lookupResults.map((res) => (
                  <div
                    key={res._id || res.id}
                    className="p-5 rounded-2xl border border-coffee-200 bg-cream-50/60 shadow-sm space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-coffee-100 pb-3">
                      <div>
                        <span className="font-mono text-sm font-bold text-charcoal-900">
                          {res.referenceId}
                        </span>
                        <p className="text-xs text-charcoal-600">Reserved for {res.fullName}</p>
                      </div>
                      <div>{getStatusBadge(res.status)}</div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-charcoal-700">
                      <div>
                        <span className="text-charcoal-500 block">Date</span>
                        <span className="font-semibold">{res.date}</span>
                      </div>
                      <div>
                        <span className="text-charcoal-500 block">Time</span>
                        <span className="font-semibold">{res.time}</span>
                      </div>
                      <div>
                        <span className="text-charcoal-500 block">Party Size</span>
                        <span className="font-semibold">{res.guests} Guests</span>
                      </div>
                      <div>
                        <span className="text-charcoal-500 block">Contact Phone</span>
                        <span className="font-semibold">{res.phone}</span>
                      </div>
                    </div>

                    {res.notes && (
                      <div className="p-3 bg-white rounded-xl border border-coffee-100 text-xs text-charcoal-700">
                        <span className="font-semibold text-burgundy-700 block">Note from Cafe Host:</span>
                        <p className="mt-0.5 italic">{res.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
