import React, { useState, useMemo } from 'react';
import { Quote } from '@/api/entities';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import QuoteCard from '@/components/quotes/QuoteCard';
import EmptyState from '@/components/shared/EmptyState';
import ShareQuoteModal from '@/components/quotes/ShareQuoteModal';

export default function Quotes() {
  const [search, setSearch] = useState('');
  const [filterBook, setFilterBook] = useState('all');
  const [shareQuote, setShareQuote] = useState(null);

  const { data: quotes = [] } = useQuery({
    queryKey: ['quotes'],
    queryFn: () => Quote.list('-created_date'),
  });

  const bookTitles = useMemo(() => {
    const titles = [...new Set(quotes.map(q => q.book_title).filter(Boolean))];
    return titles.sort();
  }, [quotes]);

  const filtered = useMemo(() => {
    return quotes.filter(q => {
      const matchesSearch = !search ||
        q.quote_text?.toLowerCase().includes(search.toLowerCase()) ||
        q.book_title?.toLowerCase().includes(search.toLowerCase()) ||
        q.book_author?.toLowerCase().includes(search.toLowerCase());
      const matchesBook = filterBook === 'all' || q.book_title === filterBook;
      return matchesSearch && matchesBook;
    });
  }, [quotes, search, filterBook]);

  return (
    <div className="p-6 md:p-10">
      <h1 className="font-heading text-5xl md:text-6xl mb-2">QUOTE VAULT</h1>
      <p className="font-display text-lg tracking-wide text-muted-foreground mb-8">
        {quotes.length} QUOTES SAVED
      </p>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search quotes..."
            className="brutal-border bg-white h-12 pl-12 font-body rounded-none"
          />
        </div>
        <Select value={filterBook} onValueChange={setFilterBook}>
          <SelectTrigger className="brutal-border bg-white h-12 w-full md:w-64 rounded-none">
            <SelectValue placeholder="Filter by book" />
          </SelectTrigger>
          <SelectContent className="brutal-border bg-background rounded-none">
            <SelectItem value="all">All Books</SelectItem>
            {bookTitles.map(title => (
              <SelectItem key={title} value={title}>{title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={search ? "NO RESULTS" : "NO QUOTES YET"}
          subtitle={search ? "Try a different search." : "Save your favorite passages from books."}
        />
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
          {filtered.map(q => (
            <div key={q.id} className="break-inside-avoid mb-4">
              <QuoteCard quote={q} onShare={setShareQuote} />
            </div>
          ))}
        </div>
      )}

      <ShareQuoteModal
        open={!!shareQuote}
        onClose={() => setShareQuote(null)}
        quote={shareQuote}
      />
    </div>
  );
}