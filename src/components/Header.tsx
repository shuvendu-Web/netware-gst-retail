import React, { useState } from 'react';
import { Search, Bell, ChevronDown, Store, User, LogOut } from 'lucide-react';

interface HeaderProps {
  user: any;
  onLogout: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, onOpenSearch }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showBranchMenu, setShowBranchMenu] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('Main Branch - Bengaluru');

  const branches = [
    'Main Branch - Bengaluru',
    'Warehouse - Hosur Road',
    'Retail Outlet - Indiranagar',
    'Wholesale Hub - Hubli'
  ];

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div 
          onClick={onOpenSearch}
          className="relative flex items-center bg-slate-100/80 hover:bg-slate-100 border border-slate-200/80 rounded-2xl px-4 py-2.5 cursor-pointer transition-all shadow-inner group"
        >
          <Search className="w-5 h-5 text-slate-400 mr-3 group-hover:text-indigo-500 transition-colors" />
          <span className="text-sm text-slate-500 font-medium">
            Search products, customers, suppliers, invoices... (e.g. Men's Casual Shirt)
          </span>
          <div className="ml-auto flex items-center space-x-1">
            <kbd className="px-2 py-0.5 text-xs font-semibold text-slate-500 bg-white border border-slate-200 rounded-lg shadow-xs">⌘</kbd>
            <kbd className="px-2 py-0.5 text-xs font-semibold text-slate-500 bg-white border border-slate-200 rounded-lg shadow-xs">K</kbd>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-5 ml-6">
        {/* Branch Selector Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowBranchMenu(!showBranchMenu)}
            className="flex items-center space-x-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-4 py-2 rounded-2xl transition-all shadow-xs"
          >
            <div className="p-1.5 rounded-xl bg-indigo-50 text-indigo-600">
              <Store className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Branch</div>
              <div className="text-xs font-bold text-slate-800">{selectedBranch}</div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
          </button>

          {showBranchMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50">
              <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase">Select Branch / Warehouse</div>
              {branches.map((b) => (
                <button
                  key={b}
                  onClick={() => {
                    setSelectedBranch(b);
                    setShowBranchMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                    selectedBranch === b ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <button className="relative p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 transition-all shadow-xs">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 p-1.5 pr-4 rounded-2xl transition-all shadow-xs"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center shadow-md">
              {user?.email?.[0]?.toUpperCase() || 'D'}
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-slate-800 truncate max-w-[100px]">
                {user?.displayName || user?.email?.split('@')[0] || 'David Grey'}
              </div>
              <div className="text-[10px] text-indigo-600 font-bold">Admin</div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800">{user?.displayName || 'David Grey'}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email || 'david.grey@hiffy.com'}</p>
              </div>
              <button 
                onClick={onLogout}
                className="w-full mt-1 flex items-center space-x-2 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout Session</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
