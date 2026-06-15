import React, { useState } from 'react';
import { Book, Quote } from '@/api/entities';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, FileText, Quote as QuoteIcon, Flame, Plus } from 'lucide-react';
import StatCard from '@/components/shared/StatCard';
import BookCard from '@/components/books/BookCard';
import QuoteCard from '@/components/quotes/QuoteCard';
import AddBookModal from '@/components/books/AddBookModal';
import EmptyState from '@/components/shared/EmptyState';

export default function Dashboard() {
  const [showAddBook, setShowAddBook] = useState(false);

  const { data: books = [] } = useQuery({
    queryKey: ['books'],
    queryFn: () => Book.list('-created_date'),
  });

  const { data: quotes = [] } = useQuery({
    queryKey: ['quotes'],
    queryFn: () => Quote.list('-created_date', 10),
  });

  const finishedBooks = books.filter(b => b.status === 'finished');
  const readingBooks = books.filter(b => b.status === 'reading');
  const totalPages = books.reduce((sum, b) => sum + (b.pages_read || 0), 0);

  const stats = [
    { icon: BookOpen, label: 'BOOKS READ', value: finishedBooks.length, color: 'bg-brutal-teal' },
    { icon: FileText, label: 'PAGES READ', value: totalPages.toLocaleString(), color: 'bg-brutal-yellow' },
    { icon: QuoteIcon, label: 'QUOTES SAVED', value: quotes.length, color: 'bg-brutal-pink text-white' },
    { icon: Flame, label: 'TOTAL BOOKS', value: books.length, color: 'bg-white' },
  ];

  if (books.length === 0) {
    return (
      <div className="p-6 md:p-10">
        <HeroSection />
        <EmptyState
          title="NO BOOKS YET"
          subtitle="Start tracking your reading journey today."
          actionLabel="ADD YOUR FIRST BOOK"
          onAction={() => setShowAddBook(true)}
        />
        <AddBookModal open={showAddBook} onClose={() => setShowAddBook(false)} />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      <HeroSection />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(s => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {readingBooks.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-3xl tracking-wide">CURRENTLY READING</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {readingBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>
      )}

      {quotes.length > 0 && (
        <section className="mb-10">
          <h2 className="font-heading text-3xl tracking-wide mb-6">RECENT QUOTES</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quotes.slice(0, 6).map(q => (
              <QuoteCard key={q.id} quote={q} />
            ))}
          </div>
        </section>
      )}

      <button
        onClick={() => setShowAddBook(true)}
        className="fixed bottom-24 lg:bottom-8 right-6 z-30 brutal-btn bg-brutal-teal text-black p-4"
      >
        <Plus className="w-6 h-6" />
      </button>

      <AddBookModal open={showAddBook} onClose={() => setShowAddBook(false)} />
    </div>
  );
}

function HeroSection() {
  return (
    <div className="mb-10">
      <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl leading-none mb-3">
        MY READING<br />
        <span className="text-brutal-teal">SYSTEM</span>
      </h1>
      <p className="font-display text-xl md:text-2xl tracking-wide text-muted-foreground">
        Track books. Save quotes. Build your second brain.
      </p>
    </div>
  );
}