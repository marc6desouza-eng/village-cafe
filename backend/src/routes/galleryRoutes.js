import express from 'express';
import {
  getGalleryImages,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  reorderGalleryImages,
} from '../controllers/galleryController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getGalleryImages);
router.post('/', protectAdmin, createGalleryImage);
router.post('/reorder', protectAdmin, reorderGalleryImages);
router.put('/:id', protectAdmin, updateGalleryImage);
router.delete('/:id', protectAdmin, deleteGalleryImage);

export default router;
