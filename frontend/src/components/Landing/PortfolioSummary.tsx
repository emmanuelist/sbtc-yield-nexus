import React, { useEffect, useRef } from 'react';
import { Sparkles, TrendingUp, ArrowUpRight, Zap } from 'lucide-react';

export const PortfolioSummary: React.FC = () => {
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
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
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
                gradient.addColorStop(0, 'rgba(249, 115, 22, 0.2)');
                gradient.addColorStop(1, 'rgba(249, 115, 22, 0)');

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

                ctx.strokeStyle = 'rgba(249, 115, 22, 0.8)';
                ctx.lineWidth = 1.5;
                ctx.stroke();

                // Draw points
                for (let i = 0; i < points.length; i++) {
                    ctx.beginPath();
                    ctx.arc(points[i].x, points[i].y, 2, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(249, 115, 22, 0.8)';
                    ctx.fill();

                    // Draw glowing point at the end
                    if (i === points.length - 1) {
                        ctx.beginPath();
                        ctx.arc(points[i].x, points[i].y, 4, 0, Math.PI * 2);
                        ctx.fillStyle = 'rgba(249, 115, 22, 0.3)';
                        ctx.fill();

                        ctx.beginPath();
                        ctx.arc(points[i].x, points[i].y, 2, 0, Math.PI * 2);
                        ctx.fillStyle = '#f97316';
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
        <div className="relative space-y-5 z-10">
            {/* Bitcoin/Web3 decorative elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 opacity-10 z-0">
                {/* Bitcoin symbol */}
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <path d="M63.0391 39.741C59.4702 56.8992 42.8242 67.9352 25.6621 64.3633C8.50488 60.7944 -2.53711 44.1484 1.0347 26.9863C4.60059 9.8291 21.2466 -1.20996 38.4087 2.36621C55.5669 5.93506 66.608 22.5781 63.0391 39.741Z" fill="url(#paint0_linear)" fillOpacity="0.2" />
                    <path d="M46.5235 27.8477C46.9766 23.5215 43.6524 21.3164 39.1954 19.877L40.272 15.3584L37.5469 14.7334L36.5078 19.084C35.752 18.9072 34.9727 18.7363 34.1992 18.5684L35.2471 14.1826L32.522 13.5576L31.4454 18.0762C30.8145 17.9404 30.1953 17.8047 29.5938 17.665L29.5997 17.6357L25.8672 16.7949L25.2041 19.6934C25.2041 19.6934 27.2412 20.1318 27.1934 20.1611C28.3946 20.4383 28.6123 21.252 28.5752 21.9004L27.3506 27.0566C27.4454 27.0801 27.5669 27.1123 27.6997 27.1651C27.5903 27.1387 27.4747 27.1123 27.3565 27.0859L25.6748 34.4355C25.5303 34.792 25.1528 35.3262 24.3496 35.1347C24.3789 35.1757 22.3535 34.6611 22.3535 34.6611L21.1231 37.7744L24.6328 38.5654C25.3272 38.7275 26.0069 38.8955 26.6748 39.0518L25.5879 43.6289L28.3071 44.2539L29.3838 39.7354C30.1689 39.9355 30.9307 40.1211 31.6719 40.2949L30.6011 44.7959L33.3262 45.4209L34.4131 40.8525C40.4951 42.0303 45.0225 41.5869 46.9063 36.1289C48.4268 31.7471 46.7334 29.335 43.4736 27.7794C45.8887 27.209 47.6416 25.5215 46.5235 27.8477ZM39.6982 34.4443C38.6113 38.8262 31.6191 36.5449 29.4844 36.0127L30.9541 29.7637C33.0887 30.2988 40.8292 29.8975 39.6982 34.4443ZM41.7803 27.7881C40.7989 31.7881 35.0342 29.8584 33.2666 29.4131L34.5996 23.752C36.3672 24.1973 42.8008 23.6279 41.7803 27.7881Z" fill="#F7931A" />
                    <defs>
                        <linearGradient id="paint0_linear" x1="32.0347" y1="2" x2="32.0347" y2="64.6992" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#F7931A" />
                            <stop offset="1" stopColor="#F7931A" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Digital network effect (connected points) */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="network-dots">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={i}
                            className="network-dot"
                            style={{
                                top: `${20 + i * 15}%`,
                                left: `${10 + i * 20}%`,
                                animationDelay: `${i * 0.5}s`
                            }}
                        ></div>
                    ))}
                </div>
            </div>

            {/* Header with performance indicator */}
            <div className="flex justify-between items-center mb-2 relative">
                <h3 className="text-lg font-semibold text-white flex items-center">
                    Portfolio Summary
                    <div className="ml-2 bg-indigo-500/10 w-5 h-5 rounded-full flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-indigo-400" />
                    </div>
                </h3>
                <div className="bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full text-green-400 text-sm font-medium flex items-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-green-500/5 rounded-full pulse-subtle"></div>
                    <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
                    +4.2% Today
                </div>
            </div>

            {/* Main summary content */}
            <div className="grid grid-cols-3 gap-x-4 gap-y-5">
                {/* Asset Balance - Main Value */}
                <div className="col-span-1 bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 flex flex-col justify-center items-center py-3 relative group">
                    <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Sparkles className="h-4 w-4 text-orange-400 mb-1" />
                    <p className="text-2xl font-bold text-white">0.842</p>
                    <p className="text-xs text-gray-400">sBTC Balance</p>
                </div>

                {/* Net APY */}
                <div className="col-span-1 bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 flex flex-col justify-center items-center py-3 relative">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500/0 via-green-500/30 to-green-500/0 glow-bar"></div>
                    </div>
                    <p className="text-xs text-gray-400 mb-1">Net APY</p>
                    <p className="text-lg font-bold text-green-400 flex items-center">
                        8.4% <Zap className="ml-1 h-3 w-3" />
                    </p>
                </div>

                {/* Risk Score */}
                <div className="col-span-1 bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 flex flex-col justify-center items-center py-3">
                    <p className="text-xs text-gray-400 mb-1">Risk Score</p>
                    <p className="text-lg font-bold text-orange-400">3/5</p>
                    <div className="mt-1 flex space-x-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                            <div
                                key={level}
                                className={`w-3 h-1 rounded-full ${level <= 3
                                    ? level <= 1
                                        ? 'bg-green-500'
                                        : level <= 2
                                            ? 'bg-green-400'
                                            : 'bg-orange-400'
                                    : 'bg-gray-700'
                                    }`}
                            ></div>
                        ))}
                    </div>
                </div>

                {/* Performance Chart (Canvas) */}
                <div className="col-span-3 bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 h-36 p-3 relative">
                    <div className="absolute top-3 left-3 flex items-center space-x-1">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-xs text-gray-400">7-Day Performance</span>
                    </div>
                    <canvas ref={chartCanvasRef} className="w-full h-full"></canvas>
                    <div className="absolute bottom-2 right-3">
                        <div className="text-xs text-gray-400 flex items-center">
                            <span className="text-green-400 font-medium">+0.018 sBTC</span>
                            <ArrowUpRight className="ml-1 h-3 w-3 text-green-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Protocol Allocation */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 p-3">
                <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium text-gray-300">Protocol Allocation</h4>
                    <span className="text-xs text-gray-400">4 protocols</span>
                </div>

                <div className="space-y-2">
                    {[
                        { name: 'ALEX', allocation: 40, color: 'bg-indigo-400' },
                        { name: 'Bitflow', allocation: 25, color: 'bg-violet-400' },
                        { name: 'Arkadiko', allocation: 20, color: 'bg-purple-300' },
                        { name: 'StackSwap', allocation: 15, color: 'bg-indigo-100' }
                    ].map((protocol, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${protocol.color}`}></div>
                            <div className="flex-1 flex items-center justify-between">
                                <span className="text-xs text-gray-300">{protocol.name}</span>
                                <span className="text-xs text-gray-400">{protocol.allocation}%</span>
                            </div>
                            <div className="w-full max-w-[100px] bg-gray-700 rounded-full h-1.5 overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${protocol.color.replace('bg-', 'bg-').replace('400', '500')}`}
                                    style={{ width: `${protocol.allocation}%`, animation: `grow-bar 1.5s ease-out ${index * 0.2}s` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-2">
                <button className="relative bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-lg py-2.5 px-4 text-center text-white text-xs font-medium overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-transform duration-700 group-hover:translate-x-full"></div>
                    Deposit
                </button>
                <button className="relative bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-lg py-2.5 px-4 text-center text-white text-xs font-medium overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-transform duration-700 group-hover:translate-x-full"></div>
                    Withdraw
                </button>
                <button className="relative bg-indigo-600/20 hover:bg-indigo-600/30 transition-colors border border-indigo-500/30 rounded-lg py-2.5 px-4 text-center text-indigo-300 text-xs font-medium overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-transform duration-700 group-hover:translate-x-full"></div>
                    Auto-Optimize
                </button>
            </div>

        </div>
    );
};

export default PortfolioSummary;