import { MenuItem } from '../models/MenuItem.js';
import { MenuCategory } from '../models/MenuCategory.js';
import { sortBy } from '../utils/helpers.js';

export const getMenuItems = async (req, res, next) => {
  try {
    const { category, search, vegetarian, featured, signature, available } = req.query;

    const filter = {};
    if (vegetarian === 'true') filter.isVegetarian = true;
    if (featured === 'true') filter.isFeatured = true;
    if (signature === 'true') filter.isSignature = true;
    if (available === 'true') filter.isAvailable = true;

    let items = await MenuItem.find(filter);

    // Filter by category if specified
    if (category && category !== 'all' && category !== 'All') {
      items = items.filter(
        item => item.category === category || item.categoryName?.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by search query if specified
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter(
        item =>
          item.name.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.categoryName?.toLowerCase().includes(q)
      );
    }

    // Sort by displayOrder ascending
    const sorted = sortBy(items, 'displayOrder', true);

    res.json({
      success: true,
      count: sorted.length,
      data: sorted,
    });
  } catch (error) {
    next(error);
  }
};

export const getMenuItemById = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found.' });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const createMenuItem = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      category,
      image,
      imagePublicId,
      isVegetarian,
      isFeatured,
      isSignature,
      isAvailable,
      displayOrder,
      badge,
    } = req.body;

    if (!name || price === undefined || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name, price, and category are required.',
      });
    }

    const cat = await MenuCategory.findById(category);
    const categoryName = cat ? cat.name : category;

    const count = await MenuItem.countDocuments({});

    const newItem = await MenuItem.create({
      name: name.trim(),
      description: description || '',
      price: Number(price),
      category,
      categoryName,
      image: image || '/uploads/village_shake.jpg',
      imagePublicId: imagePublicId || '',
      isVegetarian: isVegetarian !== undefined ? Boolean(isVegetarian) : true,
      isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : false,
      isSignature: isSignature !== undefined ? Boolean(isSignature) : false,
      isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
      displayOrder: typeof displayOrder === 'number' ? displayOrder : count,
      badge: badge || '',
    });

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully.',
      data: newItem,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found.' });
    }

    const {
      name,
      description,
      price,
      category,
      image,
      imagePublicId,
      isVegetarian,
      isFeatured,
      isSignature,
      isAvailable,
      displayOrder,
      badge,
    } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (description !== undefined) updates.description = description;
    if (price !== undefined) updates.price = Number(price);
    if (category !== undefined) {
      updates.category = category;
      const cat = await MenuCategory.findById(category);
      if (cat) updates.categoryName = cat.name;
    }
    if (image !== undefined) updates.image = image;
    if (imagePublicId !== undefined) updates.imagePublicId = imagePublicId;
    if (isVegetarian !== undefined) updates.isVegetarian = Boolean(isVegetarian);
    if (isFeatured !== undefined) updates.isFeatured = Boolean(isFeatured);
    if (isSignature !== undefined) updates.isSignature = Boolean(isSignature);
    if (isAvailable !== undefined) updates.isAvailable = Boolean(isAvailable);
    if (displayOrder !== undefined) updates.displayOrder = Number(displayOrder);
    if (badge !== undefined) updates.badge = badge;

    const updated = await MenuItem.findByIdAndUpdate(id, updates, { new: true });

    res.json({
      success: true,
      message: 'Menu item updated successfully.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const duplicateMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const original = await MenuItem.findById(id);
    if (!original) {
      return res.status(404).json({ success: false, message: 'Item not found to duplicate.' });
    }

    const count = await MenuItem.countDocuments({});
    const duplicate = await MenuItem.create({
      name: `${original.name} (Copy)`,
      description: original.description,
      price: original.price,
      category: original.category,
      categoryName: original.categoryName,
      image: original.image,
      imagePublicId: original.imagePublicId,
      isVegetarian: original.isVegetarian,
      isFeatured: false,
      isSignature: false,
      isAvailable: original.isAvailable,
      displayOrder: count + 1,
      badge: original.badge,
    });

    res.status(201).json({
      success: true,
      message: 'Menu item duplicated successfully.',
      data: duplicate,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found.' });
    }

    await MenuItem.findByIdAndDelete(id);

    res.json({
      success: true,
      message: `Menu item "${item.name}" deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
};

export const reorderMenuItems = async (req, res, next) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ success: false, message: 'orderedIds must be an array.' });
    }

    for (let index = 0; index < orderedIds.length; index++) {
      await MenuItem.findByIdAndUpdate(orderedIds[index], { displayOrder: index });
    }

    res.json({ success: true, message: 'Menu items reordered successfully.' });
  } catch (error) {
    next(error);
  }
};
