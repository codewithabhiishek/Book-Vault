import React from 'react';
import { Book, Quote } from '@/api/entities';
import { useAuth } from '@/lib/AuthContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Download, Upload, Sun, LogOut } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { logout } = useAuth();

  const { data: books = [] } = useQuery({
    queryKey: ['books'],
    queryFn: () => Book.list(),
  });

  const { data: quotes = [] } = useQuery({
    queryKey: ['quotes'],
    queryFn: () => Quote.list(),
  });

  const handleExport = () => {
    const data = { books, quotes, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookvault-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully!');
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading('Importing your data...');
    try {
      const text = await file.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        throw new Error('Invalid file format. Please upload a valid JSON backup.');
      }

      if (!data.books && !data.quotes) {
        throw new Error('No compatible Book-Vault data found in file.');
      }

      const bookIdMap = {};

      if (data.books && Array.isArray(data.books)) {
        for (const book of data.books) {
          const { id: oldId, created_date, updated_date, created_by_id, ...bookData } = book;
          const newBook = await Book.create(bookData);
          if (oldId && newBook?.id) {
            bookIdMap[oldId] = newBook.id;
          }
        }
      }

      if (data.quotes && Array.isArray(data.quotes)) {
        for (const quote of data.quotes) {
          const { id, created_date, updated_date, created_by_id, ...quoteData } = quote;
          if (quoteData.book_id && bookIdMap[quoteData.book_id]) {
            quoteData.book_id = bookIdMap[quoteData.book_id];
          }
          await Quote.create(quoteData);
        }
      }

      queryClient.invalidateQueries();
      toast.success('Data imported successfully!', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to import data.', { id: toastId });
    } finally {
      e.target.value = '';
    }
  };

  const handleToggleTheme = () => {
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="p-6 md:p-10">
      <h1 className="font-heading text-5xl md:text-6xl mb-8">SETTINGS</h1>

      <div className="max-w-2xl space-y-6">
        <div className="brutal-border brutal-shadow bg-white p-6">
          <h3 className="font-heading text-2xl mb-4">APPEARANCE</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleToggleTheme}
              className="brutal-btn bg-brutal-yellow text-black px-6 py-3 font-display text-lg tracking-widest flex items-center gap-2"
            >
              <Sun className="w-5 h-5" />
              LIGHT / DARK
            </button>
          </div>
        </div>

        <div className="brutal-border brutal-shadow bg-white p-6">
          <h3 className="font-heading text-2xl mb-2">DATA</h3>
          <p className="text-sm text-muted-foreground font-mono uppercase mb-4">Export or import your reading data as JSON.</p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExport}
              className="brutal-btn bg-brutal-teal text-black px-6 py-3 font-display text-lg tracking-widest flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              EXPORT DATA
            </button>

            <label className="brutal-btn bg-white text-black px-6 py-3 font-display text-lg tracking-widest flex items-center gap-2 cursor-pointer">
              <Upload className="w-5 h-5" />
              IMPORT DATA
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>

          <div className="mt-4 brutal-border bg-muted p-4">
            <p className="font-display text-sm tracking-wide">
              {books.length} BOOKS · {quotes.length} QUOTES
            </p>
          </div>
        </div>

        <div className="brutal-border brutal-shadow bg-white p-6">
          <h3 className="font-heading text-2xl mb-4">ACCOUNT</h3>
          <button
            onClick={() => logout()}
            className="brutal-btn bg-destructive text-white px-6 py-3 font-display text-lg tracking-widest flex items-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            LOGOUT
          </button>
        </div>
      </div>
    </div>
  );
}