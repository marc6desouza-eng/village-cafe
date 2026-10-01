import { createDualModel } from './modelFactory.js';

const defaultSchedule = [
  { day: 'Monday', isOpen: true, openTime: '08:30', closeTime: '22:00' },
  { day: 'Tuesday', isOpen: true, openTime: '08:30', closeTime: '22:00' },
  { day: 'Wednesday', isOpen: true, openTime: '08:30', closeTime: '22:00' },
  { day: 'Thursday', isOpen: true, openTime: '08:30', closeTime: '22:00' },
  { day: 'Friday', isOpen: true, openTime: '08:30', closeTime: '22:30' },
  { day: 'Saturday', isOpen: true, openTime: '08:30', closeTime: '23:00' },
  { day: 'Sunday', isOpen: true, openTime: '09:00', closeTime: '22:30' },
];

export const OpeningHours = createDualModel('OpeningHours', {
  schedule: {
    type: Array,
    default: defaultSchedule,
  },
  holidayNotice: { type: String, default: '' },
});
