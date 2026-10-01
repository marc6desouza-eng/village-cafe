import express from 'express';
import { uploadSingleImage, uploadMultipleImages, deleteImage } from '../controllers/uploadController.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/single', protectAdmin, upload.single('image'), uploadSingleImage);
router.post('/multiple', protectAdmin, upload.array('images', 10), uploadMultipleImages);
router.post('/delete', protectAdmin, deleteImage);

export default router;
