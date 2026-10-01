import React, { useState } from 'react';
import { User, Lock, Mail, Save, Loader2, Key } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Toast } from '../../components/common/Toast';

export const AdminProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword) {
      if (newPassword !== confirmPassword) {
        setToast({ message: 'New password and confirmation do not match', type: 'error' });
        return;
      }
      if (!currentPassword) {
        setToast({ message: 'Please enter your current password to change password', type: 'error' });
        return;
      }
      if (newPassword.length < 6) {
        setToast({ message: 'New password must be at least 6 characters', type: 'error' });
        return;
      }
    }

    try {
      setIsSaving(true);
      const res = await updateProfile({
        name,
        email,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      });

      if (res.success) {
        setToast({ message: 'Profile updated successfully!', type: 'success' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setToast({ message: res.message || 'Failed to update profile', type: 'error' });
      }
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Error updating profile',
        type: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="bg-white p-6 rounded-3xl border border-coffee-200/80 shadow-warm">
        <span className="text-xs font-bold uppercase tracking-wider text-burgundy-700 bg-burgundy-50 px-3 py-1 rounded-full border border-burgundy-200 inline-block mb-1">
          Security & Access
        </span>
        <h2 className="font-serif text-2xl font-bold text-charcoal-900">
          Admin Profile & Credentials
        </h2>
        <p className="text-xs text-charcoal-500">
          Update your administrator contact details and change your account password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-coffee-200/80 shadow-warm space-y-6">
        
        {/* Name & Email */}
        <div className="space-y-4">
          <h3 className="font-serif text-base font-bold text-charcoal-900 border-b border-coffee-100 pb-2">
            Personal Information
          </h3>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-coffee-200 text-sm focus:outline-none focus:border-burgundy-600 bg-cream-50/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-coffee-200 text-sm focus:outline-none focus:border-burgundy-600 bg-cream-50/50"
              />
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="border-t border-coffee-100 pt-6 space-y-4">
          <h3 className="font-serif text-base font-bold text-charcoal-900 flex items-center gap-2">
            <Key className="w-4 h-4 text-burgundy-700" />
            <span>Change Password (Leave blank to keep unchanged)</span>
          </h3>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
              Current Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current password"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-coffee-200 text-sm bg-cream-50/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-coffee-200 text-sm bg-cream-50/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-coffee-200 text-sm bg-cream-50/50"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3 rounded-2xl bg-burgundy-700 hover:bg-burgundy-800 text-white font-bold text-xs shadow-warm transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Update Profile</span>
          </button>
        </div>

      </form>
    </div>
  );
};
