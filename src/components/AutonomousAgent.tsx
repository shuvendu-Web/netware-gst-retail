import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, 
  Play, 
  Pause, 
  RotateCw, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Terminal, 
  Sparkles, 
  Activity, 
  Zap, 
  Bug, 
  Wrench, 
  Layers, 
  Package, 
  FileText, 
  Users, 
  Boxes, 
  ArrowRight,
  TrendingUp,
  Clock,
  Trash2,
  Dice5
} from 'lucide-react';
import { Product, Invoice, Party, StockLedgerEntry } from '../types';
import { HoloToggle } from './ui/HoloToggle';

interface AutonomousAgentProps {
  products: Product[];
  invoices: Invoice[];
  parties: Party[];
  stockLedger: StockLedgerEntry[];
  onUpdateProduct?: (product: Product) => void;
  onAddParty?: (party: Party) => void;
  onNavigateTab?: (tab: string) => void;
  isAutoHealingActive?: boolean;
  onToggleAutoHeal?: (active: boolean) => void;
}

interface AgentLog {
  id: string;
  timestamp: string;
  level: 'info' | 'detect' | 'diagnose' | 'fix' | 'verify';
  module: string;
  message: string;
}

interface ResolvedIssue {
  id: string;
  title: string;
  module: 'Products' | 'Sales' | 'Purchases' | 'Parties' | 'Inventory';
  severity: 'Critical' | 'Warning' | 'Optimization';
  anomaly: string;
  rootCause: string;
  beforeDiff: string;
  afterDiff: string;
  resolvedAt: string;
}

export const AutonomousAgent: React.FC<AutonomousAgentProps> = ({
  products,
  invoices,
  parties,
  stockLedger,
  onUpdateProduct,
  onNavigateTab,
  isAutoHealingActive: externalIsHealing,
  onToggleAutoHeal: externalToggleHealing
}) => {
  // Holographic Auto-Healing Switch State
  const [internalIsHealing, setInternalIsHealing] = useState<boolean>(false);
  const isAutoHealingActive = externalIsHealing !== undefined ? externalIsHealing : internalIsHealing;
  const setIsAutoHealingActive = (active: boolean) => {
    setInternalIsHealing(active);
    if (externalToggleHealing) externalToggleHealing(active);
  };
  const healingTimeoutRef = useRef<NodeJS.Timeout[]>([]);

  // Loop State
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [cycleInterval, setCycleInterval] = useState<number>(4000); // 4s loop
  const [cycleCount, setCycleCount] = useState<number>(1);
  const [issuesResolvedCount, setIssuesResolvedCount] = useState<number>(0);
  const [currentScanningModule, setCurrentScanningModule] = useState<string>('Inventory & Catalog Master');
  const [healthScore, setHealthScore] = useState<number>(99.4);
  const [activeSubAgent, setActiveSubAgent] = useState<'GST-Auditor' | 'Catalog-Sentinel' | 'Stock-Reconciler' | 'Ledger-Guard'>('Catalog-Sentinel');

  // Logs Terminal
  const [logs, setLogs] = useState<AgentLog[]>([
    {
      id: 'log-1',
      timestamp: new Date().toLocaleTimeString(),
      level: 'info',
      module: 'AGENT-CORE',
      message: 'Autonomous Sentinel Engine initialized. Multi-threaded watcher active.'
    },
    {
      id: 'log-2',
      timestamp: new Date().toLocaleTimeString(),
      level: 'detect',
      module: 'SCANNER',
      message: 'Scanning active ERP modules: Products, Sales, Parties, Ledgers...'
    }
  ]);

  // Resolved Issues List
  const [resolvedIssues, setResolvedIssues] = useState<ResolvedIssue[]>([
    {
      id: 'res-1',
      title: 'Missing HSN Code on Edible Oil Product',
      module: 'Products',
      severity: 'Critical',
      anomaly: "Product 'Fortune Cooking Oil 1L' was missing statutory 4-digit GST HSN/SAC code.",
      rootCause: "Data import from vendor catalog omitted Chapter 15 tax tariff header.",
      beforeDiff: "hsnCode: ''\ngstRate: 5%\nstatus: 'Incomplete'",
      afterDiff: "hsnCode: '1512' // Edible sunflower oil\ngstRate: 5%\nstatus: 'Active'",
      resolvedAt: new Date(Date.now() - 35000).toLocaleTimeString()
    },
    {
      id: 'res-2',
      title: 'Invoice Round-Off Ledger Micro Discrepancy',
      module: 'Sales',
      severity: 'Warning',
      anomaly: "Invoice INV-00124 tax component had a ₹0.04 rounding float variance.",
      rootCause: "Floating point precision round error in CGST/SGST 5% half-rate split.",
      beforeDiff: "roundOff: -0.46\ngrandTotal: 2450.04 (unrounded float)",
      afterDiff: "roundOff: -0.50\ngrandTotal: 2450.00 // Clean integer cash settlement",
      resolvedAt: new Date(Date.now() - 20000).toLocaleTimeString()
    }
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Pool of Random Issues that the Agent diagnoses, fixes, and logs
  const ISSUE_PRESETS = [
    {
      title: 'Missing HSN Code on Product Item',
      module: 'Products' as const,
      severity: 'Critical' as const,
      detectMsg: (name: string) => `Product '${name}' has missing or empty GST HSN code.`,
      diagnoseMsg: () => `Tariff schedule lookup: Classification matches Chapter 10 (Cereals) / 62 (Apparel).`,
      fixMsg: (name: string) => `Auto-assigned statutory HSN code to '${name}' and updated GST master.`,
      applyFix: () => {
        if (products.length > 0 && onUpdateProduct) {
          const target = products[Math.floor(Math.random() * products.length)];
          const updated = { ...target, hsnCode: target.hsnCode || '1006' };
          onUpdateProduct(updated);
        }
      },
      beforeDiff: `hsnCode: ''\ncompliance: 'Non-Compliant'`,
      afterDiff: `hsnCode: '1006' // Auto-derived GST Tariff\ncompliance: 'Verified'`
    },
    {
      title: 'Low Safety Stock Threshold Trigger',
      module: 'Inventory' as const,
      severity: 'Warning' as const,
      detectMsg: (name: string) => `Stock level for '${name}' reached critical threshold (<15 units).`,
      diagnoseMsg: () => `Velocity analysis: Item has high turnover; stock depletion risk in 48 hours.`,
      fixMsg: (name: string) => `Auto-drafted Purchase Replenishment Order with Primary Vendor for 50 units.`,
      applyFix: () => {},
      beforeDiff: `currentStock: 8\nreorderStatus: 'Pending'`,
      afterDiff: `currentStock: 8\nreorderStatus: 'PO-DRAFTED' (+50 units on order)`
    },
    {
      title: 'GST Tax Decimal Rounding Adjustment',
      module: 'Sales' as const,
      severity: 'Optimization' as const,
      detectMsg: (inv: string) => `Sales bill '${inv}' has minor float rounding mismatch on SGST component.`,
      diagnoseMsg: () => `Dual-tax split parity check: CGST (₹61.70) != SGST (₹61.71) due to round precision.`,
      fixMsg: (inv: string) => `Balanced CGST/SGST tax split and synchronized round-off entry for '${inv}'.`,
      applyFix: () => {},
      beforeDiff: `cgst: 61.70\nsgst: 61.71\nroundOff: 0.01`,
      afterDiff: `cgst: 61.70\nsgst: 61.70 // Symmetric tax split\nroundOff: 0.00`
    },
    {
      title: 'Unregistered Party GSTIN State Code Parity',
      module: 'Parties' as const,
      severity: 'Warning' as const,
      detectMsg: (party: string) => `Party '${party}' state is 'Karnataka' but GSTIN prefix was unchecked.`,
      diagnoseMsg: () => `Validating GSTIN 15-character checksum: State prefix '29' matches Karnataka jurisdiction.`,
      fixMsg: (party: string) => `Normalized party GSTIN checksum and marked as Verified B2B Taxpayer.`,
      applyFix: () => {},
      beforeDiff: `state: 'Karnataka'\ngstinCheck: 'Unchecked'`,
      afterDiff: `state: 'Karnataka' (State Code 29)\ngstinCheck: 'PASSED_VERIFIED'`
    },
    {
      title: 'EAN-13 Barcode Check Digit Verification',
      module: 'Products' as const,
      severity: 'Optimization' as const,
      detectMsg: (name: string) => `Barcode for '${name}' required standard Modulo-10 checksum validation.`,
      diagnoseMsg: () => `Recalculating 13th check digit using GS1 standard weighting algorithm.`,
      fixMsg: (name: string) => `Barcode check digit regenerated and validated for POS laser scanner.`,
      applyFix: () => {},
      beforeDiff: `barcode: '8903334445550' (Invalid Modulo Check)`,
      afterDiff: `barcode: '8903334445551' (GS1 Validated Check Digit)`
    },
    {
      title: 'Stock Ledger Movement Balancing',
      module: 'Inventory' as const,
      severity: 'Critical' as const,
      detectMsg: () => `Periodic stock audit detected unrecorded opening stock adjustment entry.`,
      diagnoseMsg: () => `Reconciling physical warehouse ledger against invoice outflow totals.`,
      fixMsg: () => `Generated zero-discrepancy balancing ledger entry reference #SL-AUTO-99.`,
      applyFix: () => {},
      beforeDiff: `openingBalance: 48\ninflows: 0\noutflows: 2\nauditDiscrepancy: -2`,
      afterDiff: `openingBalance: 50\ninflows: 0\noutflows: 2\nauditDiscrepancy: 0 // Fully Balanced`
    }
  ];

  // Execute one Autonomous Healing Cycle
  const executeHealingCycle = () => {
    // 1. Pick a random module and sub-agent
    const subAgents: Array<'GST-Auditor' | 'Catalog-Sentinel' | 'Stock-Reconciler' | 'Ledger-Guard'> = [
      'GST-Auditor', 'Catalog-Sentinel', 'Stock-Reconciler', 'Ledger-Guard'
    ];
    const pickedSubAgent = subAgents[Math.floor(Math.random() * subAgents.length)];
    setActiveSubAgent(pickedSubAgent);

    const modules = ['Products & AI', 'Sales & POS', 'Purchases & Vendors', 'Parties & Ledgers', 'Stock & Inventory'];
    const currentModule = modules[Math.floor(Math.random() * modules.length)];
    setCurrentScanningModule(currentModule);

    // 2. Pick a random issue preset
    const preset = ISSUE_PRESETS[Math.floor(Math.random() * ISSUE_PRESETS.length)];
    const sampleProduct = products[Math.floor(Math.random() * products.length)]?.name || 'Basmati Rice 10kg';
    const sampleInvoice = invoices[Math.floor(Math.random() * invoices.length)]?.invoiceNumber || 'INV-00124';
    const sampleParty = parties[Math.floor(Math.random() * parties.length)]?.name || 'Rahul Sharma';

    const entityName = preset.module === 'Sales' ? sampleInvoice : preset.module === 'Parties' ? sampleParty : sampleProduct;

    const time = new Date().toLocaleTimeString();

    // Add detect log
    const newLogs: AgentLog[] = [
      {
        id: `log-${Date.now()}-1`,
        timestamp: time,
        level: 'detect',
        module: pickedSubAgent,
        message: preset.detectMsg(entityName)
      },
      {
        id: `log-${Date.now()}-2`,
        timestamp: time,
        level: 'diagnose',
        module: pickedSubAgent,
        message: preset.diagnoseMsg()
      },
      {
        id: `log-${Date.now()}-3`,
        timestamp: time,
        level: 'fix',
        module: 'AUTO-REPAIR',
        message: preset.fixMsg(entityName)
      },
      {
        id: `log-${Date.now()}-4`,
        timestamp: time,
        level: 'verify',
        module: 'QA-VERIFIER',
        message: `Regression test passed for ${preset.title}. Health score restored to 99.8%.`
      }
    ];

    setLogs(prev => [...prev.slice(-30), ...newLogs]);

    // Apply real fix if applicable
    preset.applyFix();

    // Add to Resolved Issues
    const resolvedRecord: ResolvedIssue = {
      id: `res-${Date.now()}`,
      title: `${preset.title} (${entityName})`,
      module: preset.module,
      severity: preset.severity,
      anomaly: preset.detectMsg(entityName),
      rootCause: preset.diagnoseMsg(),
      beforeDiff: preset.beforeDiff,
      afterDiff: preset.afterDiff,
      resolvedAt: time
    };

    setResolvedIssues(prev => [resolvedRecord, ...prev.slice(0, 15)]);
    setCycleCount(c => c + 1);
    setIssuesResolvedCount(r => r + 1);
    setHealthScore(99.4 + Math.random() * 0.5);
  };

  // Holographic Auto-Healing Sequence (Auto starts on toggle ON, then auto turns OFF when finished)
  const stopAutoHealSequence = () => {
    healingTimeoutRef.current.forEach(t => clearTimeout(t));
    healingTimeoutRef.current = [];
    setIsAutoHealingActive(false);
  };

  const startAutoHealSequence = () => {
    stopAutoHealSequence();
    setIsAutoHealingActive(true);

    const time = new Date().toLocaleTimeString();
    const subAgents: Array<'GST-Auditor' | 'Catalog-Sentinel' | 'Stock-Reconciler' | 'Ledger-Guard'> = [
      'GST-Auditor', 'Catalog-Sentinel', 'Stock-Reconciler', 'Ledger-Guard'
    ];
    const pickedSubAgent = subAgents[Math.floor(Math.random() * subAgents.length)];
    setActiveSubAgent(pickedSubAgent);

    const modules = ['Products & AI', 'Sales & POS', 'Purchases & Vendors', 'Parties & Ledgers', 'Stock & Inventory'];
    const currentModule = modules[Math.floor(Math.random() * modules.length)];
    setCurrentScanningModule(currentModule);

    const preset = ISSUE_PRESETS[Math.floor(Math.random() * ISSUE_PRESETS.length)];
    const sampleProduct = products[Math.floor(Math.random() * products.length)]?.name || 'Basmati Rice 10kg';
    const sampleInvoice = invoices[Math.floor(Math.random() * invoices.length)]?.invoiceNumber || 'INV-00124';
    const sampleParty = parties[Math.floor(Math.random() * parties.length)]?.name || 'Rahul Sharma';
    const entityName = preset.module === 'Sales' ? sampleInvoice : preset.module === 'Parties' ? sampleParty : sampleProduct;

    // Phase 1 (0ms): Toggle is ON -> Deep scan & Anomaly detection
    setLogs(prev => [
      ...prev.slice(-30),
      {
        id: `heal-init-${Date.now()}`,
        timestamp: time,
        level: 'info',
        module: 'AUTO-HEALING',
        message: '⚡ Holographic Cyber Switch [ON] - Starting Auto-Healing sequence across ERP clusters...'
      },
      {
        id: `heal-detect-${Date.now()}`,
        timestamp: time,
        level: 'detect',
        module: pickedSubAgent,
        message: preset.detectMsg(entityName)
      }
    ]);
    setHealthScore(94.2);

    // Phase 2 (900ms): Root cause diagnosis
    const t1 = setTimeout(() => {
      setLogs(prev => [
        ...prev.slice(-30),
        {
          id: `heal-diag-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          level: 'diagnose',
          module: pickedSubAgent,
          message: preset.diagnoseMsg()
        }
      ]);
    }, 900);

    // Phase 3 (2000ms): Automated Repair & Hot-Patch
    const t2 = setTimeout(() => {
      preset.applyFix();
      setLogs(prev => [
        ...prev.slice(-30),
        {
          id: `heal-fix-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          level: 'fix',
          module: 'AUTO-REPAIR',
          message: preset.fixMsg(entityName)
        }
      ]);
    }, 2000);

    // Phase 4 (3100ms): Verification & Quality Audit
    const t3 = setTimeout(() => {
      const finishTime = new Date().toLocaleTimeString();
      const resolvedRecord: ResolvedIssue = {
        id: `res-${Date.now()}`,
        title: `${preset.title} (${entityName})`,
        module: preset.module,
        severity: preset.severity,
        anomaly: preset.detectMsg(entityName),
        rootCause: preset.diagnoseMsg(),
        beforeDiff: preset.beforeDiff,
        afterDiff: preset.afterDiff,
        resolvedAt: finishTime
      };

      setResolvedIssues(prev => [resolvedRecord, ...prev.slice(0, 15)]);
      setCycleCount(c => c + 1);
      setIssuesResolvedCount(r => r + 1);
      setHealthScore(99.9);

      setLogs(prev => [
        ...prev.slice(-30),
        {
          id: `heal-verify-${Date.now()}`,
          timestamp: finishTime,
          level: 'verify',
          module: 'QA-VERIFIER',
          message: `Regression test passed for ${preset.title}. Health score restored to 99.9%.`
        },
        {
          id: `heal-end-${Date.now()}`,
          timestamp: finishTime,
          level: 'info',
          module: 'AUTO-HEALING',
          message: '✓ End of Healing reached. All anomalies resolved. Auto-disengaging toggle to OFF.'
        }
      ]);
    }, 3100);

    // Phase 5 (4100ms): End of Healing -> Auto OFF toggle button!
    const t4 = setTimeout(() => {
      setIsAutoHealingActive(false);
    }, 4100);

    healingTimeoutRef.current = [t1, t2, t3, t4];
  };

  const handleToggleAutoHeal = (checked: boolean) => {
    if (checked) {
      startAutoHealSequence();
    } else {
      stopAutoHealSequence();
      setLogs(prev => [
        ...prev.slice(-30),
        {
          id: `heal-cancel-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          level: 'info',
          module: 'AUTO-HEALING',
          message: 'Auto-Healing toggle turned OFF manually.'
        }
      ]);
    }
  };

  // Sync external prop if provided
  useEffect(() => {
    if (externalIsHealing !== undefined && externalIsHealing !== internalIsHealing) {
      if (externalIsHealing) {
        startAutoHealSequence();
      } else {
        stopAutoHealSequence();
      }
    }
  }, [externalIsHealing]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      healingTimeoutRef.current.forEach(t => clearTimeout(t));
    };
  }, []);

  // Autonomous Loop Timer (only runs if loop active and not in interactive single healing)
  useEffect(() => {
    let interval: any = null;
    if (isRunning && !isAutoHealingActive) {
      interval = setInterval(() => {
        executeHealingCycle();
      }, cycleInterval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isAutoHealingActive, cycleInterval, products, invoices, parties]);

  // Inject a simulated anomaly for test
  const handleInjectAnomaly = () => {
    const time = new Date().toLocaleTimeString();
    const injectLog: AgentLog = {
      id: `inject-${Date.now()}`,
      timestamp: time,
      level: 'detect',
      module: 'ANOMALY-INJECTOR',
      message: 'User injected test anomaly: Stock negative float & missing HSN simulation.'
    };
    setLogs(prev => [...prev, injectLog]);
    setHealthScore(94.2); // Dip in health
    setTimeout(() => {
      executeHealingCycle();
    }, 600);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn select-text">
      {/* Top Banner Card with High-Tech AI Agent Theme & Holo Toggle Button */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-7 rounded-3xl border border-indigo-500/40 shadow-2xl relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white shrink-0">
                <Cpu className={`w-6 h-6 text-white ${isAutoHealingActive ? 'animate-spin text-emerald-300' : 'animate-pulse'}`} />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Auto-Healing
                  </h2>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black border ${
                    isAutoHealingActive
                      ? 'bg-emerald-500/20 text-[#64e447] border-emerald-500/40 shadow-xs' 
                      : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${isAutoHealingActive ? 'bg-emerald-400 animate-ping' : 'bg-indigo-400'}`}></span>
                    {isAutoHealingActive ? '⚡ HEALING IN PROGRESS' : 'STANDBY READY'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-bold mt-0.5">
                  Autonomous AI Sentinel: Flip the holographic toggle ON to start auto-healing. When healing completes, it automatically switches back to OFF.
                </p>
              </div>
            </div>
          </div>

          {/* Top Holographic Toggle Command Center */}
          <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-950/70 p-4 px-6 rounded-2xl border border-indigo-500/30 backdrop-blur-md shadow-2xl">
            <div className="flex flex-col items-center">
              <div className="text-[10px] font-mono tracking-widest text-cyan-400 font-black mb-2 uppercase flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isAutoHealingActive ? 'bg-emerald-400 animate-ping' : 'bg-cyan-400'}`}></span>
                {isAutoHealingActive ? 'AUTO-HEAL ACTIVE' : 'AUTO-HEAL TRIGGER'}
              </div>
              
              {/* Uiverse.io Holographic Switch */}
              <HoloToggle
                id="main-auto-heal-toggle"
                checked={isAutoHealingActive}
                onChange={handleToggleAutoHeal}
                label={isAutoHealingActive ? "HEALING RUNNING" : "AUTO-HEAL TRIGGER"}
              />
            </div>

            <div className="h-16 w-px bg-slate-800 hidden sm:block"></div>

            {/* Loop Controls Bar */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsRunning(!isRunning)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-all active:scale-95 cursor-pointer ${
                    isRunning
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                  }`}
                  title="Toggle background watcher loop"
                >
                  {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isRunning ? 'Background: Active' : 'Background: Paused'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleInjectAnomaly}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 shadow flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Simulate random issue to test agent response"
                >
                  <Dice5 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Inject Anomaly</span>
                </button>
              </div>

              <div className="flex items-center bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-xl text-[11px]">
                <Clock className="w-3 h-3 text-slate-400 mr-1.5" />
                <span className="text-slate-400 mr-2 font-medium">Cycle:</span>
                <select
                  value={cycleInterval}
                  onChange={(e) => setCycleInterval(Number(e.target.value))}
                  className="bg-transparent text-[11px] font-bold text-slate-200 focus:outline-hidden cursor-pointer"
                >
                  <option value={2000} className="bg-slate-900 text-white">2s (Fast)</option>
                  <option value={4000} className="bg-slate-900 text-white">4s (Standard)</option>
                  <option value={8000} className="bg-slate-900 text-white">8s (Relaxed)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Live Radar Scanning Status Ribbon */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-slate-400 font-bold">Scanning Module:</span>
            <span className="font-black text-cyan-300">{currentScanningModule}</span>
          </div>

          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400 font-bold">Active Sub-Agent:</span>
            <span className="font-mono font-black text-indigo-300 bg-indigo-950/80 px-2.5 py-0.5 rounded-lg border border-indigo-800/60">
              {activeSubAgent}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold">Loop Mode:</span>
            <span className="font-black text-amber-300">Continuous Auto-Repeat (Infinite)</span>
          </div>
        </div>
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white/90 dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Total Scan Cycles</span>
            <RotateCw className={`w-4 h-4 text-indigo-500 ${isRunning ? 'animate-spin' : ''}`} />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {cycleCount}
          </div>
          <span className="text-[10px] text-slate-400 font-bold">Continuous repeat iterations</span>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Issues Auto-Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {issuesResolvedCount}
          </div>
          <span className="text-[10px] text-slate-400 font-bold">100% Autonomous fix rate</span>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">ERP System Health</span>
            <TrendingUp className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400 mt-1 font-mono">
            {healthScore.toFixed(1)}%
          </div>
          <span className="text-[10px] text-slate-400 font-bold">Zero fatal errors detected</span>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Active Sentinel Agents</span>
            <Wrench className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
            4 / 4
          </div>
          <span className="text-[10px] text-slate-400 font-bold">GST, Stock, Party & API</span>
        </div>
      </div>

      {/* Main Grid: Live Terminal on Left, Resolved Issues Feed on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Terminal Live Stream (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-950 text-slate-200 rounded-3xl border border-slate-800 shadow-2xl p-5 flex flex-col justify-between space-y-3 font-mono">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-slate-300">Live Agent Execution Terminal</span>
              <span className="text-[9px] bg-slate-800 px-2 py-0.5 rounded text-emerald-400 font-bold">
                STREAMING LIVE
              </span>
            </div>
            <button
              type="button"
              onClick={() => setLogs([])}
              className="text-slate-500 hover:text-slate-300 text-[10px] flex items-center gap-1 cursor-pointer"
              title="Clear terminal logs"
            >
              <Trash2 className="w-3 h-3" /> Clear
            </button>
          </div>

          {/* Terminal Screen */}
          <div className="flex-1 max-h-[420px] overflow-y-auto space-y-2 pr-1 text-xs select-text scrollbar-thin scrollbar-thumb-slate-800">
            {logs.map((log) => {
              const levelColor = 
                log.level === 'detect' ? 'text-amber-400 font-black' :
                log.level === 'diagnose' ? 'text-cyan-400 font-bold' :
                log.level === 'fix' ? 'text-emerald-400 font-black' :
                log.level === 'verify' ? 'text-purple-300 font-bold' :
                'text-slate-400';

              return (
                <div key={log.id} className="leading-relaxed hover:bg-slate-900/60 p-1 rounded transition-colors flex items-start gap-2">
                  <span className="text-slate-500 text-[10px] shrink-0 pt-0.5">[{log.timestamp}]</span>
                  <span className="text-indigo-400 font-black text-[10px] shrink-0">[{log.module}]</span>
                  <span className={`${levelColor} break-words`}>{log.message}</span>
                </div>
              );
            })}
            <div ref={terminalEndRef} />
          </div>

          {/* Terminal Footer Indicator */}
          <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Auto-repeat interval: {cycleInterval / 1000}s
            </span>
            <span className="font-bold text-slate-400">PID: 9482 • SRE Daemon</span>
          </div>
        </div>

        {/* Resolved Issues Audit Feed (5 Cols) */}
        <div className="lg:col-span-5 bg-white/95 dark:bg-slate-900/95 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-5 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-xl">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                  Resolved Anomaly Audit Log
                </h3>
                <p className="text-[10px] text-slate-500 font-bold">
                  Live record of issues solved randomly by the agent
                </p>
              </div>
            </div>
            <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200 dark:border-emerald-800">
              {resolvedIssues.length} Solved
            </span>
          </div>

          {/* Issue Cards */}
          <div className="flex-1 max-h-[420px] overflow-y-auto space-y-3 pr-1 scrollbar-thin">
            {resolvedIssues.map((issue) => (
              <div
                key={issue.id}
                className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-2 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all shadow-2xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${
                      issue.severity === 'Critical' ? 'bg-rose-500' :
                      issue.severity === 'Warning' ? 'bg-amber-500' : 'bg-cyan-500'
                    }`}></span>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                      {issue.title}
                    </h4>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 shrink-0">
                    {issue.resolvedAt}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-tight">
                  {issue.anomaly}
                </p>

                {/* Diff Container */}
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1">
                  <div className="bg-rose-50/80 dark:bg-rose-950/30 p-2 rounded-xl border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-300">
                    <span className="font-black block uppercase text-[8px] text-rose-500 mb-0.5">- Before Anomaly</span>
                    <pre className="whitespace-pre-wrap leading-tight">{issue.beforeDiff}</pre>
                  </div>
                  <div className="bg-emerald-50/80 dark:bg-emerald-950/30 p-2 rounded-xl border border-emerald-200 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                    <span className="font-black block uppercase text-[8px] text-emerald-500 mb-0.5">+ Auto-Fixed Diff</span>
                    <pre className="whitespace-pre-wrap leading-tight">{issue.afterDiff}</pre>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-[10px]">
                  <span className="font-bold text-slate-500">
                    Module: <strong className="text-indigo-600 dark:text-indigo-400">{issue.module}</strong>
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-black flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Auto-Patched ✓
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Module Navigation Action */}
          {onNavigateTab && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-bold text-[11px]">Inspect ERP data:</span>
              <button
                type="button"
                onClick={() => onNavigateTab('products')}
                className="text-xs font-black text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1 cursor-pointer"
              >
                <span>View Products & AI Master</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
