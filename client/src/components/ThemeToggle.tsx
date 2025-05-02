import { useSettings } from '@/contexts/SettingsContext';

interface ThemeToggleProps {
  mobile?: boolean;
}

const ThemeToggle = ({ mobile = false }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useSettings();
  const isDark = theme === 'dark';

  if (mobile) {
    return (
      <button 
        onClick={toggleTheme}
        className="w-full text-left p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
      >
        <i className={`${isDark ? 'fas fa-sun' : 'fas fa-moon'} mr-2`}></i>
        <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
      </button>
    );
  }

  return (
    <button 
      onClick={toggleTheme}
      className="w-full flex items-center justify-between p-2 rounded-lg bg-muted/50 text-muted-foreground hover:text-foreground"
    >
      <div className="flex items-center">
        <i className={`${isDark ? 'fas fa-sun' : 'fas fa-moon'} w-5 h-5`}></i>
        <span className="ml-2">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
      </div>
    </button>
  );
};

export default ThemeToggle;
