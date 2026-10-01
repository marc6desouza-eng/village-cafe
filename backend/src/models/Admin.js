import { createDualModel } from './modelFactory.js';

export const Admin = createDualModel('Admin', {
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
});
