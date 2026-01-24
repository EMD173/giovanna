import { SanctuaryIcon } from '../icons/SanctuaryIcons';
import { SOSPulse } from '../../components/SOSPulse';

// The Layout now expects orders from above (Props)
interface LayoutProps {
  children: React.ReactNode;
  currentTab: string;              // "Which room is active?"
  onTabChange: (tabId: string) => void; // "Function to change the room"
}

export const Layout = ({ children, currentTab, onTabChange }: LayoutProps) => {
  const navItems = [
    { id: 'Sanctuary', label: 'Home' },
    { id: 'Village', label: 'Village' },
    { id: 'Journey', label: 'Journey' },
    { id: 'Capture', label: 'Log' },
    { id: 'Oracle', label: 'Oracle' },
  ] as const;

  return (
    <div className="min-h-screen w-full relative pb-32">
      {/* Main Content Area */}
      <main className="p-6 min-h-screen">
        {children}
      </main>

      {/* SOS PULSE: Crisis Support (Above Nav) */}
      <div className="fixed bottom-20 left-0 right-0 z-40">
        <SOSPulse />
      </div>

      {/* LIQUID GLASS NAVIGATION */}
      <nav className="fixed bottom-0 left-0 w-full glass-panel z-50 pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-around items-center h-20 px-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)} // <--- This triggers the switch
              className="flex flex-col items-center justify-center w-full h-full space-y-1 active:scale-95 transition-transform"
            >
              <SanctuaryIcon
                name={item.id}
                isActive={currentTab === item.id}
              />
              <span
                className={`text-[10px] uppercase tracking-widest font-bold ${currentTab === item.id ? 'text-[#4B0082]' : 'text-[#1A1A1A]/60'
                  }`}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};
