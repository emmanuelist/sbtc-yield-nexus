import React from 'react';
import { Bell, Settings, AlertTriangle, DollarSign, Info } from 'lucide-react';

// Define alert types
type AlertType = 'warning' | 'reward' | 'info';

// Define the Alert interface
interface Alert {
    id: string;
    type: AlertType;
    title: string;
    message: string;
    priority: number;
    timestamp: string;
    timeAgo: string;
    action?: string;
}

// Define props interface
interface AlertsPanelProps {
    alerts: Alert[];
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts }) => {
    // Sort alerts by priority (critical first) and then by time (newest first)
    const sortedAlerts = [...alerts].sort((a, b) => {
        if (a.priority !== b.priority) {
            return a.priority - b.priority; // Lower number = higher priority
        }
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    const getAlertIcon = (type: AlertType) => {
        switch (type) {
            case 'warning':
                return <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />;
            case 'reward':
                return <DollarSign className="w-4 h-4 text-green-500 mt-0.5" />;
            case 'info':
            default:
                return <Info className="w-4 h-4 text-indigo-500 mt-0.5" />;
        }
    };

    const getAlertStyle = (type: AlertType): string => {
        switch (type) {
            case 'warning':
                return 'border-amber-100 bg-amber-50';
            case 'reward':
                return 'border-green-100 bg-green-50';
            case 'info':
            default:
                return 'border-indigo-100 bg-indigo-50';
        }
    };

    return (
        <div className="bg-white/90 backdrop-blur-sm border border-indigo-100 rounded-xl shadow-md shadow-indigo-100/20 p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Bell className="w-5 h-5 mr-2 text-indigo-600" />
                    Recent Alerts
                </h2>
                <span className="text-xs text-indigo-600 flex items-center cursor-pointer">
                    Settings <Settings className="w-3.5 h-3.5 ml-1" />
                </span>
            </div>

            <div className="space-y-3">
                {sortedAlerts.map((alert) => (
                    <div key={alert.id} className={`p-3 border rounded-lg ${getAlertStyle(alert.type)}`}>
                        <div className="flex items-start">
                            {getAlertIcon(alert.type)}
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                                <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
                                <div className="mt-2 flex justify-between">
                                    <span className="text-xs text-gray-500">{alert.timeAgo}</span>
                                    {alert.action && (
                                        <button className="text-xs text-indigo-600 font-medium">
                                            {alert.action}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {alerts.length === 0 && (
                <div className="p-4 text-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-sm">No alerts at this time</p>
                </div>
            )}

            {alerts.length > 0 && (
                <div className="mt-4 text-center">
                    <button className="text-indigo-600 hover:text-indigo-700 text-xs font-medium">
                        View all alerts
                    </button>
                </div>
            )}
        </div>
    );
};

export default AlertsPanel;