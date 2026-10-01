import express from 'express';
import {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  duplicateMenuItem,
  deleteMenuItem,
  reorderMenuItems,
} from '../controllers/menuController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getMenuItems);
router.get('/:id', getMenuItemById);
router.post('/', protectAdmin, createMenuItem);
router.post('/reorder', protectAdmin, reorderMenuItems);
router.post('/:id/duplicate', protectAdmin, duplicateMenuItem);
router.put('/:id', protectAdmin, updateMenuItem);
router.delete('/:id', protectAdmin, deleteMenuItem);

export default router;
