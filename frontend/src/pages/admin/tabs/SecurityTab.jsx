import React, { useState } from 'react';
import { ShieldCheck, Lock, User, Eye, EyeOff, CheckCircle2, AlertCircle, KeyRound, Check, X } from 'lucide-react';
import { useSiteData } from '../../../context/SiteDataContext';

export default function SecurityTab() {
  const { adminUser, changePassword } = useSiteData();

  const [newUsername, setNewUsername] = useState(adminUser?.username || 'admin');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  // Password Strength Check
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasDigit = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);

  const strengthScore = [hasMinLength, hasUppercase, hasLowercase, hasDigit, hasSpecial].filter(Boolean).length;

  const getStrengthLabel = () => {
    if (!newPassword) return '';
    if (strengthScore <= 2) return 'Weak';
    if (strengthScore <= 4) return 'Good';
    return 'Strong';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      setStatusMsg({ type: 'error', text: 'Please enter your current password to authorize changes.' });
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setStatusMsg({ type: 'error', text: 'New passwords do not match. Please verify.' });
      return;
    }

    if (newPassword && strengthScore < 5) {
      setStatusMsg({
        type: 'error',
        text: 'New password must satisfy all 5 security requirements (8+ chars, uppercase, lowercase, digit, special symbol).'
      });
      return;
    }

    try {
      setIsSaving(true);
      setStatusMsg({ type: '', text: '' });

      const payload = {
        currentPassword,
        newUsername: newUsername.trim() !== adminUser?.username ? newUsername.trim() : undefined,
        newPassword: newPassword ? newPassword : undefined
      };

      const res = await changePassword(payload);
      setStatusMsg({
        type: 'success',
        text: res.message || 'Admin security credentials updated successfully!'
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setStatusMsg({
        type: 'error',
        text: err.message || 'Failed to update credentials. Please check current password.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200/90 shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-yellow-400/10 px-3 py-1 rounded-full text-yellow-700 text-xs font-bold uppercase tracking-wider mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-yellow-600" />
            <span>Admin Authentication & Security</span>
          </div>
          <h1 className="text-2xl font-bold font-nexa text-slate-900">Admin Account Credentials</h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Update your admin master login username and set a secure custom password.
          </p>
        </div>
      </div>

      {/* Status Message */}
      {statusMsg.text && (
        <div className={`p-4 rounded-2xl text-xs sm:text-sm font-semibold flex items-center space-x-2 animate-fadeIn ${
          statusMsg.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Security Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-sm space-y-6">
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Username Section */}
          <div className="border-b border-gray-100 pb-6 space-y-4">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-yellow-600" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">Admin Username</h2>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Admin Username
              </label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full max-w-md p-3.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-slate-900 text-sm focus:outline-none focus:border-brand-yellow"
                required
              />
            </div>
          </div>

          {/* Password Change Section */}
          <div className="space-y-5">
            <div className="flex items-center space-x-2">
              <KeyRound className="w-4 h-4 text-yellow-600" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">Change Admin Password</h2>
            </div>

            {/* Current Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Current Password * (Required to confirm changes)
              </label>
              <div className="relative max-w-md">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full p-3.5 pr-11 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-slate-900 text-sm focus:outline-none focus:border-brand-yellow"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  New Strong Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full p-3.5 pr-11 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-slate-900 text-sm focus:outline-none focus:border-brand-yellow"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-slate-900 text-sm focus:outline-none focus:border-brand-yellow"
                />
              </div>
            </div>

            {/* Password Strength Meter */}
            {newPassword && (
              <div className="max-w-md bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Password Strength:</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-extrabold ${
                    strengthScore >= 5 ? 'bg-emerald-100 text-emerald-800' : strengthScore >= 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {getStrengthLabel()}
                  </span>
                </div>

                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full transition-all duration-300 ${
                      strengthScore >= 5 ? 'bg-emerald-500' : strengthScore >= 3 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${(strengthScore / 5) * 100}%` }}
                  />
                </div>

                <ul className="text-[11px] space-y-1 text-gray-600 pt-1">
                  <li className={`flex items-center space-x-1.5 ${hasMinLength ? 'text-emerald-700 font-bold' : ''}`}>
                    {hasMinLength ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-gray-400" />}
                    <span>At least 8 characters long</span>
                  </li>
                  <li className={`flex items-center space-x-1.5 ${hasUppercase ? 'text-emerald-700 font-bold' : ''}`}>
                    {hasUppercase ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-gray-400" />}
                    <span>Contains uppercase letter (A-Z)</span>
                  </li>
                  <li className={`flex items-center space-x-1.5 ${hasLowercase ? 'text-emerald-700 font-bold' : ''}`}>
                    {hasLowercase ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-gray-400" />}
                    <span>Contains lowercase letter (a-z)</span>
                  </li>
                  <li className={`flex items-center space-x-1.5 ${hasDigit ? 'text-emerald-700 font-bold' : ''}`}>
                    {hasDigit ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-gray-400" />}
                    <span>Contains number (0-9)</span>
                  </li>
                  <li className={`flex items-center space-x-1.5 ${hasSpecial ? 'text-emerald-700 font-bold' : ''}`}>
                    {hasSpecial ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-gray-400" />}
                    <span>Contains special symbol (!@#$%^&*...)</span>
                  </li>
                </ul>
              </div>
            )}

          </div>

          <div className="pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSaving}
              className="yellow-gradient-btn px-8 py-3.5 rounded-2xl text-slate-950 font-extrabold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isSaving ? 'Updating Credentials...' : 'Save Security Settings'}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
