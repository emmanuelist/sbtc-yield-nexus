// import React from 'react';
// import { PieChart, Activity, TrendingUp, Info } from 'lucide-react';

// // Define TypeScript interfaces for props
// interface AllocationItem {
//     protocol: string;
//     percentage: number;
//     color: string;
// }

// interface PortfolioStatsType {
//     totalValue: number;
//     usdValue: number;
//     totalYield: number;
//     yieldPercentage: number;
//     dailyYield: number;
//     changePercentage: number;
//     riskScore: number;
// }

// interface PortfolioSummaryProps {
//     portfolioStats: PortfolioStatsType;
//     allocation: AllocationItem[];
// }

// const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ portfolioStats, allocation }) => {
//     return (
//         <div className="bg-white/90 backdrop-blur-sm border border-indigo-100 rounded-xl shadow-md shadow-indigo-100/20 p-6">
//             <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-lg font-semibold text-gray-900 flex items-center">
//                     <PieChart className="w-5 h-5 mr-2 text-indigo-600" />
//                     Portfolio Summary
//                 </h2>
//                 <button className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center">
//                     Detailed Analytics
//                 </button>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
//                 {/* Value Stats */}
//                 <div className="md:col-span-4 space-y-4">
//                     <div>
//                         <p className="text-sm text-gray-500 mb-1">Total sBTC Value</p>
//                         <div className="flex items-baseline">
//                             <h3 className="text-2xl font-bold text-gray-900">{portfolioStats.totalValue}</h3>
//                             <span className="ml-2 text-sm text-gray-500">sBTC</span>
//                         </div>
//                         <p className="text-xs text-gray-500">${portfolioStats.usdValue.toLocaleString()}</p>
//                     </div>

//                     <div>
//                         <p className="text-sm text-gray-500 mb-1">Total Yield Earned</p>
//                         <div className="flex items-baseline">
//                             <h3 className="text-xl font-semibold text-gray-900">{portfolioStats.totalYield}</h3>
//                             <span className="ml-2 text-sm text-gray-500">sBTC</span>
//                         </div>
//                         <p className="text-xs text-green-600 flex items-center">
//                             +{portfolioStats.yieldPercentage}% <Activity className="w-3 h-3 ml-1" />
//                         </p>
//                     </div>

//                     <div>
//                         <p className="text-sm text-gray-500 mb-1">Daily Yield</p>
//                         <div className="flex items-baseline">
//                             <h3 className="text-xl font-semibold text-gray-900">{portfolioStats.dailyYield}</h3>
//                             <span className="ml-2 text-sm text-gray-500">sBTC</span>
//                         </div>
//                         <p className="text-xs text-green-600 flex items-center">
//                             +{portfolioStats.changePercentage}% from avg <TrendingUp className="w-3 h-3 ml-1" />
//                         </p>
//                     </div>
//                 </div>

//                 {/* Chart - In a real app, replace with D3.js or Recharts implementation */}
//                 <div className="md:col-span-5 h-48 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-lg flex items-center justify-center">
//                     {/* This placeholder would be replaced with an actual chart component */}
//                     <span className="text-indigo-400 text-sm">Portfolio Performance Chart</span>
//                 </div>

//                 {/* Protocol Allocation */}
//                 <div className="md:col-span-3">
//                     <p className="text-sm text-gray-500 mb-3">Protocol Allocation</p>

//                     <div className="space-y-3">
//                         {allocation.map((item) => (
//                             <div key={item.protocol} className="flex items-center">
//                                 <div className={`w-3 h-3 rounded-full ${item.color} mr-2`}></div>
//                                 <span className="text-sm text-gray-700">{item.protocol}</span>
//                                 <span className="ml-auto text-sm font-medium">{item.percentage}%</span>
//                             </div>
//                         ))}
//                     </div>

//                     <div className="mt-4 pt-4 border-t border-gray-100">
//                         <div className="flex justify-between items-center">
//                             <span className="text-xs text-gray-500">Risk Score</span>
//                             <div className="flex items-center">
//                                 <span className="text-sm font-medium text-amber-600">{portfolioStats.riskScore}/5</span>
//                                 <Info className="w-3.5 h-3.5 text-gray-400 ml-1" />
//                             </div>
//                         </div>
//                         {/* Risk indicator */}
//                         <div className="w-full h-1.5 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
//                             <div
//                                 className="h-full bg-gradient-to-r from-green-500 via-amber-500 to-red-500 rounded-full"
//                                 style={{ width: `${(portfolioStats.riskScore / 5) * 100}%` }}
//                             ></div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between">
//                 <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center">
//                     Deposit sBTC
//                 </button>
//                 <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center">
//                     Rebalance Portfolio
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default PortfolioSummary;

import React, { useEffect, useRef } from 'react';
import { PieChart, Activity, TrendingUp, Info, Sparkles, Zap, ArrowUpRight, Plus, RefreshCw } from 'lucide-react';

// Define TypeScript interfaces for props
interface AllocationItem {
    protocol: string;
    percentage: number;
    color: string;
}

interface PortfolioStatsType {
    totalValue: number;
    usdValue: number;
    totalYield: number;
    yieldPercentage: number;
    dailyYield: number;
    changePercentage: number;
    riskScore: number;
}

interface PortfolioSummaryProps {
    portfolioStats: PortfolioStatsType;
    allocation: AllocationItem[];
}

const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ portfolioStats, allocation }) => {
    const chartCanvasRef = useRef<HTMLCanvasElement>(null);

    // Draw animated chart on canvas
    useEffect(() => {
        if (!chartCanvasRef.current) return;

        const ctx = chartCanvasRef.current.getContext('2d');
        if (!ctx) return;

        const canvas = chartCanvasRef.current;
        canvas.width = canvas.offsetWidth * 2;
        canvas.height = canvas.offsetHeight * 2;
        ctx.scale(2, 2); // For retina displays

        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;

        // Data points for the line chart (simulated historical performance)
        const dataPoints = [60, 55, 70, 65, 80, 75, 90, 85, 95, 88, 100];

        // Animation variables
        let animationFrame: number;
        let progress = 0;

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Background grid
            ctx.strokeStyle = 'rgba(79, 70, 229, 0.05)';
            ctx.lineWidth = 0.5;

            // Vertical grid lines
            for (let i = 0; i < width; i += 20) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, height);
                ctx.stroke();
            }

            // Horizontal grid lines
            for (let i = 0; i < height; i += 20) {
                ctx.beginPath();
                ctx.moveTo(0, i);
                ctx.lineTo(width, i);
                ctx.stroke();
            }

            // Calculate points based on progress
            const points = [];
            const animatedPoints = Math.ceil(dataPoints.length * progress);

            for (let i = 0; i < animatedPoints; i++) {
                const x = (width / (dataPoints.length - 1)) * i;
                const y = height - (dataPoints[i] / 100) * height;
                points.push({ x, y });
            }

            // Draw gradient area under chart
            if (points.length > 1) {
                const gradient = ctx.createLinearGradient(0, 0, 0, height);
                gradient.addColorStop(0, 'rgba(79, 70, 229, 0.15)');
                gradient.addColorStop(1, 'rgba(79, 70, 229, 0)');

                ctx.beginPath();
                ctx.moveTo(points[0].x, height);

                // Add points to path
                for (let i = 0; i < points.length; i++) {
                    ctx.lineTo(points[i].x, points[i].y);
                }

                ctx.lineTo(points[points.length - 1].x, height);
                ctx.closePath();
                ctx.fillStyle = gradient;
                ctx.fill();
            }

            // Draw chart line
            if (points.length > 1) {
                ctx.beginPath();
                ctx.moveTo(points[0].x, points[0].y);

                // Create smooth curve
                for (let i = 1; i < points.length - 1; i++) {
                    const xc = (points[i].x + points[i + 1].x) / 2;
                    const yc = (points[i].y + points[i + 1].y) / 2;
                    ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
                }

                if (points.length > 1) {
                    ctx.quadraticCurveTo(
                        points[points.length - 1].x,
                        points[points.length - 1].y,
                        points[points.length - 1].x,
                        points[points.length - 1].y
                    );
                }

                ctx.strokeStyle = 'rgba(79, 70, 229, 0.8)';
                ctx.lineWidth = 1.5;
                ctx.stroke();

                // Draw points
                for (let i = 0; i < points.length; i++) {
                    ctx.beginPath();
                    ctx.arc(points[i].x, points[i].y, 2, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(79, 70, 229, 0.8)';
                    ctx.fill();

                    // Draw glowing point at the end
                    if (i === points.length - 1) {
                        ctx.beginPath();
                        ctx.arc(points[i].x, points[i].y, 4, 0, Math.PI * 2);
                        ctx.fillStyle = 'rgba(79, 70, 229, 0.3)';
                        ctx.fill();

                        ctx.beginPath();
                        ctx.arc(points[i].x, points[i].y, 2, 0, Math.PI * 2);
                        ctx.fillStyle = '#4f46e5';
                        ctx.fill();
                    }
                }
            }

            // Update progress
            if (progress < 1) {
                progress += 0.02;
                animationFrame = requestAnimationFrame(animate);
            }
        };

        // Start animation
        animate();

        // Cleanup
        return () => {
            cancelAnimationFrame(animationFrame);
        };
    }, []);

    return (
        <div className="bg-white/90 backdrop-blur-sm border border-indigo-100 rounded-xl shadow-md shadow-indigo-100/20 p-6 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 opacity-5 z-0">
                {/* Bitcoin symbol */}
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <path d="M63.0391 39.741C59.4702 56.8992 42.8242 67.9352 25.6621 64.3633C8.50488 60.7944 -2.53711 44.1484 1.0347 26.9863C4.60059 9.8291 21.2466 -1.20996 38.4087 2.36621C55.5669 5.93506 66.608 22.5781 63.0391 39.741Z" fill="url(#paint0_linear)" fillOpacity="0.2" />
                    <path d="M46.5235 27.8477C46.9766 23.5215 43.6524 21.3164 39.1954 19.877L40.272 15.3584L37.5469 14.7334L36.5078 19.084C35.752 18.9072 34.9727 18.7363 34.1992 18.5684L35.2471 14.1826L32.522 13.5576L31.4454 18.0762C30.8145 17.9404 30.1953 17.8047 29.5938 17.665L29.5997 17.6357L25.8672 16.7949L25.2041 19.6934C25.2041 19.6934 27.2412 20.1318 27.1934 20.1611C28.3946 20.4383 28.6123 21.252 28.5752 21.9004L27.3506 27.0566C27.4454 27.0801 27.5669 27.1123 27.6997 27.1651C27.5903 27.1387 27.4747 27.1123 27.3565 27.0859L25.6748 34.4355C25.5303 34.792 25.1528 35.3262 24.3496 35.1347C24.3789 35.1757 22.3535 34.6611 22.3535 34.6611L21.1231 37.7744L24.6328 38.5654C25.3272 38.7275 26.0069 38.8955 26.6748 39.0518L25.5879 43.6289L28.3071 44.2539L29.3838 39.7354C30.1689 39.9355 30.9307 40.1211 31.6719 40.2949L30.6011 44.7959L33.3262 45.4209L34.4131 40.8525C40.4951 42.0303 45.0225 41.5869 46.9063 36.1289C48.4268 31.7471 46.7334 29.335 43.4736 27.7794C45.8887 27.209 47.6416 25.5215 46.5235 27.8477ZM39.6982 34.4443C38.6113 38.8262 31.6191 36.5449 29.4844 36.0127L30.9541 29.7637C33.0887 30.2988 40.8292 29.8975 39.6982 34.4443ZM41.7803 27.7881C40.7989 31.7881 35.0342 29.8584 33.2666 29.4131L34.5996 23.752C36.3672 24.1973 42.8008 23.6279 41.7803 27.7881Z" fill="#4f46e5" />
                    <defs>
                        <linearGradient id="paint0_linear" x1="32.0347" y1="2" x2="32.0347" y2="64.6992" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#4f46e5" />
                            <stop offset="1" stopColor="#4f46e5" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-4 relative">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <PieChart className="w-5 h-5 mr-2 text-indigo-600" />
                    Portfolio Summary
                    <div className="ml-2 bg-indigo-100 w-5 h-5 rounded-full flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-indigo-600" />
                    </div>
                </h2>
                <div className="flex items-center space-x-3">
                    <div className="bg-green-100 px-3 py-1 rounded-full text-green-600 text-xs font-medium flex items-center">
                        <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
                        +{portfolioStats.changePercentage}% Today
                    </div>
                    <button className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center">
                        Detailed Analytics
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Value Stats */}
                <div className="md:col-span-4 space-y-4">
                    <div className="p-4 bg-gradient-to-r from-indigo-50/50 to-white rounded-lg border border-indigo-100/70 shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">Total sBTC Value</p>
                        <div className="flex items-baseline">
                            <h3 className="text-2xl font-bold text-gray-900">{portfolioStats.totalValue}</h3>
                            <span className="ml-2 text-sm text-gray-500">sBTC</span>
                        </div>
                        <p className="text-xs text-gray-500">${portfolioStats.usdValue.toLocaleString()}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-gradient-to-r from-green-50/50 to-white rounded-lg border border-green-100/50 shadow-sm">
                            <p className="text-xs text-gray-500 mb-1">Current APY</p>
                            <p className="text-lg font-bold text-green-600 flex items-center">
                                {portfolioStats.yieldPercentage}%
                                <Zap className="ml-1 h-3.5 w-3.5 text-green-500" />
                            </p>
                        </div>

                        <div className="p-3 bg-gradient-to-r from-amber-50/30 to-white rounded-lg border border-amber-100/50 shadow-sm">
                            <p className="text-xs text-gray-500 mb-1">Risk Score</p>
                            <p className="text-lg font-bold text-amber-600">{portfolioStats.riskScore}/5</p>
                            <div className="mt-1 flex space-x-0.5">
                                {[1, 2, 3, 4, 5].map((level) => (
                                    <div
                                        key={level}
                                        className={`w-4 h-1.5 rounded-full ${level <= portfolioStats.riskScore ? 'bg-amber-500' : 'bg-gray-200'}`}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-3 bg-gradient-to-r from-indigo-50/30 to-white rounded-lg border border-indigo-100/50 shadow-sm">
                        <p className="text-xs text-gray-500 mb-1">Daily Yield</p>
                        <div className="flex items-baseline">
                            <h3 className="text-lg font-semibold text-gray-900">{portfolioStats.dailyYield}</h3>
                            <span className="ml-2 text-xs text-gray-500">sBTC</span>
                        </div>
                        <p className="text-xs text-green-600 flex items-center">
                            +{portfolioStats.changePercentage}% from avg
                            <ArrowUpRight className="w-3 h-3 ml-1 text-green-600" />
                        </p>
                    </div>
                </div>

                {/* Chart - Animated canvas chart */}
                <div className="md:col-span-5 bg-gradient-to-r from-indigo-50/70 to-violet-50/50 rounded-lg shadow-sm border border-indigo-100/70 overflow-hidden">
                    <div className="p-3 h-full relative">
                        <div className="absolute top-3 left-3 flex items-center space-x-1">
                            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                            <span className="text-xs text-indigo-700">7-Day Performance</span>
                        </div>
                        <canvas ref={chartCanvasRef} className="w-full h-full"></canvas>
                        <div className="absolute bottom-2 right-3">
                            <div className="text-xs text-gray-700 flex items-center">
                                <span className="text-green-600 font-medium">+{portfolioStats.totalYield} sBTC</span>
                                <ArrowUpRight className="ml-1 h-3 w-3 text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Protocol Allocation */}
                <div className="md:col-span-3">
                    <div className="p-4 bg-gradient-to-r from-violet-50/30 to-white rounded-lg border border-violet-100/50 shadow-sm h-full">
                        <p className="text-sm text-gray-700 mb-3 font-medium">Protocol Allocation</p>

                        <div className="space-y-3">
                            {allocation.map((item) => (
                                <div key={item.protocol} className="flex items-center">
                                    <div className={`w-3 h-3 rounded-full ${item.color} mr-2`}></div>
                                    <span className="text-sm text-gray-700">{item.protocol}</span>
                                    <span className="ml-auto text-sm font-medium">{item.percentage}%</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 pt-3 border-t border-indigo-100/50">
                            <div className="flex flex-col space-y-2">
                                {allocation.map((item) => (
                                    <div key={`bar-${item.protocol}`} className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                        <div
                                            className={`h-full ${item.color}`}
                                            style={{ width: `${item.percentage}%`, transition: 'width 1s ease-out' }}
                                        ></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between">
                <button className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700 rounded-lg text-sm font-medium border border-indigo-100 shadow-sm hover:shadow-md transition-all">
                    <Plus className="w-4 h-4 mr-1.5" />
                    Deposit sBTC
                </button>
                <button className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg hover:translate-y-[-1px] transition-all">
                    <RefreshCw className="w-4 h-4 mr-1.5" />
                    Rebalance Portfolio
                </button>
            </div>

            <style>{`
        @keyframes grow-bar {
          from { width: 0; }
          to { width: 100%; }
        }
      `}</style>
        </div>
    );
};

export default PortfolioSummary;