import { useLocation } from 'wouter';
import ThemeToggle from './ThemeToggle';

const Sidebar = () => {
  const [location] = useLocation();

  return (
    <aside className="hidden md:flex md:w-64 flex-col bg-background dark:bg-card border-r border-border shadow-sm">
      <div className="p-4 border-b border-border flex items-center space-x-2">
        <span className="text-primary text-2xl"><i className="fas fa-brain"></i></span>
        <h1 className="text-xl font-bold text-primary">MindMate AI</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        <a 
          href="/" 
          className={`flex items-center space-x-2 p-2 rounded-lg ${
            location === '/' 
              ? 'bg-primary/10 text-primary' 
              : 'hover:bg-muted text-muted-foreground hover:text-foreground'
          }`}
        >
          <i className="fas fa-home w-5 h-5"></i>
          <span>Home</span>
        </a>
        <a 
          href="/journal" 
          className={`flex items-center space-x-2 p-2 rounded-lg ${
            location === '/journal' 
              ? 'bg-primary/10 text-primary' 
              : 'hover:bg-muted text-muted-foreground hover:text-foreground'
          }`}
        >
          <i className="fas fa-book w-5 h-5"></i>
          <span>Journal</span>
        </a>
        <a 
          href="/chat" 
          className={`flex items-center space-x-2 p-2 rounded-lg ${
            location === '/chat' 
              ? 'bg-primary/10 text-primary' 
              : 'hover:bg-muted text-muted-foreground hover:text-foreground'
          }`}
        >
          <i className="fas fa-comment-dots w-5 h-5"></i>
          <span>AI Chat</span>
        </a>
        <a 
          href="/mood" 
          className={`flex items-center space-x-2 p-2 rounded-lg ${
            location === '/mood' 
              ? 'bg-primary/10 text-primary' 
              : 'hover:bg-muted text-muted-foreground hover:text-foreground'
          }`}
        >
          <i className="fas fa-smile w-5 h-5"></i>
          <span>Mood Tracker</span>
        </a>
        <a 
          href="/health-advice" 
          className={`flex items-center space-x-2 p-2 rounded-lg ${
            location === '/health-advice' 
              ? 'bg-primary/10 text-primary' 
              : 'hover:bg-muted text-muted-foreground hover:text-foreground'
          }`}
        >
          <i className="fas fa-heart w-5 h-5"></i>
          <span>Health Advice</span>
        </a>
        <a 
          href="/mental-peace" 
          className={`flex items-center space-x-2 p-2 rounded-lg ${
            location === '/mental-peace' 
              ? 'bg-primary/10 text-primary' 
              : 'hover:bg-muted text-muted-foreground hover:text-foreground'
          }`}
        >
          <i className="fas fa-om w-5 h-5"></i>
          <span>Mental Peace</span>
        </a>
        <a 
          href="/about" 
          className={`flex items-center space-x-2 p-2 rounded-lg ${
            location === '/about' 
              ? 'bg-primary/10 text-primary' 
              : 'hover:bg-muted text-muted-foreground hover:text-foreground'
          }`}
        >
          <i className="fas fa-info-circle w-5 h-5"></i>
          <span>About</span>
        </a>
      </nav>
      
      <div className="p-4 border-t border-border">
        <a 
          href="/settings" 
          className={`flex items-center space-x-2 p-2 rounded-lg ${
            location === '/settings' 
              ? 'bg-primary/10 text-primary' 
              : 'hover:bg-muted text-muted-foreground hover:text-foreground'
          }`}
        >
          <i className="fas fa-cog w-5 h-5"></i>
          <span>Settings</span>
        </a>
        
        {/* Theme toggle */}
        <div className="mt-3">
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
