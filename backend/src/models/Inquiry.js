import { createDualModel } from './modelFactory.js';

const inquirySchema = {
  name: { type: String, required: true },
  contact: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
};

export const Inquiry = createDualModel('Inquiry', inquirySchema);
