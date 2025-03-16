import React from 'react';
import { Activity, ArrowUpRight, DollarSign, RefreshCw } from 'lucide-react';

// Define transaction types
type TransactionType = 'deposit' | 'harvest' | 'rebalance' | 'other';

// Define the Transaction interface
interface Transaction {
    id: string;
    type: TransactionType;
    action: string;
    protocol: string;
    amount: string;
    timeAgo: string;
    isPositive: boolean;
}

// Define props interface
interface RecentTransactionsProps {
    transactions: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
    const getTransactionIcon = (type: TransactionType) => {
        switch (type) {
            case 'deposit':
                return (
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <ArrowUpRight className="w-4 h-4 text-green-600" />
                    </div>
                );
            case 'harvest':
                return (
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-green-600" />
                    </div>
                );
            case 'rebalance':
                return (
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <RefreshCw className="w-4 h-4 text-indigo-600" />
                    </div>
                );
            default:
                return (
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <Activity className="w-4 h-4 text-gray-600" />
                    </div>
                );
        }
    };

    return (
        <div className="bg-white/90 backdrop-blur-sm border border-indigo-100 rounded-xl shadow-md shadow-indigo-100/20 p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-indigo-600" />
                    Recent Transactions
                </h2>
            </div>

            <div className="space-y-3">
                {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center py-2 border-b border-gray-100">
                        {getTransactionIcon(tx.type)}
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{tx.action}</p>
                            <p className="text-xs text-gray-500">{tx.protocol}</p>
                        </div>
                        <div className="ml-auto text-right">
                            <p className={`text-sm font-medium ${tx.isPositive ? 'text-green-600' : 'text-gray-900'}`}>
                                {tx.amount}
                            </p>
                            <p className="text-xs text-gray-500">{tx.timeAgo}</p>
                        </div>
                    </div>
                ))}
            </div>

            {transactions.length === 0 && (
                <div className="p-4 text-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-sm">No recent transactions</p>
                </div>
            )}

            {transactions.length > 0 && (
                <div className="mt-4 text-center">
                    <button className="text-indigo-600 hover:text-indigo-700 text-xs font-medium">
                        View transaction history
                    </button>
                </div>
            )}
        </div>
    );
};

export default RecentTransactions;