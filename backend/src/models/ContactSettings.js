import { createDualModel } from './modelFactory.js';

export const ContactSettings = createDualModel('ContactSettings', {
  cafeName: { type: String, default: 'Village Cafe' },
  tagline: { type: String, default: 'Café & Bakery' },
  address: { type: String, default: 'Carmel View, Curtorim, Goa, India' },
  landmark: { type: String, default: 'Carmel View Building' },
  city: { type: String, default: 'Curtorim' },
  state: { type: String, default: 'Goa' },
  country: { type: String, default: 'India' },
  phone: { type: String, default: '+91 98220 00000' },
  email: { type: String, default: 'contact@villagecafegoa.com' },
  googleMapsUrl: {
    type: String,
    default: 'https://www.google.com/maps/search/?api=1&query=Carmel+View+Curtorim+Goa',
  },
  instagram: { type: String, default: 'https://instagram.com/villagecafegoa' },
  facebook: { type: String, default: 'https://facebook.com/villagecafegoa' },
  whatsapp: { type: String, default: '+91 98220 00000' },
  parkingInfo: { type: String, default: 'Convenient front vehicle parking available outside Carmel View.' },
});
