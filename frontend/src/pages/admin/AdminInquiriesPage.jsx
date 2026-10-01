import React, { useState, useEffect } from 'react';
import {
  Mail,
  Trash2,
  CheckCircle2,
  Circle,
  Loader2,
  Inbox,
  RefreshCw,
  User,
  Phone,
} from 'lucide-react';
import api from '../../services/api';
import { Toast } from '../../components/common/Toast';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export const AdminInquiriesPage = () => {
  const [inquiries, setInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, inquiry: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchInquiries = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/inquiries');
      if (res.data.success) {
        setInquiries(res.data.data || []);
      }
    } catch (err) {
      setToast({ message: 'Failed to load inquiries', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleMarkRead = async (inquiry) => {
    if (inquiry.isRead) return;
    try {
      const id = inquiry._id || inquiry.id;
      const res = await api.patch(`/inquiries/${id}/read`);
      if (res.data.success) {
        setInquiries((prev) =>
          prev.map((i) => (i._id === id || i.id === id ? { ...i, isRead: true } : i))
        );
      }
    } catch {
      setToast({ message: 'Could not mark as read', type: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm.inquiry) return;
    try {
      setIsDeleting(true);
      const id = deleteConfirm.inquiry._id || deleteConfirm.inquiry.id;
      const res = await api.delete(`/inquiries/${id}`);
      if (res.data.success) {
        setToast({ message: 'Inquiry deleted', type: 'success' });
        setDeleteConfirm({ isOpen: false, inquiry: null });
        fetchInquiries();
      }
    } catch {
      setToast({ message: 'Failed to delete inquiry', type: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  const unreadCount = inquiries.filter((i) => !i.isRead).length;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-coffee-200/80 shadow-warm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-burgundy-700 bg-burgundy-50 px-3 py-1 rounded-full border border-burgundy-200 inline-block mb-1">
            Customer Messages
          </span>
          <h2 className="font-serif text-2xl font-bold text-charcoal-900 flex items-center gap-2">
            Contact Inquiries
            {unreadCount > 0 && (
              <span className="text-sm font-bold bg-burgundy-700 text-white px-2.5 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </h2>
          <p className="text-xs text-charcoal-500">
            Messages submitted through the contact page on your website.
          </p>
        </div>
        <button
          onClick={fetchInquiries}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-coffee-300 text-charcoal-800 hover:bg-coffee-50 text-xs font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* Inquiries List */}
      {isLoading ? (
        <div className="py-24 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-burgundy-700" />
        </div>
      ) : inquiries.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-coffee-200">
          <Inbox className="w-12 h-12 text-coffee-300 mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-charcoal-900 mb-1">No inquiries yet</h3>
          <p className="text-xs text-charcoal-500">
            When customers fill in the contact form on your website, their messages will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq) => {
            const id = inq._id || inq.id;
            return (
              <div
                key={id}
                className={`bg-white rounded-2xl p-5 border shadow-warm transition-all ${
                  inq.isRead
                    ? 'border-coffee-200 opacity-80'
                    : 'border-burgundy-300 ring-1 ring-burgundy-200'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Read indicator */}
                    <button
                      onClick={() => handleMarkRead(inq)}
                      title={inq.isRead ? 'Already read' : 'Mark as read'}
                      className="mt-0.5 shrink-0"
                    >
                      {inq.isRead ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-burgundy-500 fill-burgundy-100" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-1">
                        <span className="flex items-center gap-1.5 font-bold text-sm text-charcoal-900">
                          <User className="w-3.5 h-3.5 text-coffee-600" />
                          {inq.name}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-charcoal-600">
                          <Phone className="w-3 h-3 text-coffee-500" />
                          {inq.contact}
                        </span>
                        {!inq.isRead && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-burgundy-700 bg-burgundy-50 px-2 py-0.5 rounded-full border border-burgundy-200">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-charcoal-700 leading-relaxed whitespace-pre-line">
                        {inq.message}
                      </p>
                      <p className="text-[11px] text-charcoal-400 mt-2 font-mono">
                        {formatDate(inq.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {!inq.isRead && (
                      <button
                        onClick={() => handleMarkRead(inq)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                      >
                        Mark Read
                      </button>
                    )}
                    <button
                      onClick={() => setDeleteConfirm({ isOpen: true, inquiry: inq })}
                      className="p-1.5 rounded-lg text-charcoal-500 hover:text-red-700 hover:bg-red-50"
                      title="Delete inquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Inquiry?"
        message="Are you sure you want to permanently delete this customer inquiry?"
        confirmText="Yes, Delete"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, inquiry: null })}
      />
    </div>
  );
};
