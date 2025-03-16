import React, { useState } from 'react';
import { TrendingUp, Clock, ArrowUpDown } from 'lucide-react';

// Define types for protocol data
interface Protocol {
    id: string;
    name: string;
    symbol: string;
    pool: string;
    apy: number;
    tvl: number;
    risk: number;
}

interface APYLeaderboardProps {
    protocols: Protocol[];
}

type SortField = 'apy' | 'tvl' | 'risk';
type SortOrder = 'asc' | 'desc';

const APYLeaderboard: React.FC<APYLeaderboardProps> = ({ protocols }) => {
    const [sortField, setSortField] = useState<SortField>('apy');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

    const handleSort = (field: SortField) => {
        if (field === sortField) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
    };

    const sortedProtocols = [...protocols].sort((a, b) => {
        if (sortOrder === 'asc') {
            return a[sortField] - b[sortField];
        } else {
            return b[sortField] - a[sortField];
        }
    });

    return (
        <div className="bg-white/90 backdrop-blur-sm border border-indigo-100 rounded-xl shadow-md shadow-indigo-100/20 p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
                    APY Leaderboard
                </h2>
                <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">Last updated:</span>
                    <span className="text-xs font-medium text-indigo-600 flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        2 min ago
                    </span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Protocol</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pool</th>
                            <th
                                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('apy')}
                            >
                                <div className="flex items-center">
                                    APY
                                    <ArrowUpDown className={`ml-1 w-3 h-3 ${sortField === 'apy' ? 'text-indigo-600' : 'text-gray-400'}`} />
                                </div>
                            </th>
                            <th
                                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('tvl')}
                            >
                                <div className="flex items-center">
                                    TVL
                                    <ArrowUpDown className={`ml-1 w-3 h-3 ${sortField === 'tvl' ? 'text-indigo-600' : 'text-gray-400'}`} />
                                </div>
                            </th>
                            <th
                                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('risk')}
                            >
                                <div className="flex items-center">
                                    Risk
                                    <ArrowUpDown className={`ml-1 w-3 h-3 ${sortField === 'risk' ? 'text-indigo-600' : 'text-gray-400'}`} />
                                </div>
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {sortedProtocols.map((protocol) => (
                            <tr key={protocol.id} className="hover:bg-indigo-50/30 transition-colors">
                                <td className="px-3 py-3 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                                            <span className="text-xs font-bold text-indigo-600">{protocol.symbol}</span>
                                        </div>
                                        <span className="font-medium text-gray-900">{protocol.name}</span>
                                    </div>
                                </td>
                                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700">{protocol.pool}</td>
                                <td className="px-3 py-3 whitespace-nowrap">
                                    <span className="font-medium text-green-600">{protocol.apy.toFixed(1)}%</span>
                                </td>
                                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700">${protocol.tvl.toLocaleString()}</td>
                                <td className="px-3 py-3 whitespace-nowrap">
                                    <div className="flex space-x-0.5">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className={`w-4 h-1.5 rounded-full ${i < protocol.risk ? 'bg-indigo-500' : 'bg-gray-200'}`}
                                            ></div>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-3 py-3 whitespace-nowrap text-sm">
                                    <button className="text-indigo-600 hover:text-indigo-900 font-medium">Deposit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 text-center">
                <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                    View all protocols
                </button>
            </div>
        </div>
    );
};

export default APYLeaderboard;