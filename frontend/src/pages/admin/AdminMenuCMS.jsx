import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Copy,
  Sparkles,
  Award,
  CheckCircle2,
  XCircle,
  Loader2,
  UtensilsCrossed,
  ArrowUpDown,
} from 'lucide-react';
import api from '../../services/api';
import { Toast } from '../../components/common/Toast';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { ImageUploader } from '../../components/common/ImageUploader';

const EMPTY_ITEM = {
  name: '',
  description: '',
  price: '',
  category: '',
  image: '/uploads/village_counter.jpg',
  isVegetarian: true,
  isFeatured: false,
  isSignature: false,
  isAvailable: true,
  displayOrder: 0,
};

export const AdminMenuCMS = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [availabilityFilter, setAvailabilityFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(EMPTY_ITEM);
  const [isSaving, setIsSaving] = useState(false);

  // Confirm Delete Dialog
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, item: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMenuData = async () => {
    try {
      setIsLoading(true);
      const [itemsRes, catRes] = await Promise.all([
        api.get('/menu'),
        api.get('/categories'),
      ]);
      if (itemsRes.data.success) {
        setItems(itemsRes.data.data || []);
      }
      if (catRes.data.success) {
        setCategories(catRes.data.data || []);
      }
    } catch (err) {
      setToast({ message: 'Failed to fetch menu items', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      ...EMPTY_ITEM,
      category: categories[0]?._id || categories[0]?.id || '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      description: item.description || '',
      price: item.price || '',
      category: item.category?._id || item.category?.id || item.category || '',
      image: item.image || item.imageUrl || '',
      isVegetarian: Boolean(item.isVegetarian),
      isFeatured: Boolean(item.isFeatured),
      isSignature: Boolean(item.isSignature),
      isAvailable: item.isAvailable !== false,
      displayOrder: item.displayOrder || 0,
    });
    setIsModalOpen(true);
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setToast({ message: 'Please provide an item name', type: 'error' });
      return;
    }
    if (!formData.price || isNaN(formData.price)) {
      setToast({ message: 'Please provide a valid price (₹)', type: 'error' });
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        displayOrder: parseInt(formData.displayOrder, 10) || 0,
      };

      if (editingItem) {
        const id = editingItem._id || editingItem.id;
        const res = await api.put(`/menu/${id}`, payload);
        if (res.data.success) {
          setToast({ message: `"${payload.name}" updated successfully!`, type: 'success' });
          setIsModalOpen(false);
          fetchMenuData();
        }
      } else {
        const res = await api.post('/menu', payload);
        if (res.data.success) {
          setToast({ message: `"${payload.name}" added to menu!`, type: 'success' });
          setIsModalOpen(false);
          fetchMenuData();
        }
      }
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Failed to save menu item',
        type: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDuplicate = async (item) => {
    try {
      const id = item._id || item.id;
      const res = await api.post(`/menu/${id}/duplicate`);
      if (res.data.success) {
        setToast({ message: `Duplicated "${item.name}"`, type: 'success' });
        fetchMenuData();
      }
    } catch (err) {
      setToast({ message: 'Failed to duplicate item', type: 'error' });
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      const id = item._id || item.id;
      const newStatus = !item.isAvailable;
      const res = await api.put(`/menu/${id}`, { isAvailable: newStatus });
      if (res.data.success) {
        setToast({
          message: `${item.name} is now ${newStatus ? 'Available' : 'Unavailable'}`,
          type: 'info',
        });
        fetchMenuData();
      }
    } catch (err) {
      setToast({ message: 'Failed to toggle availability', type: 'error' });
    }
  };

  const confirmDelete = (item) => {
    setDeleteConfirm({ isOpen: true, item });
  };

  const handleDelete = async () => {
    if (!deleteConfirm.item) return;
    try {
      setIsDeleting(true);
      const id = deleteConfirm.item._id || deleteConfirm.item.id;
      const res = await api.delete(`/menu/${id}`);
      if (res.data.success) {
        setToast({ message: `Deleted "${deleteConfirm.item.name}"`, type: 'success' });
        setDeleteConfirm({ isOpen: false, item: null });
        fetchMenuData();
      }
    } catch (err) {
      setToast({ message: 'Failed to delete item', type: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedCategory !== 'ALL') {
        const catId = item.category?._id || item.category?.id || item.category;
        if (catId !== selectedCategory) return false;
      }
      if (availabilityFilter === 'AVAILABLE' && !item.isAvailable) return false;
      if (availabilityFilter === 'UNAVAILABLE' && item.isAvailable) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = item.name?.toLowerCase().includes(q);
        const matchDesc = item.description?.toLowerCase().includes(q);
        if (!matchName && !matchDesc) return false;
      }
      return true;
    });
  }, [items, selectedCategory, availabilityFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header and Controls */}
      <div className="bg-white p-6 rounded-3xl border border-coffee-200/80 shadow-warm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-burgundy-700 bg-burgundy-50 px-3 py-1 rounded-full border border-burgundy-200 inline-block mb-1">
            Menu Catalog
          </span>
          <h2 className="font-serif text-2xl font-bold text-charcoal-900">
            Menu Items Management
          </h2>
          <p className="text-xs text-charcoal-500">
            Add, update prices, toggle availability, manage dietary tags, and edit photos.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white font-bold text-xs shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Menu Item</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-coffee-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items by name or keywords..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-coffee-200 bg-cream-50/50 focus:outline-none focus:border-burgundy-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-coffee-200 bg-cream-50/50 text-charcoal-800"
          >
            <option value="ALL">All Categories ({items.length})</option>
            {categories.map((c) => (
              <option key={c._id || c.id} value={c._id || c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Availability Toggle */}
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-coffee-200 bg-cream-50/50 text-charcoal-800"
          >
            <option value="ALL">All Statuses</option>
            <option value="AVAILABLE">Available Only</option>
            <option value="UNAVAILABLE">Unavailable Only</option>
          </select>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-3xl border border-coffee-200/80 shadow-warm overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-burgundy-700" />
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-cream-100 text-charcoal-700 uppercase tracking-wider text-[11px] font-bold border-b border-coffee-200">
                <tr>
                  <th className="py-3.5 px-4">Item & Photo</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Dietary</th>
                  <th className="py-3.5 px-4">Badges</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-coffee-100">
                {filteredItems.map((item) => (
                  <tr
                    key={item._id || item.id}
                    className="hover:bg-cream-50/60 transition-colors"
                  >
                    {/* Item & Photo */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image || item.imageUrl || '/uploads/village_counter.jpg'}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover border border-coffee-200 shrink-0"
                          onError={(e) => {
                            e.currentTarget.src = '/uploads/village_counter.jpg';
                          }}
                        />
                        <div>
                          <p className="font-semibold text-charcoal-900">{item.name}</p>
                          <p className="text-xs text-charcoal-500 line-clamp-1 max-w-xs">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-charcoal-700 font-medium">
                      {item.category?.name || 'Unassigned'}
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-serif font-bold text-burgundy-700 text-sm">
                      ₹{item.price}
                    </td>

                    {/* Dietary */}
                    <td className="py-3 px-4">
                      {item.isVegetarian ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Veg
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-700"></span> Non-Veg
                        </span>
                      )}
                    </td>

                    {/* Badges */}
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {item.isSignature && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-burgundy-700 text-white flex items-center gap-0.5">
                            <Award className="w-2.5 h-2.5" /> Signature
                          </span>
                        )}
                        {item.isFeatured && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cafeYellow-500 text-charcoal-900 flex items-center gap-0.5">
                            <Sparkles className="w-2.5 h-2.5" /> Featured
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status switch */}
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleAvailability(item)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                          item.isAvailable
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {item.isAvailable ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Available</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-red-600" />
                            <span>Unavailable</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg text-charcoal-600 hover:text-burgundy-700 hover:bg-cream-100 transition-colors"
                          title="Edit Item"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicate(item)}
                          className="p-1.5 rounded-lg text-charcoal-600 hover:text-charcoal-900 hover:bg-cream-100 transition-colors"
                          title="Duplicate Item"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => confirmDelete(item)}
                          className="p-1.5 rounded-lg text-charcoal-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                          title="Delete Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-charcoal-500">
            <UtensilsCrossed className="w-10 h-10 text-coffee-300 mx-auto mb-2" />
            <p className="font-semibold text-charcoal-800">No menu items match your criteria</p>
            <p className="text-xs text-charcoal-500 mt-1">Try resetting filters or click "Add New Menu Item"</p>
          </div>
        )}
      </div>

      {/* Add / Edit Item Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? `Edit: ${editingItem.name}` : 'Add New Menu Delicacy'}
      >
        <form onSubmit={handleSaveItem} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1">
                Item Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Goan Chorizo Roll"
                className="w-full px-3 py-2 rounded-xl border border-coffee-200 text-sm focus:outline-none focus:border-burgundy-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1">
                Price in Rupees (₹) *
              </label>
              <input
                type="number"
                step="1"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="120"
                className="w-full px-3 py-2 rounded-xl border border-coffee-200 text-sm focus:outline-none focus:border-burgundy-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-coffee-200 text-sm focus:outline-none focus:border-burgundy-600 bg-white"
              >
                {categories.map((c) => (
                  <option key={c._id || c.id} value={c._id || c.id}>
                    {c.name}
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
              Description
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Freshly oven-baked flaky pastry filled with authentic spiced filling..."
              className="w-full px-3 py-2 rounded-xl border border-coffee-200 text-sm"
            ></textarea>
          </div>

          {/* Image Uploader */}
          <ImageUploader
            label="Delicacy Photo"
            value={formData.image}
            onChange={(url) => setFormData({ ...formData, image: url })}
          />

          {/* Toggles */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-cream-50 p-3.5 rounded-2xl border border-coffee-200">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-charcoal-800">
              <input
                type="checkbox"
                checked={formData.isVegetarian}
                onChange={(e) => setFormData({ ...formData, isVegetarian: e.target.checked })}
                className="w-4 h-4 text-burgundy-700 rounded"
              />
              <span>Pure Veg</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-charcoal-800">
              <input
                type="checkbox"
                checked={formData.isAvailable}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                className="w-4 h-4 text-burgundy-700 rounded"
              />
              <span>Available</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-charcoal-800">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 text-burgundy-700 rounded"
              />
              <span>Featured</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-charcoal-800">
              <input
                type="checkbox"
                checked={formData.isSignature}
                onChange={(e) => setFormData({ ...formData, isSignature: e.target.checked })}
                className="w-4 h-4 text-burgundy-700 rounded"
              />
              <span>Signature</span>
            </label>
          </div>

          {/* Modal Actions */}
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
              <span>{editingItem ? 'Update Item' : 'Add to Menu'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title={`Delete "${deleteConfirm.item?.name}"?`}
        message="Are you sure you want to remove this item from the café menu? This action cannot be undone."
        confirmText="Yes, Delete Item"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, item: null })}
      />
    </div>
  );
};
