import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Calendar as CalendarIcon } from 'lucide-react';
import { Book } from '@/api/entities';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

const statusOptions = [
  { value: 'reading', label: 'Reading' },
  { value: 'finished', label: 'Finished' },
  { value: 'want_to_read', label: 'Want To Read' },
  { value: 'abandoned', label: 'Abandoned' },
];

const genres = ['Fiction', 'Non-Fiction', 'Sci-Fi', 'Fantasy', 'Mystery', 'Romance', 'Biography', 'Self-Help', 'History', 'Philosophy', 'Science', 'Business', 'Other'];

export default function AddBookModal({ open, onClose, editBook }) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(() => {
    if (editBook) {
      return {
        title: editBook.title || '',
        author: editBook.author || '',
        status: editBook.status || 'want_to_read',
        start_date: editBook.start_date || '',
        finish_date: editBook.finish_date || '',
        rating: editBook.rating || 0,
        pages: editBook.pages || '',
        pages_read: editBook.pages_read || 0,
        genre: editBook.genre || '',
        cover_url: editBook.cover_url || '',
      };
    }
    return {
      title: '',
      author: '',
      status: 'want_to_read',
      start_date: '',
      finish_date: '',
      rating: 0,
      pages: '',
      pages_read: 0,
      genre: '',
      cover_url: '',
    };
  });

  const [hoverRating, setHoverRating] = useState(0);

  const parseLocalDate = (dateStr) => {
    if (!dateStr) return undefined;
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const fetchCover = async (title, author) => {
    // 1. Try Open Library first (returns standard aspect ratio book covers)
    try {
      const query = encodeURIComponent(`${title} ${author}`);
      const res = await fetch(`https://openlibrary.org/search.json?q=${query}&limit=1`);
      const data = await res.json();
      if (data.docs?.[0]?.cover_i) {
        return `https://covers.openlibrary.org/b/id/${data.docs[0].cover_i}-L.jpg`;
      }
    } catch (err) {
      console.warn('Open Library API failed, falling back to Google Books:', err);
    }

    // 2. Try Google Books as fallback
    try {
      const query = encodeURIComponent(`intitle:${title} inauthor:${author}`);
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`);
      const data = await res.json();
      if (data.items?.[0]?.volumeInfo?.imageLinks?.thumbnail) {
        // Upgrade to high-res and strip fake page curls
        return data.items[0].volumeInfo.imageLinks.thumbnail
          .replace('zoom=1', 'zoom=2')
          .replace('&edge=curl', '')
          .replace('http://', 'https://');
      }
    } catch (err) {
      console.error('Google Books fallback failed:', err);
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalCoverUrl = form.cover_url;
      
      if (!finalCoverUrl) {
        finalCoverUrl = await fetchCover(form.title, form.author);
      }

      const bookData = {
        title: form.title,
        author: form.author,
        status: form.status,
        start_date: form.start_date || null,
        finish_date: form.finish_date || null,
        rating: form.rating,
        pages: form.pages ? Number(form.pages) : 0,
        pages_read: form.pages_read ? Number(form.pages_read) : 0,
        genre: form.genre || '',
        cover_url: finalCoverUrl || '',
      };

      if (editBook) {
        await Book.update(editBook.id, bookData);
      } else {
        await Book.create(bookData);
      }

      queryClient.invalidateQueries({ queryKey: ['books'] });
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to save book.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="brutal-border brutal-shadow-lg bg-background max-w-lg p-0 rounded-none">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="font-heading text-3xl tracking-wide">
            {editBook ? 'EDIT BOOK' : 'ADD BOOK'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          <div>
            <Label className="font-display text-sm tracking-wide">TITLE *</Label>
            <Input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="brutal-border bg-white h-12 font-body text-base rounded-none"
              placeholder="Enter book title"
            />
          </div>

          <div>
            <Label className="font-display text-sm tracking-wide">AUTHOR *</Label>
            <Input
              required
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              className="brutal-border bg-white h-12 font-body text-base rounded-none"
              placeholder="Enter author name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-display text-sm tracking-wide">STATUS</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger className="brutal-border bg-white h-12 rounded-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="brutal-border bg-background rounded-none">
                  {statusOptions.map(o => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="font-display text-sm tracking-wide">GENRE</Label>
              <Select value={form.genre} onValueChange={(v) => setForm({ ...form, genre: v })}>
                <SelectTrigger className="brutal-border bg-white h-12 rounded-none">
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent className="brutal-border bg-background rounded-none">
                  {genres.map(g => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-display text-sm tracking-wide">START DATE</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full brutal-border bg-white h-12 px-3 flex items-center justify-between text-left rounded-none hover:bg-zinc-50 transition-colors"
                  >
                    <span className="font-mono text-base">
                      {form.start_date ? format(parseLocalDate(form.start_date), 'dd/MM/yyyy') : 'dd/mm/yyyy'}
                    </span>
                    <CalendarIcon className="w-5 h-5 text-muted-foreground" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="brutal-border brutal-shadow bg-white p-0 rounded-none w-auto" align="start">
                  <Calendar
                    mode="single"
                    selected={form.start_date ? parseLocalDate(form.start_date) : undefined}
                    onSelect={(date) => setForm({ ...form, start_date: date ? format(date, 'yyyy-MM-dd') : '' })}
                    initialFocus
                    className="bg-white text-black"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label className="font-display text-sm tracking-wide">FINISH DATE</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full brutal-border bg-white h-12 px-3 flex items-center justify-between text-left rounded-none hover:bg-zinc-50 transition-colors"
                  >
                    <span className="font-mono text-base">
                      {form.finish_date ? format(parseLocalDate(form.finish_date), 'dd/MM/yyyy') : 'dd/mm/yyyy'}
                    </span>
                    <CalendarIcon className="w-5 h-5 text-muted-foreground" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="brutal-border brutal-shadow bg-white p-0 rounded-none w-auto" align="start">
                  <Calendar
                    mode="single"
                    selected={form.finish_date ? parseLocalDate(form.finish_date) : undefined}
                    onSelect={(date) => setForm({ ...form, finish_date: date ? format(date, 'yyyy-MM-dd') : '' })}
                    initialFocus
                    className="bg-white text-black"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-display text-sm tracking-wide">TOTAL PAGES</Label>
              <Input
                type="number"
                value={form.pages}
                onChange={(e) => setForm({ ...form, pages: e.target.value })}
                className="brutal-border bg-white h-12 rounded-none"
                placeholder="0"
              />
            </div>
            <div>
              <Label className="font-display text-sm tracking-wide">PAGES READ</Label>
              <Input
                type="number"
                value={form.pages_read}
                onChange={(e) => setForm({ ...form, pages_read: e.target.value })}
                className="brutal-border bg-white h-12 rounded-none"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <Label className="font-display text-sm tracking-wide">COVER IMAGE URL (OPTIONAL)</Label>
            <Input
              value={form.cover_url}
              onChange={(e) => setForm({ ...form, cover_url: e.target.value })}
              className="brutal-border bg-white h-12 font-body text-base rounded-none"
              placeholder="Paste custom book cover image URL (e.g. from Google Images)"
            />
          </div>

          <div>
            <Label className="font-display text-sm tracking-wide">RATING</Label>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4, 5].map(star => {
                const currentRating = hoverRating || form.rating;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setForm({ ...form, rating: hoverRating || star })}
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const isHalf = x < rect.width / 2;
                      setHoverRating(isHalf ? star - 0.5 : star);
                    }}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform duration-150 hover:scale-125"
                  >
                    <div className="relative">
                      <Star className="w-7 h-7 text-foreground/20" />
                      {star <= currentRating && (
                        <Star className="w-7 h-7 fill-brutal-yellow text-black absolute top-0 left-0" />
                      )}
                      {star - 0.5 === currentRating && (
                        <div className="absolute top-0 left-0 overflow-hidden w-[50%]">
                          <Star className="w-7 h-7 fill-brutal-yellow text-black" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="brutal-btn w-full bg-brutal-teal text-black py-3 text-xl font-display tracking-widest disabled:opacity-50"
          >
            {loading ? 'SAVING...' : editBook ? 'UPDATE BOOK' : 'ADD BOOK'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}