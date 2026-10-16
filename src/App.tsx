import React, { useState, useEffect } from 'react';
import { TabType, Product, Invoice, PurchaseOrder, Party, PaymentTransaction, StockLedgerEntry, BusinessSettings } from './types';
import { 
  initialProducts, 
  initialInvoices, 
  initialPurchaseOrders, 
  initialParties, 
  initialPayments, 
  initialStockLedger, 
  initialBusinessSettings 
} from './mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Sales } from './components/Sales';
import { Purchases } from './components/Purchases';
import { Inventory } from './components/Inventory';
import { Products } from './components/Products';
import { Parties } from './components/Parties';
import { Payments } from './components/Payments';
import { Reports } from './components/Reports';
import { AiAssistant } from './components/AiAssistant';
import { Settings } from './components/Settings';
import { AuthModal } from './components/AuthModal';
import { ThemeSetupWidget } from './components/ThemeSetupWidget';
import { auth, onAuthStateChanged, signOut } from './firebase';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  
  // Theme color state with requested default #cf45ee
  const [primaryColor, setPrimaryColor] = useState<string>('#cf45ee');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Application Data States (synced with localStorage)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('hiffy_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('hiffy_invoices');
    return saved ? JSON.parse(saved) : initialInvoices;
  });

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
    const saved = localStorage.getItem('hiffy_pos');
    return saved ? JSON.parse(saved) : initialPurchaseOrders;
  });

  const [parties, setParties] = useState<Party[]>(() => {
    const saved = localStorage.getItem('hiffy_parties');
    return saved ? JSON.parse(saved) : initialParties;
  });

  const [payments, setPayments] = useState<PaymentTransaction[]>(() => {
    const saved = localStorage.getItem('hiffy_payments');
    return saved ? JSON.parse(saved) : initialPayments;
  });

  const [stockLedger, setStockLedger] = useState<StockLedgerEntry[]>(() => {
    const saved = localStorage.getItem('hiffy_ledger');
    return saved ? JSON.parse(saved) : initialStockLedger;
  });

  const [settings, setSettings] = useState<BusinessSettings>(() => {
    const saved = localStorage.getItem('hiffy_settings');
    return saved ? JSON.parse(saved) : initialBusinessSettings;
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('hiffy_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('hiffy_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('hiffy_pos', JSON.stringify(purchaseOrders));
  }, [purchaseOrders]);

  useEffect(() => {
    localStorage.setItem('hiffy_parties', JSON.stringify(parties));
  }, [parties]);

  useEffect(() => {
    localStorage.setItem('hiffy_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('hiffy_ledger', JSON.stringify(stockLedger));
  }, [stockLedger]);

  useEffect(() => {
    localStorage.setItem('hiffy_settings', JSON.stringify(settings));
  }, [settings]);

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        const demoUser = sessionStorage.getItem('hiffy_demo_user');
        if (demoUser) {
          setUser(JSON.parse(demoUser));
        }
      }
      setAuthChecking(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLoginSuccess = (loggedInUser: any) => {
    setUser(loggedInUser);
    sessionStorage.setItem('hiffy_demo_user', JSON.stringify(loggedInUser));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
    }
    setUser(null);
    sessionStorage.removeItem('hiffy_demo_user');
  };

  const handleAddProduct = (newProd: Product) => {
    setProducts([newProd, ...products]);
    setStockLedger([
      {
        id: `sl-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        productId: newProd.id,
        productName: newProd.name,
        type: 'Opening',
        qtyIn: newProd.openingStock,
        qtyOut: 0,
        balanceQty: newProd.openingStock,
        reference: 'Initial Stock Entry',
        user: user?.displayName || 'Admin'
      },
      ...stockLedger
    ]);
  };

  const handleUpdateProduct = (updated: Product) => {
    setProducts(products.map(p => p.id === updated.id ? updated : p));
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleAddInvoice = (newInv: Invoice) => {
    setInvoices([newInv, ...invoices]);
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center font-bold text-xl">HB</div>
          <p className="text-xs font-medium text-slate-400">Loading HiffyBill ERP...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthModal onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-white dark' : 'bg-[#f8f9fc] text-slate-900'} flex font-sans antialiased selection:bg-indigo-500 selection:text-white`}>
      {/* Sidebar Navigation */}
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        primaryColor={primaryColor} 
        setPrimaryColor={setPrimaryColor} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header 
          user={user} 
          onLogout={handleLogout} 
          onOpenSearch={() => setCurrentTab('ai-assistant')} 
        />

        <main className="flex-1 overflow-y-auto p-8">
          {currentTab === 'dashboard' && (
            <Dashboard 
              products={products}
              invoices={invoices}
              purchaseOrders={purchaseOrders}
              parties={parties}
              setCurrentTab={setCurrentTab}
              onOpenNewSale={() => setCurrentTab('sales')}
              onOpenNewPurchase={() => setCurrentTab('purchases')}
              onOpenAddProduct={() => setCurrentTab('products')}
            />
          )}

          {currentTab === 'sales' && (
            <Sales 
              products={products}
              invoices={invoices}
              parties={parties}
              onAddInvoice={handleAddInvoice}
            />
          )}

          {currentTab === 'purchases' && (
            <Purchases 
              purchaseOrders={purchaseOrders}
              parties={parties}
              onAddPO={(po) => setPurchaseOrders([po, ...purchaseOrders])}
            />
          )}

          {currentTab === 'inventory' && (
            <Inventory 
              products={products}
              stockLedger={stockLedger}
            />
          )}

          {currentTab === 'products' && (
            <Products 
              products={products}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
              primaryColor={primaryColor}
              isDarkMode={isDarkMode}
            />
          )}

          {currentTab === 'parties' && (
            <Parties 
              parties={parties}
              onAddParty={(party) => setParties([party, ...parties])}
            />
          )}

          {currentTab === 'payments' && (
            <Payments 
              payments={payments}
              onAddPayment={(pay) => setPayments([pay, ...payments])}
            />
          )}

          {currentTab === 'reports' && (
            <Reports 
              invoices={invoices}
              products={products}
            />
          )}

          {currentTab === 'ai-assistant' && (
            <AiAssistant />
          )}

          {currentTab === 'settings' && (
            <Settings 
              settings={settings}
              onUpdateSettings={(s) => setSettings(s)}
              primaryColor={primaryColor}
              setPrimaryColor={setPrimaryColor}
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
            />
          )}
        </main>
      </div>

      {/* Theme Setup Floating Widget at Bottom Right */}
      <ThemeSetupWidget 
        primaryColor={primaryColor}
        setPrimaryColor={setPrimaryColor}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
    </div>
  );
}
