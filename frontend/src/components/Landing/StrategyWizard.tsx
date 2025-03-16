import React, { useState } from 'react';
import { Check, ChevronRight, HelpCircle, Info, X, Sparkles, Shield, Zap, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip';
import { DialogTitle, DialogHeader, DialogDescription } from '@/components/ui/dialog';

interface StrategyWizardProps {
    onClose: () => void;
}

export const StrategyWizard: React.FC<StrategyWizardProps> = ({ onClose }) => {
    const [step, setStep] = useState<number>(1);
    const [strategyType, setStrategyType] = useState<string>('preset');
    const [riskLevel, setRiskLevel] = useState<number>(3);
    const [rebalanceFrequency, setRebalanceFrequency] = useState<string>('weekly');
    const [selectedProtocols, setSelectedProtocols] = useState<string[]>(['alex', 'bitflow']);
    const [investment, setInvestment] = useState<number>(0.5);
    const [isDeploying, setIsDeploying] = useState<boolean>(false);

    const protocols = [
        { id: 'alex', name: 'ALEX', apy: '8.4%', risk: 3, icon: <Zap className="h-4 w-4 text-indigo-600" /> },
        { id: 'bitflow', name: 'Bitflow', apy: '10.2%', risk: 4, icon: <Sparkles className="h-4 w-4 text-violet-600" /> },
        { id: 'arkadiko', name: 'Arkadiko', apy: '6.8%', risk: 2, icon: <Shield className="h-4 w-4 text-blue-600" /> },
        { id: 'stackswap', name: 'StackSwap', apy: '11.5%', risk: 4, icon: <Zap className="h-4 w-4 text-purple-600" /> },
    ];

    const presetStrategies = [
        {
            id: 'low-risk',
            name: 'Conservative',
            description: 'Capital preservation with modest yield',
            apy: '4-6%',
            risk: 1,
            detail: 'Focuses on stablecoin pools and protocols with strong security audits',
            icon: <Shield className="h-5 w-5 text-blue-600" />
        },
        {
            id: 'balanced',
            name: 'Balanced Growth',
            description: 'Moderate approach with calculated exposure',
            apy: '6-9%',
            risk: 3,
            detail: 'Diversified allocation across multiple yield sources',
            icon: <Sparkles className="h-5 w-5 text-indigo-600" />
        },
        {
            id: 'high-yield',
            name: 'Aggressive Growth',
            description: 'Maximum yield potential with higher exposure',
            apy: '9-12%',
            risk: 5,
            detail: 'Utilizes leverage and concentrated positions for maximum returns',
            icon: <Zap className="h-5 w-5 text-violet-600" />
        },
    ];

    const handleProtocolToggle = (protocolId: string) => {
        if (selectedProtocols.includes(protocolId)) {
            setSelectedProtocols(selectedProtocols.filter(id => id !== protocolId));
        } else {
            setSelectedProtocols([...selectedProtocols, protocolId]);
        }
    };

    const nextStep = () => {
        if (step < 3) {
            setStep(step + 1);
        }
    };

    const prevStep = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleDeploy = () => {
        setIsDeploying(true);

        // Simulate deployment
        setTimeout(() => {
            setIsDeploying(false);
            onClose();
        }, 2000);
    };

    // Calculate estimated APY based on risk level and selected protocols
    const getEstimatedApy = () => {
        if (strategyType === 'preset') {
            const strategy = presetStrategies.find(s => s.risk === riskLevel);
            return strategy ? strategy.apy : '6-9%';
        } else {
            const selectedProtocolList = protocols.filter(p => selectedProtocols.includes(p.id));
            if (selectedProtocolList.length === 0) return '0%';

            const avgApy = selectedProtocolList.reduce((sum, p) => sum + parseFloat(p.apy.replace('%', '')), 0) / selectedProtocolList.length;
            return `${(avgApy - 1).toFixed(1)}-${(avgApy + 1).toFixed(1)}%`;
        }
    };

    return (
        <div className="sm:max-w-4xl bg-gradient-to-b from-blue-50 to-purple-50 border border-indigo-100 shadow-xl shadow-indigo-100/20 p-0 max-h-[90vh] overflow-hidden">
            <div className="max-h-[90vh] overflow-y-auto overflow-x-hidden p-6 scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-blue-50">
                <DialogHeader className="border-b border-indigo-200/30 pb-4">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-bold text-indigo-900 flex items-center">
                            <Sparkles className="mr-2 h-5 w-5 text-indigo-600" />
                            Yield Strategy Wizard
                        </DialogTitle>
                        <Button variant="ghost" size="icon" onClick={onClose} className="text-indigo-500 hover:text-indigo-700">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <DialogDescription className="text-indigo-700">
                        Create, simulate, and deploy a professional yield strategy tailored to your risk profile.
                    </DialogDescription>
                </DialogHeader>

                {/* Progress Background with Animated Elements */}
                <div className="relative mt-8 mb-10">
                    {/* Background elements */}
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute h-0.5 w-full bg-indigo-100 top-6"></div>
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className="absolute w-24 h-24 rounded-full bg-indigo-500/5"
                                style={{
                                    left: `calc(${i * 50}% - 12px)`,
                                    top: '-6px',
                                    transform: 'translateX(-50%)',
                                    opacity: step > i + 1 ? 0.8 : 0.2,
                                    transition: 'opacity 0.5s ease-in-out'
                                }}
                            ></div>
                        ))}
                    </div>

                    {/* Progress Bar */}
                    <div className="flex justify-between">
                        {[1, 2, 3].map((stepNumber) => (
                            <div key={stepNumber} className="relative z-10">
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center ${stepNumber === step
                                        ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                                        : stepNumber < step
                                            ? 'bg-emerald-500 text-white'
                                            : 'bg-indigo-100 text-indigo-400'
                                        } transition-all duration-500`}
                                >
                                    {stepNumber < step ? <Check className="h-5 w-5" /> : stepNumber}

                                    {/* Animated ripple effect for current step */}
                                    {stepNumber === step && (
                                        <span className="absolute inset-0 rounded-full animate-ping-slow bg-indigo-400/20"></span>
                                    )}
                                </div>
                                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm font-medium whitespace-nowrap text-indigo-700">
                                    {stepNumber === 1 ? 'Strategy' : stepNumber === 2 ? 'Parameters' : 'Review'}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div
                        className="absolute top-6 left-0 h-0.5 bg-gradient-to-r from-indigo-400 to-violet-400 -z-5 transition-all duration-500"
                        style={{ width: `${((step - 1) / 2) * 100}%` }}
                    ></div>

                </div>

                {/* Step 1: Strategy Selection */}
                {step === 1 && (
                    <div className="mt-12">
                        <Tabs
                            defaultValue="preset"
                            value={strategyType}
                            onValueChange={setStrategyType}
                            className="w-full"
                        >
                            <TabsList className="w-full grid grid-cols-2 mb-6 bg-indigo-50 p-1 rounded-lg">
                                <TabsTrigger value="preset" className="text-sm data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                                    Preset Strategies
                                </TabsTrigger>
                                <TabsTrigger value="custom" className="text-sm data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                                    Custom Strategy
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="preset" className="space-y-4">
                                <div className="grid gap-4">
                                    {presetStrategies.map((strategy) => (
                                        <div
                                            key={strategy.id}
                                            className="relative p-5 border border-indigo-100 hover:border-indigo-300 rounded-xl cursor-pointer transition-all duration-300 bg-white shadow-sm overflow-hidden group"
                                            onClick={() => {
                                                setRiskLevel(strategy.risk);
                                                nextStep();
                                            }}
                                        >
                                            {/* Hover effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 to-violet-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                            <div className="flex justify-between items-start relative z-10">
                                                <div>
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                                            {strategy.icon}
                                                        </div>
                                                        <h3 className="text-lg font-semibold text-indigo-900">{strategy.name}</h3>
                                                    </div>
                                                    <p className="text-indigo-700 mb-3">{strategy.description}</p>
                                                    <p className="text-indigo-500 text-sm">{strategy.detail}</p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm text-indigo-500">Expected APY</div>
                                                    <div className="text-emerald-600 font-semibold">{strategy.apy}</div>
                                                </div>
                                            </div>
                                            <div className="mt-4 flex items-center">
                                                <span className="text-sm text-indigo-500 mr-3">Risk Level:</span>
                                                <div className="flex space-x-1.5">
                                                    {[1, 2, 3, 4, 5].map((level) => (
                                                        <div
                                                            key={level}
                                                            className={`w-6 h-1.5 rounded-full ${level <= strategy.risk
                                                                ? level <= 2
                                                                    ? 'bg-emerald-500'
                                                                    : level <= 4
                                                                        ? 'bg-indigo-500'
                                                                        : 'bg-violet-500'
                                                                : 'bg-indigo-100'
                                                                }`}
                                                        ></div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Select indicator */}
                                            <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="bg-indigo-100 rounded-full p-1.5">
                                                    <ArrowRight className="h-4 w-4 text-indigo-600" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="custom" className="mt-2">
                                <div className="space-y-6">
                                    <div className="bg-blue-50 border border-indigo-200/30 rounded-lg p-4">
                                        <p className="text-indigo-700 text-sm">
                                            Design your own custom yield strategy by selecting the protocols you want to include
                                            in your portfolio and configuring their allocation in the next step.
                                        </p>
                                    </div>

                                    <div className="grid gap-4">
                                        {protocols.map((protocol) => (
                                            <div
                                                key={protocol.id}
                                                className={`p-4 border rounded-xl transition-all duration-300 ${selectedProtocols.includes(protocol.id)
                                                    ? 'border-indigo-300 bg-indigo-50/50 shadow-sm'
                                                    : 'border-indigo-100 hover:border-indigo-200 bg-white'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        <Checkbox
                                                            id={protocol.id}
                                                            checked={selectedProtocols.includes(protocol.id)}
                                                            onCheckedChange={() => handleProtocolToggle(protocol.id)}
                                                            className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                                                        />
                                                        <div className="flex items-center">
                                                            <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                                                                {protocol.icon}
                                                            </div>
                                                            <Label htmlFor={protocol.id} className="font-medium text-indigo-900">
                                                                {protocol.name}
                                                            </Label>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-sm text-indigo-500">Current APY</div>
                                                        <div className="text-emerald-600 font-semibold">{protocol.apy}</div>
                                                    </div>
                                                </div>
                                                <div className="mt-3 flex items-center ml-10">
                                                    <span className="text-sm text-indigo-500 mr-2">Risk Level:</span>
                                                    <div className="flex space-x-1.5">
                                                        {[1, 2, 3, 4, 5].map((level) => (
                                                            <div
                                                                key={level}
                                                                className={`w-5 h-1.5 rounded-full ${level <= protocol.risk
                                                                    ? level <= 2
                                                                        ? 'bg-emerald-500'
                                                                        : level <= 4
                                                                            ? 'bg-indigo-500'
                                                                            : 'bg-violet-500'
                                                                    : 'bg-indigo-100'
                                                                    }`}
                                                            ></div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                )}

                {/* Step 2: Parameter Setup */}
                {step === 2 && (
                    <div className="mt-10 space-y-8">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-base font-medium text-indigo-900">
                                    <div className="flex items-center">
                                        Maximum Risk Level
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <HelpCircle className="h-4 w-4 ml-2 text-indigo-400" />
                                                </TooltipTrigger>
                                                <TooltipContent className="bg-white border-indigo-200 text-indigo-900">
                                                    <p className="w-56 text-sm">Higher risk levels may yield higher returns but come with increased volatility and potential for loss.</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </Label>
                                <span className="px-3 py-1 bg-indigo-100 border border-indigo-200/50 rounded-full text-sm font-medium text-indigo-700">{riskLevel}/5</span>
                            </div>
                            <Slider
                                value={[riskLevel]}
                                min={1}
                                max={5}
                                step={1}
                                onValueChange={(value) => setRiskLevel(value[0])}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs text-indigo-500">
                                <span>Conservative</span>
                                <span>Aggressive</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Label className="text-base font-medium text-indigo-900">Rebalance Frequency</Label>
                            <RadioGroup value={rebalanceFrequency} onValueChange={setRebalanceFrequency} className="flex flex-col space-y-3">
                                <div className="flex items-center p-3 space-x-3 border border-indigo-100 rounded-lg hover:border-indigo-300 transition-all duration-200 bg-white">
                                    <RadioGroupItem value="daily" id="daily" className="data-[state=checked]:border-indigo-500 data-[state=checked]:bg-indigo-600" />
                                    <div>
                                        <Label htmlFor="daily" className="font-medium text-indigo-900">Daily Rebalancing</Label>
                                        <p className="text-xs text-indigo-500 mt-1">Most responsive to market changes, higher gas costs</p>
                                    </div>
                                </div>
                                <div className="flex items-center p-3 space-x-3 border border-indigo-100 rounded-lg hover:border-indigo-300 transition-all duration-200 bg-white">
                                    <RadioGroupItem value="weekly" id="weekly" className="data-[state=checked]:border-indigo-500 data-[state=checked]:bg-indigo-600" />
                                    <div>
                                        <Label htmlFor="weekly" className="font-medium text-indigo-900">Weekly Rebalancing</Label>
                                        <p className="text-xs text-indigo-500 mt-1">Balanced approach between responsiveness and efficiency</p>
                                    </div>
                                </div>
                                <div className="flex items-center p-3 space-x-3 border border-indigo-100 rounded-lg hover:border-indigo-300 transition-all duration-200 bg-white">
                                    <RadioGroupItem value="monthly" id="monthly" className="data-[state=checked]:border-indigo-500 data-[state=checked]:bg-indigo-600" />
                                    <div>
                                        <Label htmlFor="monthly" className="font-medium text-indigo-900">Monthly Rebalancing</Label>
                                        <p className="text-xs text-indigo-500 mt-1">Lower gas fees, less frequent updates</p>
                                    </div>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="space-y-4">
                            <Label className="text-base font-medium text-indigo-900">Investment Amount (sBTC)</Label>
                            <div className="flex space-x-2">
                                <Input
                                    type="number"
                                    value={investment}
                                    onChange={(e) => setInvestment(parseFloat(e.target.value) || 0)}
                                    placeholder="0.00"
                                    min="0.01"
                                    step="0.01"
                                    className="bg-white border-indigo-200 focus:border-indigo-500"
                                />
                                <Button
                                    variant="outline"
                                    className="shrink-0 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300"
                                >
                                    Max
                                </Button>
                            </div>
                            <div className="flex items-center text-sm text-indigo-500">
                                <Info className="h-3.5 w-3.5 mr-1.5 text-indigo-600" />
                                Available Balance: <span className="text-indigo-900 ml-1 font-medium">0.842 sBTC</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Review & Deploy */}
                {step === 3 && (
                    <div className="mt-10 space-y-6">
                        <div className="bg-white border border-indigo-100 rounded-xl p-5 shadow-sm">
                            <h3 className="text-lg font-medium text-indigo-900 mb-4">Strategy Summary</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between py-2 border-b border-indigo-100">
                                    <span className="text-indigo-700">Strategy Type:</span>
                                    <span className="text-indigo-900 font-medium">{strategyType === 'preset' ? 'Balanced Growth' : 'Custom Allocation'}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-indigo-100">
                                    <span className="text-indigo-700">Risk Level:</span>
                                    <div className="flex items-center">
                                        <span className="text-indigo-900 font-medium mr-2">{riskLevel}/5</span>
                                        <div className="flex space-x-1">
                                            {[1, 2, 3, 4, 5].map((level) => (
                                                <div
                                                    key={level}
                                                    className={`w-4 h-1 rounded-full ${level <= riskLevel
                                                        ? level <= 2
                                                            ? 'bg-emerald-500'
                                                            : level <= 4
                                                                ? 'bg-indigo-500'
                                                                : 'bg-violet-500'
                                                        : 'bg-indigo-100'
                                                        }`}
                                                ></div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between py-2 border-b border-indigo-100">
                                    <span className="text-indigo-700">Rebalance Frequency:</span>
                                    <span className="text-indigo-900 font-medium capitalize">{rebalanceFrequency}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-indigo-100">
                                    <span className="text-indigo-700">Estimated APY:</span>
                                    <span className="text-emerald-600 font-medium">{getEstimatedApy()}</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-indigo-700">Investment Amount:</span>
                                    <span className="text-indigo-900 font-medium">{investment.toFixed(3)} sBTC</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-indigo-100 rounded-xl p-5 shadow-sm">
                            <h3 className="text-lg font-medium text-indigo-900 mb-4">Included Protocols</h3>
                            <div className="divide-y divide-indigo-100">
                                {selectedProtocols.map((id) => {
                                    const protocol = protocols.find(p => p.id === id);
                                    return (
                                        <div key={id} className="flex justify-between items-center py-3">
                                            <div className="flex items-center">
                                                <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                                                    {protocol?.icon}
                                                </div>
                                                <span className="text-indigo-900">{protocol?.name}</span>
                                            </div>
                                            <div className="text-emerald-600 font-medium">{protocol?.apy}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-indigo-200/30 rounded-xl p-5">
                            <div className="flex items-start space-x-3">
                                <Info className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-medium text-indigo-700">Important Information</h4>
                                    <p className="text-sm text-indigo-700 mt-1">
                                        Deploying this strategy will require a wallet signature to approve the initial deposit.
                                        Your funds remain non-custodial and you can withdraw at any time.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-indigo-100 rounded-xl p-5 relative overflow-hidden shadow-sm">
                            <div className="absolute inset-0 bg-opacity-50 z-0">
                                {/* Subtle animated chart background */}
                                <div className="h-full w-full opacity-5">
                                    <svg
                                        width="100%"
                                        height="100%"
                                        viewBox="0 0 100 100"
                                        preserveAspectRatio="none"
                                    >
                                        <path
                                            d="M0,50 L10,45 L20,60 L30,35 L40,55 L50,25 L60,45 L70,30 L80,55 L90,20 L100,40"
                                            fill="none"
                                            stroke="url(#chartGradient)"
                                            strokeWidth="2"
                                        />
                                        <defs>
                                            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#4f46e5" />
                                                <stop offset="100%" stopColor="#8b5cf6" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                            </div>

                            <h3 className="text-lg font-medium text-indigo-900 mb-4 relative z-10">Simulated Performance</h3>
                            <div className="h-48 bg-indigo-50/50 rounded-lg flex items-center justify-center text-indigo-400 border border-indigo-100 relative z-10">
                                {/* Simple placeholder chart */}
                                <div className="w-full h-full p-4 flex items-end justify-between">
                                    <div className="h-full flex items-end space-x-4 w-full">
                                        {[30, 45, 42, 50, 65, 60, 75, 70, 85, 82, 90].map((height, i) => (
                                            <div key={i} className="relative flex-1 flex flex-col items-center">
                                                <div
                                                    className="w-full bg-gradient-to-t from-indigo-500 to-violet-500 rounded-t-sm"
                                                    style={{
                                                        height: `${height}%`,
                                                        animation: `grow-bar 1.5s ease-out ${i * 0.1}s`
                                                    }}
                                                />
                                                <div className="absolute -top-6 text-xs text-indigo-500">{i === 5 ? '6mo' : i === 10 ? '12mo' : ''}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 text-xs text-indigo-500 flex items-center relative z-10">
                                <Info className="h-3.5 w-3.5 mr-1.5 text-indigo-400" />
                                Past performance does not guarantee future results
                            </div>


                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                    {step > 1 ? (
                        <Button
                            variant="outline"
                            onClick={prevStep}
                            className="border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                        >
                            Back
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                        >
                            Cancel
                        </Button>
                    )}

                    {step < 3 ? (
                        <Button
                            onClick={nextStep}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            Continue <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleDeploy}
                            disabled={isDeploying}
                            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white relative overflow-hidden"
                        >
                            {isDeploying ? (
                                <>
                                    <span className="opacity-0">Deploy Strategy</span>
                                    <span className="absolute inset-0 flex items-center justify-center">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    </span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Deploy Strategy
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StrategyWizard;