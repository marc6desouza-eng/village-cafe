import React, { useState, useEffect } from 'react';
import { Settings, Save, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { Toast } from '../../components/common/Toast';
import { useSettings } from '../../context/SettingsContext';
import { ImageUploader } from '../../components/common/ImageUploader';

export const AdminSettingsCMS = () => {
  const { refreshSettings } = useSettings();
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/settings/site');
        if (res.data.success) {
          setFormData(res.data.data);
        }
      } catch (err) {
        setToast({ message: 'Failed to load site settings', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const res = await api.put('/settings/site', formData);
      if (res.data.success) {
        setToast({ message: 'Site metadata & branding updated!', type: 'success' });
        refreshSettings();
      }
    } catch (err) {
      setToast({ message: 'Failed to update settings', type: 'error' });
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
            Global Configuration
          </span>
          <h2 className="font-serif text-2xl font-bold text-charcoal-900">
            Site Branding & SEO Settings
          </h2>
          <p className="text-xs text-charcoal-500">
            Control browser title, meta description, brand logo, and social preview assets.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 shrink-0 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Settings</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-coffee-200/80 shadow-warm space-y-6">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
              Website Title *
            </label>
            <input
              type="text"
              required
              value={formData.siteTitle || ''}
              onChange={(e) => setFormData({ ...formData, siteTitle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-coffee-200 text-sm focus:outline-none focus:border-burgundy-600 bg-cream-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
              Brand Tagline
            </label>
            <input
              type="text"
              value={formData.tagline || ''}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-coffee-200 text-sm bg-cream-50/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
            Meta Description (Search Engines & SEO)
          </label>
          <textarea
            rows={3}
            value={formData.metaDescription || ''}
            onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-coffee-200 text-sm bg-cream-50/50"
          ></textarea>
        </div>

        {/* Logo and Default Image */}
        <div className="border-t border-coffee-100 pt-5 space-y-5">
          <ImageUploader
            label="Default Social Share / OpenGraph Image"
            value={formData.defaultSeoImage || ''}
            onChange={(url) => setFormData({ ...formData, defaultSeoImage: url })}
            helpText="Displayed when your website is shared on WhatsApp, Facebook, or iMessage."
          />
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3 rounded-2xl bg-burgundy-700 hover:bg-burgundy-800 text-white font-bold text-xs shadow-warm transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save All Settings</span>
          </button>
        </div>

      </form>
    </div>
  );
};
