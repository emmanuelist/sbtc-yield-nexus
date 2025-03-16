import React, { useState } from 'react';
import { Shield, ExternalLink, Info, LineChart, BarChart3, Clock, Terminal, Lock, AlertTriangle, Users, TrendingUp, CheckCircle } from 'lucide-react';

// Define interfaces for the component props
export interface Protocols {
    id: string;
    name: string;
    symbol: string;
    logo: string;
    description: string;
    website: string;
    tvl: number;
    apy: number;
    pools: ProtocolPool[];
    securityScore: number;
    auditStatus: 'Audited' | 'Pending' | 'None';
    lastAuditDate?: string;
    riskLevel: number;
    riskFactors: string[];
    supported: boolean;
}

interface ProtocolPool {
    id: string;
    name: string;
    pairs: string;
    apy: number;
    tvl: number;
    enabled: boolean;
    depositFee: number;
    withdrawFee: number;
}

interface ProtocolDetailsProps {
    protocols: Protocols[];
}

const ProtocolDetails: React.FC<ProtocolDetailsProps> = ({ protocols }) => {
    const [activeProtocol, setActiveProtocol] = useState<string>(protocols[0]?.id || '');
    const [activeTab, setActiveTab] = useState<'overview' | 'pools' | 'security' | 'docs'>('overview');

    const selectedProtocol = protocols.find(p => p.id === activeProtocol) || protocols[0];

    return (
        <div className="bg-white/90 backdrop-blur-sm border border-indigo-100 rounded-xl shadow-md shadow-indigo-100/20 overflow-hidden">
            {/* Protocol Selection Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
                <div className="lg:col-span-3 border-r border-indigo-100 p-4">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
                        <Shield className="w-5 h-5 mr-2 text-indigo-600" />
                        Protocols
                    </h2>

                    <div className="relative mb-4">
                        <input
                            type="text"
                            placeholder="Search protocols..."
                            className="w-full p-2 pr-8 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                    </div>

                    <div className="space-y-1 overflow-y-auto max-h-[500px]">
                        {protocols.map(protocol => (
                            <button
                                key={protocol.id}
                                onClick={() => setActiveProtocol(protocol.id)}
                                className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${protocol.id === activeProtocol
                                    ? 'bg-indigo-50 border border-indigo-100'
                                    : 'hover:bg-gray-50'
                                    }`}
                            >
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                                    <span className="text-xs font-bold text-indigo-600">{protocol.symbol}</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-medium text-gray-900">{protocol.name}</h3>
                                    <div className="text-xs text-gray-500 flex items-center mt-1">
                                        <span className="font-medium text-green-600 mr-2">{protocol.apy.toFixed(1)}%</span>
                                        <span>${protocol.tvl.toLocaleString()}</span>
                                    </div>
                                </div>
                                {protocol.id === activeProtocol && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Protocol Details Section */}
                <div className="lg:col-span-9 p-6">
                    {selectedProtocol && (
                        <>
                            {/* Protocol Header */}
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                                        <span className="text-xl font-bold text-indigo-600">{selectedProtocol.symbol}</span>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">{selectedProtocol.name}</h2>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <a
                                                href={selectedProtocol.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-indigo-600 flex items-center"
                                            >
                                                Visit Website <ExternalLink className="w-3 h-3 ml-1" />
                                            </a>
                                            {selectedProtocol.supported ? (
                                                <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
                                                    Supported
                                                </span>
                                            ) : (
                                                <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                                                    Not Supported
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-sm text-gray-700">Current APY</div>
                                    <div className="text-2xl font-bold text-green-600">{selectedProtocol.apy.toFixed(1)}%</div>
                                    <div className="text-xs text-gray-500">TVL: ${selectedProtocol.tvl.toLocaleString()}</div>
                                </div>
                            </div>

                            {/* Protocol Tabs */}
                            <div className="border-b border-gray-200 mb-6">
                                <nav className="flex space-x-8" aria-label="Protocol Tabs">
                                    <button
                                        onClick={() => setActiveTab('overview')}
                                        className={`py-3 border-b-2 font-medium text-sm transition-colors ${activeTab === 'overview'
                                            ? 'border-indigo-600 text-indigo-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <BarChart3 className="w-4 h-4 inline-block mr-2" />
                                        Overview
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('pools')}
                                        className={`py-3 border-b-2 font-medium text-sm transition-colors ${activeTab === 'pools'
                                            ? 'border-indigo-600 text-indigo-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <LineChart className="w-4 h-4 inline-block mr-2" />
                                        Pools
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('security')}
                                        className={`py-3 border-b-2 font-medium text-sm transition-colors ${activeTab === 'security'
                                            ? 'border-indigo-600 text-indigo-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <Lock className="w-4 h-4 inline-block mr-2" />
                                        Security
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('docs')}
                                        className={`py-3 border-b-2 font-medium text-sm transition-colors ${activeTab === 'docs'
                                            ? 'border-indigo-600 text-indigo-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <Terminal className="w-4 h-4 inline-block mr-2" />
                                        Documentation
                                    </button>
                                </nav>
                            </div>

                            {/* Tab Content */}
                            {activeTab === 'overview' && (
                                <div className="space-y-6">
                                    <div className="p-5 border border-indigo-100 rounded-lg bg-gradient-to-r from-indigo-50/50 to-white">
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">About {selectedProtocol.name}</h3>
                                        <p className="text-gray-700 text-sm leading-relaxed">{selectedProtocol.description}</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Protocol Stats */}
                                        <div className="p-5 border border-indigo-100 rounded-lg">
                                            <h3 className="text-md font-medium text-gray-900 mb-3">Protocol Stats</h3>
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-600">TVL</span>
                                                    <span className="text-sm font-medium">${selectedProtocol.tvl.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-600">Average APY</span>
                                                    <span className="text-sm font-medium text-green-600">{selectedProtocol.apy.toFixed(1)}%</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-600">Number of Pools</span>
                                                    <span className="text-sm font-medium">{selectedProtocol.pools.length}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-600">Audit Status</span>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${selectedProtocol.auditStatus === 'Audited'
                                                        ? 'bg-green-100 text-green-800'
                                                        : selectedProtocol.auditStatus === 'Pending'
                                                            ? 'bg-amber-100 text-amber-800'
                                                            : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {selectedProtocol.auditStatus}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Risk Assessment */}
                                        <div className="p-5 border border-indigo-100 rounded-lg">
                                            <h3 className="text-md font-medium text-gray-900 mb-3">Risk Assessment</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-gray-600">Risk Level</span>
                                                        <span className="text-sm font-medium">{selectedProtocol.riskLevel}/5</span>
                                                    </div>
                                                    <div className="w-full h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-green-500 via-amber-500 to-red-500 rounded-full"
                                                            style={{ width: `${(selectedProtocol.riskLevel / 5) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Risk Factors</h4>
                                                    <ul className="space-y-1">
                                                        {selectedProtocol.riskFactors.map((factor, index) => (
                                                            <li key={index} className="text-xs text-gray-600 flex items-start">
                                                                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mr-1.5 mt-0.5" />
                                                                {factor}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'pools' && (
                                <div className="space-y-5">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-medium text-gray-900">Available Pools</h3>
                                        <div className="flex items-center space-x-2">
                                            <div className="text-xs text-gray-500 flex items-center">
                                                <Clock className="w-3.5 h-3.5 mr-1" />
                                                Last updated: 5 min ago
                                            </div>
                                            <button className="text-xs px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg">
                                                Sort by APY
                                            </button>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead>
                                                <tr>
                                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pool</th>
                                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pairs</th>
                                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">APY</th>
                                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TVL</th>
                                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fees</th>
                                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-100">
                                                {selectedProtocol.pools.map((pool) => (
                                                    <tr key={pool.id} className="hover:bg-indigo-50/30 transition-colors">
                                                        <td className="px-3 py-3 whitespace-nowrap">
                                                            <span className="font-medium text-gray-900">{pool.name}</span>
                                                        </td>
                                                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700">{pool.pairs}</td>
                                                        <td className="px-3 py-3 whitespace-nowrap">
                                                            <span className="font-medium text-green-600">{pool.apy.toFixed(1)}%</span>
                                                        </td>
                                                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700">${pool.tvl.toLocaleString()}</td>
                                                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700">
                                                            {pool.depositFee > 0 || pool.withdrawFee > 0 ? (
                                                                <div>
                                                                    <div>Deposit: {pool.depositFee}%</div>
                                                                    <div>Withdraw: {pool.withdrawFee}%</div>
                                                                </div>
                                                            ) : (
                                                                <span className="text-green-600">No fees</span>
                                                            )}
                                                        </td>
                                                        <td className="px-3 py-3 whitespace-nowrap">
                                                            <span className={`px-2 py-1 text-xs rounded-full ${pool.enabled
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-gray-100 text-gray-800'
                                                                }`}>
                                                                {pool.enabled ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </td>
                                                        <td className="px-3 py-3 whitespace-nowrap text-sm">
                                                            <button
                                                                className={`text-indigo-600 hover:text-indigo-900 font-medium ${!pool.enabled && 'opacity-50 cursor-not-allowed'}`}
                                                                disabled={!pool.enabled}
                                                            >
                                                                Deposit
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="space-y-6">
                                    <div className="p-5 border border-indigo-100 rounded-lg bg-gradient-to-r from-indigo-50/50 to-white">
                                        <div className="flex items-start">
                                            <div className={`p-3 rounded-full ${selectedProtocol.auditStatus === 'Audited'
                                                ? 'bg-green-100'
                                                : selectedProtocol.auditStatus === 'Pending'
                                                    ? 'bg-amber-100'
                                                    : 'bg-red-100'
                                                } mr-4`}>
                                                <Lock className={`w-6 h-6 ${selectedProtocol.auditStatus === 'Audited'
                                                    ? 'text-green-600'
                                                    : selectedProtocol.auditStatus === 'Pending'
                                                        ? 'text-amber-600'
                                                        : 'text-red-600'
                                                    }`} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900 mb-1">Security Status</h3>
                                                <p className="text-gray-700 text-sm">
                                                    {selectedProtocol.auditStatus === 'Audited'
                                                        ? `${selectedProtocol.name} has been audited by reputable security firms.`
                                                        : selectedProtocol.auditStatus === 'Pending'
                                                            ? `${selectedProtocol.name} is currently undergoing security audits.`
                                                            : `${selectedProtocol.name} has not undergone formal security audits.`
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="p-5 border border-indigo-100 rounded-lg">
                                            <h3 className="text-md font-medium text-gray-900 mb-3">Audit Information</h3>

                                            {selectedProtocol.auditStatus === 'Audited' ? (
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-gray-600">Last Audit Date</span>
                                                        <span className="text-sm font-medium">{selectedProtocol.lastAuditDate}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-gray-600">Audit Firm</span>
                                                        <span className="text-sm font-medium">ConsenSys Diligence</span>
                                                    </div>
                                                    <div className="mt-3">
                                                        <a
                                                            href="#"
                                                            className="text-xs text-indigo-600 flex items-center justify-center border border-indigo-200 rounded-lg p-2 hover:bg-indigo-50"
                                                        >
                                                            <ExternalLink className="w-3.5 h-3.5 mr-1" />
                                                            View Audit Report
                                                        </a>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center h-32 text-center">
                                                    <div className="text-gray-500 text-sm">
                                                        {selectedProtocol.auditStatus === 'Pending'
                                                            ? 'Audit results pending completion'
                                                            : 'No audit information available'
                                                        }
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-5 border border-indigo-100 rounded-lg">
                                            <h3 className="text-md font-medium text-gray-900 mb-3">Security Recommendations</h3>
                                            <div className="space-y-2">
                                                <div className="flex items-start">
                                                    <div className="mr-2 mt-0.5">
                                                        <Info className="w-4 h-4 text-indigo-600" />
                                                    </div>
                                                    <p className="text-sm text-gray-600">
                                                        Start with small deposits and gradually increase as you gain confidence in the protocol.
                                                    </p>
                                                </div>
                                                <div className="flex items-start">
                                                    <div className="mr-2 mt-0.5">
                                                        <Info className="w-4 h-4 text-indigo-600" />
                                                    </div>
                                                    <p className="text-sm text-gray-600">
                                                        Regularly check for protocol updates and security announcements.
                                                    </p>
                                                </div>
                                                <div className="flex items-start">
                                                    <div className="mr-2 mt-0.5">
                                                        <Info className="w-4 h-4 text-indigo-600" />
                                                    </div>
                                                    <p className="text-sm text-gray-600">
                                                        Consider using a hardware wallet for additional security when interacting with this protocol.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-5 border border-indigo-100 rounded-lg">
                                        <h3 className="text-md font-medium text-gray-900 mb-3">Community Trust Score</h3>
                                        <div className="flex items-center space-x-6">
                                            <div className="w-24 h-24 relative">
                                                <svg viewBox="0 0 36 36" className="w-full h-full">
                                                    <path
                                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                        fill="none"
                                                        stroke="#eee"
                                                        strokeWidth="3"
                                                    />
                                                    <path
                                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                        fill="none"
                                                        stroke={selectedProtocol.securityScore > 7 ? "#4ade80" : selectedProtocol.securityScore > 4 ? "#facc15" : "#ef4444"}
                                                        strokeWidth="3"
                                                        strokeDasharray={`${selectedProtocol.securityScore * 10}, 100`}
                                                    />
                                                    <text x="18" y="20.5" textAnchor="middle" fontSize="0.8em" fill="currentColor" className="font-bold">
                                                        {selectedProtocol.securityScore}/10
                                                    </text>
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">What this means</h4>
                                                <p className="text-sm text-gray-600">
                                                    {selectedProtocol.securityScore > 7
                                                        ? "This protocol has a high community trust score, indicating a strong track record for security and reliability."
                                                        : selectedProtocol.securityScore > 4
                                                            ? "This protocol has a moderate community trust score. Exercise typical caution when interacting with it."
                                                            : "This protocol has a lower community trust score. Consider using extra caution and limiting exposure."
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'docs' && (
                                <div className="space-y-6">
                                    <div className="p-5 border border-indigo-100 rounded-lg bg-gradient-to-r from-indigo-50/50 to-white">
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Documentation Resources</h3>
                                        <p className="text-gray-700 text-sm">
                                            Access comprehensive guides, API documentation, and technical information about {selectedProtocol.name}.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <a href="#" className="block p-5 border border-indigo-100 rounded-lg hover:border-indigo-200 transition-colors">
                                            <Users className="w-8 h-8 text-indigo-600 mb-3" />
                                            <h4 className="text-md font-medium text-gray-900 mb-1">User Guides</h4>
                                            <p className="text-sm text-gray-600">Step-by-step instructions for using the protocol</p>
                                        </a>

                                        <a href="#" className="block p-5 border border-indigo-100 rounded-lg hover:border-indigo-200 transition-colors">
                                            <Terminal className="w-8 h-8 text-indigo-600 mb-3" />
                                            <h4 className="text-md font-medium text-gray-900 mb-1">API Reference</h4>
                                            <p className="text-sm text-gray-600">Technical documentation for developers</p>
                                        </a>

                                        <a href="#" className="block p-5 border border-indigo-100 rounded-lg hover:border-indigo-200 transition-colors">
                                            <TrendingUp className="w-8 h-8 text-indigo-600 mb-3" />
                                            <h4 className="text-md font-medium text-gray-900 mb-1">Tokenomics</h4>
                                            <p className="text-sm text-gray-600">Learn about the protocol's economic model</p>
                                        </a>
                                    </div>

                                    <div className="p-5 border border-indigo-100 rounded-lg">
                                        <h3 className="text-md font-medium text-gray-900 mb-3">Frequently Asked Questions</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-900 mb-1 flex items-center">
                                                    <CheckCircle className="w-4 h-4 text-indigo-600 mr-2" />
                                                    How do I stake sBTC in this protocol?
                                                </h4>
                                                <p className="text-sm text-gray-600 ml-6">
                                                    Connect your wallet, navigate to the Pool section, select the sBTC pool, and follow the deposit instructions.
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-900 mb-1 flex items-center">
                                                    <CheckCircle className="w-4 h-4 text-indigo-600 mr-2" />
                                                    What are the risks associated with this protocol?
                                                </h4>
                                                <p className="text-sm text-gray-600 ml-6">
                                                    As with any DeFi protocol, risks include smart contract vulnerabilities, impermanent loss for LPs, and market volatility.
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-900 mb-1 flex items-center">
                                                    <CheckCircle className="w-4 h-4 text-indigo-600 mr-2" />
                                                    How often are rewards distributed?
                                                </h4>
                                                <p className="text-sm text-gray-600 ml-6">
                                                    Rewards are typically distributed in real-time and can be claimed at any time from the dashboard.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4 text-center">
                                            <a
                                                href="#"
                                                className="inline-block text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                                            >
                                                View all FAQs
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                </div>
            </div>
        </div>
    );
};

export default ProtocolDetails;