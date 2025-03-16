import React, { useState } from 'react';
import { Zap, RefreshCw, Settings } from 'lucide-react';

// Define the risk tolerance options type
type RiskToleranceType = 'low' | 'medium' | 'high';

// Define the rebalance frequency options type
type RebalanceFrequencyType = 'daily' | 'weekly' | 'monthly';

// Define the settings interface
interface OptimizerSettings {
    riskTolerance: RiskToleranceType;
    rebalanceFrequency: RebalanceFrequencyType;
    targetApy: number;
    nextRebalance: string;
    autoCompound: boolean;
}

// Define props interface
interface OptimizationPanelProps {
    isEnabled: boolean;
    settings: OptimizerSettings;
    onToggle: (isEnabled: boolean) => void;
    onSaveSettings: (settings: OptimizerSettings) => void;
}

const OptimizationPanel: React.FC<OptimizationPanelProps> = ({ isEnabled, settings, onToggle, onSaveSettings }) => {
    const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
    const [localSettings, setLocalSettings] = useState<OptimizerSettings>(settings);

    const handleSaveSettings = (): void => {
        onSaveSettings(localSettings);
        setIsSettingsOpen(false);
    };

    return (
        <div className="bg-white/90 backdrop-blur-sm border border-indigo-100 rounded-xl shadow-md shadow-indigo-100/20 p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-indigo-600" />
                    Yield Optimizer
                </h2>
                <button
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    className="text-xs text-indigo-600 flex items-center"
                >
                    Settings <Settings className="w-3.5 h-3.5 ml-1" />
                </button>
            </div>

            <div className="p-4 border border-indigo-100 rounded-lg bg-gradient-to-r from-indigo-50 to-white">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="font-semibold text-gray-900">Auto-Optimization</h3>
                        <p className="text-xs text-gray-600 mt-1">
                            Automatically allocate your sBTC for optimal yields
                        </p>
                    </div>

                    <label className="inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={isEnabled}
                            onChange={() => onToggle(!isEnabled)}
                        />
                        <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-indigo-600 peer-focus:ring-2 peer-focus:ring-indigo-300">
                            <div className="absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-all peer-checked:translate-x-5"></div>
                        </div>
                    </label>
                </div>

                {isEnabled && (
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Next Rebalance</span>
                            <span className="text-xs font-medium text-gray-700 flex items-center">
                                <RefreshCw className="w-3 h-3 mr-1 text-indigo-500" />
                                {settings.nextRebalance}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Risk Tolerance</span>
                            <span className="text-xs font-medium text-amber-700">
                                {settings.riskTolerance === 'low' ? 'Low' :
                                    settings.riskTolerance === 'medium' ? 'Medium' : 'High'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Target APY</span>
                            <span className="text-xs font-medium text-green-600">{settings.targetApy}%+</span>
                        </div>
                    </div>
                )}

                {isSettingsOpen && (
                    <div className="mt-4 pt-4 border-t border-indigo-100">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Optimizer Settings</h4>

                        <div className="space-y-3 mb-4">
                            <div>
                                <label className="block text-xs text-gray-700 mb-1">Risk Tolerance</label>
                                <select
                                    value={localSettings.riskTolerance}
                                    onChange={(e) => setLocalSettings({ ...localSettings, riskTolerance: e.target.value as RiskToleranceType })}
                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                >
                                    <option value="low">Low - Capital Preservation</option>
                                    <option value="medium">Medium - Balanced Growth</option>
                                    <option value="high">High - Maximum Yield</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs text-gray-700 mb-1">Rebalance Frequency</label>
                                <select
                                    value={localSettings.rebalanceFrequency}
                                    onChange={(e) => setLocalSettings({ ...localSettings, rebalanceFrequency: e.target.value as RebalanceFrequencyType })}
                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                >
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs text-gray-700 mb-1">Auto-Compound Rewards</label>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="autoCompound"
                                        checked={localSettings.autoCompound}
                                        onChange={(e) => setLocalSettings({ ...localSettings, autoCompound: e.target.checked })}
                                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    />
                                    <label htmlFor="autoCompound" className="ml-2 text-xs text-gray-700">
                                        Automatically reinvest earned rewards
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setIsSettingsOpen(false)}
                                className="px-3 py-1.5 border border-gray-200 text-gray-700 rounded-lg text-xs"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveSettings}
                                className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs"
                            >
                                Save Settings
                            </button>
                        </div>
                    </div>
                )}

                {isEnabled && !isSettingsOpen && (
                    <div className="flex justify-between">
                        <button className="text-xs px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50">
                            View History
                        </button>
                        <button className="text-xs px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center">
                            <RefreshCw className="w-3 h-3 mr-1.5" />
                            Rebalance Now
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OptimizationPanel;