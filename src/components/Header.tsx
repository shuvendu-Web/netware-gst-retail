import React, { useState } from 'react';
import { Search, Bell, ChevronDown, Store, User, LogOut, Plus, Check, Building2, X } from 'lucide-react';

interface HeaderProps {
  user: any;
  onLogout: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  user, 
  onLogout, 
  onOpenSearch
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showBranchMenu, setShowBranchMenu] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<string>(() => {
    return localStorage.getItem('hiffybill_active_branch') || 'Main Branch - Bengaluru';
  });

  const [branches, setBranches] = useState<string[]>(() => {
    const saved = localStorage.getItem('hiffybill_branches');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        // fallback
      }
    }
    return [
      'Main Branch - Bengaluru',
      'Warehouse - Hosur Road',
      'Retail Outlet - Indiranagar',
      'Wholesale Hub - Hubli'
    ];
  });

  const [isAddingBranch, setIsAddingBranch] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchCity, setNewBranchCity] = useState('');

  const handleSelectBranch = (b: string) => {
    setSelectedBranch(b);
    localStorage.setItem('hiffybill_active_branch', b);
    setShowBranchMenu(false);
  };

  const handleAddBranch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newBranchName.trim()) return;
    
    const formatted = newBranchCity.trim() 
      ? `${newBranchName.trim()} - ${newBranchCity.trim()}`
      : newBranchName.trim();

    if (!branches.includes(formatted)) {
      const updated = [...branches, formatted];
      setBranches(updated);
      localStorage.setItem('hiffybill_branches', JSON.stringify(updated));
      setSelectedBranch(formatted);
      localStorage.setItem('hiffybill_active_branch', formatted);
    } else {
      setSelectedBranch(formatted);
      localStorage.setItem('hiffybill_active_branch', formatted);
    }
    setNewBranchName('');
    setNewBranchCity('');
    setIsAddingBranch(false);
    setShowBranchMenu(false);
  };

  return (
    <header className="h-13 sm:h-14 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs transition-all">
      {/* Small Search Bar */}
      <div className="w-56 sm:w-64 md:w-72">
        <div 
          onClick={onOpenSearch}
          className="relative flex items-center bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-xl px-2.5 py-1.5 cursor-pointer transition-all shadow-inner group"
        >
          <Search className="w-3.5 h-3.5 text-slate-400 mr-2 group-hover:text-indigo-500 transition-colors shrink-0" />
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
            Search products, invoices...
          </span>
          <div className="ml-auto flex items-center space-x-0.5 shrink-0 pl-1">
            <kbd className="px-1.5 py-0.5 text-[9px] font-semibold text-slate-500 bg-white dark:bg-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded shadow-xs">⌘K</kbd>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-2.5 ml-4">
        {/* Branch Selector Dropdown */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowBranchMenu(!showBranchMenu);
              setShowProfileMenu(false);
            }}
            className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 px-2.5 py-1.5 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <div className="p-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
              <Store className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <div className="text-[9px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider leading-none">Branch</div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[120px] sm:max-w-[150px] leading-tight">
                {selectedBranch}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5 shrink-0" />
          </button>

          {showBranchMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-2 z-50 animate-fadeIn">
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Branches & Outlets</span>
                <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded">
                  {branches.length} Active
                </span>
              </div>

              <div className="max-h-48 overflow-y-auto py-1 space-y-0.5">
                {branches.map((b) => (
                  <button
                    key={b}
                    onClick={() => handleSelectBranch(b)}
                    className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                      selectedBranch === b 
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 font-bold' 
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate pr-2">
                      <Building2 className={`w-3.5 h-3.5 shrink-0 ${selectedBranch === b ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                      <span className="truncate">{b}</span>
                    </div>
                    {selectedBranch === b && (
                      <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    )}
                  </button>
                ))}
              </div>

              {/* Add Branch Option */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-1.5 mt-1">
                {isAddingBranch ? (
                  <form onSubmit={handleAddBranch} className="p-1 space-y-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2.5">
                    <div className="text-[11px] font-bold text-slate-700 dark:text-slate-200 flex items-center justify-between">
                      <span>Create New Branch</span>
                      <button 
                        type="button" 
                        onClick={() => setIsAddingBranch(false)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={newBranchName}
                      onChange={(e) => setNewBranchName(e.target.value)}
                      placeholder="Branch name (e.g. Bandra Outlet)"
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      autoFocus
                    />
                    <input
                      type="text"
                      value={newBranchCity}
                      onChange={(e) => setNewBranchCity(e.target.value)}
                      placeholder="City / Region (e.g. Mumbai)"
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <div className="flex items-center space-x-2 pt-0.5">
                      <button
                        type="button"
                        onClick={() => setIsAddingBranch(false)}
                        className="flex-1 py-1 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!newBranchName.trim()}
                        className="flex-1 py-1 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center justify-center space-x-1 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Branch</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsAddingBranch(true)}
                    className="w-full flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Branch Option</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 transition-all shadow-xs cursor-pointer">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowBranchMenu(false);
            }}
            className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 p-1 pr-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {user?.email?.[0]?.toUpperCase() || 'D'}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[80px] leading-tight">
                {user?.displayName || user?.email?.split('@')[0] || 'David Grey'}
              </div>
              <div className="text-[9px] text-indigo-600 dark:text-indigo-400 font-bold leading-none">Admin</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-2 z-50 animate-fadeIn">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{user?.displayName || 'David Grey'}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email || 'david.grey@hiffy.com'}</p>
              </div>
              <button 
                onClick={onLogout}
                className="w-full mt-1 flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout Session</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

