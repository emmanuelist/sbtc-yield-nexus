import React, { useState } from 'react';
import {
    Settings,
    User,
    Bell,
    Shield,
    ExternalLink,
    Key,
    Globe,
    Moon,
    Sun,
    Save,
    ChevronRight,
    AlertTriangle,
    Info,
    Check
} from 'lucide-react';

// Define types for settings
interface WalletInfo {
    address: string;
    balance: number;
    network: string;
    connectionMethod: string;
}

interface NotificationSettings {
    email: boolean;
    browser: boolean;
    yieldAlerts: boolean;
    securityAlerts: boolean;
    priceAlerts: boolean;
    rebalanceNotifications: boolean;
    weeklyReports: boolean;
}

interface SecuritySettings {
    twoFactorEnabled: boolean;
    loginNotifications: boolean;
    approvalConfirmations: boolean;
    withdrawalAddressWhitelist: boolean;
    lastPasswordChange: string;
}

interface DisplaySettings {
    theme: 'light' | 'dark' | 'system';
    currency: 'USD' | 'EUR' | 'GBP' | 'JPY';
    timeFormat: '12h' | '24h';
    dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
}

interface IntegrationConnection {
    id: string;
    name: string;
    type: 'exchange' | 'wallet' | 'tax' | 'portfolio';
    connected: boolean;
    lastSync?: string;
}

interface DashboardSettings {
    wallet: WalletInfo;
    notifications: NotificationSettings;
    security: SecuritySettings;
    display: DisplaySettings;
    integrations: IntegrationConnection[];
}

interface SettingsTabProps {
    settings: DashboardSettings;
    onSaveSettings: (settings: DashboardSettings) => void;
    onDisconnectWallet: () => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({
    settings,
    onSaveSettings,
    onDisconnectWallet
}) => {
    const [activeSection, setActiveSection] = useState<'account' | 'notifications' | 'security' | 'display' | 'integrations'>('account');
    const [localSettings, setLocalSettings] = useState<DashboardSettings>(settings);
    const [showSaveSuccess, setShowSaveSuccess] = useState<boolean>(false);

    const handleSaveSettings = () => {
        onSaveSettings(localSettings);
        setShowSaveSuccess(true);
        setTimeout(() => setShowSaveSuccess(false), 3000);
    };

    const updateNotificationSetting = (key: keyof NotificationSettings, value: boolean) => {
        setLocalSettings({
            ...localSettings,
            notifications: {
                ...localSettings.notifications,
                [key]: value
            }
        });
    };

    const updateSecuritySetting = (key: keyof SecuritySettings, value: boolean) => {
        setLocalSettings({
            ...localSettings,
            security: {
                ...localSettings.security,
                [key]: value
            }
        });
    };

    const updateDisplaySetting = <K extends keyof DisplaySettings>(key: K, value: DisplaySettings[K]) => {
        setLocalSettings({
            ...localSettings,
            display: {
                ...localSettings.display,
                [key]: value
            }
        });
    };

    const toggleIntegrationConnection = (id: string) => {
        setLocalSettings({
            ...localSettings,
            integrations: localSettings.integrations.map(integration =>
                integration.id === id
                    ? { ...integration, connected: !integration.connected }
                    : integration
            )
        });
    };

    const formatWalletAddress = (address: string) => {
        if (!address || address.length < 10) return address;
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    return (
        <div className="bg-white/90 backdrop-blur-sm border border-indigo-100 rounded-xl shadow-md shadow-indigo-100/20 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
                {/* Settings Navigation Sidebar */}
                <div className="lg:col-span-3 border-r border-indigo-100 p-4">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center mb-6">
                        <Settings className="w-5 h-5 mr-2 text-indigo-600" />
                        Settings
                    </h2>

                    <nav className="space-y-1">
                        <button
                            onClick={() => setActiveSection('account')}
                            className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${activeSection === 'account'
                                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <User className="w-5 h-5 mr-3" />
                            Account & Wallet
                        </button>

                        <button
                            onClick={() => setActiveSection('notifications')}
                            className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${activeSection === 'notifications'
                                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <Bell className="w-5 h-5 mr-3" />
                            Notifications
                        </button>

                        <button
                            onClick={() => setActiveSection('security')}
                            className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${activeSection === 'security'
                                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <Shield className="w-5 h-5 mr-3" />
                            Security
                        </button>

                        <button
                            onClick={() => setActiveSection('display')}
                            className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${activeSection === 'display'
                                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <Globe className="w-5 h-5 mr-3" />
                            Display & Localization
                        </button>

                        <button
                            onClick={() => setActiveSection('integrations')}
                            className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${activeSection === 'integrations'
                                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <ExternalLink className="w-5 h-5 mr-3" />
                            Integrations
                        </button>
                    </nav>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="px-3 py-2">
                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                                Support
                            </div>
                            <div className="space-y-2">
                                <a href="#" className="block text-sm text-indigo-600 hover:text-indigo-800">
                                    Documentation
                                </a>
                                <a href="#" className="block text-sm text-indigo-600 hover:text-indigo-800">
                                    Contact Support
                                </a>
                                <a href="#" className="block text-sm text-indigo-600 hover:text-indigo-800">
                                    Feedback
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Settings Content */}
                <div className="lg:col-span-9 p-6">
                    {/* Success Message */}
                    {showSaveSuccess && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-100 rounded-lg flex items-center">
                            <Check className="w-5 h-5 text-green-500 mr-2" />
                            <span className="text-sm text-green-700">Settings saved successfully</span>
                        </div>
                    )}

                    {/* Account & Wallet Settings */}
                    {activeSection === 'account' && (
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-6">Account & Wallet Settings</h3>

                            <div className="mb-8 p-5 border border-indigo-100 rounded-lg bg-gradient-to-r from-indigo-50/50 to-white">
                                <h4 className="text-base font-medium text-gray-900 mb-4">Connected Wallet</h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Wallet Address</p>
                                        <div className="flex items-center">
                                            <p className="text-sm font-medium text-gray-900">{formatWalletAddress(localSettings.wallet.address)}</p>
                                            <button className="ml-2 text-xs text-indigo-600 hover:text-indigo-800">
                                                Copy
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Balance</p>
                                        <p className="text-sm font-medium text-gray-900">{localSettings.wallet.balance.toFixed(6)} sBTC</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Network</p>
                                        <p className="text-sm font-medium text-gray-900">{localSettings.wallet.network}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Connection Method</p>
                                        <p className="text-sm font-medium text-gray-900">{localSettings.wallet.connectionMethod}</p>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-indigo-100/50 flex">
                                    <button
                                        className="text-sm px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
                                        onClick={onDisconnectWallet}
                                    >
                                        Disconnect Wallet
                                    </button>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h4 className="text-base font-medium text-gray-900 mb-4">Default Investment Preferences</h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="default-strategy" className="block text-sm font-medium text-gray-700 mb-1">
                                            Default Strategy
                                        </label>
                                        <select
                                            id="default-strategy"
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            <option>Balanced Growth</option>
                                            <option>Conservative</option>
                                            <option>Aggressive Growth</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="default-investment" className="block text-sm font-medium text-gray-700 mb-1">
                                            Default Investment Amount
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                id="default-investment"
                                                className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="0.1"
                                            />
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <span className="text-gray-500 sm:text-sm">sBTC</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h4 className="text-base font-medium text-gray-900 mb-4">Profile Information</h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="email@example.com"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            id="username"
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="username"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notification Settings */}
                    {activeSection === 'notifications' && (
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-6">Notification Settings</h3>

                            <div className="mb-6">
                                <h4 className="text-base font-medium text-gray-900 mb-3">Notification Methods</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <input
                                                id="notifications-email"
                                                type="checkbox"
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                checked={localSettings.notifications.email}
                                                onChange={e => updateNotificationSetting('email', e.target.checked)}
                                            />
                                            <label htmlFor="notifications-email" className="ml-2 block text-sm text-gray-900">
                                                Email Notifications
                                            </label>
                                        </div>
                                        <input
                                            type="email"
                                            className="block w-64 px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-xs focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="email@example.com"
                                        />
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            id="notifications-browser"
                                            type="checkbox"
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                            checked={localSettings.notifications.browser}
                                            onChange={e => updateNotificationSetting('browser', e.target.checked)}
                                        />
                                        <label htmlFor="notifications-browser" className="ml-2 block text-sm text-gray-900">
                                            Browser Notifications
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h4 className="text-base font-medium text-gray-900 mb-3">Notification Types</h4>
                                <div className="space-y-4 bg-indigo-50/50 p-4 rounded-lg border border-indigo-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label htmlFor="yield-alerts" className="block text-sm font-medium text-gray-900">
                                                Yield Alerts
                                            </label>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                Get notified when APY changes significantly or better opportunities arise
                                            </p>
                                        </div>
                                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                            <input
                                                id="yield-alerts"
                                                type="checkbox"
                                                className="sr-only"
                                                checked={localSettings.notifications.yieldAlerts}
                                                onChange={e => updateNotificationSetting('yieldAlerts', e.target.checked)}
                                            />
                                            <div className={`block w-10 h-6 rounded-full ${localSettings.notifications.yieldAlerts ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                                            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${localSettings.notifications.yieldAlerts ? 'transform translate-x-4' : ''}`}></div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label htmlFor="security-alerts" className="block text-sm font-medium text-gray-900">
                                                Security Alerts
                                            </label>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                Important security notifications about your account and protocols
                                            </p>
                                        </div>
                                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                            <input
                                                id="security-alerts"
                                                type="checkbox"
                                                className="sr-only"
                                                checked={localSettings.notifications.securityAlerts}
                                                onChange={e => updateNotificationSetting('securityAlerts', e.target.checked)}
                                            />
                                            <div className={`block w-10 h-6 rounded-full ${localSettings.notifications.securityAlerts ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                                            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${localSettings.notifications.securityAlerts ? 'transform translate-x-4' : ''}`}></div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label htmlFor="price-alerts" className="block text-sm font-medium text-gray-900">
                                                Price Alerts
                                            </label>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                Notifications about significant sBTC price movements
                                            </p>
                                        </div>
                                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                            <input
                                                id="price-alerts"
                                                type="checkbox"
                                                className="sr-only"
                                                checked={localSettings.notifications.priceAlerts}
                                                onChange={e => updateNotificationSetting('priceAlerts', e.target.checked)}
                                            />
                                            <div className={`block w-10 h-6 rounded-full ${localSettings.notifications.priceAlerts ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                                            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${localSettings.notifications.priceAlerts ? 'transform translate-x-4' : ''}`}></div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label htmlFor="rebalance-notifications" className="block text-sm font-medium text-gray-900">
                                                Rebalance Notifications
                                            </label>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                Get notified when your strategies are rebalanced
                                            </p>
                                        </div>
                                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                            <input
                                                id="rebalance-notifications"
                                                type="checkbox"
                                                className="sr-only"
                                                checked={localSettings.notifications.rebalanceNotifications}
                                                onChange={e => updateNotificationSetting('rebalanceNotifications', e.target.checked)}
                                            />
                                            <div className={`block w-10 h-6 rounded-full ${localSettings.notifications.rebalanceNotifications ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                                            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${localSettings.notifications.rebalanceNotifications ? 'transform translate-x-4' : ''}`}></div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label htmlFor="weekly-reports" className="block text-sm font-medium text-gray-900">
                                                Weekly Performance Reports
                                            </label>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                Receive weekly summaries of your portfolio performance
                                            </p>
                                        </div>
                                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                            <input
                                                id="weekly-reports"
                                                type="checkbox"
                                                className="sr-only"
                                                checked={localSettings.notifications.weeklyReports}
                                                onChange={e => updateNotificationSetting('weeklyReports', e.target.checked)}
                                            />
                                            <div className={`block w-10 h-6 rounded-full ${localSettings.notifications.weeklyReports ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                                            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${localSettings.notifications.weeklyReports ? 'transform translate-x-4' : ''}`}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security Settings */}
                    {activeSection === 'security' && (
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-6">Security Settings</h3>

                            <div className="mb-8">
                                <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 mb-6">
                                    <div className="flex items-start">
                                        <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 mr-2" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Important</p>
                                            <p className="text-xs text-gray-700 mt-1">
                                                Your security settings help protect your assets and account. We recommend enabling all security features.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label htmlFor="two-factor-auth" className="block text-sm font-medium text-gray-900">
                                                Two-Factor Authentication
                                            </label>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                Add an extra layer of security to your account with 2FA
                                            </p>
                                        </div>
                                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                            <input
                                                id="two-factor-auth"
                                                type="checkbox"
                                                className="sr-only"
                                                checked={localSettings.security.twoFactorEnabled}
                                                onChange={e => updateSecuritySetting('twoFactorEnabled', e.target.checked)}
                                            />
                                            <div className={`block w-10 h-6 rounded-full ${localSettings.security.twoFactorEnabled ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                                            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${localSettings.security.twoFactorEnabled ? 'transform translate-x-4' : ''}`}></div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label htmlFor="login-notifications" className="block text-sm font-medium text-gray-900">
                                                Login Notifications
                                            </label>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                Get notified when there's a new login to your account
                                            </p>
                                        </div>
                                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                            <input
                                                id="login-notifications"
                                                type="checkbox"
                                                className="sr-only"
                                                checked={localSettings.security.loginNotifications}
                                                onChange={e => updateSecuritySetting('loginNotifications', e.target.checked)}
                                            />
                                            <div className={`block w-10 h-6 rounded-full ${localSettings.security.loginNotifications ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                                            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${localSettings.security.loginNotifications ? 'transform translate-x-4' : ''}`}></div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label htmlFor="approval-confirmations" className="block text-sm font-medium text-gray-900">
                                                Transaction Approval Confirmations
                                            </label>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                Require confirmation for all transactions and strategy changes
                                            </p>
                                        </div>
                                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                            <input
                                                id="approval-confirmations"
                                                type="checkbox"
                                                className="sr-only"
                                                checked={localSettings.security.approvalConfirmations}
                                                onChange={e => updateSecuritySetting('approvalConfirmations', e.target.checked)}
                                            />
                                            <div className={`block w-10 h-6 rounded-full ${localSettings.security.approvalConfirmations ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                                            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${localSettings.security.approvalConfirmations ? 'transform translate-x-4' : ''}`}></div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label htmlFor="whitelist-addresses" className="block text-sm font-medium text-gray-900">
                                                Withdrawal Address Whitelist
                                            </label>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                Only allow withdrawals to pre-approved addresses
                                            </p>
                                        </div>
                                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                            <input
                                                id="whitelist-addresses"
                                                type="checkbox"
                                                className="sr-only"
                                                checked={localSettings.security.withdrawalAddressWhitelist}
                                                onChange={e => updateSecuritySetting('withdrawalAddressWhitelist', e.target.checked)}
                                            />
                                            <div className={`block w-10 h-6 rounded-full ${localSettings.security.withdrawalAddressWhitelist ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                                            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${localSettings.security.withdrawalAddressWhitelist ? 'transform translate-x-4' : ''}`}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h4 className="text-base font-medium text-gray-900 mb-3">Password & Authentication</h4>

                                <div className="p-4 border border-gray-200 rounded-lg">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900">
                                                Password
                                            </label>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                Last changed: {localSettings.security.lastPasswordChange}
                                            </p>
                                        </div>
                                        <button className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center">
                                            Change Password
                                            <ChevronRight className="w-4 h-4 ml-1" />
                                        </button>
                                    </div>

                                    <div className="mt-4 flex space-x-4">
                                        <button className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center">
                                            <Key className="w-4 h-4 mr-1" />
                                            Configure 2FA
                                        </button>
                                        <button className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center">
                                            <Shield className="w-4 h-4 mr-1" />
                                            Manage Recovery Options
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h4 className="text-base font-medium text-gray-900 mb-3">Security History</h4>

                                <div className="p-4 border border-gray-200 rounded-lg">
                                    <table className="min-w-full">
                                        <thead>
                                            <tr>
                                                <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Date
                                                </th>
                                                <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Activity
                                                </th>
                                                <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    IP Address
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            <tr>
                                                <td className="py-2 text-sm text-gray-700">
                                                    March 15, 2025
                                                </td>
                                                <td className="py-2 text-sm text-gray-700">
                                                    Account Login
                                                </td>
                                                <td className="py-2 text-sm text-gray-700">
                                                    192.168.1.1
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="py-2 text-sm text-gray-700">
                                                    March 10, 2025
                                                </td>
                                                <td className="py-2 text-sm text-gray-700">
                                                    Password Changed
                                                </td>
                                                <td className="py-2 text-sm text-gray-700">
                                                    192.168.1.1
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="py-2 text-sm text-gray-700">
                                                    March 5, 2025
                                                </td>
                                                <td className="py-2 text-sm text-gray-700">
                                                    2FA Enabled
                                                </td>
                                                <td className="py-2 text-sm text-gray-700">
                                                    192.168.1.1
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <div className="mt-4 text-center">
                                        <button className="text-xs text-indigo-600 hover:text-indigo-700">
                                            View Full Security History
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Display Settings */}
                    {activeSection === 'display' && (
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-6">Display & Localization Settings</h3>

                            <div className="mb-8">
                                <h4 className="text-base font-medium text-gray-900 mb-4">Theme</h4>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div
                                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${localSettings.display.theme === 'light'
                                                ? 'border-indigo-300 bg-indigo-50'
                                                : 'border-gray-200 hover:bg-gray-50'
                                            }`}
                                        onClick={() => updateDisplaySetting('theme', 'light')}
                                    >
                                        <div className="flex items-center mb-3">
                                            <Sun className="w-5 h-5 text-amber-500 mr-2" />
                                            <h5 className="text-sm font-medium text-gray-900">Light Mode</h5>
                                        </div>
                                        <div className="h-16 bg-white border border-gray-200 rounded"></div>
                                    </div>

                                    <div
                                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${localSettings.display.theme === 'dark'
                                                ? 'border-indigo-300 bg-indigo-50'
                                                : 'border-gray-200 hover:bg-gray-50'
                                            }`}
                                        onClick={() => updateDisplaySetting('theme', 'dark')}
                                    >
                                        <div className="flex items-center mb-3">
                                            <Moon className="w-5 h-5 text-indigo-500 mr-2" />
                                            <h5 className="text-sm font-medium text-gray-900">Dark Mode</h5>
                                        </div>
                                        <div className="h-16 bg-gray-900 border border-gray-700 rounded"></div>
                                    </div>

                                    <div
                                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${localSettings.display.theme === 'system'
                                                ? 'border-indigo-300 bg-indigo-50'
                                                : 'border-gray-200 hover:bg-gray-50'
                                            }`}
                                        onClick={() => updateDisplaySetting('theme', 'system')}
                                    >
                                        <div className="flex items-center mb-3">
                                            <Settings className="w-5 h-5 text-gray-500 mr-2" />
                                            <h5 className="text-sm font-medium text-gray-900">System Default</h5>
                                        </div>
                                        <div className="h-16 bg-gradient-to-r from-white to-gray-900 border border-gray-200 rounded"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h4 className="text-base font-medium text-gray-900 mb-4">Currency & Time Format</h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                                            Currency
                                        </label>
                                        <select
                                            id="currency"
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            value={localSettings.display.currency}
                                            onChange={(e) => updateDisplaySetting('currency', e.target.value as 'USD' | 'EUR' | 'GBP' | 'JPY')}
                                        >
                                            <option value="USD">USD - US Dollar</option>
                                            <option value="EUR">EUR - Euro</option>
                                            <option value="GBP">GBP - British Pound</option>
                                            <option value="JPY">JPY - Japanese Yen</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="time-format" className="block text-sm font-medium text-gray-700 mb-1">
                                            Time Format
                                        </label>
                                        <select
                                            id="time-format"
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            value={localSettings.display.timeFormat}
                                            onChange={(e) => updateDisplaySetting('timeFormat', e.target.value as '12h' | '24h')}
                                        >
                                            <option value="12h">12-hour (AM/PM)</option>
                                            <option value="24h">24-hour</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="date-format" className="block text-sm font-medium text-gray-700 mb-1">
                                            Date Format
                                        </label>
                                        <select
                                            id="date-format"
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            value={localSettings.display.dateFormat}
                                            onChange={(e) => updateDisplaySetting('dateFormat', e.target.value as 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD')}
                                        >
                                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Integrations */}
                    {activeSection === 'integrations' && (
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-6">Integrations & Connections</h3>

                            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-6">
                                <div className="flex items-start">
                                    <Info className="w-5 h-5 text-indigo-600 mt-0.5 mr-2" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Connect External Services</p>
                                        <p className="text-xs text-gray-700 mt-1">
                                            Link your external accounts and services to enhance your dashboard experience.
                                            All connections are secure and use read-only API keys where applicable.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8 space-y-4">
                                <h4 className="text-base font-medium text-gray-900 mb-3">Exchange & Wallet Connections</h4>

                                {localSettings.integrations
                                    .filter(i => i.type === 'exchange' || i.type === 'wallet')
                                    .map(integration => (
                                        <div key={integration.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                                                    <span className="text-xs font-bold text-indigo-600">{integration.name.charAt(0)}</span>
                                                </div>
                                                <div>
                                                    <h5 className="text-sm font-medium text-gray-900">{integration.name}</h5>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        {integration.connected
                                                            ? `Connected · Last synced: ${integration.lastSync || 'Never'}`
                                                            : 'Not connected'}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => toggleIntegrationConnection(integration.id)}
                                                className={`text-xs px-3 py-1.5 rounded-lg ${integration.connected
                                                        ? 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                                                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                                    }`}
                                            >
                                                {integration.connected ? 'Disconnect' : 'Connect'}
                                            </button>
                                        </div>
                                    ))}
                            </div>

                            <div className="mb-8 space-y-4">
                                <h4 className="text-base font-medium text-gray-900 mb-3">Tax & Portfolio Services</h4>

                                {localSettings.integrations
                                    .filter(i => i.type === 'tax' || i.type === 'portfolio')
                                    .map(integration => (
                                        <div key={integration.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                                                    <span className="text-xs font-bold text-indigo-600">{integration.name.charAt(0)}</span>
                                                </div>
                                                <div>
                                                    <h5 className="text-sm font-medium text-gray-900">{integration.name}</h5>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        {integration.connected
                                                            ? `Connected · Last synced: ${integration.lastSync || 'Never'}`
                                                            : 'Not connected'}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => toggleIntegrationConnection(integration.id)}
                                                className={`text-xs px-3 py-1.5 rounded-lg ${integration.connected
                                                        ? 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                                                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                                    }`}
                                            >
                                                {integration.connected ? 'Disconnect' : 'Connect'}
                                            </button>
                                        </div>
                                    ))}
                            </div>

                            <div className="mb-6">
                                <div className="p-4 border border-dashed border-indigo-200 rounded-lg bg-indigo-50/30 flex flex-col items-center justify-center">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
                                        <ExternalLink className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <h5 className="text-sm font-medium text-gray-900 mb-1">Connect a New Service</h5>
                                    <p className="text-xs text-gray-600 text-center mb-3">
                                        Add support for additional exchanges, wallets, or tax services
                                    </p>
                                    <button className="text-xs px-3 py-1.5 bg-white border border-indigo-200 text-indigo-600 rounded-lg hover:bg-indigo-50">
                                        Browse Integrations
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Save button */}
                    <div className="mt-8 pt-5 border-t border-gray-200">
                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                onClick={handleSaveSettings}
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Save Settings
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsTab;