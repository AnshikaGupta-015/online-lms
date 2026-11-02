import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';
import { User, Shield, KeyRound, Sparkles, Check, CheckCircle2, Upload } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, profile, role, updateProfile, switchDemoUser } = useAuth();

  const [fullName, setFullName] = useState(profile?.fullName || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl || '');
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80'
  ];

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess(false);

    try {
      await updateProfile({ fullName, bio, avatarUrl });
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err: any) {
      setProfileError(err.message || 'Failed to update profile');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);
    setIsChangingPassword(true);

    try {
      await api.changePassword({ currentPassword, newPassword });
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* HEADER */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Account Profile & Preferences
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Manage your personal instructor/student information, credentials, and authentication security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* PROFILE CARD */}
          <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-6 sm:p-8 shadow-xs space-y-6">
            
            <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
              <img
                src={avatarUrl || profile?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName || 'User')}`}
                alt="Avatar"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/20"
                referrerPolicy="no-referrer"
              />
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {profile?.fullName || 'LearnHub Member'}
                </h3>
                <p className="text-xs text-slate-400 font-mono">{user?.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  {role} Role
                </span>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
              
              {profileSuccess && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              {profileError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 rounded-xl">
                  {profileError}
                </div>
              )}

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Bio / Credentials
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell learners or peers about your engineering background..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Avatar Photo
                </label>
                
                {/* File Upload Input */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 transition-colors">
                    <Upload className="w-4 h-4 text-indigo-500" />
                    <span>Upload Image from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 2 * 1024 * 1024) {
                            setProfileError('Image size exceeds 2MB limit.');
                            return;
                          }
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            if (typeof reader.result === 'string') {
                              setAvatarUrl(reader.result);
                              setProfileError('');
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  <span className="text-[11px] text-slate-400">JPG, PNG or GIF (max 2MB)</span>
                </div>

                <div className="text-[11px] text-slate-400 mb-1.5 font-medium">Or pick an curated preset avatar:</div>
                <div className="flex items-center gap-2.5">
                  {avatarPresets.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setAvatarUrl(url)}
                      className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all ${
                        avatarUrl === url ? 'border-indigo-600 scale-110 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs shadow-xs transition-colors"
                >
                  Save Profile Changes
                </button>
              </div>

            </form>

            {/* PASSWORD UPDATE */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-indigo-500" />
                Change Password
              </h4>

              <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
                {passwordSuccess && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Password changed successfully.</span>
                  </div>
                )}

                {passwordError && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 rounded-xl">
                    {passwordError}
                  </div>
                )}

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password (demo is Password123!)"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isChangingPassword || !currentPassword || !newPassword}
                    className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl text-xs hover:bg-slate-800 transition-colors disabled:opacity-50"
                  >
                    {isChangingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>

          </div>

          {/* RIGHT SIDE: DEMO ROLE TESTING PANEL */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-6 shadow-xs space-y-4 h-fit">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Role Switcher</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Quickly switch between pre-seeded personas to test Row-Level Security and page permissions.
            </p>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => switchDemoUser('admin@learnhub.com')}
                className="w-full p-2.5 text-left rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200/60 dark:border-slate-700/60 text-xs transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-rose-500" /> Admin
                  </div>
                  <div className="text-[11px] text-slate-400">admin@learnhub.com</div>
                </div>
                {role === 'admin' && <span className="text-[10px] font-bold text-indigo-600">Active</span>}
              </button>

              <button
                onClick={() => switchDemoUser('sarah.chen@learnhub.com')}
                className="w-full p-2.5 text-left rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200/60 dark:border-slate-700/60 text-xs transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-violet-500" /> Instructor (Dr. Chen)
                  </div>
                  <div className="text-[11px] text-slate-400">sarah.chen@learnhub.com</div>
                </div>
                {user?.email === 'sarah.chen@learnhub.com' && <span className="text-[10px] font-bold text-indigo-600">Active</span>}
              </button>

              <button
                onClick={() => switchDemoUser('student.elena@learnhub.com')}
                className="w-full p-2.5 text-left rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200/60 dark:border-slate-700/60 text-xs transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-500" /> Student (Elena)
                  </div>
                  <div className="text-[11px] text-slate-400">student.elena@learnhub.com</div>
                </div>
                {user?.email === 'student.elena@learnhub.com' && <span className="text-[10px] font-bold text-indigo-600">Active</span>}
              </button>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
              Demo password for all accounts: <code className="text-slate-600 dark:text-slate-300 font-mono">Password123!</code>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
