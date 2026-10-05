import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Compass,
  Instagram,
  Facebook,
  Sparkles,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { OpenStatusBadge } from '../components/common/OpenStatusBadge';
import api from '../services/api';

export const ContactPage = () => {
  const { contact, hours } = useSettings();
  const [formSent, setFormSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [inquiry, setInquiry] = useState({
    name: '',
    phone: '',
    message: '',
  });

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);
    try {
      await api.post('/inquiries', {
        name: inquiry.name,
        contact: inquiry.phone,
        message: inquiry.message,
      });
      setFormSent(true);
    } catch (err) {
      setSubmitError('Failed to send message. Please try again or call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const daysList = hours?.days || [];

  return (
    <div className="pt-24 pb-20">
      
      {/* Header Banner */}
      <section className="bg-charcoal-950 text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cafeYellow-400 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Get in Touch</span>
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4">
            Visit & Contact Us
          </h1>
          <p className="text-cream-200 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            We are always here to welcome you at Carmel View in Curtorim, Goa. Drop by or send us a message.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Contact & Hours Details */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Contact Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-coffee-200 shadow-warm-xl space-y-6">
              <div className="flex items-center justify-between border-b border-coffee-100 pb-4">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-charcoal-900">Village Cafe</h3>
                  <p className="text-xs text-coffee-700">Café & Bakery • Curtorim, Goa</p>
                </div>
                <OpenStatusBadge />
              </div>

              <div className="space-y-4 text-sm text-charcoal-700">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-burgundy-50 text-burgundy-700 shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-charcoal-900 text-xs uppercase tracking-wider">Address</h4>
                    <p className="mt-0.5 leading-relaxed">
                      {contact?.address || 'Carmel View, Curtorim, Goa 403701, India'}
                    </p>
                  </div>
                </div>

                {contact?.phone && (
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-burgundy-50 text-burgundy-700 shrink-0 mt-0.5">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-charcoal-900 text-xs uppercase tracking-wider">Telephone</h4>
                      <p className="mt-0.5">
                        <a href={`tel:${contact.phone}`} className="hover:text-burgundy-700 font-medium">
                          {contact.phone}
                        </a>
                      </p>
                    </div>
                  </div>
                )}

                {contact?.email && (
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-burgundy-50 text-burgundy-700 shrink-0 mt-0.5">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-charcoal-900 text-xs uppercase tracking-wider">Email</h4>
                      <p className="mt-0.5">
                        <a href={`mailto:${contact.email}`} className="hover:text-burgundy-700 font-medium truncate">
                          {contact.email}
                        </a>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-coffee-100 flex flex-wrap gap-3">
                {contact?.googleMapsUrl && (
                  <a
                    href={contact.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-coffee-800 hover:bg-coffee-900 text-white shadow-sm transition-all"
                  >
                    <Compass className="w-4 h-4 text-cafeYellow-400" />
                    <span>Get Directions</span>
                  </a>
                )}
                {contact?.instagramUrl && (
                  <a
                    href={contact.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold bg-cream-100 hover:bg-cream-200 text-charcoal-800 transition-colors"
                  >
                    <Instagram className="w-4 h-4 text-burgundy-700" />
                    <span>Instagram</span>
                  </a>
                )}
                {contact?.facebookUrl && (
                  <a
                    href={contact.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold bg-cream-100 hover:bg-cream-200 text-charcoal-800 transition-colors"
                  >
                    <Facebook className="w-4 h-4 text-blue-600" />
                    <span>Facebook</span>
                  </a>
                )}
              </div>
            </div>

            {/* Opening Hours Schedule */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-coffee-200 shadow-warm-xl">
              <h3 className="font-serif text-xl font-bold text-charcoal-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-burgundy-700" />
                <span>Weekly Hours</span>
              </h3>

              <div className="space-y-2 text-xs sm:text-sm">
                {daysList.map((d, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center py-1.5 border-b border-coffee-100 last:border-b-0"
                  >
                    <span className="font-semibold text-charcoal-800">{d.day}</span>
                    <span className="text-charcoal-600 font-mono">
                      {d.isOpen ? `${d.openTime} – ${d.closeTime}` : <span className="text-amber-700 font-sans font-bold">Closed</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Google Maps & Send Message */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Map Frame */}
            <div className="h-80 rounded-3xl overflow-hidden border border-coffee-200 shadow-warm-xl bg-cream-100">
              <iframe
                title="Village Cafe Map Location Curtorim"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d961.955!2d74.015!3d15.275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbfb15b3e64fbf1%3A0x6e6e22f36081efb0!2sVillage%20Cafe%2C%20Carmel%20View%2C%20Shelvan%2C%20Curtorim%2C%20Goa!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            {/* Direct Message Form */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-coffee-200 shadow-warm-xl">
              {formSent ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-xl font-bold text-charcoal-900">Message Received!</h4>
                  <p className="text-xs sm:text-sm text-charcoal-600 max-w-md mx-auto">
                    Thank you for reaching out. We will get back to you shortly.
                  </p>
                  <button
                    onClick={() => {
                      setFormSent(false);
                      setSubmitError('');
                      setInquiry({ name: '', phone: '', message: '' });
                    }}
                    className="mt-3 text-xs font-semibold text-burgundy-700 hover:underline"
                  >
                    Send another note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <h3 className="font-serif text-2xl font-bold text-charcoal-900">
                    Send Us a Message
                  </h3>
                  <p className="text-xs text-charcoal-500">
                    Have questions about large orders, special catering, or private tea gatherings? Let us know.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={inquiry.name}
                        onChange={(e) => setInquiry({ ...inquiry, name: e.target.value })}
                        placeholder="e.g. Maria"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-coffee-200 text-sm focus:outline-none focus:border-burgundy-600 bg-cream-50/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1">
                        Phone or Email *
                      </label>
                      <input
                        type="text"
                        required
                        value={inquiry.phone}
                        onChange={(e) => setInquiry({ ...inquiry, phone: e.target.value })}
                        placeholder="Contact number or email"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-coffee-200 text-sm focus:outline-none focus:border-burgundy-600 bg-cream-50/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1">
                      Message *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={inquiry.message}
                      onChange={(e) => setInquiry({ ...inquiry, message: e.target.value })}
                      placeholder="How can we help you today?"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-coffee-200 text-sm focus:outline-none focus:border-burgundy-600 bg-cream-50/50"
                    ></textarea>
                  </div>

                  {submitError && (
                    <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                      {submitError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white font-bold text-xs sm:text-sm shadow-warm transition-all disabled:opacity-60"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>{isSubmitting ? 'Sending...' : 'Send Inquiry'}</span>
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
