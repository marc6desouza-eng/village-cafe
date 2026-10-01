import { Reservation } from '../models/Reservation.js';
import { MenuItem } from '../models/MenuItem.js';
import { GalleryImage } from '../models/GalleryImage.js';

const generateReferenceId = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let random = '';
  for (let i = 0; i < 4; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const year = new Date().getFullYear();
  return `VC-${year}-${random}`;
};

export const createReservation = async (req, res, next) => {
  try {
    const { fullName, phone, email, date, time, guests, specialRequest } = req.body;

    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide your full name.' });
    }

    if (!phone || !phone.trim() || phone.trim().length < 8) {
      return res.status(400).json({ success: false, message: 'Please provide a valid contact phone number.' });
    }

    if (!date) {
      return res.status(400).json({ success: false, message: 'Please select a reservation date.' });
    }

    if (!time) {
      return res.status(400).json({ success: false, message: 'Please select a reservation time.' });
    }

    const guestCount = parseInt(guests, 10);
    if (isNaN(guestCount) || guestCount < 1 || guestCount > 30) {
      return res.status(400).json({
        success: false,
        message: 'Guest count must be between 1 and 30. For larger groups, please contact us directly.',
      });
    }

    const referenceId = generateReferenceId();

    const reservation = await Reservation.create({
      referenceId,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email ? email.trim().toLowerCase() : '',
      date,
      time,
      guests: guestCount,
      specialRequest: specialRequest ? specialRequest.trim() : '',
      status: 'PENDING',
    });

    res.status(201).json({
      success: true,
      message: 'Your table reservation request has been received!',
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

export const lookupReservation = async (req, res, next) => {
  try {
    const { query } = req.params;
    if (!query || !query.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide a reference ID or phone number.' });
    }

    const q = query.trim().toLowerCase();
    const all = await Reservation.find({});
    const matches = all.filter(r => 
      (r.referenceId && r.referenceId.toLowerCase() === q) || 
      (r.phone && r.phone.replace(/[^0-9]/g, '') === q.replace(/[^0-9]/g, ''))
    );

    if (matches.length === 0) {
      return res.status(404).json({ success: false, message: 'No reservation found matching this reference or phone number.' });
    }

    res.json({
      success: true,
      data: matches.sort((a, b) => new Date(b.date) - new Date(a.date)),
    });
  } catch (error) {
    next(error);
  }
};

export const getReservations = async (req, res, next) => {
  try {
    const { status, date, search } = req.query;

    let reservations = await Reservation.find({});

    if (status && status !== 'ALL') {
      reservations = reservations.filter(r => r.status === status.toUpperCase());
    }

    if (date) {
      reservations = reservations.filter(r => r.date === date);
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      reservations = reservations.filter(
        r =>
          r.fullName?.toLowerCase().includes(q) ||
          r.phone?.toLowerCase().includes(q) ||
          r.referenceId?.toLowerCase().includes(q) ||
          r.email?.toLowerCase().includes(q)
      );
    }

    // Sort descending by date and time
    const sorted = [...reservations].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time || '00:00'}`);
      const dateB = new Date(`${b.date}T${b.time || '00:00'}`);
      return dateB - dateA;
    });

    res.json({
      success: true,
      count: sorted.length,
      data: sorted,
    });
  } catch (error) {
    next(error);
  }
};

export const getReservationById = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found.' });
    }
    res.json({ success: true, data: reservation });
  } catch (error) {
    next(error);
  }
};

export const updateReservationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const allowedStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
    if (status && !allowedStatuses.includes(status.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}`,
      });
    }

    const updates = {};
    if (status) updates.status = status.toUpperCase();
    if (notes !== undefined) updates.notes = notes;

    const updated = await Reservation.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Reservation not found.' });
    }

    res.json({
      success: true,
      message: `Reservation status updated to ${updated.status}.`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReservation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Reservation.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Reservation not found.' });
    }

    res.json({
      success: true,
      message: 'Reservation record deleted.',
    });
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const allMenuItems = await MenuItem.find({});
    const totalMenuItems = allMenuItems.length;
    const availableItems = allMenuItems.filter(item => item.isAvailable).length;

    const allGallery = await GalleryImage.find({});
    const totalGalleryImages = allGallery.length;

    const allReservations = await Reservation.find({});
    const pendingReservations = allReservations.filter(r => r.status === 'PENDING').length;
    const confirmedReservations = allReservations.filter(r => r.status === 'CONFIRMED').length;

    const todayStr = new Date().toISOString().split('T')[0];
    const todayReservations = allReservations.filter(r => r.date === todayStr).length;

    // Recent 5 reservations
    const recentReservations = [...allReservations]
      .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
      .slice(0, 5);

    // Recent 5 menu updates
    const recentMenuUpdates = [...allMenuItems]
      .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
      .slice(0, 5);

    res.json({
      success: true,
      data: {
        totalMenuItems,
        availableItems,
        totalGalleryImages,
        pendingReservations,
        todayReservations,
        confirmedReservations,
        recentReservations,
        recentMenuUpdates,
      },
    });
  } catch (error) {
    next(error);
  }
};
