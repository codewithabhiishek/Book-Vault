import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Settings } from 'lucide-react';

export default function MobileHeader() {
  return (
    <header className="lg:hidden flex items-center justify-between px-4 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top))] bg-foreground text-background border-b-4 border-foreground sticky top-0 z-40">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-brutal-teal flex items-center justify-center border-2 border-background">
          <BookOpen className="w-5 h-5 text-black" />
        </div>
        <span className="font-heading text-xl tracking-wider">BOOKVAULT</span>
      </Link>
      <Link to="/settings">
        <Settings className="w-5 h-5 text-background/70" />
      </Link>
    </header>
  );
}