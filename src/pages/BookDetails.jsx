import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Book, Quote } from '@/api/entities';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Star, ArrowLeft, Pencil, Trash2, Plus, BookOpen } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import StatusBadge from '@/components/books/StatusBadge';
import AddBookModal from '@/components/books/AddBookModal';
import AddQuoteModal from '@/components/quotes/AddQuoteModal';
import QuoteCard from '@/components/quotes/QuoteCard';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showEditBook, setShowEditBook] = useState(false);
  const [showAddQuote, setShowAddQuote] = useState(false);
  const [isUpdatingPages, setIsUpdatingPages] = useState(false);

  const handleUpdatePages = async (newPagesRead) => {
    const pagesNum = Number(newPagesRead);
    if (isNaN(pagesNum) || pagesNum < 0 || (book.pages > 0 && pagesNum > book.pages)) {
      toast.error(book.pages > 0 ? `Please enter a valid page number between 0 and ${book.pages}` : "Please enter a valid page number");
      return;
    }
    
    setIsUpdatingPages(true);
    try {
      const isFinished = book.pages > 0 && pagesNum === book.pages;
      const updatedData = {
        pages_read: pagesNum,
        status: isFinished ? 'finished' : book.status,
      };
      if (isFinished && !book.finish_date) {
        updatedData.finish_date = new Date().toISOString().split('T')[0];
      }
      
      await Book.update(book.id, updatedData);
      queryClient.invalidateQueries({ queryKey: ['book', id] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast.success(isFinished ? "Congrats on finishing the book! 🎉" : "Progress updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update progress.");
    } finally {
      setIsUpdatingPages(false);
    }
  };

  const { data: book, isLoading } = useQuery({
    queryKey: ['book', id],
    queryFn: async () => {
      const books = await Book.filter({ id });
      return books[0];
    },
  });

  const { data: quotes = [] } = useQuery({
    queryKey: ['book-quotes', id],
    queryFn: () => Quote.filter({ book_id: id }, '-created_date'),
  });

  const handleDelete = async () => {
    await Book.delete(book.id);
    for (const q of quotes) {
      await Quote.delete(q.id);
    }
    queryClient.invalidateQueries({ queryKey: ['books'] });
    navigate('/library');
  };

  if (isLoading) {
    return (
      <div className="p-10 flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-foreground border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!book) return null;

  const readingDays = book.start_date && book.finish_date
    ? differenceInDays(new Date(book.finish_date), new Date(book.start_date))
    : book.start_date
    ? differenceInDays(new Date(), new Date(book.start_date))
    : null;

  const progress = book.pages ? Math.round((book.pages_read / book.pages) * 100) : 0;

  return (
    <div className="p-6 md:p-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 font-display text-lg tracking-wide mb-8 hover:text-brutal-teal transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        BACK
      </button>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 mb-10">
        <div className="brutal-border brutal-shadow-lg overflow-hidden bg-muted aspect-[2/3]">
          {book.cover_url ? (
            <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-brutal-yellow/20">
              <BookOpen className="w-16 h-16 text-foreground/20" />
            </div>
          )}
        </div>

        <div>
          <StatusBadge status={book.status} />
          <h1 className="font-heading text-4xl md:text-6xl mt-3 mb-2 capitalize">{book.title}</h1>
          <p className="text-xl text-muted-foreground font-display tracking-wide uppercase mb-4">{book.author}</p>

          {book.rating > 0 && (
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map(s => (
                <div key={s} className="relative">
                  <Star className="w-6 h-6 text-foreground/15" />
                  {s <= book.rating && (
                    <Star className="w-6 h-6 fill-brutal-yellow text-black absolute top-0 left-0" />
                  )}
                  {s - 0.5 === book.rating && (
                    <div className="absolute top-0 left-0 overflow-hidden w-[50%]">
                      <Star className="w-6 h-6 fill-brutal-yellow text-black" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {book.genre && (
              <div className="brutal-border bg-white p-3">
                <p className="font-display text-xs tracking-wider text-muted-foreground">GENRE</p>
                <p className="font-display text-lg">{book.genre}</p>
              </div>
            )}
            {book.pages > 0 && (
              <div className="brutal-border bg-white p-3">
                <p className="font-display text-xs tracking-wider text-muted-foreground">PAGES</p>
                <p className="font-display text-lg">{book.pages_read}/{book.pages}</p>
              </div>
            )}
            {readingDays !== null && (
              <div className="brutal-border bg-white p-3">
                <p className="font-display text-xs tracking-wider text-muted-foreground">DAYS</p>
                <p className="font-display text-lg">{readingDays}</p>
              </div>
            )}
            {book.start_date && (
              <div className="brutal-border bg-white p-3">
                <p className="font-display text-xs tracking-wider text-muted-foreground">STARTED</p>
                <p className="font-display text-lg">{format(new Date(book.start_date), 'MMM d, yy')}</p>
              </div>
            )}
            {book.finish_date && (
              <div className="brutal-border bg-white p-3">
                <p className="font-display text-xs tracking-wider text-muted-foreground">FINISHED</p>
                <p className="font-display text-lg">{format(new Date(book.finish_date), 'MMM d, yy')}</p>
              </div>
            )}
          </div>

          {book.status === 'reading' && book.pages > 0 && (
            <div className="mb-8">
              <div className="flex justify-between text-sm font-display tracking-wide mb-1">
                <span>PROGRESS</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-5 bg-muted brutal-border mb-4">
                <div className="h-full bg-brutal-teal transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              
              {/* Quick Progress Update Panel */}
              <div className="flex flex-wrap items-center gap-3 bg-white brutal-border p-4 max-w-md brutal-shadow">
                <span className="font-display text-sm tracking-wide">QUICK UPDATE:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdatePages(Math.max(0, book.pages_read - 1))}
                    disabled={isUpdatingPages || book.pages_read <= 0}
                    className="w-10 h-10 brutal-btn bg-white text-black font-heading text-xl flex items-center justify-center disabled:opacity-50"
                  >
                    -
                  </button>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max={book.pages}
                      defaultValue={book.pages_read}
                      key={book.pages_read}
                      onBlur={(e) => {
                        if (Number(e.target.value) !== book.pages_read) {
                          handleUpdatePages(e.target.value);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleUpdatePages(e.target.value);
                          e.target.blur();
                        }
                      }}
                      className="w-16 h-10 brutal-border bg-white text-black text-center font-mono text-lg"
                    />
                    <span className="font-display text-muted-foreground text-sm">/ {book.pages}</span>
                  </div>
                  <button
                    onClick={() => handleUpdatePages(Math.min(book.pages, book.pages_read + 1))}
                    disabled={isUpdatingPages || book.pages_read >= book.pages}
                    className="w-10 h-10 brutal-btn bg-brutal-teal text-black font-heading text-xl flex items-center justify-center disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
                
                <button
                  onClick={() => handleUpdatePages(book.pages)}
                  disabled={isUpdatingPages || book.pages_read >= book.pages}
                  className="brutal-btn bg-brutal-yellow text-black px-4 py-2 font-display text-sm tracking-widest ml-auto"
                >
                  FINISH
                </button>
              </div>
            </div>
          )}

          {book.status === 'want_to_read' && (
            <div className="mb-8">
              <button
                onClick={async () => {
                  try {
                    await Book.update(book.id, {
                      status: 'reading',
                      start_date: new Date().toISOString().split('T')[0]
                    });
                    queryClient.invalidateQueries({ queryKey: ['book', id] });
                    queryClient.invalidateQueries({ queryKey: ['books'] });
                    toast.success("Added to Currently Reading! Happy reading! 📖");
                  } catch (err) {
                    console.error(err);
                    toast.error("Failed to start reading.");
                  }
                }}
                className="brutal-btn bg-brutal-teal text-black px-6 py-3 font-display text-lg tracking-widest flex items-center gap-2"
              >
                START READING
              </button>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowAddQuote(true)}
              className="brutal-btn bg-brutal-yellow text-black px-6 py-3 font-display text-lg tracking-widest flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              ADD QUOTE
            </button>
            <button
              onClick={() => setShowEditBook(true)}
              className="brutal-btn bg-white text-black px-6 py-3 font-display text-lg tracking-widest flex items-center gap-2"
            >
              <Pencil className="w-5 h-5" />
              EDIT
            </button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="brutal-btn bg-destructive text-white px-6 py-3 font-display text-lg tracking-widest flex items-center gap-2">
                  <Trash2 className="w-5 h-5" />
                  DELETE
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="brutal-border brutal-shadow-lg bg-background rounded-none">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-heading text-2xl">DELETE BOOK?</AlertDialogTitle>
                  <AlertDialogDescription>This will permanently delete this book and all its quotes.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="brutal-btn bg-white font-display rounded-none">CANCEL</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="brutal-btn bg-destructive text-white font-display rounded-none">DELETE</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      <section>
        <h2 className="font-heading text-3xl tracking-wide mb-6">
          QUOTES <span className="text-muted-foreground text-xl">({quotes.length})</span>
        </h2>
        {quotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quotes.map(q => <QuoteCard key={q.id} quote={q} />)}
          </div>
        ) : (
          <div className="brutal-border bg-white p-8 text-center">
            <p className="font-display text-lg tracking-wide text-muted-foreground">NO QUOTES YET</p>
            <button
              onClick={() => setShowAddQuote(true)}
              className="mt-4 brutal-btn bg-brutal-yellow text-black px-6 py-2 font-display tracking-widest"
            >
              ADD FIRST QUOTE
            </button>
          </div>
        )}
      </section>

      {showEditBook && (
        <AddBookModal open={showEditBook} onClose={() => setShowEditBook(false)} editBook={book} />
      )}
      {showAddQuote && (
        <AddQuoteModal open={showAddQuote} onClose={() => setShowAddQuote(false)} book={book} />
      )}
    </div>
  );
}