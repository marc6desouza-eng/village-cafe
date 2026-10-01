import { Inquiry } from '../models/Inquiry.js';

// POST /api/inquiries — public, submit a contact inquiry
export const submitInquiry = async (req, res, next) => {
  try {
    const { name, contact, message } = req.body;

    if (!name || !contact || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, contact (phone/email), and message are required.',
      });
    }

    const inquiry = await Inquiry.create({
      name: name.trim(),
      contact: contact.trim(),
      message: message.trim(),
      isRead: false,
    });

    res.status(201).json({
      success: true,
      message: 'Your message has been received. We will get back to you shortly.',
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/inquiries — admin only, list all inquiries
export const getInquiries = async (req, res, next) => {
  try {
    const items = await Inquiry.find({});
    // sort by newest first
    const sorted = Array.isArray(items)
      ? [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      : (items.sort ? items.sort({ createdAt: -1 }) : []);

    res.json({ success: true, count: sorted.length, data: sorted });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/inquiries/:id/read — admin only, mark as read
export const markInquiryRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const inquiry = await Inquiry.findById(id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found.' });
    }
    const updated = await Inquiry.findByIdAndUpdate(id, { isRead: true }, { new: true });
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/inquiries/:id — admin only
export const deleteInquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const inquiry = await Inquiry.findById(id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found.' });
    }
    await Inquiry.findByIdAndDelete(id);
    res.json({ success: true, message: 'Inquiry deleted.' });
  } catch (error) {
    next(error);
  }
};
