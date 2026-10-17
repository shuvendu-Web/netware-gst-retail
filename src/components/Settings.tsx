import React, { useState } from 'react';
import { Settings as SettingsIcon, Crown, Store, Palette, Sun, Moon, CheckCircle2, Shuffle } from 'lucide-react';
import { BusinessSettings } from '../types';

interface SettingsProps {
  settings: BusinessSettings;
  onUpdateSettings: (settings: BusinessSettings) => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
}

export const Settings: React.FC<SettingsProps> = ({ 
  settings, 
  onUpdateSettings,
  primaryColor,
  setPrimaryColor,
  isDarkMode,
  setIsDarkMode
}) => {
  const [formData, setFormData] = useState<BusinessSettings>(settings);
  const [saved, setSaved] = useState(false);

  const colors = [
    { name: 'Primary (Magenta)', value: '#cf45ee' },
    { name: 'Success (Green)', value: '#64e447' },
    { name: 'Caution (Yellow)', value: '#f5e134' },
    { name: 'Danger (Red)', value: '#d91940' },
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Cyan', value: '#06b6d4' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Business & Theme Settings</h2>
            <p className="text-xs text-slate-500 mt-0.5">Configure company profile, GSTIN, theme appearance, and dark/light mode.</p>
          </div>
        </div>
        {saved && (
          <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>Saved Successfully!</span>
          </div>
        )}
      </div>

      {/* Theme Setup Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-slate-800 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <Palette className="w-5 h-5 text-indigo-500" /> Theme & Appearance Setup
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Display Mode */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-2">Display Mode</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsDarkMode(false)}
                className={`py-3 px-4 rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 border transition-all ${
                  !isDarkMode ? 'bg-indigo-50 text-indigo-600 border-indigo-300 shadow-sm' : 'border-slate-300 dark:border-slate-700 text-slate-500'
                }`}
              >
                <Sun className="w-4 h-4" />
                <span>Light Mode</span>
              </button>
              <button
                type="button"
                onClick={() => setIsDarkMode(true)}
                className={`py-3 px-4 rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 border transition-all ${
                  isDarkMode ? 'bg-indigo-950 text-indigo-300 border-indigo-600 shadow-sm' : 'border-slate-300 dark:border-slate-700 text-slate-500'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>Dark Mode</span>
              </button>
            </div>
          </div>

          {/* Color Palette */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-2">Accent Color Palette</label>
            <div className="flex items-center space-x-3">
              {colors.map(c => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setPrimaryColor(c.value)}
                  className={`w-10 h-10 rounded-full border-2 transition-transform ${primaryColor === c.value ? 'scale-110 border-white shadow-lg ring-2 ring-indigo-500' : 'border-transparent'}`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
              <button
                type="button"
                onClick={() => {
                  const random = colors[Math.floor(Math.random() * colors.length)].value;
                  setPrimaryColor(random);
                }}
                className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                title="Randomize Color"
              >
                <Shuffle className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-slate-800 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">Company Profile & GSTIN</h3>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Business Name</label>
            <input 
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-white font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Legal Entity Name</label>
            <input 
              type="text"
              value={formData.legalName}
              onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-white font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">GSTIN Number</label>
            <input 
              type="text"
              value={formData.gstin}
              onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-indigo-600"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
            <input 
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-white font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
            <input 
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-white font-medium"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
          <button 
            type="submit"
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg transition-all"
            style={{ backgroundColor: primaryColor }}
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};
