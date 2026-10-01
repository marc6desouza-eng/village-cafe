import express from 'express';
import {
  getOpeningHours,
  updateOpeningHours,
  getContactSettings,
  updateContactSettings,
  getSiteSettings,
  updateSiteSettings,
  getPublicBootstrap,
} from '../controllers/settingsController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public aggregated bootstrap
router.get('/bootstrap', getPublicBootstrap);

// Hours
router.get('/hours', getOpeningHours);
router.put('/hours', protectAdmin, updateOpeningHours);

// Contact
router.get('/contact', getContactSettings);
router.put('/contact', protectAdmin, updateContactSettings);

// Site
router.get('/site', getSiteSettings);
router.put('/site', protectAdmin, updateSiteSettings);

export default router;
