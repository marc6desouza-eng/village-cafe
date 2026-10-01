import React, { useState, useEffect } from 'react';
import { Save, Loader2, Plus, Trash2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Toast } from '../../components/common/Toast';
import { ImageUploader } from '../../components/common/ImageUploader';

export const AdminAboutCMS = () => {
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/content/about');
        if (res.data.success && res.data.data) {
          setFormData(res.data.data);
        }
      } catch (err) {
        setToast({ message: 'Failed to load about content', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchAbout();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const res = await api.put('/content/about', formData);
      if (res.data.success) {
        setToast({ message: 'About page content updated successfully!', type: 'success' });
      }
    } catch (err) {
      setToast({ message: 'Failed to update about content', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const addPoint = () => {
    const points = [...(formData.philosophy?.points || []), 'New Philosophy Value'];
    setFormData({
      ...formData,
      philosophy: { ...formData.philosophy, points },
    });
  };

  const removePoint = (index) => {
    const points = (formData.philosophy?.points || []).filter((_, idx) => idx !== index);
    setFormData({
      ...formData,
      philosophy: { ...formData.philosophy, points },
    });
  };

  const updatePoint = (index, value) => {
    const points = [...(formData.philosophy?.points || [])];
    points[index] = value;
    setFormData({
      ...formData,
      philosophy: { ...formData.philosophy, points },
    });
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
            About & Story Content Management
          </h2>
          <p className="text-xs text-charcoal-500">
            Manage your café's story, values, freshness standards, and bakery presentation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/about"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl border border-coffee-300 text-charcoal-800 hover:bg-coffee-50 text-xs font-semibold flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View About Page</span>
          </Link>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save About Page</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Story Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-coffee-200/80 shadow-warm space-y-5">
          <h3 className="font-serif text-lg font-bold text-charcoal-900 border-b border-coffee-100 pb-3">
            Our Story & Origin
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Story Title
              </label>
              <input
                type="text"
                value={formData.story?.title || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    story: { ...formData.story, title: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-coffee-200 text-sm font-serif"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Subtitle Tag
              </label>
              <input
                type="text"
                value={formData.story?.subtitle || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    story: { ...formData.story, subtitle: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-coffee-200 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
              Story Paragraphs (separate paragraphs with a blank line)
            </label>
            <textarea
              rows={5}
              value={(formData.story?.paragraphs || []).join('\n\n')}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  story: {
                    ...formData.story,
                    paragraphs: e.target.value.split('\n\n').filter(Boolean),
                  },
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-coffee-200 text-sm leading-relaxed"
            ></textarea>
          </div>

          <div>
            <ImageUploader
              label="Story Feature Image"
              value={formData.story?.imageUrl || ''}
              onChange={(url) =>
                setFormData({
                  ...formData,
                  story: { ...formData.story, imageUrl: url },
                })
              }
            />
          </div>
        </div>

        {/* Philosophy & Values */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-coffee-200/80 shadow-warm space-y-5">
          <div className="flex items-center justify-between border-b border-coffee-100 pb-3">
            <h3 className="font-serif text-lg font-bold text-charcoal-900">
              Our Philosophy & Values
            </h3>
            <button
              type="button"
              onClick={addPoint}
              className="text-xs font-bold text-burgundy-700 hover:text-burgundy-800 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Value
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Philosophy Heading
              </label>
              <input
                type="text"
                value={formData.philosophy?.title || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    philosophy: { ...formData.philosophy, title: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-coffee-200 text-sm font-serif"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Subtitle
              </label>
              <input
                type="text"
                value={formData.philosophy?.subtitle || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    philosophy: { ...formData.philosophy, subtitle: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-coffee-200 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
              Philosophy Statement
            </label>
            <textarea
              rows={3}
              value={formData.philosophy?.text || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  philosophy: { ...formData.philosophy, text: e.target.value },
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-coffee-200 text-sm"
            ></textarea>
          </div>

          {/* Bullet points */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700">
              Core Principles
            </label>
            {(formData.philosophy?.points || []).map((point, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={point}
                  onChange={(e) => updatePoint(idx, e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-coffee-200 text-xs sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => removePoint(idx)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Freshness, Bakery, and Cafe Experience */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Freshness */}
          <div className="bg-white rounded-3xl p-6 border border-coffee-200 shadow-warm space-y-4">
            <h4 className="font-serif font-bold text-base text-charcoal-900 border-b border-coffee-100 pb-2">
              Freshness
            </h4>
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">Title</label>
              <input
                type="text"
                value={formData.freshness?.title || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    freshness: { ...formData.freshness, title: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 rounded-lg border border-coffee-200 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">Description</label>
              <textarea
                rows={3}
                value={formData.freshness?.text || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    freshness: { ...formData.freshness, text: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 rounded-lg border border-coffee-200 text-xs"
              ></textarea>
            </div>
            <ImageUploader
              value={formData.freshness?.imageUrl || ''}
              onChange={(url) =>
                setFormData({
                  ...formData,
                  freshness: { ...formData.freshness, imageUrl: url },
                })
              }
            />
          </div>

          {/* Bakery */}
          <div className="bg-white rounded-3xl p-6 border border-coffee-200 shadow-warm space-y-4">
            <h4 className="font-serif font-bold text-base text-charcoal-900 border-b border-coffee-100 pb-2">
              The Bakery
            </h4>
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">Title</label>
              <input
                type="text"
                value={formData.bakery?.title || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bakery: { ...formData.bakery, title: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 rounded-lg border border-coffee-200 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">Description</label>
              <textarea
                rows={3}
                value={formData.bakery?.text || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bakery: { ...formData.bakery, text: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 rounded-lg border border-coffee-200 text-xs"
              ></textarea>
            </div>
            <ImageUploader
              value={formData.bakery?.imageUrl || ''}
              onChange={(url) =>
                setFormData({
                  ...formData,
                  bakery: { ...formData.bakery, imageUrl: url },
                })
              }
            />
          </div>

          {/* Experience */}
          <div className="bg-white rounded-3xl p-6 border border-coffee-200 shadow-warm space-y-4">
            <h4 className="font-serif font-bold text-base text-charcoal-900 border-b border-coffee-100 pb-2">
              Café Experience
            </h4>
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">Title</label>
              <input
                type="text"
                value={formData.experience?.title || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    experience: { ...formData.experience, title: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 rounded-lg border border-coffee-200 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">Description</label>
              <textarea
                rows={3}
                value={formData.experience?.text || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    experience: { ...formData.experience, text: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 rounded-lg border border-coffee-200 text-xs"
              ></textarea>
            </div>
            <ImageUploader
              value={formData.experience?.imageUrl || ''}
              onChange={(url) =>
                setFormData({
                  ...formData,
                  experience: { ...formData.experience, imageUrl: url },
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
            <span>Save All About Content</span>
          </button>
        </div>

      </form>
    </div>
  );
};
