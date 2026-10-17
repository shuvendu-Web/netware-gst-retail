import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  User, 
  Brain, 
  Package, 
  ZoomIn, 
  CheckCircle2, 
  X, 
  ChevronRight, 
  ChevronLeft,
  ArrowRight, 
  Trash2, 
  Copy, 
  Check,
  Layers,
  Edit3,
  Sliders,
  Save,
  FileText,
  Truck,
  ShoppingCart,
  Users,
  CreditCard,
  Barcode,
  Search,
  Receipt,
  BookOpen,
  ArrowUpRight,
  TrendingUp,
  Tag,
  Plus
} from 'lucide-react';
import { ChatMessage, Product } from '../types';

interface AiAssistantProps {
  onNavigateTab?: (tab: string) => void;
  onAddProduct?: (product: Product) => void;
}

// Interactive Horizontal Carousel for AI Catalog Matches
interface CatalogCarouselProps {
  products: any[];
  onQuickAdd: (product: any) => void;
  onZoom: (product: any) => void;
}

const CatalogCarousel: React.FC<CatalogCarouselProps> = ({ products, onQuickAdd, onZoom }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(products.length > 1);
  const [activeIdx, setActiveIdx] = useState(0);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      const cardWidth = 320;
      const idx = Math.min(Math.round(scrollLeft / cardWidth), products.length - 1);
      setActiveIdx(idx);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 330;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="w-full bg-slate-900/95 dark:bg-slate-950 text-white rounded-3xl p-4 sm:p-5 border border-indigo-500/40 shadow-2xl space-y-4">
      {/* Carousel Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-indigo-500/20">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-xl bg-amber-400/20 text-amber-400">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-black text-indigo-300">
                AI Catalog Matches with Google Images & 9 GST Attributes
              </h3>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#64e447] border border-emerald-500/30">
                {products.length} Matches Carousel
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-bold">
              Swipe or use arrows to view all verified catalog items and add to ERP master.
            </p>
          </div>
        </div>

        {/* Carousel Navigation Buttons */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-[11px] font-mono font-bold text-indigo-300 hidden sm:inline">
            {activeIdx + 1} of {products.length}
          </span>
          <button
            type="button"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-white flex items-center justify-center border border-slate-700 transition-all shadow-md active:scale-95 cursor-pointer disabled:cursor-not-allowed"
            title="Previous item"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="w-8 h-8 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:hover:bg-indigo-600 text-white flex items-center justify-center border border-indigo-400/30 transition-all shadow-md active:scale-95 cursor-pointer disabled:cursor-not-allowed"
            title="Next item"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Carousel Track */}
      <div 
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex items-stretch gap-3.5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 scrollbar-none"
      >
        {products.map((p, idx) => (
          <div 
            key={idx}
            className="min-w-[285px] sm:min-w-[315px] max-w-[325px] bg-slate-800/90 rounded-2xl p-3.5 border border-indigo-500/30 flex flex-col justify-between space-y-3 shrink-0 snap-start shadow-xl hover:border-indigo-400 transition-all"
          >
            {/* Image Preview with Zoom */}
            <div 
              onClick={() => onZoom(p)}
              className="relative w-full h-36 rounded-xl overflow-hidden bg-slate-950 border border-slate-700/80 cursor-pointer group"
              title="Click to Zoom Image"
            >
              <img 
                src={p.imageUrl} 
                alt={p.productName} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
              />
              <div className="absolute top-2 left-2 bg-slate-950/75 backdrop-blur-md px-2 py-0.5 rounded-full text-[9px] font-black text-emerald-400 border border-emerald-500/30 flex items-center gap-1 shadow-xs">
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" /> AI Verified
              </div>
              <div className="absolute top-2 right-2 bg-slate-950/75 backdrop-blur-md px-2 py-0.5 rounded-full text-[9px] font-black text-amber-300 border border-amber-500/30">
                {idx + 1}/{products.length}
              </div>
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-xs font-black text-white">
                <ZoomIn className="w-4 h-4 text-white" /> Click to Zoom
              </div>
            </div>

            {/* Product Meta */}
            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold mb-1">
                <span>{p.brand}</span>
                <span className="text-indigo-400">{p.category}</span>
              </div>
              <h4 className="text-xs sm:text-sm font-black text-white line-clamp-1">
                {p.productName}
              </h4>
            </div>

            {/* 9 GST & ERP Attributes Grid */}
            <div className="grid grid-cols-3 gap-1.5 text-[10px] bg-slate-900/90 p-2.5 rounded-xl border border-slate-700/60 font-mono">
              <div>
                <span className="text-slate-400 block text-[8px] uppercase">HSN Code</span>
                <span className="font-bold text-amber-300">{p.hsnCode}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[8px] uppercase">GST Rate</span>
                <span className="font-bold text-emerald-400">{p.gstRate}%</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[8px] uppercase">UOM</span>
                <span className="font-bold text-slate-200">{p.units}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[8px] uppercase">Buy Price</span>
                <span className="font-bold text-slate-200">₹{p.purchasePrice}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[8px] uppercase">Sell Price</span>
                <span className="font-bold text-emerald-300">₹{p.sellingPrice}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[8px] uppercase">Confidence</span>
                <span className="font-bold text-cyan-300">{p.confidenceScore}%</span>
              </div>
            </div>

            {/* Action Button */}
            <button
              type="button"
              onClick={() => onQuickAdd(p)}
              className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Package className="w-3.5 h-3.5" />
              <span>+ Quick Add to Product Master</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// ALL ERP STEP-BY-STEP FLOW DEFINITIONS
// ==========================================
// ALL ERP STEP-BY-STEP FLOW DEFINITIONS
// ==========================================
interface ERPStepItem {
  num: number;
  badge: string;
  title: string;
  desc: string;
  icon: any;
  actionable?: boolean;
  actionText?: string;
  tab?: string;
}

interface ERPStepFlowDefinition {
  id: string;
  featureName: string;
  category: string;
  breadcrumbString: string;
  pills: Array<{ text: string; colorClass: string }>;
  steps: ERPStepItem[];
  targetTab: string;
  targetTabName: string;
  keywords: string[];
}

const ERP_STEP_FLOWS: ERPStepFlowDefinition[] = [
  {
    id: 'add-product',
    featureName: 'How to Add Product',
    category: 'Inventory',
    breadcrumbString: 'click Products & AI > Add New Product button > open Add New Product & AI Assistant > input product name > edit > clicksave product button',
    pills: [
      { text: 'click Products & AI', colorClass: 'bg-indigo-600 text-white' },
      { text: 'Add New Product button', colorClass: 'bg-purple-600 text-white' },
      { text: 'open Add New Product & AI Assistant', colorClass: 'bg-slate-900 text-white dark:bg-slate-800' },
      { text: 'input product name', colorClass: 'bg-cyan-700 text-white' },
      { text: 'edit', colorClass: 'bg-amber-600 text-white' },
      { text: 'clicksave product button', colorClass: 'bg-emerald-600 text-white' }
    ],
    targetTab: 'products',
    targetTabName: 'Products & AI',
    keywords: ['add product', 'create product', 'new product', 'item add', 'kaise add'],
    steps: [
      {
        num: 1,
        badge: 'Step 1',
        title: 'click Products & AI',
        desc: "Navigate to the 'Products & AI' module from the sidebar navigation or quick menu.",
        icon: Package,
        actionable: true,
        actionText: 'Go to Products & AI',
        tab: 'products'
      },
      {
        num: 2,
        badge: 'Step 2',
        title: 'Add New Product button',
        desc: "Click the primary '+ Add New Product' button positioned at the top right of the table.",
        icon: Layers,
        actionable: false
      },
      {
        num: 3,
        badge: 'Step 3',
        title: 'open Add New Product & AI Assistant',
        desc: "The 'Add New Product & AI Assistant' modal popup opens with intelligent auto-discovery.",
        icon: Sparkles,
        actionable: false
      },
      {
        num: 4,
        badge: 'Step 4',
        title: 'input product name',
        desc: 'Type product title (e.g., Lay\'s, Basmati Rice, Jeans) to auto-fill GST%, HSN & catalog image.',
        icon: Edit3,
        actionable: false
      },
      {
        num: 5,
        badge: 'Step 5',
        title: 'edit',
        desc: 'Review and edit pricing, GST rate, HSN/SAC code, brand, and opening stock attributes.',
        icon: Sliders,
        actionable: false
      },
      {
        num: 6,
        badge: 'Step 6',
        title: 'clicksave product button',
        desc: "Click the 'Save Product' button at the bottom right to record the item into inventory master.",
        icon: Save,
        actionable: false
      }
    ]
  },
  {
    id: 'sales-invoice',
    featureName: 'How to Create GST Sales Invoice',
    category: 'Sales',
    breadcrumbString: 'click Sales & Invoices > New GST Sales Invoice button > enter Customer Name & Phone > select Products > adjust Qty & Discount > choose Payment Mode > click Issue & Print GST Invoice',
    pills: [
      { text: 'click Sales & Invoices', colorClass: 'bg-indigo-600 text-white' },
      { text: 'New GST Sales Invoice button', colorClass: 'bg-purple-600 text-white' },
      { text: 'enter Customer Name & Phone', colorClass: 'bg-cyan-700 text-white' },
      { text: 'select Products', colorClass: 'bg-amber-600 text-white' },
      { text: 'adjust Qty & Discount', colorClass: 'bg-rose-600 text-white' },
      { text: 'choose Payment Mode', colorClass: 'bg-blue-600 text-white' },
      { text: 'click Issue & Print GST Invoice', colorClass: 'bg-emerald-600 text-white' }
    ],
    targetTab: 'sales',
    targetTabName: 'Sales & Invoices',
    keywords: ['create invoice', 'sales invoice', 'gst bill', 'new sale', 'billing', 'pos'],
    steps: [
      {
        num: 1,
        badge: 'Step 1',
        title: 'click Sales & Invoices',
        desc: 'Open the Sales & Invoices module from the sidebar navigation or dashboard quick action.',
        icon: FileText,
        actionable: true,
        actionText: 'Go to Sales & Invoices',
        tab: 'sales'
      },
      {
        num: 2,
        badge: 'Step 2',
        title: 'New GST Sales Invoice button',
        desc: "Click the prominent '+ New GST Sales Invoice' button to open the billing modal.",
        icon: Receipt,
        actionable: false
      },
      {
        num: 3,
        badge: 'Step 3',
        title: 'enter Customer Name & Phone',
        desc: 'Search customer name with live autocomplete, enter phone number, and verify OTP if required.',
        icon: Users,
        actionable: false
      },
      {
        num: 4,
        badge: 'Step 4',
        title: 'select Products',
        desc: 'Click on catalog product chips (shows up to 4 items with expand toggle) or scan barcode.',
        icon: Package,
        actionable: false
      },
      {
        num: 5,
        badge: 'Step 5',
        title: 'adjust Qty & Discount',
        desc: 'Adjust line item quantities, discounts, or click the Edit icon in action column to modify rates.',
        icon: Edit3,
        actionable: false
      },
      {
        num: 6,
        badge: 'Step 6',
        title: 'choose Payment Mode',
        desc: 'Select payment mode (Cash, UPI, Bank Transfer, or Credit/Ledger) and mark payment status.',
        icon: CreditCard,
        actionable: false
      },
      {
        num: 7,
        badge: 'Step 7',
        title: 'click Issue & Print GST Invoice',
        desc: 'Click Issue Invoice to finalize, deduct stock in real time, and print thermal/A4 GST bill.',
        icon: CheckCircle2,
        actionable: false
      }
    ]
  },
  {
    id: 'add-supplier',
    featureName: 'How to Add Supplier & Products Details',
    category: 'Purchases',
    breadcrumbString: 'click Purchase Orders & Bills > Add Supplier button > input Supplier Name & GSTIN > add Supplied Products details (Name, Rate, HSN, GST%) > toggle Add to Master > click Save Supplier & Products',
    pills: [
      { text: 'click Purchase Orders & Bills', colorClass: 'bg-indigo-600 text-white' },
      { text: 'Add Supplier button', colorClass: 'bg-purple-600 text-white' },
      { text: 'input Supplier Name & GSTIN', colorClass: 'bg-cyan-700 text-white' },
      { text: 'add Supplied Products details', colorClass: 'bg-amber-600 text-white' },
      { text: 'toggle Add to Master', colorClass: 'bg-pink-600 text-white' },
      { text: 'click Save Supplier & Products', colorClass: 'bg-emerald-600 text-white' }
    ],
    targetTab: 'purchases',
    targetTabName: 'Purchase Orders & Bills',
    keywords: ['add supplier', 'new supplier', 'vendor', 'supplier product', 'supplier details'],
    steps: [
      {
        num: 1,
        badge: 'Step 1',
        title: 'click Purchase Orders & Bills',
        desc: 'Navigate to Purchase Orders & Bills from the sidebar.',
        icon: ShoppingCart,
        actionable: true,
        actionText: 'Go to Purchases',
        tab: 'purchases'
      },
      {
        num: 2,
        badge: 'Step 2',
        title: 'Add Supplier button',
        desc: "Click the '+ Add Supplier' button in the top header ribbon.",
        icon: Truck,
        actionable: false
      },
      {
        num: 3,
        badge: 'Step 3',
        title: 'input Supplier Name & GSTIN',
        desc: 'Enter vendor company name, contact person, phone number, and 15-character GSTIN.',
        icon: Edit3,
        actionable: false
      },
      {
        num: 4,
        badge: 'Step 4',
        title: 'add Supplied Products details',
        desc: 'Enter product names, categories, HSN codes, purchase rates (₹), MOQ, and GST rates.',
        icon: Package,
        actionable: false
      },
      {
        num: 5,
        badge: 'Step 5',
        title: 'toggle Add to Master',
        desc: "Keep 'Also automatically add products to Product Master' checked to update inventory.",
        icon: Check,
        actionable: false
      },
      {
        num: 6,
        badge: 'Step 6',
        title: 'click Save Supplier & Products',
        desc: 'Click Save to register the supplier profile and make items immediately purchasable.',
        icon: Save,
        actionable: false
      }
    ]
  },
  {
    id: 'purchase-order',
    featureName: 'How to Create Purchase Order & Bill',
    category: 'Purchases',
    breadcrumbString: 'click Purchase Orders & Bills > New Purchase Order button > select Supplier > pick Products & Batch > enter Purchase Qty & Rate > click Save PO & Receive Stock',
    pills: [
      { text: 'click Purchase Orders & Bills', colorClass: 'bg-indigo-600 text-white' },
      { text: 'New Purchase Order button', colorClass: 'bg-purple-600 text-white' },
      { text: 'select Supplier', colorClass: 'bg-cyan-700 text-white' },
      { text: 'pick Products & Batch', colorClass: 'bg-amber-600 text-white' },
      { text: 'enter Purchase Qty & Rate', colorClass: 'bg-blue-600 text-white' },
      { text: 'click Save PO & Receive Stock', colorClass: 'bg-emerald-600 text-white' }
    ],
    targetTab: 'purchases',
    targetTabName: 'Purchase Orders & Bills',
    keywords: ['create po', 'purchase order', 'purchase bill', 'buy stock', 'order supplier'],
    steps: [
      {
        num: 1,
        badge: 'Step 1',
        title: 'click Purchase Orders & Bills',
        desc: 'Open the Purchase Orders & Bills screen from the sidebar navigation.',
        icon: ShoppingCart,
        actionable: true,
        actionText: 'Go to Purchases',
        tab: 'purchases'
      },
      {
        num: 2,
        badge: 'Step 2',
        title: 'New Purchase Order button',
        desc: "Click '+ New Purchase Order' in the header to launch the PO issuance window.",
        icon: Plus,
        actionable: false
      },
      {
        num: 3,
        badge: 'Step 3',
        title: 'select Supplier',
        desc: 'Choose vendor from the list of registered suppliers (e.g. India Gate Foods, Peter England).',
        icon: Truck,
        actionable: false
      },
      {
        num: 4,
        badge: 'Step 4',
        title: 'pick Products & Batch',
        desc: 'Select product items supplied by this vendor and specify batch or expiry dates.',
        icon: Package,
        actionable: false
      },
      {
        num: 5,
        badge: 'Step 5',
        title: 'enter Purchase Qty & Rate',
        desc: 'Input quantity to purchase and confirmed unit cost; taxes calculate automatically.',
        icon: Sliders,
        actionable: false
      },
      {
        num: 6,
        badge: 'Step 6',
        title: 'click Save PO & Receive Stock',
        desc: 'Save the PO to issue order and immediately replenish warehouse stock in ledger.',
        icon: Save,
        actionable: false
      }
    ]
  },
  {
    id: 'parties',
    featureName: 'How to Manage Parties (Customers & Suppliers)',
    category: 'Parties',
    breadcrumbString: 'click Parties > switch to All Parties or Customers/Suppliers > click Add New Party button > choose Customer or Supplier > enter GSTIN, Phone & Credit Limit > click Save Party',
    pills: [
      { text: 'click Parties', colorClass: 'bg-indigo-600 text-white' },
      { text: 'switch to All Parties', colorClass: 'bg-purple-600 text-white' },
      { text: 'click Add New Party button', colorClass: 'bg-cyan-700 text-white' },
      { text: 'choose Customer or Supplier', colorClass: 'bg-blue-600 text-white' },
      { text: 'enter GSTIN, Phone & Credit Limit', colorClass: 'bg-amber-600 text-white' },
      { text: 'click Save Party', colorClass: 'bg-emerald-600 text-white' }
    ],
    targetTab: 'parties',
    targetTabName: 'Party Management',
    keywords: ['parties', 'customer', 'supplier', 'manage parties', 'all parties', 'add customer'],
    steps: [
      {
        num: 1,
        badge: 'Step 1',
        title: 'click Parties',
        desc: "Open 'Party Management (Customers & Suppliers)' from the sidebar.",
        icon: Users,
        actionable: true,
        actionText: 'Go to Parties',
        tab: 'parties'
      },
      {
        num: 2,
        badge: 'Step 2',
        title: 'switch to All Parties',
        desc: 'View all Customer and Supplier names together in the unified directory table.',
        icon: BookOpen,
        actionable: false
      },
      {
        num: 3,
        badge: 'Step 3',
        title: 'click Add New Party button',
        desc: "Click the '+ Add New Party' button at the top right.",
        icon: Plus,
        actionable: false
      },
      {
        num: 4,
        badge: 'Step 4',
        title: 'choose Customer or Supplier',
        desc: 'Toggle party type: Customer (for buyers) or Supplier (for vendors).',
        icon: Layers,
        actionable: false
      },
      {
        num: 5,
        badge: 'Step 5',
        title: 'enter GSTIN, Phone & Credit Limit',
        desc: 'Fill business name, phone, email, 15-character GSTIN, state, and credit terms.',
        icon: Edit3,
        actionable: false
      },
      {
        num: 6,
        badge: 'Step 6',
        title: 'click Save Party',
        desc: 'Save party details to track real-time receivables, payables, and billing history.',
        icon: Save,
        actionable: false
      }
    ]
  },
  {
    id: 'inventory',
    featureName: 'How to Track Inventory & Stock Ledger',
    category: 'Inventory',
    breadcrumbString: 'click Inventory & Stock > view Real-time Stock Levels > click Stock Ledger tab > filter by Product or Transaction Type > inspect Opening, In/Out & Balance Qty',
    pills: [
      { text: 'click Inventory & Stock', colorClass: 'bg-indigo-600 text-white' },
      { text: 'view Real-time Stock Levels', colorClass: 'bg-purple-600 text-white' },
      { text: 'click Stock Ledger tab', colorClass: 'bg-cyan-700 text-white' },
      { text: 'filter by Product / Type', colorClass: 'bg-amber-600 text-white' },
      { text: 'inspect Opening, In/Out & Balance Qty', colorClass: 'bg-emerald-600 text-white' }
    ],
    targetTab: 'inventory',
    targetTabName: 'Inventory & Stock',
    keywords: ['stock', 'inventory', 'stock ledger', 'balance', 'stock audit', 'low stock'],
    steps: [
      {
        num: 1,
        badge: 'Step 1',
        title: 'click Inventory & Stock',
        desc: 'Select Inventory & Stock from the sidebar.',
        icon: Package,
        actionable: true,
        actionText: 'Go to Inventory',
        tab: 'inventory'
      },
      {
        num: 2,
        badge: 'Step 2',
        title: 'view Real-time Stock Levels',
        desc: 'Review total stock value, low-stock warning banners, and category stock breakdown.',
        icon: TrendingUp,
        actionable: false
      },
      {
        num: 3,
        badge: 'Step 3',
        title: 'click Stock Ledger tab',
        desc: 'Switch to the audit trail stock movement ledger tab.',
        icon: BookOpen,
        actionable: false
      },
      {
        num: 4,
        badge: 'Step 4',
        title: 'filter by Product or Transaction Type',
        desc: 'Filter movements by Sale, Purchase, Return, Opening Stock, or Adjustment.',
        icon: Sliders,
        actionable: false
      },
      {
        num: 5,
        badge: 'Step 5',
        title: 'inspect Opening, In/Out & Balance Qty',
        desc: 'Verify exact unit changes, invoice/PO reference numbers, and user timestamps.',
        icon: CheckCircle2,
        actionable: false
      }
    ]
  },
  {
    id: 'payments',
    featureName: 'How to Record Payments & Settle Ledgers',
    category: 'Finance',
    breadcrumbString: 'click Payments & Ledgers > click Record Payment button > select Party (Customer/Supplier) > enter Received/Paid Amount > pick Mode (Cash/UPI/Bank) > click Save Receipt',
    pills: [
      { text: 'click Payments & Ledgers', colorClass: 'bg-indigo-600 text-white' },
      { text: 'click Record Payment button', colorClass: 'bg-purple-600 text-white' },
      { text: 'select Party (Customer/Supplier)', colorClass: 'bg-cyan-700 text-white' },
      { text: 'enter Received/Paid Amount', colorClass: 'bg-amber-600 text-white' },
      { text: 'pick Mode (Cash/UPI/Bank)', colorClass: 'bg-blue-600 text-white' },
      { text: 'click Save Receipt', colorClass: 'bg-emerald-600 text-white' }
    ],
    targetTab: 'payments',
    targetTabName: 'Payments & Ledgers',
    keywords: ['payment', 'record payment', 'payment in', 'payment out', 'receipt', 'settle'],
    steps: [
      {
        num: 1,
        badge: 'Step 1',
        title: 'click Payments & Ledgers',
        desc: 'Navigate to Payments & Ledgers from the sidebar.',
        icon: CreditCard,
        actionable: true,
        actionText: 'Go to Payments',
        tab: 'payments'
      },
      {
        num: 2,
        badge: 'Step 2',
        title: 'click Record Payment button',
        desc: "Click '+ Record Payment' at the top of the payments table.",
        icon: Plus,
        actionable: false
      },
      {
        num: 3,
        badge: 'Step 3',
        title: 'select Party (Customer/Supplier)',
        desc: 'Choose Payment In (from customer) or Payment Out (to supplier) and select party.',
        icon: Users,
        actionable: false
      },
      {
        num: 4,
        badge: 'Step 4',
        title: 'enter Received/Paid Amount',
        desc: 'Input payment amount in ₹ and allocate to specific invoice or against ledger balance.',
        icon: Edit3,
        actionable: false
      },
      {
        num: 5,
        badge: 'Step 5',
        title: 'pick Mode (Cash/UPI/Bank)',
        desc: 'Select payment channel: UPI QR, Cash, Cheque, or NEFT/RTGS bank transfer.',
        icon: Sliders,
        actionable: false
      },
      {
        num: 6,
        badge: 'Step 6',
        title: 'click Save Receipt',
        desc: 'Save receipt to immediately adjust party outstanding and log transaction.',
        icon: Save,
        actionable: false
      }
    ]
  },
  {
    id: 'reports',
    featureName: 'How to File GST Reports (GSTR-1 & 3B)',
    category: 'Compliance',
    breadcrumbString: 'click GST & Tax Reports > select Tax Period > review B2B Invoices, B2CS & HSN Summary > check CGST/SGST/IGST breakdown > click Export GSTR-1 JSON or Download PDF',
    pills: [
      { text: 'click GST & Tax Reports', colorClass: 'bg-indigo-600 text-white' },
      { text: 'select Tax Period', colorClass: 'bg-purple-600 text-white' },
      { text: 'review B2B, B2CS & HSN Summary', colorClass: 'bg-cyan-700 text-white' },
      { text: 'check CGST/SGST/IGST breakdown', colorClass: 'bg-amber-600 text-white' },
      { text: 'click Export GSTR-1 JSON / PDF', colorClass: 'bg-emerald-600 text-white' }
    ],
    targetTab: 'reports',
    targetTabName: 'GST & Tax Reports',
    keywords: ['gst report', 'gstr1', 'gstr3b', 'tax return', 'file gst', 'tax report'],
    steps: [
      {
        num: 1,
        badge: 'Step 1',
        title: 'click GST & Tax Reports',
        desc: 'Open GST & Tax Reports from the sidebar.',
        icon: FileText,
        actionable: true,
        actionText: 'Go to Reports',
        tab: 'reports'
      },
      {
        num: 2,
        badge: 'Step 2',
        title: 'select Tax Period',
        desc: 'Choose the filing period (current month, quarter, or custom date range).',
        icon: Sliders,
        actionable: false
      },
      {
        num: 3,
        badge: 'Step 3',
        title: 'review B2B, B2CS & HSN Summary',
        desc: 'Audit registered business invoices (B2B), retail consumers (B2CS), and HSN tables.',
        icon: BookOpen,
        actionable: false
      },
      {
        num: 4,
        badge: 'Step 4',
        title: 'check CGST/SGST/IGST breakdown',
        desc: 'Verify output tax liabilities and input tax credit (ITC) reconciliations.',
        icon: Receipt,
        actionable: false
      },
      {
        num: 5,
        badge: 'Step 5',
        title: 'click Export GSTR-1 JSON / PDF',
        desc: 'Export standard government-ready GSTR-1 JSON file or download complete PDF audit summary.',
        icon: Save,
        actionable: false
      }
    ]
  },
  {
    id: 'barcode-billing',
    featureName: 'How to Use Barcode Scanner for POS Billing',
    category: 'POS',
    breadcrumbString: 'click Sales & Invoices > click New GST Sales Invoice > plug USB Barcode Scanner > scan Product Barcode > auto-adds item to cart > enter Customer details > press F12 or Issue Invoice',
    pills: [
      { text: 'click Sales & Invoices', colorClass: 'bg-indigo-600 text-white' },
      { text: 'click New GST Sales Invoice', colorClass: 'bg-purple-600 text-white' },
      { text: 'plug USB Barcode Scanner', colorClass: 'bg-slate-900 text-white dark:bg-slate-800' },
      { text: 'scan Product Barcode', colorClass: 'bg-cyan-700 text-white' },
      { text: 'auto-adds item to cart', colorClass: 'bg-amber-600 text-white' },
      { text: 'press F12 or Issue Invoice', colorClass: 'bg-emerald-600 text-white' }
    ],
    targetTab: 'sales',
    targetTabName: 'Sales & Invoices',
    keywords: ['barcode', 'scan barcode', 'scanner', 'pos scan', 'quick billing'],
    steps: [
      {
        num: 1,
        badge: 'Step 1',
        title: 'click Sales & Invoices',
        desc: 'Open the Sales & Invoices POS billing screen.',
        icon: FileText,
        actionable: true,
        actionText: 'Go to Sales',
        tab: 'sales'
      },
      {
        num: 2,
        badge: 'Step 2',
        title: 'click New GST Sales Invoice',
        desc: "Click '+ New GST Sales Invoice' to initiate the billing transaction.",
        icon: Receipt,
        actionable: false
      },
      {
        num: 3,
        badge: 'Step 3',
        title: 'plug USB Barcode Scanner',
        desc: 'Connect any standard USB or Bluetooth handheld laser scanner to your PC.',
        icon: Barcode,
        actionable: false
      },
      {
        num: 4,
        badge: 'Step 4',
        title: 'scan Product Barcode',
        desc: 'Point the laser at the product EAN/UPC barcode sticker; scanner beeps upon detection.',
        icon: Tag,
        actionable: false
      },
      {
        num: 5,
        badge: 'Step 5',
        title: 'auto-adds item to cart',
        desc: 'Item is added instantly to invoice table with matched price, GST%, and HSN code.',
        icon: Package,
        actionable: false
      },
      {
        num: 6,
        badge: 'Step 6',
        title: 'press F12 or Issue Invoice',
        desc: 'Take payment and press F12 / Issue Invoice to print thermal receipt.',
        icon: CheckCircle2,
        actionable: false
      }
    ]
  },
  {
    id: 'ai-catalog',
    featureName: 'How to Use AI Catalog Match & Google Images',
    category: 'AI Copilot',
    breadcrumbString: 'click AI Assistant > type product query (e.g. Lay\'s, Basmati Rice) > browse AI Catalog Carousel > click Quick Add to Master > instant HSN, GST% & Google Image match',
    pills: [
      { text: 'click AI Assistant', colorClass: 'bg-indigo-600 text-white' },
      { text: 'type product query', colorClass: 'bg-purple-600 text-white' },
      { text: 'browse AI Catalog Carousel', colorClass: 'bg-cyan-700 text-white' },
      { text: 'click Quick Add to Master', colorClass: 'bg-amber-600 text-white' },
      { text: 'instant HSN, GST% & Image match', colorClass: 'bg-emerald-600 text-white' }
    ],
    targetTab: 'ai-assistant',
    targetTabName: 'AI Assistant',
    keywords: ['ai catalog', 'google image', 'catalog match', 'ai product', 'gst attributes'],
    steps: [
      {
        num: 1,
        badge: 'Step 1',
        title: 'click AI Assistant',
        desc: 'Open HiffyAI Assistant from the sidebar navigation or top search bar.',
        icon: Bot,
        actionable: false
      },
      {
        num: 2,
        badge: 'Step 2',
        title: 'type product query',
        desc: "Type any brand or product query in the floating bottom bar (e.g. 'Lay\'s Chips', 'Basmati Rice', 'Jeans').",
        icon: Search,
        actionable: false
      },
      {
        num: 3,
        badge: 'Step 3',
        title: 'browse AI Catalog Carousel',
        desc: 'Swipe or use left/right arrow buttons to view 5 verified catalog items with images & 9 GST attributes.',
        icon: Sparkles,
        actionable: false
      },
      {
        num: 4,
        badge: 'Step 4',
        title: 'click Quick Add to Master',
        desc: "Click '+ Quick Add to Product Master' on any catalog item card.",
        icon: Plus,
        actionable: false
      },
      {
        num: 5,
        badge: 'Step 5',
        title: 'instant HSN, GST% & Image match',
        desc: 'Item is immediately registered in your Product Master with verified HSN, GST rate, and image.',
        icon: CheckCircle2,
        actionable: false
      }
    ]
  }
];

export const AiAssistant: React.FC<AiAssistantProps> = ({ onNavigateTab, onAddProduct }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('hiffy_ai_chat');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((m: any) => ({
            ...m,
            stepFlow: undefined // Always resolve from in-memory ERP_STEP_FLOWS to preserve Lucide React components
          }));
        }
      } catch (e) {
        // Fallback default
      }
    }
    return [
      {
        id: '1',
        role: 'model',
        content: "Hello! I am HiffyAI, your intelligent copilot for HiffyBill GST Billing & Retail ERP. Ask me for step-by-step guidance on any ERP feature, discover retail products with Google images, or analyze your sales and stock.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [highThinking, setHighThinking] = useState(true);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [zoomedProductPreview, setZoomedProductPreview] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    localStorage.setItem('hiffy_ai_chat', JSON.stringify(messages));
  }, [messages, loading]);

  // Quick Action Chips
  const quickActions = [
    { label: "📦 How to Add Product Flow", query: "how to add product", highlight: true },
    { label: "🧾 Sales Invoice Flow", query: "how to create gst sales invoice", highlight: true },
    { label: "🚚 Add Supplier & Products", query: "how to add supplier and product details", highlight: true },
    { label: "👥 Party Management Flow", query: "how to manage parties customers and suppliers", highlight: false },
    { label: "📦 Stock Movement Ledger", query: "how to track inventory stock ledger", highlight: false },
    { label: "💳 Record Payment Flow", query: "how to record payment", highlight: false },
    { label: "✨ Lay's Chips Catalog (5)", query: "Suggest Lay's Chips with HSN & GST", highlight: false },
    { label: "✨ Basmati Rice Catalog (5)", query: "Catalog match for India Gate Basmati Rice", highlight: false }
  ];

  // Helper: Find matching Step Flow from registry
  const matchStepFlow = (query: string): ERPStepFlowDefinition | null => {
    const q = query.toLowerCase().trim();
    for (const flow of ERP_STEP_FLOWS) {
      if (q.includes(flow.id)) return flow;
      for (const kw of flow.keywords) {
        if (q.includes(kw)) return flow;
      }
    }
    if (/how.*add.*product|product.*kaise|create.*product/i.test(q)) {
      return ERP_STEP_FLOWS.find(f => f.id === 'add-product') || null;
    }
    if (/invoice|sale|bill|pos.*bill/i.test(q)) {
      return ERP_STEP_FLOWS.find(f => f.id === 'sales-invoice') || null;
    }
    if (/supplier.*product|add.*supplier|vendor/i.test(q)) {
      return ERP_STEP_FLOWS.find(f => f.id === 'add-supplier') || null;
    }
    if (/purchase.*order|create.*po/i.test(q)) {
      return ERP_STEP_FLOWS.find(f => f.id === 'purchase-order') || null;
    }
    if (/party|parties|customer.*supplier|all.*customer/i.test(q)) {
      return ERP_STEP_FLOWS.find(f => f.id === 'parties') || null;
    }
    if (/stock|inventory|stock.*ledger|stock.*movement/i.test(q)) {
      return ERP_STEP_FLOWS.find(f => f.id === 'inventory') || null;
    }
    if (/payment|receipt|settle/i.test(q)) {
      return ERP_STEP_FLOWS.find(f => f.id === 'payments') || null;
    }
    if (/gst.*report|gstr1|gstr3b|tax.*report/i.test(q)) {
      return ERP_STEP_FLOWS.find(f => f.id === 'reports') || null;
    }
    if (/barcode|scanner|pos.*scan/i.test(q)) {
      return ERP_STEP_FLOWS.find(f => f.id === 'barcode-billing') || null;
    }
    return null;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Directly trigger a step flow from the top ribbon
  const handleTriggerStepFlow = (flowId: string) => {
    const flow = ERP_STEP_FLOWS.find(f => f.id === flowId);
    if (!flow) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: flow.featureName,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const aiMsg: ChatMessage = {
      id: `m-${Date.now() + 1}`,
      role: 'model',
      isProductGuide: true,
      stepFlowKey: flow.id,
      content: flow.breadcrumbString,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg, aiMsg]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!textToSend) setInput('');
    setLoading(true);

    // Check if query matches any ERP Step-by-Step Flow
    const matchedFlow = matchStepFlow(text);
    if (matchedFlow) {
      setTimeout(() => {
        const aiMsg: ChatMessage = {
          id: `m-${Date.now()}`,
          role: 'model',
          isProductGuide: true,
          stepFlowKey: matchedFlow.id,
          content: matchedFlow.breadcrumbString,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiMsg]);
        setLoading(false);
      }, 350);
      return;
    }

    // Check if query is about product discovery or catalog search
    const isProductQuery = /product|suggest|item|chips|lay|rice|jeans|shirt|oil|soap|phone|biscuit|noodles|maggi|catalog|hsn|watch|headphone/i.test(text);

    let fetchedCandidates: any[] = [];

    try {
      if (isProductQuery) {
        const prodRes = await fetch('/api/ai-product-search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: text })
        });
        const prodData = await prodRes.json();
        if (prodData.candidates && prodData.candidates.length > 0) {
          fetchedCandidates = prodData.candidates;
        }
      }

      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          highThinking,
          systemInstruction: "You are HiffyAI, the intelligent assistant for HiffyBill GST Billing & Retail ERP. Provide structured ERP step-by-step guidance whenever asked."
        })
      });
      const data = await res.json();
      
      let replyContent = data.reply || "I have analyzed your request based on current ERP records.";
      if (fetchedCandidates.length > 0) {
        replyContent = `Here are ${fetchedCandidates.length} AI Catalog Matches with Google Images & 9 GST Attributes for "${text}". You can swipe or click the arrows in the carousel to review and add them to your Product Master:`;
      }

      const flowCheck = matchStepFlow(data.reply || '');

      const aiMsg: ChatMessage = {
        id: `m-${Date.now()}`,
        role: 'model',
        isProductGuide: !!flowCheck || (data.reply || '').includes('click '),
        stepFlowKey: flowCheck ? flowCheck.id : undefined,
        suggestedProducts: fetchedCandidates.length > 0 ? fetchedCandidates : undefined,
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        role: 'model',
        content: "Sorry, I encountered an issue connecting to the AI engine. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAddProduct = (item: any) => {
    // Generate authentic product-related EAN-13 barcode
    const catCode = item.category?.toLowerCase().includes('groc') ? '20' : item.category?.toLowerCase().includes('elect') ? '30' : '10';
    const cleanHsn = (item.hsnCode || '8517').replace(/\D/g, '').padStart(4, '0').slice(-4);
    const seq = String(Math.floor(100 + Math.random() * 900));
    const raw12 = `890${catCode}${cleanHsn}${seq}`;
    let chk = 0;
    for (let i = 0; i < 12; i++) chk += parseInt(raw12[i], 10) * (i % 2 === 0 ? 1 : 3);
    const checksum = (10 - (chk % 10)) % 10;
    const generatedBarcode = raw12 + checksum;

    const existing: Product[] = JSON.parse(localStorage.getItem('hiffy_products') || '[]');
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: item.productName,
      code: item.suggestedSKU || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      brand: item.brand,
      category: item.category,
      subcategory: 'General',
      industry: item.industry || 'General',
      description: item.description || `${item.productName} by ${item.brand}`,
      uom: item.units || 'PCS',
      hsnCode: item.hsnCode,
      gstRate: item.gstRate,
      purchasePrice: item.purchasePrice,
      sellingPrice: item.sellingPrice,
      mrp: item.sellingPrice * 1.25,
      openingStock: item.stock || 50,
      minStockLevel: 10,
      image: item.imageUrl,
      barcode: item.barcode || generatedBarcode,
      trackBatch: item.industry === 'Grocery',
      trackExpiry: item.industry === 'Grocery',
      variants: [],
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0]
    };
    localStorage.setItem('hiffy_products', JSON.stringify([newProd, ...existing]));
    if (onAddProduct) onAddProduct(newProd);
    showToast(`✓ "${newProd.name}" added with Barcode ${newProd.barcode}! Ready to scan in Sales.`);
  };

  const clearChat = () => {
    setMessages([
      {
        id: `m-${Date.now()}`,
        role: 'model',
        content: "Chat cleared! How can I assist you with HiffyBill ERP today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden select-text">
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white text-xs font-black px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 animate-fadeIn border border-emerald-400">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="shrink-0 px-6 py-3.5 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between z-10 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/25">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-slate-950 dark:text-white tracking-tight">
                HiffyAI Assistant & ERP Flows
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Active ERP Copilot
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-bold">
              Step-by-Step ERP Guidance • AI Catalog Matches with Google Images & 9 GST Attributes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* High Thinking Mode Toggle */}
          <div className="flex items-center space-x-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3.5 py-1.5 rounded-2xl shadow-2xs">
            <Brain className={`w-4 h-4 ${highThinking ? 'text-indigo-600 dark:text-indigo-400 animate-pulse' : 'text-slate-500'}`} />
            <span className="text-xs font-black text-slate-900 dark:text-slate-200 hidden sm:inline">Argon Thinking</span>
            <input 
              type="checkbox"
              checked={highThinking}
              onChange={(e) => setHighThinking(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded cursor-pointer accent-indigo-600"
              title="Toggle Gemini High Thinking Mode"
            />
          </div>

          <button
            type="button"
            onClick={clearChat}
            className="p-2 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* USER REQUESTED: INTERACTIVE ERP STEP-BY-STEP FLOW GUIDES HORIZONTAL RIBBON */}
      <div className="shrink-0 px-6 py-2.5 bg-indigo-50/70 dark:bg-slate-900/90 border-b border-indigo-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none z-10">
        <span className="text-[10px] font-black uppercase text-indigo-700 dark:text-indigo-400 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          ERP Step-by-Step Flows:
        </span>
        {ERP_STEP_FLOWS.map((flow) => (
          <button
            key={flow.id}
            type="button"
            onClick={() => handleTriggerStepFlow(flow.id)}
            className="px-3 py-1 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-400 border border-slate-200 dark:border-slate-700 text-[10px] font-black shrink-0 shadow-2xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
            title={`View Step-by-Step Flow for ${flow.featureName}`}
          >
            <span>{flow.featureName}</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
          </button>
        ))}
      </div>

      {/* Full-Page Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6 pb-36 scroll-smooth">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            const hasProducts = m.suggestedProducts && m.suggestedProducts.length > 0;
            
            // Resolve step flow safely from in-memory ERP_STEP_FLOWS to ensure valid React component references
            const activeFlow = m.stepFlowKey 
              ? (ERP_STEP_FLOWS.find(f => f.id === m.stepFlowKey) || null)
              : (m.isProductGuide ? ERP_STEP_FLOWS[0] : null);

            return (
              <div 
                key={m.id} 
                className={`flex items-start gap-3 sm:gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-fadeIn`}
              >
                {/* Avatar Icon */}
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                  isUser 
                    ? 'bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white' 
                    : 'bg-gradient-to-tr from-purple-600 via-indigo-600 to-indigo-700 text-white'
                }`}>
                  {isUser ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
                </div>

                {/* Message Bubble Content */}
                <div className={`min-w-0 max-w-[90%] sm:max-w-[85%] space-y-3 ${isUser ? 'text-right' : 'text-left'}`}>
                  {isUser ? (
                    <div className="inline-block bg-indigo-600 text-white p-4 sm:p-4.5 rounded-3xl rounded-tr-xs shadow-md text-xs sm:text-sm font-bold text-left leading-relaxed">
                      {m.content}
                      <span className="block text-[10px] text-right font-medium text-indigo-200 mt-1">
                        {m.timestamp}
                      </span>
                    </div>
                  ) : activeFlow ? (
                    /* USER REQUESTED: STRUCTURED STEP-BY-STEP FLOW FOR ALL ERP FEATURES */
                    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-indigo-200/90 dark:border-indigo-900/80 p-5 sm:p-6 rounded-3xl rounded-tl-xs shadow-xl space-y-4">
                      {/* Flow Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-indigo-100 dark:border-indigo-950">
                        <div className="flex items-center space-x-2">
                          <div className="p-1.5 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs sm:text-sm font-black text-slate-950 dark:text-white">
                              ERP Step-by-Step Flow: {activeFlow.featureName}
                            </span>
                            <span className="text-[10px] font-bold text-slate-500 block">
                              Module: {activeFlow.targetTabName}
                            </span>
                          </div>
                        </div>

                        {/* Copy Flow Breadcrumb Button */}
                        <button
                          type="button"
                          onClick={() => handleCopy(activeFlow.breadcrumbString)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer text-slate-700 dark:text-slate-200 shadow-2xs"
                          title="Copy breadcrumb flow to clipboard"
                        >
                          {copiedText === activeFlow.breadcrumbString ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                              <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-500" />
                              <span>Copy Flow</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Prominent Colorful Breadcrumb Highlight Bar requested by User */}
                      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/60 dark:via-purple-950/40 dark:to-slate-900 p-3.5 rounded-2xl border border-indigo-200 dark:border-indigo-800/60 shadow-2xs">
                        <span className="text-[10px] font-black uppercase text-indigo-700 dark:text-indigo-400 block mb-1.5">
                          Exact Navigation Breadcrumb:
                        </span>
                        <div className="flex items-center flex-wrap gap-1.5 text-xs sm:text-sm font-black text-indigo-950 dark:text-white leading-relaxed">
                          {activeFlow.pills.map((pill, pIdx) => (
                            <React.Fragment key={pIdx}>
                              <span className={`${pill.colorClass} px-2.5 py-0.5 rounded-lg shadow-2xs`}>
                                {pill.text}
                              </span>
                              {pIdx < activeFlow.pills.length - 1 && (
                                <span className="text-indigo-400 dark:text-indigo-300 font-black">&gt;</span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>

                      {/* Interactive Visual Step Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                        {activeFlow.steps.map((s) => {
                          const IconComp = (s.icon && (typeof s.icon === 'function' || (typeof s.icon === 'object' && (s.icon as any).$$typeof))) ? s.icon : Package;
                          return (
                            <div 
                              key={s.num} 
                              className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 flex items-start gap-3 hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors shadow-2xs"
                            >
                              <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 ring-1 ring-indigo-500/20">
                                <IconComp className="w-4 h-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400">
                                    {s.badge}
                                  </span>
                                  {s.num === 1 && onNavigateTab && (
                                    <button
                                      type="button"
                                      onClick={() => onNavigateTab(activeFlow.targetTab)}
                                      className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 underline flex items-center gap-0.5 cursor-pointer"
                                    >
                                      Go now <ChevronRight className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                                <h4 className="text-xs font-black text-slate-950 dark:text-white truncate">
                                  {s.title}
                                </h4>
                                <p className="text-[11px] text-slate-600 dark:text-slate-400 font-bold leading-tight mt-0.5">
                                  {s.desc}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Direct Navigation Action CTA */}
                      {onNavigateTab && (
                        <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
                          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                            Ready to perform this action?
                          </span>
                          <button
                            type="button"
                            onClick={() => onNavigateTab(activeFlow.targetTab)}
                            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                          >
                            <Package className="w-4 h-4 text-white" />
                            <span>Open {activeFlow.targetTabName} Page</span>
                            <ArrowRight className="w-3.5 h-3.5 text-white" />
                          </button>
                        </div>
                      )}

                      <span className="block text-[10px] text-right font-bold text-slate-500 dark:text-slate-400 pt-1">
                        {m.timestamp}
                      </span>
                    </div>
                  ) : (
                    /* CHAT MESSAGE WITH OPTIONAL IN-CHAT CATALOG CAROUSEL */
                    <div className="space-y-3">
                      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-4 sm:p-5 rounded-3xl rounded-tl-xs shadow-md space-y-2">
                        <p className="text-xs sm:text-sm font-bold text-slate-950 dark:text-white leading-relaxed whitespace-pre-wrap">
                          {m.content}
                        </p>
                        <span className="block text-[10px] text-right font-bold text-slate-500 dark:text-slate-400">
                          {m.timestamp}
                        </span>
                      </div>

                      {/* CHAT-STYLE HORIZONTAL CAROUSEL FOR AI CATALOG MATCHES */}
                      {hasProducts && (
                        <div className="animate-fadeIn">
                          <CatalogCarousel 
                            products={m.suggestedProducts!} 
                            onQuickAdd={handleQuickAddProduct}
                            onZoom={(p) => setZoomedProductPreview(p)}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Thinking / Loading Bubble */}
          {loading && (
            <div className="flex items-start gap-3 sm:gap-4 animate-pulse">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <Sparkles className="w-5 h-5 text-white animate-spin" />
              </div>
              <div className="bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl rounded-tl-xs shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.3s]"></div>
                <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 ml-2">
                  {highThinking ? 'Argon Thinking Deep Analysis Active...' : 'Formulating Step Guidance...'}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* FLOATING BOTTOM INPUT BAR */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-slate-100 via-slate-100/90 to-transparent dark:from-slate-950 dark:via-slate-950/90 pointer-events-none z-20">
        <div className="max-w-4xl mx-auto space-y-2.5 pointer-events-auto">
          {/* Quick Suggestion Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {quickActions.map((qa, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(qa.query)}
                className={`text-[11px] font-black px-3 py-1.5 rounded-full shrink-0 transition-all cursor-pointer shadow-xs active:scale-95 ${
                  qa.highlight 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border border-indigo-400/30'
                    : 'bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {qa.label}
              </button>
            ))}
          </div>

          {/* Floating Input Pill Box */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-2 sm:p-2.5 rounded-full border border-slate-300 dark:border-slate-700 shadow-2xl focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all"
          >
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask how to perform any ERP action (e.g. 'how to add product', 'how to add supplier', 'sales invoice flow')..."
              className="flex-1 bg-transparent px-4 py-2 text-xs sm:text-sm font-bold text-slate-950 dark:text-white placeholder:text-slate-500 focus:outline-hidden"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 disabled:hover:from-indigo-600 disabled:hover:to-purple-600 text-white flex items-center justify-center shrink-0 shadow-md active:scale-95 transition-all cursor-pointer disabled:cursor-not-allowed"
              title="Send message"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </form>
        </div>
      </div>

      {/* FULL-IMAGE ZOOM MODAL */}
      {zoomedProductPreview && (
        <div 
          onClick={() => setZoomedProductPreview(null)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 rounded-3xl max-w-xl w-full border border-indigo-500/40 p-5 space-y-4 shadow-2xl cursor-default animate-scaleUp"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-black text-white">{zoomedProductPreview.productName}</h3>
              </div>
              <button 
                type="button"
                onClick={() => setZoomedProductPreview(null)}
                className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="w-full h-72 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
              <img 
                src={zoomedProductPreview.imageUrl} 
                alt={zoomedProductPreview.productName} 
                className="w-full h-full object-contain"
              />
            </div>

            <div className="grid grid-cols-4 gap-2 text-[10px] bg-slate-950 p-3 rounded-2xl border border-slate-800 font-mono">
              <div>
                <span className="text-slate-500 block uppercase">HSN Code</span>
                <span className="font-bold text-amber-400">{zoomedProductPreview.hsnCode}</span>
              </div>
              <div>
                <span className="text-slate-500 block uppercase">GST Rate</span>
                <span className="font-bold text-emerald-400">{zoomedProductPreview.gstRate}%</span>
              </div>
              <div>
                <span className="text-slate-500 block uppercase">Selling Price</span>
                <span className="font-bold text-emerald-300">₹{zoomedProductPreview.sellingPrice}</span>
              </div>
              <div>
                <span className="text-slate-500 block uppercase">Confidence</span>
                <span className="font-bold text-cyan-300">{zoomedProductPreview.confidenceScore}%</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                handleQuickAddProduct(zoomedProductPreview);
                setZoomedProductPreview(null);
              }}
              className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md cursor-pointer hover:opacity-95"
            >
              <Package className="w-4 h-4" />
              <span>Add to Product Master</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
