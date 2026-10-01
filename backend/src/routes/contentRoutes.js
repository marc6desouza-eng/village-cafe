import express from 'express';
import {
  getHomepageContent,
  updateHomepageContent,
  getAboutContent,
  updateAboutContent,
  getOurSpaceContent,
  updateOurSpaceContent,
} from '../controllers/contentController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Homepage
router.get('/homepage', getHomepageContent);
router.put('/homepage', protectAdmin, updateHomepageContent);

// About
router.get('/about', getAboutContent);
router.put('/about', protectAdmin, updateAboutContent);

// Our Space
router.get('/our-space', getOurSpaceContent);
router.put('/our-space', protectAdmin, updateOurSpaceContent);

export default router;
