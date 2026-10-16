import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ShoppingCart, 
  Package, 
  Boxes, 
  Users, 
  CreditCard, 
  BarChart3, 
  Bot, 
  Settings, 
  Crown,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { TabType } from '../types';

interface SidebarProps {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab }) => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'sales' as TabType, label: 'Sales', icon: ShoppingBag, badge: 'New' },
    { id: 'purchases' as TabType, label: 'Purchases', icon: ShoppingCart },
    { id: 'inventory' as TabType, label: 'Inventory', icon: Boxes },
    { id: 'products' as TabType, label: 'Products & AI', icon: Package },
    { id: 'parties' as TabType, label: 'Parties', icon: Users },
    { id: 'payments' as TabType, label: 'Payments', icon: CreditCard },
    { id: 'reports' as TabType, label: 'Reports', icon: BarChart3 },
    { id: 'ai-assistant' as TabType, label: 'AI Assistant', icon: Bot, highlight: true },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings },
  ];

  return (
    <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 select-none shadow-2xl border-r border-slate-800 transition-all duration-300 relative`}>
      {/* Collapse Toggle Button */}
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3.5 top-7 w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-500 transition-transform z-40"
        title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      <div>
        {/* Brand Header with Uiverse Logo Style */}
        <div className={`p-5 border-b border-slate-800 flex items-center ${collapsed ? 'justify-center' : ''}`}>
          <div className="uiverse shrink-0">
            <div className="wrapper !p-2 !min-width-auto flex items-center space-x-2">
              <Boxes className="w-6 h-6 text-white shrink-0" />
              {!collapsed && (
                <div className="text-left">
                  <h1 className="font-black text-xs text-white tracking-tight">AI Netware</h1>
                  <p className="text-[9px] text-slate-300">GST billings & ERP</p>
                </div>
              )}
            </div>
            <div className="circle circle-12"></div>
            <div className="circle circle-11"></div>
            <div className="circle circle-10"></div>
            <div className="circle circle-9"></div>
            <div className="circle circle-8"></div>
            <div className="circle circle-7"></div>
            <div className="circle circle-6"></div>
            <div className="circle circle-5"></div>
            <div className="circle circle-4"></div>
            <div className="circle circle-3"></div>
            <div className="circle circle-2"></div>
            <div className="circle circle-1"></div>
          </div>
        </div>

        {/* Navigation Menu - Full height without scroll */}
        <nav className="p-3 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'uiverse text-white shadow-lg font-bold w-full !rounded-2xl'
                    : item.highlight
                    ? 'bg-slate-800/50 text-indigo-300 hover:bg-slate-800 border border-indigo-500/30'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                {isActive ? (
                  <div className="wrapper w-full flex items-center justify-between !py-2 !px-3">
                    <div className={`flex items-center ${collapsed ? '' : 'space-x-3'}`}>
                      <Icon className="w-5 h-5 text-white" />
                      {!collapsed && <span className="font-black text-white">{item.label}</span>}
                    </div>
                    {!collapsed && item.badge && (
                      <span className="text-[10px] bg-emerald-500/30 text-emerald-200 font-bold px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                ) : (
                  <>
                    <div className={`flex items-center ${collapsed ? '' : 'space-x-3'}`}>
                      <Icon className="w-5 h-5 text-slate-400 group-hover:text-white transition-transform group-hover:scale-110" />
                      {!collapsed && <span className="text-black dark:text-slate-200 font-bold">{item.label}</span>}
                    </div>
                    {!collapsed && item.badge && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded-full border border-emerald-500/30">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {isActive && (
                  <>
                    <div className="circle circle-12"></div>
                    <div className="circle circle-11"></div>
                    <div className="circle circle-10"></div>
                    <div className="circle circle-9"></div>
                    <div className="circle circle-8"></div>
                    <div className="circle circle-7"></div>
                    <div className="circle circle-6"></div>
                    <div className="circle circle-5"></div>
                    <div className="circle circle-4"></div>
                    <div className="circle circle-3"></div>
                    <div className="circle circle-2"></div>
                    <div className="circle circle-1"></div>
                  </>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Pro Plan Card */}
      {!collapsed && (
        <div className="p-3 m-3 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 text-white">
          <div className="flex items-center space-x-2 mb-1">
            <Crown className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-black">Pro Plan Active</span>
          </div>
          <p className="text-[10px] text-slate-400 font-bold">Multi-branch & AI enabled</p>
        </div>
      )}
    </aside>
  );
};
