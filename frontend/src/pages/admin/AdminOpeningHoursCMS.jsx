import React, { useState, useEffect } from 'react';
import { Clock, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { Toast } from '../../components/common/Toast';
import { useSettings } from '../../context/SettingsContext';
import { OpenStatusBadge } from '../../components/common/OpenStatusBadge';

export const AdminOpeningHoursCMS = () => {
  const { refreshSettings } = useSettings();
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchHours = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/settings/hours');
        if (res.data.success) {
          setFormData(res.data.data);
        }
      } catch (err) {
        setToast({ message: 'Failed to load opening hours', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchHours();
  }, []);

  const handleDayChange = (index, field, value) => {
    const updatedDays = [...formData.days];
    updatedDays[index] = {
      ...updatedDays[index],
      [field]: value,
    };
    setFormData({ ...formData, days: updatedDays });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const res = await api.put('/settings/hours', formData);
      if (res.data.success) {
        setToast({ message: 'Opening hours updated successfully!', type: 'success' });
        refreshSettings();
      }
    } catch (err) {
      setToast({ message: 'Failed to save opening hours', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !formData) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-burgundy-700" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-coffee-200/80 shadow-warm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-burgundy-700 bg-burgundy-50 px-3 py-1 rounded-full border border-burgundy-200 inline-block mb-1">
            Store Operations
          </span>
          <h2 className="font-serif text-2xl font-bold text-charcoal-900">
            Opening Hours CMS
          </h2>
          <p className="text-xs text-charcoal-500">
            Define daily operating hours. Powers the real-time "OPEN NOW" / "CLOSED" badge on the site.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <OpenStatusBadge />
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 shrink-0 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Hours</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-coffee-200/80 shadow-warm space-y-6">
        
        {/* Summary note */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
            Public Hours Summary Tagline
          </label>
          <input
            type="text"
            value={formData.summary || ''}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            placeholder="e.g. Open Daily: 8:30 AM – 10:00 PM"
            className="w-full px-3.5 py-2.5 rounded-xl border border-coffee-200 text-sm bg-cream-50/50"
          />
        </div>

        {/* Days Table */}
        <div className="border border-coffee-200 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-cream-100 text-charcoal-700 uppercase tracking-wider text-[11px] font-bold border-b border-coffee-200">
              <tr>
                <th className="py-3 px-4">Day</th>
                <th className="py-3 px-4">Operating Status</th>
                <th className="py-3 px-4">Opening Time</th>
                <th className="py-3 px-4">Closing Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-coffee-100">
              {(formData.days || []).map((d, index) => (
                <tr key={d.day} className="hover:bg-cream-50/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-charcoal-900">
                    {d.day}
                  </td>
                  
                  {/* Status Toggle */}
                  <td className="py-3 px-4">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={d.isOpen}
                        onChange={(e) => handleDayChange(index, 'isOpen', e.target.checked)}
                        className="w-4 h-4 text-burgundy-700 rounded"
                      />
                      <span className={`text-xs font-semibold ${d.isOpen ? 'text-emerald-700' : 'text-amber-800'}`}>
                        {d.isOpen ? 'Open' : 'Closed'}
                      </span>
                    </label>
                  </td>

                  {/* Open Time */}
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      disabled={!d.isOpen}
                      value={d.openTime}
                      onChange={(e) => handleDayChange(index, 'openTime', e.target.value)}
                      placeholder="08:30 AM"
                      className="px-3 py-1.5 text-xs rounded-lg border border-coffee-200 disabled:bg-gray-100 disabled:text-gray-400 font-mono w-28"
                    />
                  </td>

                  {/* Close Time */}
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      disabled={!d.isOpen}
                      value={d.closeTime}
                      onChange={(e) => handleDayChange(index, 'closeTime', e.target.value)}
                      placeholder="10:00 PM"
                      className="px-3 py-1.5 text-xs rounded-lg border border-coffee-200 disabled:bg-gray-100 disabled:text-gray-400 font-mono w-28"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3 rounded-2xl bg-burgundy-700 hover:bg-burgundy-800 text-white font-bold text-xs shadow-warm transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save All Opening Hours</span>
          </button>
        </div>

      </form>
    </div>
  );
};
