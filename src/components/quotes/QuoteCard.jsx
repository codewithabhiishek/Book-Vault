import React from 'react';
import { format } from 'date-fns';
import { Quote, Share2 } from 'lucide-react';

const colorMap = {
  teal: 'bg-brutal-teal',
  yellow: 'bg-brutal-yellow',
  pink: 'bg-brutal-pink text-white',
};

export default function QuoteCard({ quote, onShare }) {
  const bgClass = colorMap[quote.color] || colorMap.yellow;

  const toTitleCase = (str) => {
    if (!str) return '';
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className={`brutal-border brutal-shadow brutal-hover p-5 ${bgClass} relative group`}>
      <Quote className="w-6 h-6 mb-2 opacity-30" />
      <p className="font-serif text-base md:text-lg leading-relaxed mb-4 italic">
        "{quote.quote_text}"
      </p>
      <div className="border-t-2 border-black/20 pt-3">
        <p className="font-display text-sm tracking-wide capitalize">{quote.book_title}</p>
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs font-semibold opacity-80">{toTitleCase(quote.book_author)}</span>
          <div className="flex gap-2 items-center text-xs opacity-60">
            {quote.page_number && <span>p.{quote.page_number}</span>}
            {quote.created_date && (
              <span>{format(new Date(quote.created_date), 'MMM d')}</span>
            )}
            {onShare && (
              <button
                onClick={(e) => { e.stopPropagation(); onShare(quote); }}
                className="ml-1 p-1 hover:opacity-100 opacity-60 transition-opacity"
                title="Share as image"
              >
                <Share2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}