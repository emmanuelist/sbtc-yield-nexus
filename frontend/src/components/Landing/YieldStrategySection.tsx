import React, { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
    Sparkles,
    Shield,
    Zap,
    TrendingUp,
    BarChart3,
    ArrowRight,
    Info,
    Clock,
    DollarSign,
    CheckCircle
} from 'lucide-react';

const STRATEGIES = [
    {
        id: 'conservative',
        name: 'Conservative',
        description: 'Capital preservation with steady returns',
        risk: 1,
        apy: '4-6%',
        icon: <Shield className="h-5 w-5" />,
        color: 'text-emerald-600',
        gradient: 'from-emerald-50 to-green-50',
        border: 'border-emerald-200',
        protocols: ['ALEX Stable Pools', 'Arkadiko Treasury'],
        recommended: 'New investors focused on safety'
    },
    {
        id: 'balanced',
        name: 'Balanced Growth',
        description: 'Optimal risk-adjusted returns',
        risk: 3,
        apy: '7-9%',
        icon: <TrendingUp className="h-5 w-5" />,
        color: 'text-indigo-600',
        gradient: 'from-indigo-50 to-violet-50',
        border: 'border-indigo-200',
        protocols: ['Bitflow Yield Farms', 'ALEX LP', 'Arkadiko Vaults'],
        recommended: 'Most investors seeking growth'
    },
    {
        id: 'aggressive',
        name: 'Aggressive Growth',
        description: 'Maximum yield optimization',
        risk: 5,
        apy: '10-12%',
        icon: <Zap className="h-5 w-5" />,
        color: 'text-orange-600',
        gradient: 'from-orange-50 to-amber-50',
        border: 'border-orange-200',
        protocols: ['StackSwap Pools', 'Bitflow Leverage', 'ALEX Options'],
        recommended: 'Experienced investors comfortable with volatility'
    }
];

const PROTOCOLS = [
    {
        id: 'alex',
        name: 'ALEX',
        apy: '9.2%',
        tvl: '$42.8M',
        risk: 3,
        logo: '/api/placeholder/32/32', // In a real app, use actual logo paths
        description: 'Automated liquidity exchange offering yield farming and options'
    },
    {
        id: 'bitflow',
        name: 'Bitflow',
        apy: '11.5%',
        tvl: '$38.1M',
        risk: 4,
        logo: '/api/placeholder/32/32',
        description: 'Advanced yield aggregator with leverage options'
    },
    {
        id: 'arkadiko',
        name: 'Arkadiko',
        apy: '7.2%',
        tvl: '$29.7M',
        risk: 2,
        logo: '/api/placeholder/32/32',
        description: 'Decentralized stablecoin protocol with lending vaults'
    },
    {
        id: 'stackswap',
        name: 'StackSwap',
        apy: '10.8%',
        tvl: '$19.3M',
        risk: 4,
        logo: '/api/placeholder/32/32',
        description: 'Native Stacks DEX with innovative liquidity pools'
    }
];

export const YieldStrategySection: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('preset');
    const [selectedStrategy, setSelectedStrategy] = useState<string>('balanced');
    const [riskLevel, setRiskLevel] = useState<number[]>([3]);
    const [selectedProtocols, setSelectedProtocols] = useState<string[]>(['alex', 'arkadiko']);
    const [investment, setInvestment] = useState<number>(0.5);
    const [projectedReturns, setProjectedReturns] = useState<number[]>([]);
    const [holdReturns, setHoldReturns] = useState<number[]>([]);
    const chartRef = useRef<HTMLCanvasElement>(null);
    const sectionRef = useRef<HTMLElement>(null);

    // Generate simulated returns data when parameters change
    useEffect(() => {
        // Simulate returns based on risk level and selected protocols
        const baseRisk = activeTab === 'preset'
            ? STRATEGIES.find(s => s.id === selectedStrategy)?.risk || 3
            : riskLevel[0];

        const baseApy = baseRisk * 2 + (Math.random() * 2);

        // Generate 12 months of simulated data
        const newProjectedReturns = [investment];
        const newHoldReturns = [investment];

        for (let i = 1; i <= 12; i++) {
            // Add some randomness to APY to simulate market fluctuations
            const monthlyApy = (baseApy + (Math.random() * 2 - 1)) / 100 / 12;
            const lastMonth = newProjectedReturns[i - 1];
            newProjectedReturns.push(lastMonth * (1 + monthlyApy));

            // Bitcoin historical average around 10% annually with higher volatility
            const holdApy = (5 + (Math.random() * 10 - 5)) / 100 / 12;
            const lastHoldMonth = newHoldReturns[i - 1];
            newHoldReturns.push(lastHoldMonth * (1 + holdApy));
        }

        setProjectedReturns(newProjectedReturns);
        setHoldReturns(newHoldReturns);
    }, [activeTab, selectedStrategy, riskLevel, selectedProtocols, investment]);

    // Draw chart when returns data changes
    useEffect(() => {
        if (!chartRef.current || projectedReturns.length === 0 || holdReturns.length === 0) return;

        const ctx = chartRef.current.getContext('2d');
        if (!ctx) return;

        const canvas = chartRef.current;
        canvas.width = canvas.offsetWidth * 2;
        canvas.height = canvas.offsetHeight * 2;
        ctx.scale(2, 2); // For retina displays

        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Find max value for scaling
        const maxValue = Math.max(
            ...projectedReturns,
            ...holdReturns
        ) * 1.1; // Add 10% padding

        // Draw background grid with more sophisticated styling
        ctx.strokeStyle = 'rgba(229, 231, 235, 0.3)';
        ctx.lineWidth = 0.5;

        // Horizontal grid lines with subtle gradient
        for (let i = 0; i <= 4; i++) {
            const y = height - (height * (i / 4));

            // Create gradient for grid lines
            const gridGradient = ctx.createLinearGradient(0, y, width, y);
            gridGradient.addColorStop(0, 'rgba(224, 231, 255, 0.5)');
            gridGradient.addColorStop(0.5, 'rgba(199, 210, 254, 0.7)');
            gridGradient.addColorStop(1, 'rgba(224, 231, 255, 0.5)');

            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.strokeStyle = gridGradient;
            ctx.stroke();

            // Add labels with enhanced styling
            ctx.fillStyle = 'rgba(79, 70, 229, 0.8)';
            ctx.font = '10px sans-serif';
            ctx.textAlign = 'left';
            const value = (maxValue * (i / 4)).toFixed(3);
            ctx.fillText(`${value} sBTC`, 5, y - 5);
        }

        // Vertical grid lines (months) with subtle gradient
        for (let i = 0; i <= 12; i += 3) {
            const x = (width / 12) * i;

            // Create gradient for vertical grid lines
            const verticalGridGradient = ctx.createLinearGradient(x, 0, x, height);
            verticalGridGradient.addColorStop(0, 'rgba(224, 231, 255, 0.5)');
            verticalGridGradient.addColorStop(0.5, 'rgba(199, 210, 254, 0.7)');
            verticalGridGradient.addColorStop(1, 'rgba(224, 231, 255, 0.5)');

            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.strokeStyle = verticalGridGradient;
            ctx.stroke();

            // Add labels with enhanced styling
            ctx.fillStyle = 'rgba(79, 70, 229, 0.8)';
            ctx.font = '10px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(`Month ${i}`, x, height - 5);
        }

        // Create gradient area fill for the projected returns
        const areaGradient = ctx.createLinearGradient(0, 0, 0, height);
        areaGradient.addColorStop(0, 'rgba(79, 70, 229, 0.15)');
        areaGradient.addColorStop(1, 'rgba(139, 92, 246, 0.01)');

        // Draw area under projected returns
        ctx.beginPath();
        // Start from bottom left
        ctx.moveTo(0, height);

        // Draw line to the first data point
        const firstY = height - (projectedReturns[0] / maxValue) * height;
        ctx.lineTo(0, firstY);

        // Connect all data points
        for (let i = 1; i < projectedReturns.length; i++) {
            const x = (width / 12) * i;
            const y = height - (projectedReturns[i] / maxValue) * height;
            ctx.lineTo(x, y);
        }

        // Draw line to bottom right and then back to bottom left to close the shape
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);

        // Fill with gradient
        ctx.fillStyle = areaGradient;
        ctx.fill();

        // Draw hold returns line with enhanced styling
        ctx.beginPath();
        for (let i = 0; i < holdReturns.length; i++) {
            const x = (width / 12) * i;
            const y = height - (holdReturns[i] / maxValue) * height;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }

        // Create dashed gradient stroke for HODL line
        const holdGradient = ctx.createLinearGradient(0, 0, width, 0);
        holdGradient.addColorStop(0, 'rgba(99, 102, 241, 0.6)');
        holdGradient.addColorStop(1, 'rgba(139, 92, 246, 0.6)');

        ctx.strokeStyle = holdGradient;
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 3]); // Set dashed line style
        ctx.stroke();
        ctx.setLineDash([]); // Reset line style

        // Draw projected returns line with enhanced styling
        ctx.beginPath();
        for (let i = 0; i < projectedReturns.length; i++) {
            const x = (width / 12) * i;
            const y = height - (projectedReturns[i] / maxValue) * height;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }

        // Create sophisticated gradient for the line
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, 'rgba(79, 70, 229, 1)');
        gradient.addColorStop(0.5, 'rgba(109, 40, 217, 1)');
        gradient.addColorStop(1, 'rgba(139, 92, 246, 1)');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Add glow effect to the main line
        ctx.shadowColor = 'rgba(79, 70, 229, 0.5)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.stroke();

        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;

        // Add enhanced points to projected returns line
        for (let i = 0; i < projectedReturns.length; i += 3) {
            const x = (width / 12) * i;
            const y = height - (projectedReturns[i] / maxValue) * height;

            // Draw outer glow
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(79, 70, 229, 0.2)';
            ctx.fill();

            // Draw main point
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(79, 70, 229, 1)';
            ctx.fill();

            // Draw inner highlight
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fillStyle = 'white';
            ctx.fill();
        }

        // Add enhanced legend with gradient backgrounds
        // Strategy Returns label
        const strategyGradient = ctx.createLinearGradient(10, 20, 100, 20);
        strategyGradient.addColorStop(0, 'rgba(79, 70, 229, 1)');
        strategyGradient.addColorStop(1, 'rgba(139, 92, 246, 1)');

        ctx.fillStyle = strategyGradient;
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Strategy Returns', 10, 20);

        // HODL Returns label
        const holdLabelGradient = ctx.createLinearGradient(110, 20, 190, 20);
        holdLabelGradient.addColorStop(0, 'rgba(99, 102, 241, 0.6)');
        holdLabelGradient.addColorStop(1, 'rgba(139, 92, 246, 0.6)');

        ctx.fillStyle = holdLabelGradient;
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('HODL Returns', 110, 20);
    }, [projectedReturns, holdReturns]);

    const handleProtocolToggle = (protocolId: string) => {
        if (selectedProtocols.includes(protocolId)) {
            setSelectedProtocols(selectedProtocols.filter(id => id !== protocolId));
        } else {
            setSelectedProtocols([...selectedProtocols, protocolId]);
        }
    };

    const getReturnsDifference = () => {
        if (projectedReturns.length === 0 || holdReturns.length === 0) return 0;

        const strategyFinal = projectedReturns[projectedReturns.length - 1];
        const holdFinal = holdReturns[holdReturns.length - 1];

        return ((strategyFinal - holdFinal) / holdFinal) * 100;
    };

    return (
        <section ref={sectionRef} className="py-16 md:py-20 relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
            {/* Enhanced sophisticated background */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {/* Layered gradient orbs with enhanced styling */}
                <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-br from-indigo-50/30 via-violet-50/20 to-transparent rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4 animate-pulse-slow"></div>
                <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-to-tr from-orange-50/30 via-amber-50/20 to-transparent rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4 animate-pulse-slow-reverse"></div>

                {/* Enhanced blockchain network visualization */}
                <div className="absolute inset-0">
                    {/* Improved hexagonal pattern for blockchain representation */}
                    <div className="absolute w-full h-full opacity-[0.03]"
                        style={{
                            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 0l25.98 15v30L30 60 4.02 45V15L30 0zm-5.98 10l-15 8.66v17.32l15 8.66 15-8.66V18.66l-15-8.66z\' fill=\'%234f46e5\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
                            backgroundSize: '60px 60px'
                        }}>
                    </div>

                    {/* Enhanced connection rings */}
                    <div className="hidden lg:block">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className="absolute rounded-full border opacity-[0.07]"
                                style={{
                                    top: '50%',
                                    left: '50%',
                                    width: `${400 + i * 200}px`,
                                    height: `${400 + i * 200}px`,
                                    marginTop: `-${(400 + i * 200) / 2}px`,
                                    marginLeft: `-${(400 + i * 200) / 2}px`,
                                    borderWidth: '1px',
                                    borderColor: i % 2 === 0 ? '#818cf8' : '#c084fc',
                                    transform: `rotate(${i * 15}deg)`,
                                    animation: `spin-slow-${i % 2 === 0 ? 'normal' : 'reverse'} ${70 + i * 20}s linear infinite`
                                }}
                            ></div>
                        ))}
                    </div>

                    {/* Enhanced animated nodes */}
                    {Array.from({ length: 12 }).map((_, i) => {
                        const size = 2 + Math.random() * 3;
                        return (
                            <div
                                key={i}
                                className="absolute rounded-full"
                                style={{
                                    width: `${size}px`,
                                    height: `${size}px`,
                                    top: `${5 + Math.random() * 90}%`,
                                    left: `${5 + Math.random() * 90}%`,
                                    background: i % 3 === 0
                                        ? 'rgba(79, 70, 229, 0.5)'
                                        : i % 3 === 1
                                            ? 'rgba(139, 92, 246, 0.5)'
                                            : 'rgba(249, 115, 22, 0.5)',
                                    boxShadow: '0 0 8px rgba(79, 70, 229, 0.6)',
                                    animation: `float-node ${5 + Math.random() * 10}s ease-in-out infinite alternate ${Math.random() * 5}s`
                                }}
                            ></div>
                        );
                    })}

                    {/* Enhanced animated connectors */}
                    <svg className="absolute inset-0 w-full h-full">
                        <defs>
                            <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="rgba(79, 70, 229, 0.05)" />
                                <stop offset="50%" stopColor="rgba(139, 92, 246, 0.08)" />
                                <stop offset="100%" stopColor="rgba(79, 70, 229, 0.05)" />
                            </linearGradient>
                        </defs>
                        {Array.from({ length: 5 }).map((_, i) => {
                            const startX = Math.random() * 100;
                            const startY = Math.random() * 100;
                            const endX = Math.random() * 100;
                            const endY = Math.random() * 100;
                            const controlX1 = startX + Math.random() * 30 - 15;
                            const controlY1 = startY + Math.random() * 30 - 15;
                            const controlX2 = endX + Math.random() * 30 - 15;
                            const controlY2 = endY + Math.random() * 30 - 15;

                            return (
                                <path
                                    key={i}
                                    d={`M${startX},${startY} C${controlX1},${controlY1} ${controlX2},${controlY2} ${endX},${endY}`}
                                    fill="none"
                                    stroke="url(#connectionGradient)"
                                    strokeWidth="1"
                                    strokeDasharray="3,3"
                                    className="connection-line"
                                    style={{
                                        animation: `dash-animation ${10 + i * 5}s linear infinite ${i * 2}s`,
                                        opacity: 0.5
                                    }}
                                />
                            );
                        })}
                    </svg>
                </div>

                {/* Enhanced animation keyframes */}
                <style>{`
                    @keyframes pulse-slow {
                        0%, 100% { opacity: 0.2; }
                        50% { opacity: 0.4; }
                    }
                    
                    @keyframes pulse-slow-reverse {
                        0%, 100% { opacity: 0.4; }
                        50% { opacity: 0.2; }
                    }
                    
                    @keyframes float-node {
                        0% {
                            transform: translateY(0) scale(1);
                            opacity: 0.3;
                        }
                        50% {
                            transform: translateY(-10px) scale(1.3);
                            opacity: 0.7;
                        }
                        100% {
                            transform: translateY(5px) scale(1);
                            opacity: 0.3;
                        }
                    }
                    
                    @keyframes spin-slow-normal {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    
                    @keyframes spin-slow-reverse {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(-360deg); }
                    }
                    
                    @keyframes dash-animation {
                        to {
                            stroke-dashoffset: -100;
                        }
                    }
                    
                    .animate-pulse-slow {
                        animation: pulse-slow 15s ease-in-out infinite;
                    }
                    
                    .animate-pulse-slow-reverse {
                        animation: pulse-slow-reverse 15s ease-in-out infinite;
                    }
                    
                    .connection-line {
                        stroke-dasharray: 5, 5;
                    }
                `}</style>
            </div>

            <div className="container mx-auto px-4 lg:px-8 relative z-10">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-10 lg:mb-12">
                        <div className="inline-flex items-center justify-center px-4 py-1.5 mb-3 rounded-full bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 shadow-sm">
                            <Sparkles className="w-4 h-4 text-indigo-600 mr-2" />
                            <span className="text-indigo-700 font-medium text-sm">Strategy Builder</span>
                        </div>

                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Yield Strategy</span> Wizard
                        </h2>

                        <p className="text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
                            Maximize your sBTC returns with our powerful strategy builder. Choose a preset strategy or customize your own.
                        </p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm shadow-xl shadow-indigo-100/30 rounded-2xl border border-indigo-100/50 overflow-hidden">
                        <Tabs defaultValue="preset" value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <div className="px-4 md:px-6 lg:px-8 pt-6">
                                <TabsList className="w-full grid grid-cols-2 mb-6 bg-indigo-50/50 p-1 rounded-lg shadow-inner shadow-indigo-100/50">
                                    <TabsTrigger value="preset" className="text-sm md:text-base data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-violet-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200">Preset Strategies</TabsTrigger>
                                    <TabsTrigger value="custom" className="text-sm md:text-base data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-violet-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200">Custom Strategy</TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="px-4 md:px-6 lg:px-8 pb-6">
                                <TabsContent value="preset" className="mt-0">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                        {STRATEGIES.map((strategy) => (
                                            <div
                                                key={strategy.id}
                                                className={`relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 group ${selectedStrategy === strategy.id
                                                    ? `bg-gradient-to-br ${strategy.gradient} ${strategy.border} shadow-lg shadow-indigo-100`
                                                    : 'bg-white border border-gray-200 hover:border-indigo-200 hover:shadow-md shadow-sm'
                                                    }`}
                                                onClick={() => setSelectedStrategy(strategy.id)}
                                            >
                                                {/* Enhanced decorative top border */}
                                                <div className={`h-1 w-full bg-gradient-to-r ${selectedStrategy === strategy.id
                                                    ? 'from-indigo-500 to-violet-500'
                                                    : 'from-gray-200 to-gray-200 group-hover:from-indigo-300 group-hover:to-violet-300'
                                                    } transition-colors duration-300`}></div>

                                                <div className="p-4">
                                                    <div className="flex items-start">
                                                        <div className={`mr-3 ${strategy.color} bg-opacity-10 p-1.5 rounded-lg inline-block transform transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                                                            {strategy.icon}
                                                        </div>
                                                        <div>
                                                            <h3 className="text-base font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">{strategy.name}</h3>
                                                            <p className="text-xs text-gray-600 mt-0.5 group-hover:text-gray-700 transition-colors">{strategy.description}</p>
                                                        </div>
                                                    </div>

                                                    <div className="mt-3 flex justify-between items-center">
                                                        <div className="flex items-center">
                                                            <span className="text-xs text-gray-500 mr-2">Risk:</span>
                                                            <div className="flex space-x-0.5">
                                                                {[1, 2, 3, 4, 5].map((level) => (
                                                                    <div
                                                                        key={level}
                                                                        className={`w-4 h-1.5 rounded-full transition-all duration-300 ${level <= strategy.risk
                                                                            ? level <= 2
                                                                                ? 'bg-emerald-500'
                                                                                : level <= 4
                                                                                    ? 'bg-indigo-500'
                                                                                    : 'bg-orange-500'
                                                                            : 'bg-gray-200 group-hover:bg-gray-300'
                                                                            }`}
                                                                    ></div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <span className={`text-sm font-semibold ${strategy.color} group-hover:scale-110 transition-transform`}>{strategy.apy}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Strategy details - with enhanced styling */}
                                    {selectedStrategy && (
                                        <div className="bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-xl p-4 lg:p-5 border border-indigo-100/50 mb-6 shadow-sm backdrop-blur-sm">
                                            <div className="flex flex-col md:flex-row justify-between gap-5">
                                                <div className="md:w-1/2">
                                                    <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                                        <Clock className="w-3.5 h-3.5 mr-1.5 text-indigo-500" />
                                                        Included Protocols
                                                    </h5>
                                                    <ul className="grid grid-cols-1 gap-1.5">
                                                        {STRATEGIES.find(s => s.id === selectedStrategy)?.protocols.map((protocol, i) => (
                                                            <li key={i} className="flex items-center text-gray-600 text-sm group">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-1.5 group-hover:scale-125 transition-transform"></div>
                                                                <span className="group-hover:text-indigo-700 transition-colors">{protocol}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div className="md:w-1/2">
                                                    <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                                        <Info className="w-3.5 h-3.5 mr-1.5 text-indigo-500" />
                                                        Recommended For
                                                    </h5>
                                                    <p className="text-gray-600 text-sm mb-3">
                                                        {STRATEGIES.find(s => s.id === selectedStrategy)?.recommended}
                                                    </p>

                                                    <div className="bg-white/80 border border-indigo-100 rounded-lg p-3 shadow-sm">
                                                        <h5 className="text-xs font-medium text-indigo-700 mb-1.5 flex items-center">
                                                            <DollarSign className="w-3.5 h-3.5 mr-1 text-indigo-600" />
                                                            Simulated Annual Return
                                                        </h5>
                                                        <div className="text-gray-700 text-sm">
                                                            <span className="font-semibold">
                                                                0.5 sBTC
                                                            </span> could grow to approximately <span className="text-green-600 font-semibold">
                                                                {(investment * (1 + (parseFloat(STRATEGIES.find(s => s.id === selectedStrategy)?.apy.split('-')[1] || '6') / 100))).toFixed(3)} sBTC
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="custom" className="mt-0">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                                        <div className="bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-xl p-4 border border-indigo-100/50 shadow-sm backdrop-blur-sm">
                                            <h4 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                                                <Shield className="w-4 h-4 mr-1.5 text-indigo-600" />
                                                Risk Tolerance
                                            </h4>

                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600 text-sm">Conservative</span>
                                                    <span className="px-2 py-0.5 bg-gradient-to-r from-indigo-100 to-violet-100 rounded-full text-indigo-700 text-xs font-medium border border-indigo-200/50 shadow-sm">
                                                        Level {riskLevel[0]}/5
                                                    </span>
                                                    <span className="text-gray-600 text-sm">Aggressive</span>
                                                </div>

                                                <Slider
                                                    value={riskLevel}
                                                    min={1}
                                                    max={5}
                                                    step={1}
                                                    onValueChange={setRiskLevel}
                                                    className="w-full"
                                                />

                                                <div className="flex justify-between">
                                                    <div className="flex items-center">
                                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1.5 shadow-sm shadow-emerald-200"></div>
                                                        <span className="text-xs text-gray-500">Lower Risk</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className="w-2.5 h-2.5 rounded-full bg-orange-500 mr-1.5 shadow-sm shadow-orange-200"></div>
                                                        <span className="text-xs text-gray-500">Higher Potential Returns</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-xl p-4 border border-indigo-100/50 shadow-sm backdrop-blur-sm">
                                            <h4 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                                                <BarChart3 className="w-4 h-4 mr-1.5 text-indigo-600" />
                                                Select Protocols
                                            </h4>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {PROTOCOLS.map((protocol) => (
                                                    <div
                                                        key={protocol.id}
                                                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${selectedProtocols.includes(protocol.id)
                                                            ? 'border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50/50 shadow-sm shadow-indigo-100'
                                                            : 'border-gray-200 bg-white hover:border-indigo-100 shadow-sm'
                                                            }`}
                                                        onClick={() => handleProtocolToggle(protocol.id)}
                                                    >
                                                        <div className="flex items-center mb-1.5">
                                                            <div className="w-6 h-6 rounded-full bg-indigo-100 mr-2 flex items-center justify-center overflow-hidden border border-indigo-200">
                                                                <img src={protocol.logo} alt={protocol.name} className="w-full h-full object-cover" />
                                                            </div>
                                                            <div>
                                                                <h5 className="text-gray-900 font-medium text-sm">{protocol.name}</h5>
                                                                <div className="flex items-center">
                                                                    <span className="text-xs text-gray-500 mr-2">APY: <span className="text-green-600 font-medium">{protocol.apy}</span></span>
                                                                    <span className="text-xs text-gray-500">TVL: {protocol.tvl}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <p className="text-xs text-gray-600 mb-1.5 line-clamp-1">{protocol.description}</p>

                                                        <div className="flex items-center">
                                                            <span className="text-xs text-gray-500 mr-1.5">Risk:</span>
                                                            <div className="flex space-x-0.5">
                                                                {[1, 2, 3, 4, 5].map((level) => (
                                                                    <div
                                                                        key={level}
                                                                        className={`w-3 h-1 rounded-full transition-all duration-200 ${level <= protocol.risk
                                                                            ? level <= 2
                                                                                ? 'bg-emerald-500'
                                                                                : level <= 4
                                                                                    ? 'bg-indigo-500'
                                                                                    : 'bg-orange-500'
                                                                            : 'bg-gray-200'
                                                                            }`}
                                                                    ></div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* Investment simulator shared between tabs - with enhanced styling */}
                                <div className="bg-white border border-indigo-100 rounded-xl p-4 shadow-lg shadow-indigo-50/20 backdrop-blur-sm">
                                    <h4 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                                        <TrendingUp className="w-4 h-4 mr-1.5 text-indigo-600" />
                                        Returns Simulator
                                    </h4>

                                    <div className="grid md:grid-cols-3 gap-4 mb-5">
                                        <div className="col-span-1">
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="text-xs text-gray-700 mb-1.5 block">Investment Amount (sBTC)</label>
                                                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2 border border-indigo-200 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all duration-200 shadow-sm">
                                                        <input
                                                            type="number"
                                                            value={investment}
                                                            onChange={(e) => setInvestment(parseFloat(e.target.value) || 0)}
                                                            step="0.1"
                                                            min="0.1"
                                                            max="10"
                                                            className="w-full bg-transparent border-none text-gray-900 focus:outline-none text-base"
                                                        />
                                                        <span className="text-orange-600 font-medium text-sm">sBTC</span>
                                                    </div>
                                                </div>

                                                <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-lg p-3 border border-indigo-100 shadow-sm">
                                                    <h5 className="text-indigo-700 font-medium mb-2 text-xs flex items-center">
                                                        <Sparkles className="w-3 h-3 mr-1" />
                                                        Projected Outcome
                                                    </h5>
                                                    <div className="space-y-1.5">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-gray-700 text-xs">12-Month Yield:</span>
                                                            <span className="text-green-600 font-semibold text-xs">
                                                                {projectedReturns.length > 0 ?
                                                                    `+${((projectedReturns[projectedReturns.length - 1] - investment) / investment * 100).toFixed(2)}%` :
                                                                    '--'}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-gray-700 text-xs">vs. HODLing:</span>
                                                            <span className={`font-semibold text-xs ${getReturnsDifference() > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                                {getReturnsDifference() > 0 ? '+' : ''}{getReturnsDifference().toFixed(2)}%
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-gray-700 text-xs">Est. Final Value:</span>
                                                            <span className="text-gray-900 font-semibold text-xs">
                                                                {projectedReturns.length > 0 ?
                                                                    `${projectedReturns[projectedReturns.length - 1].toFixed(4)} sBTC` :
                                                                    '--'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-span-2">
                                            <div className="h-52 bg-white rounded-lg overflow-hidden border border-indigo-100 shadow-inner shadow-gray-50">
                                                <canvas
                                                    ref={chartRef}
                                                    className="w-full h-full"
                                                ></canvas>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Call to action and security note with enhanced styling */}
                                    <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3">
                                        <div className="flex items-center text-sm text-green-600 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full px-3 py-1 border border-green-100 shadow-sm">
                                            <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                                            Non-custodial with secure wallet signing
                                        </div>

                                        <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md shadow-indigo-500/20 rounded-lg px-5 py-2 transition-all hover:translate-y-[-2px]">
                                            Start Earning
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Tabs>
                    </div>
                </div>
            </div>
        </section>
    );
};