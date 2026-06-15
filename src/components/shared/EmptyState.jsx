import React from 'react';
import { BookOpen } from 'lucide-react';

export default function EmptyState({ title = "NO BOOKS YET", subtitle, actionLabel = "ADD YOUR FIRST BOOK", onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-24 h-24 bg-brutal-yellow brutal-border brutal-shadow-lg flex items-center justify-center mb-6">
        <BookOpen className="w-12 h-12" />
      </div>
      <h2 className="font-heading text-4xl md:text-5xl text-center mb-2">{title}</h2>
      {subtitle && <p className="text-muted-foreground font-mono uppercase text-center mb-6">{subtitle}</p>}
      {onAction && (
        <button
          onClick={onAction}
          className="brutal-btn bg-brutal-teal text-black px-8 py-3 text-xl font-display tracking-widest"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}