import React, { useEffect, useRef } from 'react';
import { BarChart3, Gauge, Bell, FileText, Sparkles, Shield, PieChart, ArrowRight } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    // Animation effect for fluid background patterns
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            },
            { threshold: 0.1 }
        );

        const featureElements = document.querySelectorAll('.feature-card');
        featureElements.forEach(el => observer.observe(el));

        return () => {
            featureElements.forEach(el => observer.unobserve(el));
        };
    }, []);

    const features = [
        {
            title: 'Unified Dashboard',
            description: 'View your entire portfolio across all Stacks protocols with real-time metrics and intuitive visualizations.',
            icon: <BarChart3 className="h-10 w-10 p-1.5" />,
            gradient: 'from-indigo-100 to-violet-100',
            borderGradient: 'from-indigo-300 to-violet-300',
            iconColor: 'text-indigo-600',
            accent: 'indigo'
        },
        {
            title: 'Yield Strategy Wizard',
            description: 'Create, simulate, and deploy customized yield strategies with our sophisticated step-by-step guide.',
            icon: <Sparkles className="h-10 w-10 p-1.5" />,
            gradient: 'from-orange-100 to-amber-100',
            borderGradient: 'from-orange-300 to-amber-300',
            iconColor: 'text-orange-600',
            accent: 'orange'
        },
        {
            title: 'Real-Time Alerts',
            description: 'Stay informed with immediate on-chain notifications based on your personalized thresholds and preferences.',
            icon: <Bell className="h-10 w-10 p-1.5" />,
            gradient: 'from-green-100 to-emerald-100',
            borderGradient: 'from-green-300 to-emerald-300',
            iconColor: 'text-green-600',
            accent: 'green'
        },
        {
            title: 'Tax Reporting',
            description: 'Simplify crypto tax compliance with automated data aggregation and IRS-compatible export features.',
            icon: <FileText className="h-10 w-10 p-1.5" />,
            gradient: 'from-purple-100 to-pink-100',
            borderGradient: 'from-purple-300 to-pink-300',
            iconColor: 'text-purple-600',
            accent: 'purple'
        },
        {
            title: 'APY Optimization',
            description: 'Maximize returns with intelligent, risk-adjusted portfolio rebalancing based on market conditions.',
            icon: <Gauge className="h-10 w-10 p-1.5" />,
            gradient: 'from-blue-100 to-cyan-100',
            borderGradient: 'from-blue-300 to-cyan-300',
            iconColor: 'text-blue-600',
            accent: 'blue'
        },
        {
            title: 'Institutional Security',
            description: 'Enterprise-grade protection with non-custodial architecture and explicit transaction signing.',
            icon: <Shield className="h-10 w-10 p-1.5" />,
            gradient: 'from-red-100 to-rose-100',
            borderGradient: 'from-red-300 to-rose-300',
            iconColor: 'text-red-600',
            accent: 'red'
        }
    ];

    return (
        <section ref={sectionRef} className="py-20 relative overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100">
            {/* Enhanced background elements */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {/* Radial gradients */}
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-indigo-100/40 to-violet-100/40 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/4 animate-pulse-slow"></div>
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-orange-100/40 to-amber-100/40 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/4 animate-pulse-slow"></div>

                {/* Dynamic circular elements */}
                <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-indigo-600/5 rounded-full animate-float-slow"></div>
                <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-orange-600/5 rounded-full animate-float-medium"></div>
                <div className="absolute top-2/4 left-3/4 w-20 h-20 bg-green-600/5 rounded-full animate-float-fast"></div>

                {/* Connective lines - more sophisticated */}
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(79, 70, 229, 0.05)" />
                            <stop offset="50%" stopColor="rgba(139, 92, 246, 0.08)" />
                            <stop offset="100%" stopColor="rgba(79, 70, 229, 0.05)" />
                        </linearGradient>
                        <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(249, 115, 22, 0.05)" />
                            <stop offset="50%" stopColor="rgba(236, 72, 153, 0.08)" />
                            <stop offset="100%" stopColor="rgba(249, 115, 22, 0.05)" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M0,100 C150,200 250,0 500,100 C750,200 850,0 1000,100"
                        fill="none"
                        stroke="url(#lineGradient1)"
                        strokeWidth="2"
                        className="animate-wave-slow"
                    />
                    <path
                        d="M0,150 C150,50 250,250 500,150 C750,50 850,250 1000,150"
                        fill="none"
                        stroke="url(#lineGradient2)"
                        strokeWidth="2"
                        className="animate-wave-medium"
                    />
                </svg>

                {/* Dot matrix pattern */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'radial-gradient(circle, #4f46e5 1px, transparent 1px)',
                        backgroundSize: '24px 24px'
                    }}>
                </div>

                {/* Animation keyframes */}
                <style >{`
                    @keyframes pulse-slow {
                        0%, 100% { opacity: 0.4; }
                        50% { opacity: 0.6; }
                    }
                    
                    @keyframes float-slow {
                        0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
                        50% { transform: translateY(-20px) translateX(10px) rotate(5deg); }
                    }
                    
                    @keyframes float-medium {
                        0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
                        50% { transform: translateY(15px) translateX(-10px) rotate(-5deg); }
                    }
                    
                    @keyframes float-fast {
                        0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
                        50% { transform: translateY(-10px) translateX(-15px) rotate(10deg); }
                    }
                    
                    @keyframes wave-slow {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-100px); }
                    }
                    
                    @keyframes wave-medium {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(100px); }
                    }
                    
                    .animate-pulse-slow {
                        animation: pulse-slow 8s ease-in-out infinite;
                    }
                    
                    .animate-float-slow {
                        animation: float-slow 15s ease-in-out infinite;
                    }
                    
                    .animate-float-medium {
                        animation: float-medium 12s ease-in-out infinite;
                    }
                    
                    .animate-float-fast {
                        animation: float-fast 10s ease-in-out infinite;
                    }
                    
                    .animate-wave-slow {
                        animation: wave-slow 25s linear infinite;
                    }
                    
                    .animate-wave-medium {
                        animation: wave-medium 20s linear infinite;
                    }
                    
                    .feature-card {
                        opacity: 0;
                        transform: translateY(20px);
                        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
                    }
                    
                    .animate-in {
                        opacity: 1;
                        transform: translateY(0);
                    }
                `}</style>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center px-4 py-1.5 mb-4 rounded-full bg-indigo-50 border border-indigo-200 shadow-sm shadow-indigo-100/40">
                        <PieChart className="w-4 h-4 text-indigo-600 mr-2" />
                        <span className="text-indigo-700 font-medium text-sm">Advanced Features</span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                        Everything You Need for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Optimal Yield</span>
                    </h2>

                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Our platform offers a comprehensive suite of tools designed to optimize your sBTC yield while prioritizing security and user experience.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`feature-card relative group`}
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                            <div className="bg-white shadow-md hover:shadow-xl shadow-gray-200/50 rounded-xl relative z-10 h-full transform transition-all duration-300 group-hover:translate-y-[-3px] overflow-hidden flex flex-col">
                                {/* Decorative top border with animated gradient */}
                                <div className={`h-1 w-full bg-gradient-to-r ${feature.borderGradient} group-hover:animate-shimmer`}></div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-start mb-4">
                                        <div className={`${feature.iconColor} bg-${feature.accent}-50 rounded-lg p-2 mr-3 shadow-sm`}>
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mt-1.5">
                                            {feature.title}
                                        </h3>
                                    </div>

                                    <p className="text-gray-600 leading-relaxed text-sm flex-grow">{feature.description}</p>

                                    <div className={`mt-4 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-${feature.accent}-600 text-sm font-medium`}>
                                        <span className="inline-flex items-center">
                                            Learn more
                                            <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative corner accent */}
                            <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl ${feature.gradient} opacity-20 rounded-bl-full transform translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-300`}></div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <a href="#" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-md hover:shadow-lg shadow-indigo-500/20 transition-all duration-200">
                        Explore All Features
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;