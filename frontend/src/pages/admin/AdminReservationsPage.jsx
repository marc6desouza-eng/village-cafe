import React, { useState, useEffect, useMemo } from 'react';
import {
  CalendarCheck,
  Search,
  CheckCircle,
  XCircle,
  CheckCheck,
  Trash2,
  Clock,
  MessageSquare,
  Users,
  Phone,
  Mail,
  Loader2,
  Calendar,
  Filter,
} from 'lucide-react';
import api from '../../services/api';
import { Toast } from '../../components/common/Toast';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

const STATUS_OPTIONS = ['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];

export const AdminReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected reservation for viewing details or editing notes
  const [selectedRes, setSelectedRes] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [isUpdatingNotes, setIsUpdatingNotes] = useState(false);

  // Delete Dialog
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, res: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchReservations = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/reservations');
      if (res.data.success) {
        setReservations(res.data.data || []);
      }
    } catch (err) {
      setToast({ message: 'Failed to fetch reservations', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await api.patch(`/reservations/${id}/status`, { status: newStatus });
      if (res.data.success) {
        setToast({ message: `Reservation updated to ${newStatus}`, type: 'success' });
        fetchReservations();
        if (selectedRes && (selectedRes._id === id || selectedRes.id === id)) {
          setSelectedRes(res.data.data);
        }
      }
    } catch (err) {
      setToast({ message: 'Failed to update reservation status', type: 'error' });
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedRes) return;
    try {
      setIsUpdatingNotes(true);
      const id = selectedRes._id || selectedRes.id;
      const res = await api.patch(`/reservations/${id}/status`, { notes: noteText });
      if (res.data.success) {
        setToast({ message: 'Manager notes saved', type: 'success' });
        setSelectedRes(res.data.data);
        fetchReservations();
      }
    } catch (err) {
      setToast({ message: 'Failed to update notes', type: 'error' });
    } finally {
      setIsUpdatingNotes(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm.res) return;
    try {
      setIsDeleting(true);
      const id = deleteConfirm.res._id || deleteConfirm.res.id;
      const res = await api.delete(`/reservations/${id}`);
      if (res.data.success) {
        setToast({ message: 'Reservation deleted', type: 'success' });
        setDeleteConfirm({ isOpen: false, res: null });
        if (selectedRes && (selectedRes._id === id || selectedRes.id === id)) {
          setSelectedRes(null);
        }
        fetchReservations();
      }
    } catch (err) {
      setToast({ message: 'Failed to delete reservation', type: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredReservations = useMemo(() => {
    return reservations.filter((r) => {
      if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
      if (dateFilter && r.date !== dateFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = r.fullName?.toLowerCase().includes(q);
        const matchPhone = r.phone?.toLowerCase().includes(q);
        const matchRef = r.referenceId?.toLowerCase().includes(q);
        const matchEmail = r.email?.toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchRef && !matchEmail) return false;
      }
      return true;
    });
  }, [reservations, statusFilter, dateFilter, searchQuery]);

  const openDetailsModal = (res) => {
    setSelectedRes(res);
    setNoteText(res.notes || '');
  };

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-coffee-200/80 shadow-warm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-burgundy-700 bg-burgundy-50 px-3 py-1 rounded-full border border-burgundy-200 inline-block mb-1">
            Table Hospitality
          </span>
          <h2 className="font-serif text-2xl font-bold text-charcoal-900">
            Guest Reservations Management
          </h2>
          <p className="text-xs text-charcoal-500">
            View booking inquiries, update table confirmation statuses, and record manager notes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-charcoal-600 bg-cream-100 px-3 py-1.5 rounded-xl border border-coffee-200">
            Total Logged: {reservations.length}
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-coffee-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar">
          {STATUS_OPTIONS.map((status) => {
            const count =
              status === 'ALL'
                ? reservations.length
                : reservations.filter((r) => r.status === status).length;

            return (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  statusFilter === status
                    ? 'bg-burgundy-700 text-white shadow-sm'
                    : 'bg-cream-50 text-charcoal-700 hover:bg-cream-100 border border-coffee-100'
                }`}
              >
                {status} ({count})
              </button>
            );
          })}
        </div>

        {/* Date & Search */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <div className="relative">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-coffee-200 bg-cream-50/50"
            />
            {dateFilter && (
              <button
                onClick={() => setDateFilter('')}
                className="ml-1 text-[11px] text-red-600 font-semibold hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, phone, ref ID..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-coffee-200 bg-cream-50/50 focus:outline-none focus:border-burgundy-600"
            />
          </div>
        </div>

      </div>

      {/* Reservations Table */}
      <div className="bg-white rounded-3xl border border-coffee-200/80 shadow-warm overflow-hidden">
        {isLoading ? (
          <div className="py-24 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-burgundy-700" />
          </div>
        ) : filteredReservations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-cream-100 text-charcoal-700 uppercase tracking-wider text-[11px] font-bold border-b border-coffee-200">
                <tr>
                  <th className="py-3.5 px-4">Ref ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Guests</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Notes</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-coffee-100">
                {filteredReservations.map((r) => (
                  <tr
                    key={r._id || r.id}
                    className="hover:bg-cream-50/60 transition-colors cursor-pointer"
                    onClick={() => openDetailsModal(r)}
                  >
                    {/* Ref ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-charcoal-800">
                      {r.referenceId}
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-semibold text-charcoal-900">{r.fullName}</p>
                        <p className="text-xs text-charcoal-500">{r.phone}</p>
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-medium text-charcoal-800">
                        <span>{r.date}</span>
                        <span className="text-coffee-600 font-bold">•</span>
                        <span>{r.time}</span>
                      </div>
                    </td>

                    {/* Guests */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 font-semibold text-charcoal-800">
                        <Users className="w-3.5 h-3.5 text-coffee-600" />
                        <span>{r.guests}</span>
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            r.status === 'CONFIRMED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : r.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-800'
                              : r.status === 'CANCELLED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-charcoal-100 text-charcoal-800'
                          }`}
                        >
                          {r.status}
                        </span>
                      </div>
                    </td>

                    {/* Notes preview */}
                    <td className="py-3.5 px-4 text-xs text-charcoal-500 max-w-xs truncate">
                      {r.notes || r.specialRequest || '—'}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {r.status === 'PENDING' && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(r._id || r.id, 'CONFIRMED')}
                            className="px-2 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-sm"
                            title="Confirm Booking"
                          >
                            Confirm
                          </button>
                        )}
                        {r.status === 'CONFIRMED' && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(r._id || r.id, 'COMPLETED')}
                            className="px-2 py-1 bg-charcoal-800 hover:bg-charcoal-900 text-white rounded-lg text-xs font-semibold shadow-sm"
                            title="Mark as Completed"
                          >
                            Complete
                          </button>
                        )}
                        {r.status !== 'CANCELLED' && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(r._id || r.id, 'CANCELLED')}
                            className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-xs font-semibold"
                            title="Cancel Booking"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setDeleteConfirm({ isOpen: true, res: r })}
                          className="p-1.5 text-charcoal-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-20 text-center text-charcoal-500">
            <CalendarCheck className="w-12 h-12 text-coffee-300 mx-auto mb-2" />
            <p className="font-semibold text-charcoal-800">No reservations match the filter</p>
            <p className="text-xs text-charcoal-500 mt-1">Check another status or clear filters</p>
          </div>
        )}
      </div>

      {/* Details & Notes Modal */}
      {selectedRes && (
        <Modal
          isOpen={Boolean(selectedRes)}
          onClose={() => setSelectedRes(null)}
          title={`Booking Details: ${selectedRes.referenceId}`}
        >
          <div className="space-y-5">
            
            {/* Summary Grid */}
            <div className="grid grid-cols-2 gap-4 bg-cream-50 p-4 rounded-2xl border border-coffee-200 text-xs">
              <div>
                <span className="text-charcoal-500 block">Customer Name</span>
                <span className="font-bold text-sm text-charcoal-900">{selectedRes.fullName}</span>
              </div>
              <div>
                <span className="text-charcoal-500 block">Phone</span>
                <a href={`tel:${selectedRes.phone}`} className="font-bold text-sm text-burgundy-700 hover:underline">
                  {selectedRes.phone}
                </a>
              </div>
              <div>
                <span className="text-charcoal-500 block">Date & Time</span>
                <span className="font-semibold text-charcoal-800">
                  {selectedRes.date} at {selectedRes.time}
                </span>
              </div>
              <div>
                <span className="text-charcoal-500 block">Party Size</span>
                <span className="font-semibold text-charcoal-800">{selectedRes.guests} Guests</span>
              </div>
              {selectedRes.email && (
                <div className="col-span-2">
                  <span className="text-charcoal-500 block">Email</span>
                  <span className="font-medium text-charcoal-800">{selectedRes.email}</span>
                </div>
              )}
            </div>

            {/* Special Request */}
            {selectedRes.specialRequest && (
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs">
                <span className="font-bold text-amber-900 block mb-1">Customer Special Request:</span>
                <p className="text-amber-800 italic">"{selectedRes.specialRequest}"</p>
              </div>
            )}

            {/* Status change buttons */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-700 block mb-2">
                Update Status
              </span>
              <div className="flex flex-wrap gap-2">
                {['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStatusChange(selectedRes._id || selectedRes.id, st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedRes.status === st
                        ? 'bg-burgundy-700 text-white shadow-sm'
                        : 'bg-cream-100 text-charcoal-800 hover:bg-cream-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Internal Manager Notes */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700">
                Internal Manager Notes / Table Assignment
              </label>
              <textarea
                rows={3}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="e.g. Table 4 reserved by window, cake candle requested..."
                className="w-full px-3 py-2 rounded-xl border border-coffee-200 text-xs"
              ></textarea>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={isUpdatingNotes}
                  className="px-4 py-1.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-bold"
                >
                  {isUpdatingNotes ? 'Saving...' : 'Save Note'}
                </button>
              </div>
            </div>

          </div>
        </Modal>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title={`Delete Reservation for ${deleteConfirm.res?.fullName}?`}
        message="Are you sure you want to permanently delete this reservation record from the database?"
        confirmText="Yes, Delete Record"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, res: null })}
      />
    </div>
  );
};
