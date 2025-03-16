import React, { useState } from 'react';
import { FileText, Download, Filter, Calendar, ArrowUpRight, DollarSign, PieChart, BarChart3, Zap, Clock, ChevronRight, Share2, Eye, Plus } from 'lucide-react';
import { Info, CheckCircle, XCircle } from 'lucide-react';

// Define interfaces for the component props
export interface TaxReport {
    id: string;
    year: number;
    quarter?: number;
    month?: number;
    type: 'yearly' | 'quarterly' | 'monthly';
    status: 'ready' | 'generating' | 'incomplete';
    dateGenerated?: string;
    downloadUrl?: string;
    transactionCount: number;
    totalYield: number;
    currency: string;
}

export interface YieldTransaction {
    id: string;
    date: string;
    protocol: string;
    type: 'deposit' | 'withdraw' | 'harvest' | 'claim' | 'rebalance';
    amount: number;
    currency: string;
    usdValue: number;
    taxableEvent: boolean;
    costBasis?: number;
    gain?: number;
}

export interface TaxSummary {
    totalYield: number;
    totalTaxable: number;
    totalNonTaxable: number;
    totalCapitalGains: number;
    totalCostBasis: number;
    totalHarvestAmount: number;
    protocols: {
        name: string;
        yield: number;
        percentage: number;
    }[];
}

interface TaxReportingProps {
    reports: TaxReport[];
    recentTransactions: YieldTransaction[];
    taxSummary: TaxSummary;
}

const TaxReporting: React.FC<TaxReportingProps> = ({ reports, recentTransactions, taxSummary }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'reports'>('overview');
    const [yearFilter, setYearFilter] = useState<number>(new Date().getFullYear());

    // Get most recent report
    const latestReport = reports.length > 0
        ? reports.sort((a, b) => {
            if (a.year !== b.year) return b.year - a.year;
            if (a.type === 'yearly') return -1;
            if (b.type === 'yearly') return 1;
            if (a.quarter && b.quarter) return b.quarter - a.quarter;
            if (a.month && b.month) return b.month - a.month;
            return 0;
        })[0]
        : null;

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (value: number, currency: string = 'USD') => {
        if (currency === 'sBTC') {
            return `${value.toFixed(6)} sBTC`;
        }
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency
        }).format(value);
    };

    const getReportPeriodLabel = (report: TaxReport) => {
        if (report.type === 'yearly') return `Year ${report.year}`;
        if (report.type === 'quarterly') {
            return `Q${report.quarter} ${report.year}`;
        }
        if (report.type === 'monthly') {
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];
            return `${monthNames[report.month! - 1]} ${report.year}`;
        }
        return 'Unknown period';
    };

    const getStatusBadge = (status: TaxReport['status']) => {
        switch (status) {
            case 'ready':
                return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Ready</span>;
            case 'generating':
                return <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">Generating</span>;
            case 'incomplete':
                return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Incomplete</span>;
            default:
                return null;
        }
    };

    return (
        <div className="bg-white/90 backdrop-blur-sm border border-indigo-100 rounded-xl shadow-md shadow-indigo-100/20 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                        Tax Reporting
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">Manage your yield tax reports and transaction history</p>
                </div>

                <div className="flex items-center space-x-2 mt-4 md:mt-0">
                    <button className="px-3 py-1.5 border border-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 flex items-center">
                        <Eye className="w-3.5 h-3.5 mr-1.5" /> Preview
                    </button>
                    <button className="px-3 py-1.5 border border-indigo-200 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-50 flex items-center">
                        <Share2 className="w-3.5 h-3.5 mr-1.5" /> Share with Accountant
                    </button>
                    <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 flex items-center">
                        <Download className="w-3.5 h-3.5 mr-1.5" /> Export All
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-8" aria-label="Tax Reporting Tabs">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`py-3 border-b-2 font-medium text-sm transition-colors ${activeTab === 'overview'
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <PieChart className="w-4 h-4 inline-block mr-2" />
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('transactions')}
                        className={`py-3 border-b-2 font-medium text-sm transition-colors ${activeTab === 'transactions'
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <ArrowUpRight className="w-4 h-4 inline-block mr-2" />
                        Transactions
                    </button>
                    <button
                        onClick={() => setActiveTab('reports')}
                        className={`py-3 border-b-2 font-medium text-sm transition-colors ${activeTab === 'reports'
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <FileText className="w-4 h-4 inline-block mr-2" />
                        Reports
                    </button>
                </nav>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    {/* Tax Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-4 p-5 border border-indigo-100 rounded-lg bg-gradient-to-r from-indigo-50/50 to-white">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Yield (YTD)</p>
                                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(taxSummary.totalYield)}</h3>
                                </div>
                                <div className="p-2 bg-indigo-100 rounded-full">
                                    <Zap className="w-6 h-6 text-indigo-600" />
                                </div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-indigo-100/50">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">Taxable Yield:</span>
                                    <span className="font-medium text-gray-900">{formatCurrency(taxSummary.totalTaxable)}</span>
                                </div>
                                <div className="flex justify-between text-xs mt-1">
                                    <span className="text-gray-500">Non-Taxable:</span>
                                    <span className="font-medium text-gray-900">{formatCurrency(taxSummary.totalNonTaxable)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-4 p-5 border border-indigo-100 rounded-lg bg-gradient-to-r from-indigo-50/50 to-white">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Capital Gains</p>
                                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(taxSummary.totalCapitalGains)}</h3>
                                </div>
                                <div className="p-2 bg-green-100 rounded-full">
                                    <BarChart3 className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-indigo-100/50">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">Total Cost Basis:</span>
                                    <span className="font-medium text-gray-900">{formatCurrency(taxSummary.totalCostBasis)}</span>
                                </div>
                                <div className="flex justify-between text-xs mt-1">
                                    <span className="text-gray-500">Transactions:</span>
                                    <span className="font-medium text-gray-900">{recentTransactions.length}</span>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-4 p-5 border border-indigo-100 rounded-lg bg-gradient-to-r from-indigo-50/50 to-white">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Latest Report</p>
                                    <h3 className="text-lg font-bold text-gray-900 mt-1">
                                        {latestReport ? getReportPeriodLabel(latestReport) : 'No reports'}
                                    </h3>
                                </div>
                                <div className="p-2 bg-amber-100 rounded-full">
                                    <FileText className="w-6 h-6 text-amber-600" />
                                </div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-indigo-100/50">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">Status:</span>
                                    <span>
                                        {latestReport ? getStatusBadge(latestReport.status) : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-xs mt-1">
                                    <span className="text-gray-500">Generated:</span>
                                    <span className="font-medium text-gray-900">
                                        {latestReport ? formatDate(latestReport.dateGenerated) : 'N/A'}
                                    </span>
                                </div>
                            </div>
                            {latestReport && latestReport.status === 'ready' && (
                                <button className="w-full mt-3 text-xs px-3 py-1.5 border border-indigo-200 text-indigo-700 rounded-lg hover:bg-indigo-50 flex items-center justify-center">
                                    <Download className="w-3.5 h-3.5 mr-1.5" /> Download Report
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Protocol Yield Distribution */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        <div className="md:col-span-7 p-5 border border-indigo-100 rounded-lg">
                            <h3 className="text-md font-medium text-gray-900 mb-4">Yield By Protocol</h3>

                            <div className="space-y-4">
                                {taxSummary.protocols.map((protocol, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm font-medium text-gray-700">{protocol.name}</span>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm font-medium text-gray-900">{formatCurrency(protocol.yield)}</span>
                                                <span className="text-xs text-gray-500">{protocol.percentage}%</span>
                                            </div>
                                        </div>
                                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-indigo-500 rounded-full"
                                                style={{ width: `${protocol.percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 flex justify-between items-center pt-4 border-t border-gray-100">
                                <div className="text-sm text-gray-700">
                                    <span className="font-medium">Total Transactions:</span> {recentTransactions.length}
                                </div>
                                <button className="text-xs text-indigo-600 flex items-center">
                                    View Details <ChevronRight className="w-3 h-3 ml-1" />
                                </button>
                            </div>
                        </div>

                        <div className="md:col-span-5 p-5 border border-indigo-100 rounded-lg">
                            <h3 className="text-md font-medium text-gray-900 mb-4">Tax Calendar</h3>

                            <div className="space-y-3">
                                <div className="flex items-start">
                                    <div className="p-2 rounded-lg bg-indigo-100 mr-3">
                                        <Calendar className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">Q1 Tax Reporting</h4>
                                        <p className="text-xs text-gray-500 mt-0.5">April 15, 2025</p>
                                        <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: '65%' }}></div>
                                        </div>
                                        <p className="text-xs text-gray-600 mt-1">65% of transactions recorded</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="p-2 rounded-lg bg-amber-100 mr-3">
                                        <Calendar className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">Q2 Tax Reporting</h4>
                                        <p className="text-xs text-gray-500 mt-0.5">July 15, 2025</p>
                                        <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                                            <div className="h-full bg-amber-500 rounded-full" style={{ width: '30%' }}></div>
                                        </div>
                                        <p className="text-xs text-gray-600 mt-1">30% of transactions recorded</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="p-2 rounded-lg bg-gray-100 mr-3">
                                        <Calendar className="w-5 h-5 text-gray-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">Q3 Tax Reporting</h4>
                                        <p className="text-xs text-gray-500 mt-0.5">October 15, 2025</p>
                                        <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2"></div>
                                        <p className="text-xs text-gray-600 mt-1">Not started yet</p>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full mt-5 text-xs px-3 py-2 border border-indigo-200 text-indigo-700 rounded-lg hover:bg-indigo-50 flex items-center justify-center">
                                <Calendar className="w-3.5 h-3.5 mr-1.5" /> View Full Tax Calendar
                            </button>
                        </div>
                    </div>

                    {/* Tax Tips Section */}
                    <div className="p-5 border border-indigo-100 rounded-lg bg-gradient-to-r from-indigo-50/50 to-white">
                        <h3 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                            <Info className="w-5 h-5 mr-2 text-indigo-600" />
                            Tax Optimization Tips
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-white rounded-lg border border-indigo-100">
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Harvest Tax Losses</h4>
                                <p className="text-xs text-gray-600">
                                    Consider harvesting losses on underperforming positions to offset capital gains elsewhere in your portfolio.
                                </p>
                            </div>

                            <div className="p-4 bg-white rounded-lg border border-indigo-100">
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Long-Term Capital Gains</h4>
                                <p className="text-xs text-gray-600">
                                    Hold assets for more than a year when possible to qualify for lower long-term capital gains tax rates.
                                </p>
                            </div>

                            <div className="p-4 bg-white rounded-lg border border-indigo-100">
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Keep Detailed Records</h4>
                                <p className="text-xs text-gray-600">
                                    Maintain comprehensive documentation of all transactions, including timestamps and cost basis information.
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 text-xs text-gray-500 italic">
                            Note: Tax laws vary by jurisdiction. Please consult with a tax professional for advice specific to your situation.
                        </div>
                    </div>
                </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
                <div className="space-y-6">
                    {/* Filters and Search */}
                    <div className="flex flex-col md:flex-row justify-between space-y-3 md:space-y-0 mb-4">
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <select
                                    className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    value={yearFilter}
                                    onChange={(e) => setYearFilter(parseInt(e.target.value))}
                                >
                                    <option value={2025}>2025</option>
                                    <option value={2024}>2024</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <ChevronRight className="h-4 w-4 text-gray-400 transform rotate-90" />
                                </div>
                            </div>

                            <div className="relative">
                                <select
                                    className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                >
                                    <option value="all">All Protocols</option>
                                    {[...new Set(recentTransactions.map(tx => tx.protocol))].map((protocol, idx) => (
                                        <option key={idx} value={protocol}>{protocol}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <ChevronRight className="h-4 w-4 text-gray-400 transform rotate-90" />
                                </div>
                            </div>

                            <div className="relative">
                                <select
                                    className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                >
                                    <option value="all">All Transaction Types</option>
                                    <option value="deposit">Deposits</option>
                                    <option value="withdraw">Withdrawals</option>
                                    <option value="harvest">Harvests</option>
                                    <option value="claim">Claims</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <ChevronRight className="h-4 w-4 text-gray-400 transform rotate-90" />
                                </div>
                            </div>

                            <button className="flex items-center px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm hover:bg-indigo-100">
                                <Filter className="w-4 h-4 mr-1.5" />
                                More Filters
                            </button>
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search transactions..."
                                className="pl-9 pr-3 py-2 w-full md:w-64 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Transactions Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Protocol</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">USD Value</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taxable</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gain/Loss</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {recentTransactions.map((transaction) => (
                                    <tr key={transaction.id} className="hover:bg-indigo-50/30 transition-colors">
                                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700">
                                            {formatDate(transaction.date)}
                                        </td>
                                        <td className="px-3 py-3 whitespace-nowrap">
                                            <span className="font-medium text-gray-900">{transaction.protocol}</span>
                                        </td>
                                        <td className="px-3 py-3 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs rounded-full ${transaction.type === 'deposit' ? 'bg-blue-100 text-blue-800' :
                                                transaction.type === 'withdraw' ? 'bg-red-100 text-red-800' :
                                                    transaction.type === 'harvest' ? 'bg-green-100 text-green-800' :
                                                        transaction.type === 'claim' ? 'bg-purple-100 text-purple-800' :
                                                            'bg-gray-100 text-gray-800'
                                                }`}>
                                                {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-3 py-3 whitespace-nowrap font-medium text-gray-900">
                                            {formatCurrency(transaction.amount, transaction.currency)}
                                        </td>
                                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700">
                                            {formatCurrency(transaction.usdValue)}
                                        </td>
                                        <td className="px-3 py-3 whitespace-nowrap">
                                            {transaction.taxableEvent ? (
                                                <div className="flex items-center text-green-600">
                                                    <CheckCircle className="w-4 h-4 mr-1" />
                                                    <span className="text-xs">Yes</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center text-gray-400">
                                                    <XCircle className="w-4 h-4 mr-1" />
                                                    <span className="text-xs">No</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-3 py-3 whitespace-nowrap">
                                            {transaction.gain !== undefined ? (
                                                <span className={`font-medium ${transaction.gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {transaction.gain >= 0 ? '+' : ''}{formatCurrency(transaction.gain)}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">N/A</span>
                                            )}
                                        </td>
                                        <td className="px-3 py-3 whitespace-nowrap text-right text-sm text-indigo-600">
                                            <button className="hover:text-indigo-900">View Details</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-4">
                        <div className="flex items-center">
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                                <span className="font-medium">{recentTransactions.length}</span> transactions
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-500">
                                Previous
                            </button>
                            <button className="px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-lg text-sm text-indigo-600 font-medium">
                                1
                            </button>
                            <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-500">
                                2
                            </button>
                            <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-500">
                                2
                            </button>
                            <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-500">
                                3
                            </button>
                            <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-500">
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
                <div className="space-y-6">
                    {/* Reports Actions */}
                    <div className="flex flex-col md:flex-row justify-between space-y-3 md:space-y-0 mb-4">
                        <div className="relative">
                            <select
                                className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                value={yearFilter}
                                onChange={(e) => setYearFilter(parseInt(e.target.value))}
                            >
                                <option value={2025}>2025</option>
                                <option value={2024}>2024</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                <ChevronRight className="h-4 w-4 text-gray-400 transform rotate-90" />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <button className="px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 flex items-center">
                                <Calendar className="w-4 h-4 mr-1.5" />
                                Generate Custom Report
                            </button>
                            <button className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center">
                                <Download className="w-4 h-4 mr-1.5" />
                                Download All Reports
                            </button>
                        </div>
                    </div>

                    {/* Available Reports */}
                    <div className="space-y-4">
                        <h3 className="text-md font-medium text-gray-900 mb-2">Available Reports</h3>

                        {reports.length === 0 ? (
                            <div className="p-8 text-center bg-indigo-50 rounded-lg border border-dashed border-indigo-200">
                                <FileText className="w-12 h-12 text-indigo-300 mx-auto mb-3" />
                                <p className="text-gray-600">No tax reports available yet</p>
                                <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
                                    Generate Your First Report
                                </button>
                            </div>
                        ) : (
                            <div className="border border-indigo-100 rounded-lg overflow-hidden">
                                {reports
                                    .filter(report => report.year === yearFilter)
                                    .sort((a, b) => {
                                        if (a.type === 'yearly' && b.type !== 'yearly') return -1;
                                        if (a.type !== 'yearly' && b.type === 'yearly') return 1;
                                        if (a.type === 'quarterly' && b.type === 'monthly') return -1;
                                        if (a.type === 'monthly' && b.type === 'quarterly') return 1;
                                        if (a.quarter && b.quarter) return b.quarter - a.quarter;
                                        if (a.month && b.month) return b.month - a.month;
                                        return 0;
                                    })
                                    .map((report, index) => (
                                        <div
                                            key={report.id}
                                            className={`p-4 flex flex-col md:flex-row justify-between items-start md:items-center ${index !== reports.length - 1 ? 'border-b border-indigo-100' : ''
                                                } hover:bg-indigo-50/30 transition-colors`}
                                        >
                                            <div className="flex items-start">
                                                <div className="p-2 rounded-lg bg-indigo-100 mr-3">
                                                    <FileText className="w-5 h-5 text-indigo-600" />
                                                </div>
                                                <div>
                                                    <h4 className="text-base font-medium text-gray-900">{getReportPeriodLabel(report)}</h4>
                                                    <div className="flex items-center mt-1">
                                                        <span className="text-xs text-gray-500 mr-2">
                                                            {report.transactionCount} transactions
                                                        </span>
                                                        {getStatusBadge(report.status)}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-3 md:mt-0 flex items-center space-x-2 ml-0 md:ml-auto">
                                                <div className="text-right mr-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {formatCurrency(report.totalYield, report.currency)}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        Generated: {formatDate(report.dateGenerated) || 'Not yet'}
                                                    </div>
                                                </div>

                                                {report.status === 'ready' ? (
                                                    <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 flex items-center">
                                                        <Download className="w-3.5 h-3.5 mr-1.5" />
                                                        Download
                                                    </button>
                                                ) : report.status === 'generating' ? (
                                                    <button className="px-3 py-1.5 bg-gray-200 text-gray-600 rounded-lg text-xs font-medium flex items-center cursor-not-allowed">
                                                        <Clock className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                                                        Generating...
                                                    </button>
                                                ) : (
                                                    <button className="px-3 py-1.5 border border-indigo-200 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-50 flex items-center">
                                                        <Zap className="w-3.5 h-3.5 mr-1.5" />
                                                        Generate
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>

                    {/* Export Options */}
                    <div className="p-5 border border-indigo-100 rounded-lg bg-gradient-to-r from-indigo-50/50 to-white mt-6">
                        <h3 className="text-md font-medium text-gray-900 mb-4">Export Options</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-white rounded-lg border border-indigo-100 hover:border-indigo-300 cursor-pointer transition-colors">
                                <div className="flex items-center mb-2">
                                    <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                                        <FileText className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <h4 className="text-sm font-medium text-gray-900">CSV Format</h4>
                                </div>
                                <p className="text-xs text-gray-600">
                                    Export all transaction data in CSV format for easy import into spreadsheet applications.
                                </p>
                            </div>

                            <div className="p-4 bg-white rounded-lg border border-indigo-100 hover:border-indigo-300 cursor-pointer transition-colors">
                                <div className="flex items-center mb-2">
                                    <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                                        <DollarSign className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <h4 className="text-sm font-medium text-gray-900">TurboTax Format</h4>
                                </div>
                                <p className="text-xs text-gray-600">
                                    Export in a format compatible with TurboTax for seamless tax filing.
                                </p>
                            </div>

                            <div className="p-4 bg-white rounded-lg border border-indigo-100 hover:border-indigo-300 cursor-pointer transition-colors">
                                <div className="flex items-center mb-2">
                                    <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                                        <Share2 className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <h4 className="text-sm font-medium text-gray-900">Accountant Access</h4>
                                </div>
                                <p className="text-xs text-gray-600">
                                    Share a secure link with your accountant to provide temporary access to your reports.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Tax Integration Services */}
                    <div className="p-5 border border-indigo-100 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-md font-medium text-gray-900">Tax Service Integrations</h3>
                            <button className="text-xs text-indigo-600 flex items-center">
                                Manage Integrations <ChevronRight className="w-3.5 h-3.5 ml-1" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                                <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                                    <span className="font-bold text-gray-600">T</span>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900">TurboTax</h4>
                                    <p className="text-xs text-gray-500">Connected</p>
                                </div>
                            </div>

                            <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                                <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                                    <span className="font-bold text-gray-600">K</span>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900">Koinly</h4>
                                    <p className="text-xs text-green-600">Connected</p>
                                </div>
                            </div>

                            <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                                <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                                    <span className="font-bold text-gray-600">T</span>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900">TokenTax</h4>
                                    <p className="text-xs text-gray-500">Not Connected</p>
                                </div>
                            </div>

                            <div className="flex items-center p-3 border border-dashed border-indigo-200 rounded-lg bg-indigo-50/30">
                                <div className="w-10 h-10 bg-indigo-100 rounded-md flex items-center justify-center mr-3">
                                    <Plus className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-indigo-600">Add New</h4>
                                    <p className="text-xs text-gray-500">Integration</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export default TaxReporting;