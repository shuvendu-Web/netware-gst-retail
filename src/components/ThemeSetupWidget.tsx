import React, { useState } from 'react';
import { Settings, Sun, Moon, Palette, X, Shuffle } from 'lucide-react';

interface ThemeSetupWidgetProps {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
}

export const ThemeSetupWidget: React.FC<ThemeSetupWidgetProps> = ({
  primaryColor,
  setPrimaryColor,
  isDarkMode,
  setIsDarkMode
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const colors = [
    { name: 'Primary (Magenta)', value: '#cf45ee' },
    { name: 'Success (Green)', value: '#64e447' },
    { name: 'Caution (Yellow)', value: '#f5e134' },
    { name: 'Danger (Red)', value: '#d91940' },
    { name: 'Indigo', value: '#6366f1' }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className={`mb-3 w-72 p-5 rounded-3xl shadow-2xl border ${
          isDarkMode ? 'bg-slate-900 text-white border-slate-700' : 'bg-white text-slate-800 border-slate-200'
        } animate-fadeIn`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/20 mb-4">
            <h4 className="font-bold text-sm flex items-center gap-2">
              <Palette className="w-4 h-4 text-indigo-500" /> Theme & Mode Setup
            </h4>
            <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-slate-200/20">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mode Toggle */}
          <div className="mb-4">
            <span className="block text-xs font-bold text-slate-400 uppercase mb-2">Display Mode</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setIsDarkMode(false)}
                className={`py-2 px-3 rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 border transition-all ${
                  !isDarkMode ? 'bg-indigo-50 text-indigo-600 border-indigo-300 shadow-xs' : 'border-slate-700 text-slate-400'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Light</span>
              </button>
              <button
                onClick={() => setIsDarkMode(true)}
                className={`py-2 px-3 rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 border transition-all ${
                  isDarkMode ? 'bg-indigo-950 text-indigo-300 border-indigo-600 shadow-xs' : 'border-slate-300 text-slate-600'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          {/* Color Palette */}
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase mb-2">Accent Color Palette</span>
            <div className="flex items-center space-x-2">
              {colors.map(c => (
                <button
                  key={c.value}
                  onClick={() => setPrimaryColor(c.value)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${primaryColor === c.value ? 'scale-110 border-white shadow-lg' : 'border-transparent'}`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
              <button
                onClick={() => {
                  const random = colors[Math.floor(Math.random() * colors.length)].value;
                  setPrimaryColor(random);
                }}
                className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                title="Randomize Color"
              >
                <Shuffle className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Settings Gear Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-slate-900 text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-transform border-2 border-slate-700 group"
        title="Theme Setup"
      >
        <Settings className="w-6 h-6 group-hover:rotate-95 transition-transform duration-300" style={{ color: primaryColor }} />
      </button>
    </div>
  );
};
