import React, { useEffect, useState } from 'react';
import { ArrowRight, Zap, Shield, BarChart3 } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import {
    authenticate,
    getUserData,
    signUserOut,
    userSession,
} from '@/lib/auth';
import { UserData } from '@/lib/type';
import toast from 'react-hot-toast';

export const CTASection: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [_userData, setUserData] = useState<UserData | null>(null);

    const { walletAddress, setWalletAddress, setCurrentPage, setWalletConnected } = useAppContext();

    useEffect(() => {
        const checkAuth = async () => {
            if (userSession.isSignInPending()) {
                const userData = await userSession.handlePendingSignIn();
                setIsAuthenticated(true);
                setUserData(userData);
                setWalletAddress(userData?.profile?.stxAddress?.testnet ?? null);
                setWalletConnected(true);
                toast.success("Wallet connected successfully");
            } else if (userSession.isUserSignedIn()) {
                const userData = getUserData();
                setIsAuthenticated(true);
                setUserData(userData);
                setWalletAddress(userData?.profile?.stxAddress?.testnet ?? null);
                setWalletConnected(true);
            }
        };

        checkAuth();
    }, []);

    const handleAuth = () => {
        if (isAuthenticated) {
            signUserOut();
            setWalletAddress(null);
            setIsAuthenticated(false);
            setWalletConnected(false);
            toast.success("Wallet disconnected successfully");
        } else {
            authenticate();
        }
    };

    const navigateToDashboard = () => {
        if (isAuthenticated) {
            setCurrentPage('dashboard');
        } else {
            toast.error("Please connect your wallet to access the dashboard");
        }
    };

    return (
        <div className="relative overflow-hidden bg-gradient-to-b from-gray-50 via-indigo-50/30 to-white py-16">
            {/* Enhanced background elements */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-300 via-indigo-200/40 to-transparent"></div>

                {/* Enhanced pattern background */}
                <div className="absolute inset-0 opacity-[0.05]" style={{
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15L30 0zm-5.98 10l-15 8.66v17.32l15 8.66 15-8.66V18.66l-15-8.66z' fill='%234f46e5' fill-opacity='0.6' fill-rule='evenodd'/%3E%3C/svg%3E\")",
                    backgroundSize: "60px 60px"
                }}></div>

                {/* Accent lines with subtle animation */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>
                <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    {/* Main container with enhanced styling */}
                    <div className="bg-white/90 backdrop-blur-sm border border-indigo-100 rounded-xl shadow-xl shadow-indigo-200/50">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 p-6 md:p-8">
                            {/* Content */}
                            <div className="md:col-span-3 flex flex-col justify-center">
                                <div className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-medium mb-4 self-start rounded-full shadow-sm">
                                    <Zap className="w-3.5 h-3.5 mr-1.5" />
                                    {isAuthenticated ? 'Ready to Optimize' : 'Start Optimizing'}
                                </div>

                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                                    Maximize Your Bitcoin Returns with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">sBTC Yield Nexus</span>
                                </h2>

                                <p className="text-gray-600 mb-5 sm:mb-6 text-sm sm:text-base">
                                    Join thousands of users already earning optimal yields across multiple Stacks protocols with our advanced platform. Setup takes less than 2 minutes.
                                </p>

                                <div className="flex flex-wrap gap-3 sm:gap-4">
                                    <button
                                        onClick={handleAuth}
                                        className="group px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-medium transition-all transform hover:translate-y-[-2px] hover:shadow-lg shadow-md shadow-indigo-300/50 rounded-lg text-sm sm:text-base ring-2 ring-indigo-600/10 ring-offset-2 ring-offset-white/80"
                                    >
                                        {isAuthenticated ? 'Disconnect Wallet' : 'Connect Wallet'}
                                        <ArrowRight className="inline-block ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </button>

                                    <button
                                        onClick={navigateToDashboard}
                                        className={`px-4 sm:px-5 py-2 sm:py-2.5 font-medium transition-all transform hover:translate-y-[-2px] hover:shadow-md rounded-lg text-sm sm:text-base ${isAuthenticated
                                                ? 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border border-amber-200 shadow-sm'
                                                : 'bg-white hover:bg-gray-50 text-indigo-700 border border-indigo-200'
                                            }`}
                                    >
                                        {isAuthenticated ? 'Go to Dashboard' : 'View Dashboard Demo'}
                                    </button>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="md:col-span-2 flex flex-col justify-center mt-6 md:mt-0">
                                <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 p-4 sm:p-5 rounded-lg shadow-md shadow-indigo-100/50">
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Platform Highlights</h3>

                                    <ul className="space-y-3">
                                        <li className="flex items-start group">
                                            <div className="shrink-0 pt-0.5">
                                                <div className="w-5 h-5 bg-indigo-100 group-hover:bg-indigo-200 flex items-center justify-center rounded-md shadow-sm transition-colors duration-200">
                                                    <Shield className="w-3 h-3 text-indigo-600" />
                                                </div>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-gray-700 text-xs sm:text-sm">Non-custodial security with complete asset control</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start group">
                                            <div className="shrink-0 pt-0.5">
                                                <div className="w-5 h-5 bg-violet-100 group-hover:bg-violet-200 flex items-center justify-center rounded-md shadow-sm transition-colors duration-200">
                                                    <Zap className="w-3 h-3 text-violet-600" />
                                                </div>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-gray-700 text-xs sm:text-sm">Automated yield optimization across multiple protocols</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start group">
                                            <div className="shrink-0 pt-0.5">
                                                <div className="w-5 h-5 bg-indigo-100 group-hover:bg-indigo-200 flex items-center justify-center rounded-md shadow-sm transition-colors duration-200">
                                                    <BarChart3 className="w-3 h-3 text-indigo-600" />
                                                </div>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-gray-700 text-xs sm:text-sm">Real-time analytics and performance tracking</p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                {isAuthenticated && (
                                    <div className="mt-4 bg-green-50 border border-green-100 rounded-lg p-3 shadow-sm">
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                                            <p className="text-green-800 text-xs">Wallet Connected: <span className="font-medium">{walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}</span></p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CTASection;