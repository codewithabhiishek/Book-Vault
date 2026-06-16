import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Library, Quote, BarChart3, Sparkles } from 'lucide-react';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Home' },
  { path: '/library', icon: Library, label: 'Library' },
  { path: '/quotes', icon: Quote, label: 'Quotes' },
  { path: '/stats', icon: BarChart3, label: 'Stats' },
  { path: '/wrapped', icon: Sparkles, label: 'Wrapped' },
];

export default function MobileNav() {
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-foreground border-t-4 border-foreground">
      <div className="flex justify-around pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center gap-1 px-3 py-2 transition-all duration-200 ${
                isActive ? 'text-brutal-teal scale-110' : 'text-background/60'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-display tracking-wide">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}