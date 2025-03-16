import { useEffect, useState, } from 'react';
import { ArrowRight, Sparkles, Shield, BarChart3, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAppContext } from '@/context/AppContext';
import {
  authenticate,
  getUserData,
  signUserOut,
  userSession,
} from '@/lib/auth';
import { UserData } from '@/lib/type';
import { StrategyWizard } from '@/components/Landing/StrategyWizard';
import { PortfolioSummary } from '@/components/Landing/PortfolioSummary';

interface HeroSectionProps { }

export const HeroSection: React.FC<HeroSectionProps> = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [_userData, setUserData] = useState<UserData | null>(null);
  const [isStrategyWizardOpen, setIsStrategyWizardOpen] = useState<boolean>(false);

  const { setWalletAddress, setWalletConnected, setCurrentPage } = useAppContext();

  useEffect(() => {
    const checkAuth = async () => {
      if (userSession.isSignInPending()) {
        const userData = await userSession.handlePendingSignIn();
        setIsAuthenticated(true);
        setUserData(userData);
        setWalletAddress(userData?.profile?.stxAddress?.testnet ?? null);
        setWalletConnected(true);
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
      toast.success("Successfully disconnected wallet");
    } else {
      authenticate();
    }
  };

  const handleExploreYield = () => {
    if (isAuthenticated) {
      setIsStrategyWizardOpen(true);
    } else {
      toast.error("Please connect your wallet to explore yield strategies");
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-gray-900 via-violet-950 to-purple-950">
      {/* Ultra-sophisticated web3 Bitcoin background with advanced animations */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Bitcoin network nodes and connections animation */}
        <div className="absolute inset-0">
          {/* Animated Bitcoin symbols and node network - created with CSS */}
          <div className="bitcoin-network">
            {Array.from({ length: 20 }).map((_, index) => (
              <div
                key={index}
                className="bitcoin-node"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${15 + Math.random() * 15}s`
                }}
              >
                <div className="node-pulse"></div>
              </div>
            ))}
          </div>

          {/* Digital connection lines */}
          <div className="network-connections">
            {Array.from({ length: 15 }).map((_, index) => (
              <div
                key={index}
                className="connection-line"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${100 + Math.random() * 200}px`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${5 + Math.random() * 10}s`
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Glowing blockchain representation */}
        <div className="absolute inset-0 blockchain-visualization">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="block"
              style={{
                left: `${index * 10}%`,
                animationDelay: `${index * 0.5}s`
              }}
            ></div>
          ))}
        </div>

        {/* Bitcoin price visualization wave */}
        <div className="bitcoin-chart-wave absolute bottom-0 left-0 right-0 h-32 opacity-20"></div>

        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-radial opacity-30"></div>

        {/* Web3 data particles */}
        <div className="data-particles">
          {Array.from({ length: 30 }).map((_, index) => (
            <div
              key={index}
              className="data-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${20 + Math.random() * 20}s`,
                opacity: 0.1 + Math.random() * 0.5
              }}
            ></div>
          ))}
        </div>

        {/* DeFi yield curve visualization */}
        <div className="yield-curve absolute opacity-20"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="grid lg:grid-cols-2 gap-8 items-center justify-center">
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-4">
              <Zap className="w-4 h-4 mr-2" />
              Maximize Your Bitcoin Yield
            </div>

            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight">
              <span className="text-transparent bg-gradient-to-r from-orange-300 to-amber-300 bg-clip-text">
                Unlock the Power
              </span>
              <br />
              <span className="text-white/90">
                of sBTC DeFi Strategies
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300/90 text-justify max-w-xl">
              Seamlessly manage Bitcoin-based DeFi activities across Stacks protocols with our intuitive platform designed for all user levels - from beginners to institutional investors.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {isAuthenticated ? (
                <>
                  <Button
                    onClick={() => setCurrentPage('dashboard')}
                    className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-6 rounded-xl text-lg shadow-lg shadow-indigo-500/25"
                  >
                    <BarChart3 className="mr-2 h-5 w-5" />
                    View Dashboard
                  </Button>
                  <Button
                    onClick={handleExploreYield}
                    className="bg-violet-500/90 text-white px-8 py-6 rounded-xl text-lg shadow-lg shadow-violet-500/25"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Explore Yield Strategies
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleAuth}
                  className="group bg-gradient-to-r from-orange-600 to-amber-600 text-white px-8 py-6 rounded-xl text-lg hover:opacity-90 transform hover:scale-105 transition-all duration-200 shadow-lg shadow-indigo-500/25"
                >
                  Connect Wallet
                  <ArrowRight className="ml-2 h-5 w-5 inline-block group-hover:translate-x-1 transition-transform" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 justify-center items-center gap-6 mt-8">
              <div className="flex items-center justify-center space-x-3 bg-white/5 p-3 rounded-lg backdrop-blur-sm">
                <BarChart3 className="h-5 w-5 text-orange-300" />
                <span className="text-gray-200 sm:text-sm md:text-lg text-xs">Up to 12% APY</span>
              </div>
              <div className="flex items-center justify-center space-x-3 bg-white/5 p-3 rounded-lg backdrop-blur-sm">
                <Zap className="h-5 w-5 text-orange-300" />
                <span className="text-gray-200 sm:text-sm md:text-lg text-xs">Auto-Optimize</span>
              </div>
              <div className="flex items-center justify-center space-x-3 bg-white/5 p-3 rounded-lg backdrop-blur-sm">
                <Shield className="h-5 w-5 text-orange-300" />
                <span className="text-gray-200 sm:text-sm md:text-lg text-xs">Non-Custodial</span>
              </div>
            </div>
          </div>

          <div className="relative block">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-violet-500/20 rounded-3xl transform rotate-3 animate-pulse" />
            <div className="relative bg-white/10 backdrop-blur-lg p-5 rounded-3xl shadow-2xl border border-white/10">
              <PortfolioSummary />
            </div>
          </div>
        </div>
      </div>

      {/* Strategy Wizard Dialog */}
      <Dialog open={isStrategyWizardOpen} onOpenChange={setIsStrategyWizardOpen}>
        <DialogContent className="sm:max-w-4xl">
          <StrategyWizard onClose={() => setIsStrategyWizardOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HeroSection;