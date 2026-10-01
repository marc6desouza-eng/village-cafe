import React, { useState, useEffect } from 'react';
import { Save, Sparkles, Loader2, ArrowLeft, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Toast } from '../../components/common/Toast';
import { ImageUploader } from '../../components/common/ImageUploader';

export const AdminHomepageCMS = () => {
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/content/homepage');
        if (res.data.success && res.data.data) {
          setFormData(res.data.data);
        }
      } catch (err) {
        setToast({ message: 'Failed to load homepage content', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const res = await api.put('/content/homepage', formData);
      if (res.data.success) {
        setToast({ message: 'Homepage content successfully updated!', type: 'success' });
      }
    } catch (err) {
      setToast({ message: 'Failed to update homepage content', type: 'error' });
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
    <div className="space-y-6 max-w-5xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-coffee-200/80 shadow-warm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-burgundy-700 bg-burgundy-50 px-3 py-1 rounded-full border border-burgundy-200 inline-block mb-1.5">
            CMS Editor
          </span>
          <h2 className="font-serif text-2xl font-bold text-charcoal-900">
            Homepage Content Management
          </h2>
          <p className="text-xs text-charcoal-500">
            Edit text, headings, and imagery. Changes will reflect instantly on the public website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl border border-coffee-300 text-charcoal-800 hover:bg-coffee-50 text-xs font-semibold flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Homepage</span>
          </Link>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save All Changes</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* 1. HERO SECTION */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-coffee-200/80 shadow-warm space-y-6">
          <div className="border-b border-coffee-100 pb-3">
            <h3 className="font-serif text-lg font-bold text-charcoal-900">
              1. Hero Section
            </h3>
            <p className="text-xs text-charcoal-500">
              The main visual banner visitors see when entering the site.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Hero Main Title *
              </label>
              <input
                type="text"
                required
                value={formData.hero?.title || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, title: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-coffee-200 text-sm focus:outline-none focus:border-burgundy-600 bg-cream-50/50 font-serif"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Hero Subtitle / Crest Badge
              </label>
              <input
                type="text"
                value={formData.hero?.subtitle || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, subtitle: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-coffee-200 text-sm focus:outline-none focus:border-burgundy-600 bg-cream-50/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
              Hero Supporting Description
            </label>
            <textarea
              rows={3}
              value={formData.hero?.description || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  hero: { ...formData.hero, description: e.target.value },
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-coffee-200 text-sm focus:outline-none focus:border-burgundy-600 bg-cream-50/50"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Primary Button Label
              </label>
              <input
                type="text"
                value={formData.hero?.primaryButtonText || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, primaryButtonText: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-coffee-200 text-sm focus:outline-none focus:border-burgundy-600 bg-cream-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Secondary Button Label
              </label>
              <input
                type="text"
                value={formData.hero?.secondaryButtonText || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, secondaryButtonText: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-coffee-200 text-sm focus:outline-none focus:border-burgundy-600 bg-cream-50/50"
              />
            </div>
          </div>

          {/* Hero Image */}
          <div>
            <ImageUploader
              label="Hero Background Image"
              value={formData.hero?.imageUrl || ''}
              onChange={(url) =>
                setFormData({
                  ...formData,
                  hero: { ...formData.hero, imageUrl: url },
                })
              }
              helpText="Select a high-resolution cafe photo (e.g. Carmel View exterior or ambient seating)."
            />
          </div>
        </div>

        {/* 2. INTRODUCTION SECTION */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-coffee-200/80 shadow-warm space-y-6">
          <div className="border-b border-coffee-100 pb-3">
            <h3 className="font-serif text-lg font-bold text-charcoal-900">
              2. Welcome & Introduction Section
            </h3>
            <p className="text-xs text-charcoal-500">
              Introduces Village Cafe and your baking ethos to new visitors.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Introduction Title
              </label>
              <input
                type="text"
                value={formData.intro?.title || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    intro: { ...formData.intro, title: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-coffee-200 text-sm focus:outline-none focus:border-burgundy-600 bg-cream-50/50 font-serif"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Button Label
              </label>
              <input
                type="text"
                value={formData.intro?.buttonText || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    intro: { ...formData.intro, buttonText: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-coffee-200 text-sm focus:outline-none focus:border-burgundy-600 bg-cream-50/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
              Introduction Narrative Text
            </label>
            <textarea
              rows={4}
              value={formData.intro?.description || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  intro: { ...formData.intro, description: e.target.value },
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-coffee-200 text-sm focus:outline-none focus:border-burgundy-600 bg-cream-50/50"
            ></textarea>
          </div>

          <div>
            <ImageUploader
              label="Introduction Feature Image"
              value={formData.intro?.imageUrl || ''}
              onChange={(url) =>
                setFormData({
                  ...formData,
                  intro: { ...formData.intro, imageUrl: url },
                })
              }
            />
          </div>
        </div>

        {/* 3. SECTION HEADINGS (Featured, Bakery, Our Space) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-coffee-200/80 shadow-warm space-y-6">
          <div className="border-b border-coffee-100 pb-3">
            <h3 className="font-serif text-lg font-bold text-charcoal-900">
              3. Section Headings & Copy
            </h3>
            <p className="text-xs text-charcoal-500">
              Customize the section headers displayed across the homepage.
            </p>
          </div>

          {/* Featured Menu Heading */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-4 rounded-2xl bg-cream-50 border border-coffee-200">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Featured Menu Section Title
              </label>
              <input
                type="text"
                value={formData.featured?.title || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    featured: { ...formData.featured, title: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl border border-coffee-200 text-sm bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Featured Subtext
              </label>
              <input
                type="text"
                value={formData.featured?.description || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    featured: { ...formData.featured, description: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl border border-coffee-200 text-sm bg-white"
              />
            </div>
          </div>

          {/* Bakery Section Heading */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-4 rounded-2xl bg-cream-50 border border-coffee-200">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Bakery Section Title
              </label>
              <input
                type="text"
                value={formData.bakery?.title || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bakery: { ...formData.bakery, title: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl border border-coffee-200 text-sm bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Bakery Subtext
              </label>
              <input
                type="text"
                value={formData.bakery?.description || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bakery: { ...formData.bakery, description: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl border border-coffee-200 text-sm bg-white"
              />
            </div>
          </div>

          {/* Our Space Heading */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-4 rounded-2xl bg-cream-50 border border-coffee-200">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Our Space Section Title
              </label>
              <input
                type="text"
                value={formData.ourSpace?.title || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ourSpace: { ...formData.ourSpace, title: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl border border-coffee-200 text-sm bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Our Space Subtext
              </label>
              <input
                type="text"
                value={formData.ourSpace?.description || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ourSpace: { ...formData.ourSpace, description: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl border border-coffee-200 text-sm bg-white"
              />
            </div>
          </div>
        </div>

        {/* 4. RESERVATION CALL TO ACTION */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-coffee-200/80 shadow-warm space-y-6">
          <div className="border-b border-coffee-100 pb-3">
            <h3 className="font-serif text-lg font-bold text-charcoal-900">
              4. Reservation CTA Box
            </h3>
            <p className="text-xs text-charcoal-500">
              The high-conversion call-to-action banner inviting guests to reserve.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
                CTA Title
              </label>
              <input
                type="text"
                value={formData.reservationCta?.title || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    reservationCta: { ...formData.reservationCta, title: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-coffee-200 text-sm font-serif"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Button Text
              </label>
              <input
                type="text"
                value={formData.reservationCta?.buttonText || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    reservationCta: { ...formData.reservationCta, buttonText: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-coffee-200 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
              CTA Description
            </label>
            <textarea
              rows={2}
              value={formData.reservationCta?.description || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  reservationCta: { ...formData.reservationCta, description: e.target.value },
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-coffee-200 text-sm"
            ></textarea>
          </div>

          <div>
            <ImageUploader
              label="Reservation Banner Image"
              value={formData.reservationCta?.imageUrl || ''}
              onChange={(url) =>
                setFormData({
                  ...formData,
                  reservationCta: { ...formData.reservationCta, imageUrl: url },
                })
              }
            />
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="flex justify-end pt-2 pb-6">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3.5 rounded-2xl bg-burgundy-700 hover:bg-burgundy-800 text-white font-bold text-sm shadow-warm hover:shadow-warm-xl transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            <span>Save All Homepage Content</span>
          </button>
        </div>

      </form>
    </div>
  );
};
