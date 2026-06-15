import React, { useState, useMemo } from 'react';
import { Book } from '@/api/entities';
import { useQuery } from '@tanstack/react-query';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import BookCard from '@/components/books/BookCard';
import AddBookModal from '@/components/books/AddBookModal';
import EmptyState from '@/components/shared/EmptyState';

const filters = [
  { value: 'all', label: 'ALL' },
  { value: 'reading', label: 'READING' },
  { value: 'finished', label: 'FINISHED' },
  { value: 'want_to_read', label: 'WANT TO READ' },
  { value: 'abandoned', label: 'ABANDONED' },
];

export default function Library() {
  const [showAddBook, setShowAddBook] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');

  const { data: books = [] } = useQuery({
    queryKey: ['books'],
    queryFn: () => Book.list('-created_date'),
  });

  const filtered = useMemo(() => {
    return books.filter(b => {
      const matchesFilter = activeFilter === 'all' || b.status === activeFilter;
      const matchesSearch = !search ||
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [books, activeFilter, search]);

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-5xl md:text-6xl">LIBRARY</h1>
        <button
          onClick={() => setShowAddBook(true)}
          className="brutal-btn bg-brutal-teal text-black px-6 py-3 font-display text-lg tracking-widest flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          ADD BOOK
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or author..."
            className="brutal-border bg-white h-12 pl-12 font-body rounded-none"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {filters.map(f => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={`px-4 py-2 font-display text-sm tracking-wider border-4 border-foreground transition-all duration-200 ${
              activeFilter === f.value
                ? 'bg-foreground text-background'
                : 'bg-background text-foreground hover:bg-muted'
            }`}
          >
            {f.label}
            <span className="ml-1 opacity-60">
              ({f.value === 'all' ? books.length : books.filter(b => b.status === f.value).length})
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={search ? "NO RESULTS" : "NO BOOKS YET"}
          subtitle={search ? "Try a different search term." : "Start building your library."}
          actionLabel="ADD YOUR FIRST BOOK"
          onAction={() => setShowAddBook(true)}
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}

      <AddBookModal open={showAddBook} onClose={() => setShowAddBook(false)} />
    </div>
  );
}