import React from 'react';
import ThemeToggle from './ThemeToggle';

interface MobileNavProps {
  isOpen: boolean;
  toggleMenu: () => void;
  currentPath: string;
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpen, toggleMenu, currentPath }) => {
  return (
    <>
      {/* Mobile header */}
      <header className="md:hidden bg-background dark:bg-card shadow-sm border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-primary text-xl"><i className="fas fa-brain"></i></span>
          <h1 className="text-lg font-bold text-primary">MindMate AI</h1>
        </div>
        <button onClick={toggleMenu} className="text-muted-foreground">
          <i className="fas fa-bars"></i>
        </button>
      </header>
      
      {/* Mobile menu (hidden by default) */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} bg-background dark:bg-card shadow-lg border-b border-border`}>
        <nav className="p-4 space-y-1">
          <a 
            href="/" 
            className={`block p-2 rounded-lg ${
              currentPath === '/' 
                ? 'bg-primary/10 text-primary' 
                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            <i className="fas fa-home mr-2"></i> Home
          </a>
          <a 
            href="/journal" 
            className={`block p-2 rounded-lg ${
              currentPath === '/journal' 
                ? 'bg-primary/10 text-primary' 
                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            <i className="fas fa-book mr-2"></i> Journal
          </a>
          <a 
            href="/chat" 
            className={`block p-2 rounded-lg ${
              currentPath === '/chat' 
                ? 'bg-primary/10 text-primary' 
                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            <i className="fas fa-comment-dots mr-2"></i> AI Chat
          </a>
          <a 
            href="/mood" 
            className={`block p-2 rounded-lg ${
              currentPath === '/mood' 
                ? 'bg-primary/10 text-primary' 
                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            <i className="fas fa-smile mr-2"></i> Mood Tracker
          </a>
          <a 
            href="/health-advice" 
            className={`block p-2 rounded-lg ${
              currentPath === '/health-advice' 
                ? 'bg-primary/10 text-primary' 
                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            <i className="fas fa-heart mr-2"></i> Health Advice
          </a>
          <a 
            href="/mental-peace" 
            className={`block p-2 rounded-lg ${
              currentPath === '/mental-peace' 
                ? 'bg-primary/10 text-primary' 
                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            <i className="fas fa-om mr-2"></i> Mental Peace
          </a>
          <a 
            href="/about" 
            className={`block p-2 rounded-lg ${
              currentPath === '/about' 
                ? 'bg-primary/10 text-primary' 
                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            <i className="fas fa-info-circle mr-2"></i> About
          </a>
          <a 
            href="/settings" 
            className={`block p-2 rounded-lg ${
              currentPath === '/settings' 
                ? 'bg-primary/10 text-primary' 
                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            <i className="fas fa-cog mr-2"></i> Settings
          </a>
          <div className="pt-2">
            <ThemeToggle mobile={true} />
          </div>
        </nav>
      </div>
    </>
  );
};

export default MobileNav;
