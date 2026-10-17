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
  ChevronLeft,
  Cpu
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
    { 
      id: 'dashboard' as TabType, 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      iconColor: 'text-sky-400 group-hover:text-sky-300',
      textGradient: 'from-sky-300 via-cyan-200 to-sky-400'
    },
    { 
      id: 'sales' as TabType, 
      label: 'Sales', 
      icon: ShoppingBag, 
      badge: 'New',
      iconColor: 'text-emerald-400 group-hover:text-emerald-300',
      textGradient: 'from-emerald-300 via-teal-200 to-emerald-400'
    },
    { 
      id: 'purchases' as TabType, 
      label: 'Purchases', 
      icon: ShoppingCart,
      iconColor: 'text-amber-400 group-hover:text-amber-300',
      textGradient: 'from-amber-300 via-orange-200 to-amber-400'
    },
    { 
      id: 'inventory' as TabType, 
      label: 'Inventory', 
      icon: Boxes,
      iconColor: 'text-violet-400 group-hover:text-violet-300',
      textGradient: 'from-violet-300 via-purple-200 to-violet-400'
    },
    { 
      id: 'products' as TabType, 
      label: 'Products & AI', 
      icon: Package,
      iconColor: 'text-pink-400 group-hover:text-pink-300',
      textGradient: 'from-pink-300 via-rose-200 to-pink-400'
    },
    { 
      id: 'parties' as TabType, 
      label: 'Parties', 
      icon: Users,
      iconColor: 'text-blue-400 group-hover:text-blue-300',
      textGradient: 'from-blue-300 via-indigo-200 to-blue-400'
    },
    { 
      id: 'payments' as TabType, 
      label: 'Payments', 
      icon: CreditCard,
      iconColor: 'text-teal-400 group-hover:text-teal-300',
      textGradient: 'from-teal-300 via-cyan-200 to-teal-400'
    },
    { 
      id: 'reports' as TabType, 
      label: 'Reports', 
      icon: BarChart3,
      iconColor: 'text-yellow-400 group-hover:text-yellow-300',
      textGradient: 'from-yellow-300 via-amber-200 to-yellow-400'
    },
    { 
      id: 'ai-assistant' as TabType, 
      label: 'AI Assistant', 
      icon: Bot, 
      highlight: true,
      iconColor: 'text-fuchsia-400 group-hover:text-fuchsia-300',
      textGradient: 'from-fuchsia-300 via-pink-200 to-fuchsia-400'
    },
    { 
      id: 'ai-agent' as TabType, 
      label: 'Auto-Healing', 
      icon: Cpu, 
      badge: 'AI', 
      isAutoHealSpecial: true
    },
    { 
      id: 'settings' as TabType, 
      label: 'Settings', 
      icon: Settings,
      iconColor: 'text-slate-300 group-hover:text-white',
      textGradient: 'from-slate-200 via-zinc-100 to-slate-400'
    },
  ];

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-56'} bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 select-none shadow-2xl border-r border-slate-800 transition-all duration-300 relative`}>
      {/* Collapse Toggle Button */}
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-5 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-500 transition-transform z-40 text-xs cursor-pointer"
        title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      <div>
        {/* Brand Header with Uiverse Logo Style */}
        <div className={`p-3 px-3.5 border-b border-slate-800 flex items-center ${collapsed ? 'justify-center' : ''}`}>
          <div className="uiverse shrink-0 !rounded-xl">
            <div className="wrapper !p-1.5 !min-width-auto flex items-center space-x-2">
              <Boxes className="w-5 h-5 text-white shrink-0" />
              {!collapsed && (
                <div className="text-left">
                  <h1 className="font-black text-xs text-white tracking-tight">AI Netware</h1>
                  <p className="text-[8px] text-slate-300">GST billing & ERP</p>
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

        {/* Navigation Menu - Multicolor Text & Uiverse Auto-Healing */}
        <nav className="p-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            // 3. Auto-Healing Menu item - Exclusively uses Uiverse MuhammadHasann effect
            if (item.isAutoHealSpecial) {
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`autoheal-sparkle-btn ${isActive ? 'is-active' : ''} ${collapsed ? '!justify-center !px-1.5' : ''}`}
                >
                  <div className="dots_border"></div>
                  <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-2'} relative z-10 w-full`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="sparkle shrink-0"
                    >
                      <path
                        className="path"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="currentColor"
                        d="M14.187 8.096L15 5.25L15.813 8.096C16.0231 8.83114 16.4171 9.50062 16.9577 10.0413C17.4984 10.5819 18.1679 10.9759 18.903 11.186L21.75 12L18.904 12.813C18.1689 13.0231 17.4994 13.4171 16.9587 13.9577C16.4181 14.4984 16.0241 15.1679 15.814 15.903L15 18.75L14.187 15.904C13.9769 15.1689 13.5829 14.4994 13.0423 13.9587C12.5016 13.4181 11.8321 13.0241 11.097 12.814L8.25 12L11.096 11.187C11.8311 10.9769 12.5006 10.5829 13.0413 10.0423C13.5819 9.50162 13.9759 8.83214 14.186 8.097L14.187 8.096Z"
                      ></path>
                      <path
                        className="path"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="currentColor"
                        d="M6 14.25L5.741 15.285C5.59267 15.8785 5.28579 16.4206 4.85319 16.8532C4.42059 17.2858 3.87853 17.5927 3.285 17.741L2.25 18L3.285 18.259C3.87853 18.4073 4.42059 18.7142 4.85319 19.1468C5.28579 19.5794 5.59267 20.1215 5.741 20.715L6 21.75L6.259 20.715C6.40725 20.1216 6.71398 19.5796 7.14639 19.147C7.5788 18.7144 8.12065 18.4075 8.714 18.259L9.75 18L8.714 17.741C8.12065 17.5925 7.5788 17.2856 7.14639 16.853C6.71398 16.4204 6.40725 15.8784 6.259 15.285L6 14.25Z"
                      ></path>
                      <path
                        className="path"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="currentColor"
                        d="M6.5 4L6.303 4.5915C6.24777 4.75718 6.15472 4.90774 6.03123 5.03123C5.90774 5.15472 5.75718 5.24777 5.5915 5.303L5 5.5L5.5915 5.697C5.75718 5.75223 5.90774 5.84528 6.03123 5.96877C6.15472 6.09226 6.24777 6.24282 6.303 6.4085L6.5 7L6.697 6.4085C6.75223 6.24282 6.84528 6.09226 6.96877 5.96877C7.09226 5.84528 7.24282 5.75223 7.4085 5.697L8 5.5L7.4085 5.303C7.24282 5.24777 7.09226 5.15472 6.96877 5.03123C6.84528 4.90774 6.75223 4.75718 6.697 4.5915L6.5 4Z"
                      ></path>
                    </svg>
                    {!collapsed && (
                      <div className="flex items-center justify-between flex-1">
                        <span className={`text_button ${isActive ? '!text-black !font-black' : ''}`}>Auto-Healing</span>
                        {item.badge && (
                          <span className={`text-[9px] ${isActive ? 'bg-slate-900 text-white border-slate-900' : 'bg-purple-500/30 text-purple-200 border-purple-400/40'} font-bold px-1.5 py-0.2 rounded-full border`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              );
            }

            // 2. Standard Menu Items with Multicolor Text
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center ${collapsed ? 'justify-center' : 'justify-between'} ${isActive ? '!p-0' : 'p-0.5'} rounded-xl text-xs font-semibold transition-all duration-200 group relative cursor-pointer ${
                  isActive
                    ? 'uiverse uiverse-active-tab text-white shadow-md font-bold w-full !rounded-xl overflow-hidden'
                    : item.highlight
                    ? 'bg-slate-800/40 hover:bg-slate-800/80 border border-fuchsia-500/20 px-3 py-1.5'
                    : 'hover:bg-slate-800/80 px-3 py-1.5'
                }`}
              >
                {isActive ? (
                  <div className="wrapper w-full flex items-center justify-between !py-1.5 !px-3 relative overflow-hidden rounded-xl">
                    <div className={`flex items-center ${collapsed ? '' : 'space-x-2.5'} relative z-10`}>
                      <Icon className="w-4 h-4 text-black shrink-0" />
                      {!collapsed && (
                        <span className="font-black text-xs tracking-wide text-black">
                          {item.label}
                        </span>
                      )}
                    </div>
                    {!collapsed && item.badge && (
                      <span className="text-[9px] bg-slate-900 text-white font-bold px-1.5 py-0.2 rounded-full relative z-10">
                        {item.badge}
                      </span>
                    )}
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
                ) : (
                  <>
                    <div className={`flex items-center ${collapsed ? '' : 'space-x-2.5'}`}>
                      <Icon className={`w-4 h-4 ${item.iconColor} transition-transform group-hover:scale-110 shrink-0`} />
                      {!collapsed && (
                        <span className={`font-bold text-xs bg-gradient-to-r ${item.textGradient} bg-clip-text text-transparent group-hover:brightness-125 transition-all`}>
                          {item.label}
                        </span>
                      )}
                    </div>
                    {!collapsed && item.badge && (
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.2 rounded-full border border-emerald-500/30">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Pro Plan Card - Compact */}
      {!collapsed && (
        <div className="p-2.5 m-2.5 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/60 text-white">
          <div className="flex items-center space-x-1.5 mb-0.5">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-black">Pro Plan Active</span>
          </div>
          <p className="text-[9px] text-slate-400 font-medium">Multi-branch & AI enabled</p>
        </div>
      )}
    </aside>
  );
};
