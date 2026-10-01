import { MenuCategory } from '../models/MenuCategory.js';
import { MenuItem } from '../models/MenuItem.js';
import { sortBy } from '../utils/helpers.js';

export const getCategories = async (req, res, next) => {
  try {
    const isPublic = req.query.public === 'true';
    const filter = isPublic ? { isActive: true } : {};
    const categories = await MenuCategory.find(filter);
    
    // Sort by displayOrder ascending
    const sorted = sortBy(categories, 'displayOrder', true);

    // Attach count of items for admin view
    if (!isPublic) {
      const allItems = await MenuItem.find({});
      const withCounts = sorted.map(cat => {
        const id = cat._id || cat.id;
        const count = allItems.filter(item => item.category === id || item.category === cat.slug).length;
        return {
          ...cat,
          itemCount: count,
        };
      });
      return res.json({ success: true, data: withCounts });
    }

    res.json({ success: true, data: sorted });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, slug, description, displayOrder, isActive } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }

    const categorySlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const existing = await MenuCategory.findOne({ slug: categorySlug });
    if (existing) {
      return res.status(400).json({ success: false, message: 'A category with this name or slug already exists.' });
    }

    const count = await MenuCategory.countDocuments({});

    const newCategory = await MenuCategory.create({
      name: name.trim(),
      slug: categorySlug,
      description: description || '',
      displayOrder: typeof displayOrder === 'number' ? displayOrder : count,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({ success: true, data: newCategory, message: 'Category created successfully.' });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, displayOrder, isActive } = req.body;

    const category = await MenuCategory.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    const updates = {};
    if (name) updates.name = name.trim();
    if (description !== undefined) updates.description = description;
    if (displayOrder !== undefined) updates.displayOrder = displayOrder;
    if (isActive !== undefined) updates.isActive = isActive;

    const updated = await MenuCategory.findByIdAndUpdate(id, updates, { new: true });

    if (name && name.trim() !== category.name) {
      const items = await MenuItem.find({ category: id });
      for (const item of items) {
        await MenuItem.findByIdAndUpdate(item._id || item.id, { categoryName: name.trim() });
      }
    }

    res.json({ success: true, data: updated, message: 'Category updated successfully.' });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await MenuCategory.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    const allItems = await MenuItem.find({});
    const linkedItems = allItems.filter(
      item => item.category === id || item.category === category.slug
    );

    if (linkedItems.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete "${category.name}" because it contains ${linkedItems.length} menu item(s). Please reassign or delete these items first.`,
        linkedCount: linkedItems.length,
      });
    }

    await MenuCategory.findByIdAndDelete(id);

    res.json({ success: true, message: `Category "${category.name}" deleted successfully.` });
  } catch (error) {
    next(error);
  }
};

export const reorderCategories = async (req, res, next) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ success: false, message: 'orderedIds must be an array.' });
    }

    for (let index = 0; index < orderedIds.length; index++) {
      await MenuCategory.findByIdAndUpdate(orderedIds[index], { displayOrder: index });
    }

    res.json({ success: true, message: 'Categories reordered successfully.' });
  } catch (error) {
    next(error);
  }
};
