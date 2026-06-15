import React from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Library, Quote, BarChart3, Sparkles, Settings, LogOut, BookOpen } from 'lucide-react';


const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'DASHBOARD', color: 'bg-brutal-teal' },
  { path: '/library', icon: Library, label: 'LIBRARY', color: 'bg-brutal-yellow' },
  { path: '/quotes', icon: Quote, label: 'QUOTES', color: 'bg-brutal-pink' },
  { path: '/stats', icon: BarChart3, label: 'STATS', color: 'bg-brutal-teal' },
  { path: '/wrapped', icon: Sparkles, label: 'WRAPPED', color: 'bg-brutal-yellow' },
  { path: '/settings', icon: Settings, label: 'SETTINGS', color: 'bg-brutal-pink' },
];

export default function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <aside className="hidden lg:flex flex-col w-72 bg-foreground text-background min-h-screen p-6 fixed left-0 top-0 z-40">
      <Link to="/" className="flex items-center gap-3 mb-12">
        <div className="w-12 h-12 bg-brutal-teal brutal-border flex items-center justify-center">
          <BookOpen className="w-7 h-7 text-black" />
        </div>
        <h1 className="font-heading text-3xl text-background tracking-wider">BOOKVAULT</h1>
      </Link>

      <nav className="flex-1 space-y-2">
        {navItems.map(({ path, icon: Icon, label, color }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-4 py-3 font-display text-lg tracking-wide transition-all duration-200 ${
                isActive
                  ? `${color} text-black brutal-border translate-x-2`
                  : 'text-background/70 hover:text-background hover:translate-x-1'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => logout()}
        className="flex items-center gap-3 px-4 py-3 font-display text-lg tracking-wide text-background/50 hover:text-destructive transition-colors"
      >
        <LogOut className="w-5 h-5" />
        LOGOUT
      </button>
    </aside>
  );
}