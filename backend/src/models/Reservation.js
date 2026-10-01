import { createDualModel } from './modelFactory.js';

export const Reservation = createDualModel('Reservation', {
  referenceId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: '' },
  date: { type: String, required: true },
  time: { type: String, required: true },
  guests: { type: Number, required: true, default: 2 },
  specialRequest: { type: String, default: '' },
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'],
    default: 'PENDING',
  },
  notes: { type: String, default: '' },
});
