import React from 'react';
import { Link } from 'react-router-dom';
import { Star, BookOpen } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function BookCard({ book }) {
  const progress = book.pages ? Math.round((book.pages_read / book.pages) * 100) : 0;

  return (
    <Link
      to={`/book/${book.id}`}
      className="block brutal-border bg-white brutal-shadow brutal-hover group"
    >
      <div className="aspect-[2/3] relative overflow-hidden border-b-4 border-foreground bg-muted">
        {book.cover_url ? (
          <img
            src={book.cover_url}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-brutal-yellow/20">
            <BookOpen className="w-12 h-12 text-foreground/30" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <StatusBadge status={book.status} />
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-heading text-lg leading-tight line-clamp-2 mb-1">
          {book.title}
        </h3>
        <p className="text-sm text-muted-foreground font-body mb-3">{book.author}</p>

        {book.rating > 0 && (
          <div className="flex gap-0.5 mb-3">
            {[1, 2, 3, 4, 5].map(s => (
              <Star
                key={s}
                className={`w-4 h-4 ${s <= book.rating ? 'fill-brutal-yellow text-black' : 'text-foreground/15'}`}
              />
            ))}
          </div>
        )}

        {book.status === 'reading' && book.pages > 0 && (
          <div>
            <div className="flex justify-between text-xs font-display tracking-wide mb-1">
              <span>{progress}%</span>
              <span>{book.pages_read}/{book.pages}</span>
            </div>
            <div className="w-full h-3 bg-muted brutal-border">
              <div
                className="h-full bg-brutal-teal transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}