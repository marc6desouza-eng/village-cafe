import React, { useState, useEffect } from 'react';
import {
  Upload,
  Plus,
  Trash2,
  Edit2,
  Image as ImageIcon,
  Sparkles,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Toast } from '../../components/common/Toast';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { ImageUploader } from '../../components/common/ImageUploader';

const CATEGORY_CHOICES = ['Café', 'Bakery', 'Food', 'Drinks', 'Ambience', 'Exterior'];

const EMPTY_IMAGE = {
  url: '',
  caption: '',
  altText: '',
  category: 'Ambience',
  isFeatured: false,
  displayOrder: 0,
};

export const AdminGalleryCMS = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [formData, setFormData] = useState(EMPTY_IMAGE);
  const [isSaving, setIsSaving] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, img: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchGallery = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/gallery');
      if (res.data.success) {
        setImages(res.data.data || []);
      }
    } catch (err) {
      setToast({ message: 'Failed to fetch gallery images', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const openAddModal = () => {
    setEditingImage(null);
    setFormData({
      ...EMPTY_IMAGE,
      displayOrder: images.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (img) => {
    setEditingImage(img);
    setFormData({
      url: img.url || img.imageUrl || '',
      caption: img.caption || '',
      altText: img.altText || '',
      category: img.category || 'Ambience',
      isFeatured: Boolean(img.isFeatured),
      displayOrder: img.displayOrder || 0,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.url) {
      setToast({ message: 'Please provide or upload an image', type: 'error' });
      return;
    }

    const payload = {
      url: formData.url,
      caption: formData.caption,
      altText: formData.altText,
      category: formData.category,
      isFeatured: formData.isFeatured,
      displayOrder: Number(formData.displayOrder) || 0,
    };

    try {
      setIsSaving(true);
      if (editingImage) {
        const id = editingImage._id || editingImage.id;
        const res = await api.put(`/gallery/${id}`, payload);
        if (res.data.success) {
          setToast({ message: 'Gallery photo updated!', type: 'success' });
          setIsModalOpen(false);
          fetchGallery();
        }
      } else {
        const res = await api.post('/gallery', payload);
        if (res.data.success) {
          setToast({ message: 'New photo added to gallery!', type: 'success' });
          setIsModalOpen(false);
          fetchGallery();
        }
      }
    } catch (err) {
      setToast({ message: 'Failed to save gallery image', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm.img) return;
    try {
      setIsDeleting(true);
      const id = deleteConfirm.img._id || deleteConfirm.img.id;
      const res = await api.delete(`/gallery/${id}`);
      if (res.data.success) {
        setToast({ message: 'Photo deleted from gallery', type: 'success' });
        setDeleteConfirm({ isOpen: false, img: null });
        fetchGallery();
      }
    } catch (err) {
      setToast({ message: 'Failed to delete photo', type: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-coffee-200/80 shadow-warm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-burgundy-700 bg-burgundy-50 px-3 py-1 rounded-full border border-burgundy-200 inline-block mb-1">
            Visual Media
          </span>
          <h2 className="font-serif text-2xl font-bold text-charcoal-900">
            Gallery Photo Management
          </h2>
          <p className="text-xs text-charcoal-500">
            Upload new photography, organize categories, and choose images featured on the homepage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/gallery"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl border border-coffee-300 text-charcoal-800 hover:bg-coffee-50 text-xs font-semibold flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Public Gallery</span>
          </Link>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white font-bold text-xs shadow-sm transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Photo</span>
          </button>
        </div>
      </div>

      {/* Photos Grid */}
      {isLoading ? (
        <div className="py-24 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-burgundy-700" />
        </div>
      ) : images.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((img) => (
            <div
              key={img._id || img.id}
              className="bg-white rounded-2xl overflow-hidden border border-coffee-200 shadow-warm flex flex-col group"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-cream-100">
                <img
                  src={img.url || img.imageUrl}
                  alt={img.altText || img.caption || 'Gallery photo'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-semibold">
                  {img.category}
                </div>
                {img.isFeatured && (
                  <div className="absolute top-2.5 right-2.5 bg-cafeYellow-500 text-charcoal-950 px-2 py-0.5 rounded text-[10px] font-bold shadow flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5" /> Featured
                  </div>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <p className="font-serif font-semibold text-sm text-charcoal-900 line-clamp-2">
                    {img.caption || 'No caption'}
                  </p>
                  {img.altText && (
                    <p className="text-[11px] text-charcoal-500 mt-1 line-clamp-1 italic">
                      Alt: {img.altText}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-coffee-100 flex items-center justify-between text-xs">
                  <span className="font-mono text-charcoal-400 text-[11px]">
                    Order #{img.displayOrder || 0}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(img)}
                      className="p-1.5 rounded-lg text-charcoal-600 hover:text-burgundy-700 hover:bg-cream-100"
                      title="Edit photo metadata"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm({ isOpen: true, img })}
                      className="p-1.5 rounded-lg text-charcoal-600 hover:text-red-700 hover:bg-red-50"
                      title="Delete photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-16 text-center border border-coffee-200">
          <ImageIcon className="w-12 h-12 text-coffee-300 mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-charcoal-900 mb-1">
            No gallery photos uploaded yet
          </h3>
          <p className="text-xs text-charcoal-500 mb-4">
            Upload cafe photos to showcase on the homepage and gallery page.
          </p>
          <button
            onClick={openAddModal}
            className="px-5 py-2.5 bg-burgundy-700 text-white rounded-xl text-xs font-semibold"
          >
            Upload Photo
          </button>
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingImage ? 'Edit Photo Details' : 'Add Photo to Gallery'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <ImageUploader
            label="Image File or URL *"
            value={formData.url}
            onChange={(url) => setFormData({ ...formData, url })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-coffee-200 text-sm bg-white"
              >
                {CATEGORY_CHOICES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1">
                Display Order
              </label>
              <input
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-coffee-200 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1">
              Caption
            </label>
            <input
              type="text"
              value={formData.caption}
              onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
              placeholder="e.g. Modern illuminated pastry counter with fresh treats"
              className="w-full px-3 py-2 rounded-xl border border-coffee-200 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1">
              Alt Text (for accessibility & SEO)
            </label>
            <input
              type="text"
              value={formData.altText}
              onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
              placeholder="e.g. Village Cafe pastry display counter in Curtorim"
              className="w-full px-3 py-2 rounded-xl border border-coffee-200 text-sm"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-charcoal-800">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 text-burgundy-700 rounded"
              />
              <span>Feature this photo on Homepage Gallery Preview</span>
            </label>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-coffee-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-charcoal-700 hover:bg-cream-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white font-bold text-xs shadow-sm disabled:opacity-50 flex items-center gap-1.5"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              <span>{editingImage ? 'Save Changes' : 'Upload to Gallery'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Photo from Gallery?"
        message="Are you sure you want to remove this photo? It will no longer appear on the website or homepage."
        confirmText="Yes, Delete Photo"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, img: null })}
      />
    </div>
  );
};
