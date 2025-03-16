import { useEffect, useState } from 'react';
import { Bell, LogOut, Wallet, Zap, ArrowRight, BarChart3 } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import {
  authenticate,
  getUserData,
  signUserOut,
  userSession,
} from '@/lib/auth';
import { UserData } from '@/lib/type';
import toast from 'react-hot-toast';

export const Navbar = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { walletAddress, setWalletAddress, currentPage, setCurrentPage, setWalletConnected } = useAppContext();

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

    // Add scroll event listener
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
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

  const toggleDashboard = () => {
    setCurrentPage(currentPage === 'home' ? 'dashboard' : 'home');
  };

  const formatWalletAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className={`overflow-hidden fixed top-0 right-0 left-0 z-50 h-16 border-b border-indigo-100 transition-all duration-300 ${scrolled
      ? 'bg-white/95 backdrop-blur-md shadow-md'
      : 'bg-gradient-to-b from-gray-50 via-indigo-50/30 to-white'
      }`}>
      {/* Background Elements from CTA Section */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className={`absolute inset-0 ${scrolled ? 'opacity-20' : 'opacity-30'} bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-300 via-indigo-200/40 to-transparent`}></div>

        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15L30 0zm-5.98 10l-15 8.66v17.32l15 8.66 15-8.66V18.66l-15-8.66z' fill='%234f46e5' fill-opacity='0.6' fill-rule='evenodd'/%3E%3C/svg%3E\")",
          backgroundSize: "60px 60px"
        }}></div>

        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>
      </div>

      <div className="relative z-10 h-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Brand */}
        <div onClick={() => setCurrentPage("home")} className="flex items-center">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-lg shadow-md shadow-indigo-200/50">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <div className="text-lg font-bold relative group">
              <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-300 bg-clip-text text-transparent">
                sBTC <span className="font-light italic tracking-tight">Yield</span> Nexus
              </span>
              <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </div>
          </div>
        </div>

        {/* Dashboard Button - Shown for all devices when authenticated */}
        {isAuthenticated && (
          <div className="flex-shrink-0">
            <button
              onClick={toggleDashboard}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-all duration-200 text-sm ${currentPage === 'dashboard'
                ? 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 shadow-sm border border-amber-200/50'
                : 'text-gray-600 border-amber-500 rounded-3xl hover:text-amber-700 hover:bg-amber-50/70 border border-transparent'
                }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">{currentPage === 'dashboard' ? 'Dashboard' : 'View Dashboard'}</span>
              {currentPage !== 'dashboard' && (
                <ArrowRight className="ml-0.5 h-3.5 w-3.5 opacity-70 hidden sm:inline-block" />
              )}
            </button>
          </div>
        )}

        {/* Right Section - Notifications, Wallet Address, Connect Button */}
        <div className="flex items-center space-x-3">
          {/* Notification Bell - only when authenticated */}
          {isAuthenticated && (
            <button className="p-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 relative transition-colors shadow-sm">
              <Bell className="h-4 w-4 text-indigo-600" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-amber-500 rounded-full border border-white"></span>
            </button>
          )}

          {/* Wallet Address - only when authenticated and on medium screens and up */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-lg border border-indigo-100 shadow-sm">
              <Wallet className="h-3.5 w-3.5 text-indigo-600 mr-1.5" />
              <span className="text-xs font-medium text-gray-700">
                {formatWalletAddress(walletAddress || '')}
              </span>
            </div>
          )}

          {/* Connect/Disconnect Button */}
          <button
            onClick={handleAuth}
            className="group px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-sm font-medium rounded-lg shadow-md shadow-indigo-300/50 transition-all transform hover:translate-y-[-2px] flex items-center"
          >
            {isAuthenticated ? (
              <>
                <LogOut className="h-3.5 w-3.5 mr-1.5" />
                <span className="hidden sm:inline">Disconnect</span>
              </>
            ) : (
              <>
                <Wallet className="h-3.5 w-3.5 mr-1.5" />
                <span className="hidden sm:inline">Connect Wallet</span>
                <ArrowRight className="ml-1 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform hidden sm:inline-block" />
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;