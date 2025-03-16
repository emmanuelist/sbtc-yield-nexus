import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Zap,
  Settings,
  Shield,
  FileText,
  Plus
} from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

// Import all components
import PortfolioSummary from '@/components/Dashboard/PortfolioSummaryd';
import ActivePositions from '@/components/Dashboard/ActivePositions';
import AlertsPanel from '@/components/Dashboard/AlertsPanel';
import APYLeaderboard from '@/components/Dashboard/APYLeaderboard';
import OptimizationPanel from '@/components/Dashboard/OptimizationPanel';
import RecentTransactions from '@/components/Dashboard/RecentTransactions';
import YieldStrategyCard from '@/components/Dashboard/YieldStrategyCard';
import ProtocolDetails, { Protocols } from '@/components/Dashboard/ProtocolDetails';
import TaxReporting, { TaxReport, TaxSummary, YieldTransaction } from '@/components/Dashboard/TaxReporting';
import NewStrategyModal from '@/components/Dashboard/NewStrategyModal';
import SettingsTab from '@/components/Dashboard/SettingsTab';

// Define interfaces for typed data
interface PortfolioStatsType {
  totalValue: number;
  usdValue: number;
  totalYield: number;
  yieldPercentage: number;
  dailyYield: number;
  changePercentage: number;
  riskScore: number;
}

interface AllocationItem {
  protocol: string;
  percentage: number;
  color: string;
}

interface Position {
  id: string;
  name: string;
  symbol: string;
  type: string;
  status: string;
  deposited: number;
  apy: number;
  rewards: number;
  timeInPosition: string;
  color: 'indigo' | 'violet' | 'amber' | 'emerald';
}

interface Alert {
  id: string;
  type: 'warning' | 'reward' | 'info';
  title: string;
  message: string;
  priority: number;
  timestamp: string;
  timeAgo: string;
  action?: string;
}

interface Protocol {
  id: string;
  name: string;
  symbol: string;
  pool: string;
  apy: number;
  tvl: number;
  risk: number;
}

interface Transaction {
  id: string;
  type: 'deposit' | 'harvest' | 'rebalance' | 'other';  // Use literal types
  action: string;
  protocol: string;
  amount: string;
  timeAgo: string;
  isPositive: boolean;
}

interface Strategy {
  id: string;
  name: string;
  description: string;
  type: 'conservative' | 'balanced' | 'aggressive'; // This should be a StrategyType
  targetApy: string;
  riskLevel: number;
  rebalance: string;
}

interface DashboardProps { }

export const Dashboard: React.FC<DashboardProps> = () => {
  const [_isLoading, setIsLoading] = useState<boolean>(true);
  // Add 'settings' to your activeTab type
  const [activeTab, setActiveTab] = useState<'overview' | 'strategies' | 'protocols' | 'tax' | 'settings'>('overview');
  const { walletAddress } = useAppContext();


  // Add this to your existing state declarations
  const [isStrategyModalOpen, setIsStrategyModalOpen] = useState<boolean>(false);


  // Add this after your other state declarations
  const [dashboardSettings, setDashboardSettings] = useState({
    wallet: {
      address: walletAddress || '0x123...abc',
      balance: 1.45,
      network: 'Bitcoin Mainnet',
      connectionMethod: 'Web Wallet'
    },
    notifications: {
      email: true,
      browser: true,
      yieldAlerts: true,
      securityAlerts: true,
      priceAlerts: false,
      rebalanceNotifications: true,
      weeklyReports: true
    },
    security: {
      twoFactorEnabled: false,
      loginNotifications: true,
      approvalConfirmations: true,
      withdrawalAddressWhitelist: false,
      lastPasswordChange: '2025-02-15'
    },
    display: {
      theme: 'light' as 'light' | 'dark' | 'system',
      currency: 'USD' as 'USD' | 'EUR' | 'GBP' | 'JPY',
      timeFormat: '12h' as '12h' | '24h',
      dateFormat: 'MM/DD/YYYY' as 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD'
    },
    integrations: [
      {
        id: 'int-1',
        name: 'Coinbase',
        type: 'exchange' as 'exchange' | 'wallet' | 'tax' | 'portfolio',
        connected: true,
        lastSync: '2025-03-10T15:30:00Z'
      },
      {
        id: 'int-2',
        name: 'TurboTax',
        type: 'tax' as 'exchange' | 'wallet' | 'tax' | 'portfolio',
        connected: true,
        lastSync: '2025-03-05T10:15:00Z'
      },
      {
        id: 'int-3',
        name: 'Koinly',
        type: 'tax' as 'exchange' | 'wallet' | 'tax' | 'portfolio',
        connected: false
      }
    ]
  });

  // Add these handler functions
  const handleSaveSettings = (settings: any) => {
    setDashboardSettings(settings);
  };

  const handleWalletDisconnect = () => {
    // Implement your wallet disconnection logic
    console.log("Wallet disconnected");
  };

  // Simulation of loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Portfolio stats
  const portfolioStats: PortfolioStatsType = {
    totalValue: 1.45, // sBTC
    usdValue: 68732.50, // USD
    totalYield: 0.087, // sBTC
    yieldPercentage: 8.2,
    dailyYield: 0.00032,
    changePercentage: 3.2,
    riskScore: 2.8,
  };

  // Protocol allocation
  const allocation: AllocationItem[] = [
    { protocol: 'ALEX', percentage: 40, color: 'bg-indigo-500' },
    { protocol: 'Bitflow', percentage: 25, color: 'bg-violet-500' },
    { protocol: 'Arkadiko', percentage: 20, color: 'bg-amber-500' },
    { protocol: 'StackSwap', percentage: 15, color: 'bg-emerald-500' }
  ];

  const [isOptimizerEnabled, setIsOptimizerEnabled] = useState<boolean>(true);
  const [optimizerSettings, setOptimizerSettings] = useState({
    riskTolerance: 'medium' as 'low' | 'medium' | 'high',
    rebalanceFrequency: 'weekly' as 'daily' | 'weekly' | 'monthly',
    targetApy: 8.5,
    nextRebalance: '2d 14h 23m',
    autoCompound: true
  });

  // Add these handler functions inside the Dashboard component
  const handleOptimizerToggle = (isEnabled: boolean) => {
    setIsOptimizerEnabled(isEnabled);
  };

  const handleSaveOptimizerSettings = (settings: any) => {
    setOptimizerSettings(settings);
  };

  // Add sample data for Protocol Details
  // Update the protocols data to use the correct literal types for auditStatus
  const protocolss: Protocols[] = [
    {
      id: 'proto-1',
      name: 'ALEX',
      symbol: 'A',
      logo: '/alex-logo.png',
      description: 'ALEX is a DeFi protocol built on Stacks, offering liquidity pools, yield farming, and staking services for sBTC and other Stacks assets.',
      website: 'https://alexgo.io',
      tvl: 4200000,
      apy: 11.2,
      pools: [
        {
          id: 'pool-1',
          name: 'sBTC-USDA Pool',
          pairs: 'sBTC-USDA',
          apy: 11.2,
          tvl: 2500000,
          enabled: true,
          depositFee: 0,
          withdrawFee: 0
        },
        {
          id: 'pool-2',
          name: 'sBTC-STX Pool',
          pairs: 'sBTC-STX',
          apy: 9.8,
          tvl: 1700000,
          enabled: true,
          depositFee: 0.1,
          withdrawFee: 0.1
        }
      ],
      securityScore: 8.5,
      auditStatus: 'Audited', // This is now a literal type, not a general string
      lastAuditDate: '2024-09-15',
      riskLevel: 3,
      riskFactors: [
        'Smart contract risk',
        'Oracle dependency',
        'Market volatility exposure'
      ],
      supported: true
    },
    {
      id: 'proto-2',
      name: 'Bitflow',
      symbol: 'B',
      logo: '/bitflow-logo.png',
      description: 'Bitflow is a yield optimizer for sBTC, automatically compounding rewards across multiple protocols to maximize returns.',
      website: 'https://bitflow.finance',
      tvl: 1800000,
      apy: 9.8,
      pools: [
        {
          id: 'pool-3',
          name: 'Leverage Vault',
          pairs: 'sBTC',
          apy: 9.8,
          tvl: 1800000,
          enabled: true,
          depositFee: 0.5,
          withdrawFee: 0.5
        }
      ],
      securityScore: 7.2,
      auditStatus: 'Audited', // Must be one of: 'Audited', 'Pending', or 'None'
      lastAuditDate: '2024-08-20',
      riskLevel: 4,
      riskFactors: [
        'Smart contract risk',
        'Leverage exposure',
        'Oracle dependency',
        'Complex optimization strategies'
      ],
      supported: true
    },
    {
      id: 'proto-3',
      name: 'Arkadiko',
      symbol: 'A',
      logo: '/arkadiko-logo.png',
      description: 'Arkadiko is a decentralized lending protocol on Stacks, allowing users to provide liquidity and earn yield on sBTC and other assets.',
      website: 'https://arkadiko.finance',
      tvl: 2900000,
      apy: 7.6,
      pools: [
        {
          id: 'pool-4',
          name: 'sBTC-xUSD Pool',
          pairs: 'sBTC-xUSD',
          apy: 7.6,
          tvl: 1900000,
          enabled: true,
          depositFee: 0,
          withdrawFee: 0
        },
        {
          id: 'pool-5',
          name: 'sBTC Lend',
          pairs: 'sBTC',
          apy: 6.8,
          tvl: 1000000,
          enabled: true,
          depositFee: 0,
          withdrawFee: 0
        }
      ],
      securityScore: 8.0,
      auditStatus: 'Audited', // Must be one of: 'Audited', 'Pending', or 'None'
      lastAuditDate: '2024-07-10',
      riskLevel: 2,
      riskFactors: [
        'Smart contract risk',
        'Liquidation risk'
      ],
      supported: true
    }
  ] as Protocols[]; // You can use type assertion if needed

  // Add sample data for Tax Reporting
  const reports: TaxReport[] = [
    {
      id: 'report-1',
      year: 2025,
      quarter: 1,
      type: 'quarterly',
      status: 'ready',
      dateGenerated: '2025-03-10T12:00:00Z',
      downloadUrl: '/reports/q1-2025.pdf',
      transactionCount: 42,
      totalYield: 0.056,
      currency: 'sBTC'
    },
    {
      id: 'report-2',
      year: 2025,
      month: 2,
      type: 'monthly',
      status: 'ready',
      dateGenerated: '2025-03-01T10:30:00Z',
      downloadUrl: '/reports/feb-2025.pdf',
      transactionCount: 15,
      totalYield: 0.018,
      currency: 'sBTC'
    },
    {
      id: 'report-3',
      year: 2025,
      month: 1,
      type: 'monthly',
      status: 'ready',
      dateGenerated: '2025-02-01T09:45:00Z',
      downloadUrl: '/reports/jan-2025.pdf',
      transactionCount: 12,
      totalYield: 0.021,
      currency: 'sBTC'
    },
    {
      id: 'report-4',
      year: 2024,
      type: 'yearly',
      status: 'ready',
      dateGenerated: '2025-01-15T14:20:00Z',
      downloadUrl: '/reports/2024-annual.pdf',
      transactionCount: 156,
      totalYield: 0.34,
      currency: 'sBTC'
    }
  ];

  const recentTaxTransactions: YieldTransaction[] = [
    {
      id: 'tax-tx-1',
      date: '2025-03-12T10:30:00Z',
      protocol: 'ALEX',
      type: 'harvest',
      amount: 0.0023,
      currency: 'sBTC',
      usdValue: 109.12,
      taxableEvent: true,
      costBasis: 0,
      gain: 109.12
    },
    {
      id: 'tax-tx-2',
      date: '2025-03-10T14:45:00Z',
      protocol: 'Bitflow',
      type: 'deposit',
      amount: 0.15,
      currency: 'sBTC',
      usdValue: 7123.50,
      taxableEvent: false
    },
    {
      id: 'tax-tx-3',
      date: '2025-03-05T09:15:00Z',
      protocol: 'Arkadiko',
      type: 'withdraw',
      amount: 0.05,
      currency: 'sBTC',
      usdValue: 2374.50,
      taxableEvent: true,
      costBasis: 2300.00,
      gain: 74.50
    }
  ];

  const taxSummary: TaxSummary = {
    totalYield: 8642.75,
    totalTaxable: 6218.45,
    totalNonTaxable: 2424.30,
    totalCapitalGains: 842.68,
    totalCostBasis: 5375.77,
    totalHarvestAmount: 0.087,
    protocols: [
      {
        name: 'ALEX',
        yield: 4563.20,
        percentage: 52.8
      },
      {
        name: 'Bitflow',
        yield: 2345.67,
        percentage: 27.1
      },
      {
        name: 'Arkadiko',
        yield: 1733.88,
        percentage: 20.1
      }
    ]
  };
  // Active positions data
  const positions: Position[] = [
    {
      id: 'pos-1',
      name: 'ALEX sBTC-USDA',
      symbol: 'A',
      type: 'Liquidity Pool',
      status: 'Active',
      deposited: 0.35,
      apy: 11.2,
      rewards: 0.0082,
      timeInPosition: '14 days',
      color: 'indigo'
    },
    {
      id: 'pos-2',
      name: 'Bitflow Leverage Vault',
      symbol: 'B',
      type: 'Yield Vault',
      status: 'Active',
      deposited: 0.4,
      apy: 9.8,
      rewards: 0.0065,
      timeInPosition: '8 days',
      color: 'violet'
    },
    {
      id: 'pos-3',
      name: 'Arkadiko sBTC-xUSD',
      symbol: 'A',
      type: 'Liquidity Pool',
      status: 'Active',
      deposited: 0.3,
      apy: 7.6,
      rewards: 0.0043,
      timeInPosition: '10 days',
      color: 'amber'
    }
  ];

  // Alerts data
  const alerts: Alert[] = [
    {
      id: 'alert-1',
      type: 'warning',
      title: 'APY Drop Detected',
      message: 'ALEX sBTC-USDA pool APY has dropped by 12% in the last 24 hours.',
      priority: 1,
      timestamp: '2025-03-15T10:00:00Z',
      timeAgo: '2h ago',
      action: 'Take Action'
    },
    {
      id: 'alert-2',
      type: 'reward',
      title: 'Rewards Available',
      message: '0.0023 sBTC rewards ready to harvest from Bitflow Leverage Vault.',
      priority: 2,
      timestamp: '2025-03-15T07:00:00Z',
      timeAgo: '5h ago',
      action: 'Harvest'
    },
    {
      id: 'alert-3',
      type: 'info',
      title: 'New Pool Available',
      message: 'Arkadiko launched a new sBTC-STX liquidity pool with 10.5% APY.',
      priority: 3,
      timestamp: '2025-03-14T12:00:00Z',
      timeAgo: '1d ago',
      action: 'Explore'
    }
  ];

  // APY Leaderboard data
  const protocols: Protocol[] = [
    {
      id: 'apy-1',
      name: 'ALEX',  // changed from 'protocol' to 'name'
      symbol: 'A',
      pool: 'sBTC-USDA',
      apy: 11.2,
      tvl: 4200000,  // numeric value
      risk: 3
    },
    {
      id: 'apy-2',
      name: 'Bitflow',  // changed from 'protocol' to 'name'
      symbol: 'B',
      pool: 'Leverage Vault',
      apy: 9.8,
      tvl: 1800000,  // changed from string '$1.8M' to numeric value
      risk: 4
    },
    {
      id: 'apy-3',
      name: 'Arkadiko',  // changed from 'protocol' to 'name'
      symbol: 'A',
      pool: 'sBTC-xUSD',
      apy: 7.6,
      tvl: 2900000,  // changed from string '$2.9M' to numeric value
      risk: 2
    }
  ];

  // Recent transactions data
  const transactions: Transaction[] = [
    {
      id: 'tx-1',
      type: 'deposit',
      action: 'Deposit',
      protocol: 'ALEX sBTC-USDA LP',
      amount: '+0.25 sBTC',
      timeAgo: '12h ago',
      isPositive: true
    },
    {
      id: 'tx-2',
      type: 'harvest',
      action: 'Harvest',
      protocol: 'Bitflow Leverage Vault',
      amount: '+0.0018 sBTC',
      timeAgo: '2d ago',
      isPositive: true
    },
    {
      id: 'tx-3',
      type: 'rebalance',
      action: 'Rebalance',
      protocol: 'Auto-Optimizer Strategy',
      amount: 'System',
      timeAgo: '3d ago',
      isPositive: false
    }
  ];

  // Strategy data for the strategies tab
  // const strategies: Strategy[] = [
  //   {
  //     id: 'strat-1',
  //     name: 'Balanced Growth',
  //     description: 'Optimized for medium risk tolerance with auto-rebalancing across top protocols.',
  //     type: 'balanced',
  //     targetApy: '7-9%',
  //     riskLevel: 3,
  //     rebalance: 'Weekly'
  //   },
  //   {
  //     id: 'strat-2',
  //     name: 'Conservative',
  //     description: 'Capital preservation focus with steady returns and minimal risk exposure.',
  //     type: 'conservative',
  //     targetApy: '4-6%',
  //     riskLevel: 2,
  //     rebalance: 'Monthly'
  //   },
  //   {
  //     id: 'strat-3',
  //     name: 'Aggressive Growth',
  //     description: 'Maximum yield optimization with leverage and higher volatility tolerance.',
  //     type: 'aggressive',
  //     targetApy: '10-12%',
  //     riskLevel: 5,
  //     rebalance: 'Daily'
  //   }
  // ];

  // First, let's modify the strategies state to load from localStorage on component mount
  const [strategies, setStrategies] = useState<Strategy[]>(() => {
    // Try to load strategies from localStorage on initial render
    const savedStrategies = localStorage.getItem('sbtc-yield-strategies');
    return savedStrategies ? JSON.parse(savedStrategies) : [
      {
        id: 'strat-1',
        name: 'Balanced Growth',
        description: 'Optimized for medium risk tolerance with auto-rebalancing across top protocols.',
        type: 'balanced',
        targetApy: '7-9%',
        riskLevel: 3,
        rebalance: 'Weekly'
      },
      {
        id: 'strat-2',
        name: 'Conservative',
        description: 'Capital preservation focus with steady returns and minimal risk exposure.',
        type: 'conservative',
        targetApy: '4-6%',
        riskLevel: 2,
        rebalance: 'Monthly'
      },
      {
        id: 'strat-3',
        name: 'Aggressive Growth',
        description: 'Maximum yield optimization with leverage and higher volatility tolerance.',
        type: 'aggressive',
        targetApy: '10-12%',
        riskLevel: 5,
        rebalance: 'Daily'
      }
    ];
  });

  // Add an effect to save strategies to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('sbtc-yield-strategies', JSON.stringify(strategies));
  }, [strategies]);

  // Now, update the handleNewStrategy function to add the new strategy to the state
  const handleNewStrategy = (strategy: any) => {
    // Add the new strategy to the strategies array
    const updatedStrategies = [...strategies, strategy];

    // Update state (this will trigger the effect to save to localStorage)
    setStrategies(updatedStrategies);

    // Optionally, you might want to set this as the active strategy
    setActiveStrategyId(strategy.id);

    // Display a success message or notification
    console.log("New strategy created and saved:", strategy);
  };

  // Also, let's update the handleActivateStrategy function to update localStorage
  const handleActivateStrategy = (id: string) => {
    setActiveStrategyId(id);

    // Update the active status in the strategies array
    const updatedStrategies = strategies.map(strategy => ({
      ...strategy,
      active: strategy.id === id
    }));

    // Update state (this will trigger the effect to save to localStorage)
    setStrategies(updatedStrategies);

    // Save the active strategy ID separately for easy access
    localStorage.setItem('sbtc-active-strategy', id);
  };

  // Load the active strategy ID from localStorage on component mount
  const [activeStrategyId, setActiveStrategyId] = useState<string>(() => {
    return localStorage.getItem('sbtc-active-strategy') || 'strat-1';
  });

  // const [activeStrategyId, setActiveStrategyId] = useState<string>('strat-1'); // Default active strategy

  // const handleActivateStrategy = (id: string) => {
  //   setActiveStrategyId(id);
  // };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-50 via-indigo-50/10 to-white pb-12">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Gradient overlay */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-300 via-indigo-200/40 to-transparent"></div>

        {/* Pattern background */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15L30 0zm-5.98 10l-15 8.66v17.32l15 8.66 15-8.66V18.66l-15-8.66z' fill='%234f46e5' fill-opacity='0.6' fill-rule='evenodd'/%3E%3C/svg%3E\")",
          backgroundSize: "60px 60px"
        }}></div>

        {/* Accent lines */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 max-w-7xl pt-6">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-400 bg-clip-text text-transparent">
                sBTC Yield Dashboard
              </span>
            </h1>
            <p className="text-gray-600 text-sm md:text-base mt-1">
              Optimize your sBTC yield across multiple protocols
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <button
              onClick={() => setActiveTab('settings')}
              className="px-4 py-2 bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700 rounded-lg text-sm font-medium border border-indigo-100 shadow-sm flex items-center"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </button>
            <button onClick={() => setIsStrategyModalOpen(true)} className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg text-sm font-medium shadow-md shadow-indigo-300/30 flex items-center transition-all hover:translate-y-[-2px]">
              <Zap className="w-4 h-4 mr-2" />
              New Strategy
            </button>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="border-b border-gray-200 mb-6 overflow-x-auto">
          <nav className="flex space-x-8" aria-label="Dashboard Tabs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <BarChart3 className="w-4 h-4 inline-block mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('strategies')}
              className={`py-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === 'strategies'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <Zap className="w-4 h-4 inline-block mr-2" />
              Strategies
            </button>
            <button
              onClick={() => setActiveTab('protocols')}
              className={`py-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === 'protocols'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <Shield className="w-4 h-4 inline-block mr-2" />
              Protocols
            </button>
            <button
              onClick={() => setActiveTab('tax')}
              className={`py-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === 'tax'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <FileText className="w-4 h-4 inline-block mr-2" />
              Tax Reporting
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === 'settings'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <Settings className="w-4 h-4 inline-block mr-2" />
              Settings
            </button>
          </nav>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {activeTab === 'overview' && (
            <>
              {/* First Row - Portfolio Summary and Active Strategy */}
              <div className="lg:col-span-8 space-y-6">
                {/* Portfolio Summary Card */}
                <PortfolioSummary
                  portfolioStats={portfolioStats}
                  allocation={allocation}
                />

                {/* APY Leaderboard */}
                <APYLeaderboard
                  protocols={protocols}
                />
              </div>

              {/* Sidebar - Optimization Panel, Alerts, and Recent Transactions */}
              <div className="lg:col-span-4 space-y-6">
                {/* Currently Active Strategy */}
                <OptimizationPanel
                  isEnabled={isOptimizerEnabled}
                  settings={optimizerSettings}
                  onToggle={handleOptimizerToggle}
                  onSaveSettings={handleSaveOptimizerSettings}
                />

                {/* Alerts Panel */}
                <AlertsPanel
                  alerts={alerts}
                />

                {/* Recent Transactions */}
                {/* <RecentTransactions
                  transactions={transactions}
                /> */}
              </div>

              {/* Recent Transactions */}
              <div className='lg:col-span-12'>
                <RecentTransactions
                  transactions={transactions}
                />
              </div>

              {/* Second Row - Active Positions */}
              <div className="lg:col-span-12">
                <ActivePositions
                  positions={positions}
                />
              </div>

            </>
          )}

          {activeTab === 'strategies' && (
            <div className="lg:col-span-12">
              <div className="bg-white/90 backdrop-blur-sm border border-indigo-100 rounded-xl shadow-md shadow-indigo-100/20 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-indigo-600" />
                    Yield Strategies
                  </h2>
                  <button
                    onClick={() => setIsStrategyModalOpen(true)}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg text-sm font-medium shadow-md shadow-indigo-300/30 flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Strategy
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Map through strategies and render YieldStrategyCard components */}
                  {strategies.map((strategy) => (
                    <YieldStrategyCard
                      key={strategy.id}
                      strategy={strategy}
                      isActive={strategy.id === activeStrategyId}
                      onActivate={handleActivateStrategy}
                    />
                  ))}

                  {/* Create Custom Strategy Card */}
                  <div className="border border-dashed border-indigo-200 rounded-lg bg-indigo-50/30 p-5 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
                      <Plus className="w-6 h-6 text-indigo-600" />
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Custom Strategy</h3>

                    <p className="text-sm text-gray-600 mb-4">
                      Build a personalized yield strategy tailored to your specific requirements.
                    </p>

                    <button
                      onClick={() => setIsStrategyModalOpen(true)}
                      className="text-sm px-4 py-2 bg-white border border-indigo-200 text-indigo-600 rounded-lg hover:bg-indigo-50"
                    >
                      Start Building
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'protocols' && (
            <div className="lg:col-span-12">
              <ProtocolDetails protocols={protocolss} />
            </div>
          )}

          {activeTab === 'tax' && (
            <div className="lg:col-span-12">
              <TaxReporting
                reports={reports}
                recentTransactions={recentTaxTransactions}
                taxSummary={taxSummary}
              />
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="lg:col-span-12">
              <SettingsTab
                settings={dashboardSettings}
                onSaveSettings={handleSaveSettings}
                onDisconnectWallet={handleWalletDisconnect}
              />
            </div>
          )}
        </div>
      </div>

      <NewStrategyModal
        isOpen={isStrategyModalOpen}
        onClose={() => setIsStrategyModalOpen(false)}
        onSave={handleNewStrategy}
        availableProtocols={protocols.map(protocol => ({
          id: protocol.id,
          name: protocol.name,
          symbol: protocol.symbol,
          apy: protocol.apy,
          riskLevel: protocol.risk // Map 'risk' to 'riskLevel'
        }))}
      />
    </div>
  );
};

export default Dashboard;