import express from 'express';
import {
  submitInquiry,
  getInquiries,
  markInquiryRead,
  deleteInquiry,
} from '../controllers/inquiryController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public — submit inquiry
router.post('/', submitInquiry);

// Admin only
router.get('/', protectAdmin, getInquiries);
router.patch('/:id/read', protectAdmin, markInquiryRead);
router.delete('/:id', protectAdmin, deleteInquiry);

export default router;
