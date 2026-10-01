import React, { useState, useEffect } from 'react';
import { Save, Loader2, MapPin, Phone, Mail, Compass, Instagram, Facebook } from 'lucide-react';
import api from '../../services/api';
import { Toast } from '../../components/common/Toast';
import { useSettings } from '../../context/SettingsContext';

export const AdminContactCMS = () => {
  const { refreshSettings } = useSettings();
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/settings/contact');
        if (res.data.success) {
          setFormData(res.data.data);
        }
      } catch (err) {
        setToast({ message: 'Failed to load contact information', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchContact();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const res = await api.put('/settings/contact', formData);
      if (res.data.success) {
        setToast({ message: 'Contact settings updated successfully!', type: 'success' });
        refreshSettings();
      }
    } catch (err) {
      setToast({ message: 'Failed to update contact settings', type: 'error' });
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

      <div className="bg-white p-6 rounded-3xl border border-coffee-200/80 shadow-warm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-burgundy-700 bg-burgundy-50 px-3 py-1 rounded-full border border-burgundy-200 inline-block mb-1">
            Site Info
          </span>
          <h2 className="font-serif text-2xl font-bold text-charcoal-900">
            Contact & Location Settings
          </h2>
          <p className="text-xs text-charcoal-500">
            Update café address, telephone, email, and social media presence.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 shrink-0 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Contact Settings</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-coffee-200/80 shadow-warm space-y-6">
        
        {/* Basic Brand / Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
              Café Name *
            </label>
            <input
              type="text"
              required
              value={formData.cafeName || ''}
              onChange={(e) => setFormData({ ...formData, cafeName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-coffee-200 text-sm focus:outline-none focus:border-burgundy-600 bg-cream-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
              Primary Phone Number *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-coffee-200 text-sm focus:outline-none focus:border-burgundy-600 bg-cream-50/50"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
              Secondary / WhatsApp Phone
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={formData.secondaryPhone || ''}
                onChange={(e) => setFormData({ ...formData, secondaryPhone: e.target.value })}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-coffee-200 text-sm bg-cream-50/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
              Contact Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-coffee-200 text-sm bg-cream-50/50"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
            Physical Address
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
            <textarea
              rows={2}
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-coffee-200 text-sm bg-cream-50/50"
            ></textarea>
          </div>
        </div>

        {/* Links */}
        <div className="border-t border-coffee-100 pt-5 space-y-4">
          <h4 className="font-serif font-bold text-sm text-charcoal-900">
            Map & Social Profiles
          </h4>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1">
              Google Maps Web URL / Link
            </label>
            <div className="relative">
              <Compass className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={formData.googleMapsUrl || ''}
                onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
                placeholder="https://maps.google.com/?q=Curtorim+Goa"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-coffee-200 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1">
                Instagram URL
              </label>
              <div className="relative">
                <Instagram className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.instagramUrl || ''}
                  onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                  placeholder="https://instagram.com/villagecafe_goa"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-coffee-200 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1">
                Facebook URL
              </label>
              <div className="relative">
                <Facebook className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.facebookUrl || ''}
                  onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                  placeholder="https://facebook.com/villagecafegoa"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-coffee-200 text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3 rounded-2xl bg-burgundy-700 hover:bg-burgundy-800 text-white font-bold text-xs shadow-warm transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Contact Settings</span>
          </button>
        </div>

      </form>
    </div>
  );
};
