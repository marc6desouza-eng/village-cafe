import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Layers, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { Toast } from '../../components/common/Toast';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

const EMPTY_CAT = {
  name: '',
  slug: '',
  description: '',
  displayOrder: 0,
  isActive: true,
};

export const AdminCategoriesCMS = () => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [formData, setFormData] = useState(EMPTY_CAT);
  const [isSaving, setIsSaving] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, cat: null, linkedCount: 0 });
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [catRes, menuRes] = await Promise.all([
        api.get('/categories'),
        api.get('/menu'),
      ]);
      if (catRes.data.success) {
        setCategories(catRes.data.data || []);
      }
      if (menuRes.data.success) {
        setMenuItems(menuRes.data.data || []);
      }
    } catch (err) {
      setToast({ message: 'Failed to fetch categories', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingCat(null);
    setFormData({
      ...EMPTY_CAT,
      displayOrder: categories.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCat(cat);
    setFormData({
      name: cat.name || '',
      slug: cat.slug || '',
      description: cat.description || '',
      displayOrder: cat.displayOrder || 0,
      isActive: cat.isActive !== false,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setToast({ message: 'Please provide a category name', type: 'error' });
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        ...formData,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        displayOrder: parseInt(formData.displayOrder, 10) || 0,
      };

      if (editingCat) {
        const id = editingCat._id || editingCat.id;
        const res = await api.put(`/categories/${id}`, payload);
        if (res.data.success) {
          setToast({ message: `Category "${payload.name}" updated!`, type: 'success' });
          setIsModalOpen(false);
          fetchData();
        }
      } else {
        const res = await api.post('/categories', payload);
        if (res.data.success) {
          setToast({ message: `Category "${payload.name}" created!`, type: 'success' });
          setIsModalOpen(false);
          fetchData();
        }
      }
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Failed to save category',
        type: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const openDeleteDialog = (cat) => {
    const catId = cat._id || cat.id;
    const linked = menuItems.filter(
      (item) => (item.category?._id || item.category?.id || item.category) === catId
    );
    setDeleteConfirm({ isOpen: true, cat, linkedCount: linked.length });
  };

  const handleDelete = async () => {
    if (!deleteConfirm.cat) return;
    try {
      setIsDeleting(true);
      const id = deleteConfirm.cat._id || deleteConfirm.cat.id;
      const res = await api.delete(`/categories/${id}`);
      if (res.data.success) {
        setToast({ message: `Category deleted`, type: 'success' });
        setDeleteConfirm({ isOpen: false, cat: null, linkedCount: 0 });
        fetchData();
      }
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Failed to delete category',
        type: 'error',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-coffee-200/80 shadow-warm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-burgundy-700 bg-burgundy-50 px-3 py-1 rounded-full border border-burgundy-200 inline-block mb-1">
            Taxonomy
          </span>
          <h2 className="font-serif text-2xl font-bold text-charcoal-900">
            Menu Categories CMS
          </h2>
          <p className="text-xs text-charcoal-500">
            Manage product categories. All categories dynamically power menu filters and tabs.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white font-bold text-xs shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-3xl border border-coffee-200/80 shadow-warm overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-burgundy-700" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-cream-100 text-charcoal-700 uppercase tracking-wider text-[11px] font-bold border-b border-coffee-200">
                <tr>
                  <th className="py-3.5 px-4">Order</th>
                  <th className="py-3.5 px-4">Category Name</th>
                  <th className="py-3.5 px-4">Slug</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4">Items Count</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-coffee-100">
                {categories.map((cat) => {
                  const catId = cat._id || cat.id;
                  const count = menuItems.filter(
                    (i) => (i.category?._id || i.category?.id || i.category) === catId
                  ).length;

                  return (
                    <tr key={catId} className="hover:bg-cream-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-charcoal-500">
                        #{cat.displayOrder || 0}
                      </td>
                      <td className="py-3 px-4 font-bold text-charcoal-900">
                        {cat.name}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-charcoal-500">
                        {cat.slug}
                      </td>
                      <td className="py-3 px-4 text-xs text-charcoal-600 max-w-xs truncate">
                        {cat.description || '—'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-coffee-100 text-coffee-800">
                          {count} items
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            cat.isActive !== false
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-charcoal-100 text-charcoal-600'
                          }`}
                        >
                          {cat.isActive !== false ? 'Active' : 'Hidden'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(cat)}
                            className="p-1.5 rounded-lg text-charcoal-600 hover:text-burgundy-700 hover:bg-cream-100 transition-colors"
                            title="Edit Category"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openDeleteDialog(cat)}
                            className="p-1.5 rounded-lg text-charcoal-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                            title="Delete Category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCat ? `Edit Category: ${editingCat.name}` : 'Create New Category'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => {
                const name = e.target.value;
                setFormData({
                  ...formData,
                  name,
                  slug: editingCat
                    ? formData.slug
                    : name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                });
              }}
              placeholder="e.g. Artisanal Breads & Puffs"
              className="w-full px-3 py-2 rounded-xl border border-coffee-200 text-sm focus:outline-none focus:border-burgundy-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1">
                URL Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="artisan-breads"
                className="w-full px-3 py-2 rounded-xl border border-coffee-200 text-sm font-mono text-xs"
              />
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
              Category Description
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description for menu headings..."
              className="w-full px-3 py-2 rounded-xl border border-coffee-200 text-sm"
            ></textarea>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-charcoal-800">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-burgundy-700 rounded"
              />
              <span>Category Active & Visible to Customers</span>
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
              <span>{editingCat ? 'Save Changes' : 'Create Category'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title={`Delete Category "${deleteConfirm.cat?.name}"?`}
        message={
          deleteConfirm.linkedCount > 0
            ? `WARNING: There are ${deleteConfirm.linkedCount} menu items assigned to this category. Deleting it may orphan these items unless you reassign them first.`
            : 'Are you sure you want to delete this category? This action cannot be undone.'
        }
        confirmText={deleteConfirm.linkedCount > 0 ? 'Delete Anyway' : 'Delete Category'}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, cat: null, linkedCount: 0 })}
      />
    </div>
  );
};
