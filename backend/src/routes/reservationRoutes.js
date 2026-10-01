import express from 'express';
import {
  createReservation,
  lookupReservation,
  getReservations,
  getReservationById,
  updateReservationStatus,
  deleteReservation,
  getDashboardStats,
} from '../controllers/reservationController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public reservation submission & lookup
router.post('/', createReservation);
router.get('/lookup/:query', lookupReservation);

// Admin endpoints
router.get('/dashboard-stats', protectAdmin, getDashboardStats);
router.get('/', protectAdmin, getReservations);
router.get('/:id', protectAdmin, getReservationById);
router.patch('/:id/status', protectAdmin, updateReservationStatus);
router.delete('/:id', protectAdmin, deleteReservation);

export default router;
