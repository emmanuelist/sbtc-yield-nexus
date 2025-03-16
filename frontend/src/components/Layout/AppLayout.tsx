import React from 'react';
import { useAppContext } from '../../context/AppContext';
import Navbar from '../Navigation/Header';
import { Dashboard } from '@/pages/Dashboard';
import { HomePage } from '@/pages/HomePage';

export const AppLayout: React.FC = () => {
    const { currentPage } = useAppContext();

    if (currentPage === 'home') {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <main className="pt-16">
                    <HomePage />
                </main>
            </div>
        );
    }

    // const renderPage = () => {
    //     switch (currentPage) {
    //         case 'dashboard':
    //             return <Dashboard />;
    //         case 'history':
    //             return <History />;
    //         case 'rewards':
    //             return <Rewards />;
    //         case 'settings':
    //             return <Settings />;
    //         default:
    //             return <Dashboard />;
    //     }
    // };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="pt-16">
                <Dashboard />
                {/* <div className="p-6">
                    {renderPage()}
                </div> */}
            </main>
        </div>
    );
};