import React, { useState } from 'react';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import { useLocation } from 'wouter';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar (desktop) */}
      <Sidebar />
      
      {/* Main content area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile header */}
        <MobileNav 
          isOpen={mobileMenuOpen} 
          toggleMenu={toggleMobileMenu} 
          currentPath={location}
        />
        
        {/* Page content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
          <div className="animate-fadeIn">
            {children}
          </div>
        </div>
        
        {/* Mobile bottom navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-card border-t border-border flex justify-around p-2">
          <a href="/" className={`flex flex-col items-center p-2 ${location === '/' ? 'text-primary dark:text-primary' : 'text-muted-foreground'}`}>
            <i className="fas fa-home text-lg"></i>
            <span className="text-xs mt-1">Home</span>
          </a>
          <a href="/journal" className={`flex flex-col items-center p-2 ${location === '/journal' ? 'text-primary dark:text-primary' : 'text-muted-foreground'}`}>
            <i className="fas fa-book text-lg"></i>
            <span className="text-xs mt-1">Journal</span>
          </a>
          <a href="/chat" className={`flex flex-col items-center p-2 ${location === '/chat' ? 'text-primary dark:text-primary' : 'text-muted-foreground'}`}>
            <i className="fas fa-comment-dots text-lg"></i>
            <span className="text-xs mt-1">Chat</span>
          </a>
          <a href="/mood" className={`flex flex-col items-center p-2 ${location === '/mood' ? 'text-primary dark:text-primary' : 'text-muted-foreground'}`}>
            <i className="fas fa-smile text-lg"></i>
            <span className="text-xs mt-1">Mood</span>
          </a>
          <a href="/mental-peace" className={`flex flex-col items-center p-2 ${location === '/mental-peace' ? 'text-primary dark:text-primary' : 'text-muted-foreground'}`}>
            <i className="fas fa-om text-lg"></i>
            <span className="text-xs mt-1">Peace</span>
          </a>
        </div>
      </main>
    </div>
  );
};

export default Layout;
