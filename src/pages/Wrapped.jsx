import React, { useState, useMemo } from 'react';
import { Book, Quote } from '@/api/entities';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, BookOpen, FileText, User, Star, BookMarked, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const slideColors = [
  'bg-brutal-teal',
  'bg-brutal-yellow',
  'bg-brutal-pink text-white',
  'bg-foreground text-background',
  'bg-brutal-teal',
  'bg-brutal-yellow',
  'bg-brutal-pink text-white',
];

export default function Wrapped() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  const { data: books = [] } = useQuery({
    queryKey: ['books'],
    queryFn: () => Book.list('-created_date'),
  });

  const { data: quotes = [] } = useQuery({
    queryKey: ['quotes'],
    queryFn: () => Quote.list(),
  });

  const stats = useMemo(() => {
    const year = new Date().getFullYear();
    const finished = books.filter(b => b.status === 'finished');
    const thisYear = finished.filter(b => b.finish_date && new Date(b.finish_date).getFullYear() === year);
    const totalPages = thisYear.reduce((s, b) => s + (b.pages || 0), 0);

    const authorCounts = {};
    thisYear.forEach(b => {
      if (b.author) authorCounts[b.author] = (authorCounts[b.author] || 0) + 1;
    });
    const favAuthor = Object.entries(authorCounts).sort((a, b) => b[1] - a[1])[0];

    const genreCounts = {};
    thisYear.forEach(b => {
      if (b.genre) genreCounts[b.genre] = (genreCounts[b.genre] || 0) + 1;
    });
    const topGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0];

    const highestRated = [...thisYear].sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];
    const longestBook = [...thisYear].sort((a, b) => (b.pages || 0) - (a.pages || 0))[0];
    const avgRating = thisYear.filter(b => b.rating > 0).length
      ? (thisYear.filter(b => b.rating > 0).reduce((s, b) => s + b.rating, 0) / thisYear.filter(b => b.rating > 0).length).toFixed(1)
      : '—';

    return { year, thisYear, totalPages, favAuthor, topGenre, highestRated, longestBook, avgRating };
  }, [books]);

  const slides = [
    {
      icon: Sparkles,
      label: `YOUR ${stats.year}`,
      title: 'READING WRAPPED',
      subtitle: 'Your year in books',
    },
    {
      icon: BookOpen,
      label: 'BOOKS READ',
      title: String(stats.thisYear.length),
      subtitle: `books finished in ${stats.year}`,
    },
    {
      icon: FileText,
      label: 'PAGES TURNED',
      title: stats.totalPages.toLocaleString(),
      subtitle: 'total pages read',
    },
    {
      icon: User,
      label: 'FAVORITE AUTHOR',
      title: (stats.favAuthor?.[0] || '—').toUpperCase(),
      subtitle: stats.favAuthor ? `${stats.favAuthor[1]} books read` : 'Read more to find out',
    },
    {
      icon: Star,
      label: 'TOP RATED',
      title: stats.highestRated?.title || '—',
      subtitle: stats.highestRated ? `${stats.highestRated.rating}/5 stars` : 'Rate your books',
    },
    {
      icon: BookMarked,
      label: 'LONGEST BOOK',
      title: stats.longestBook?.title || '—',
      subtitle: stats.longestBook?.pages ? `${stats.longestBook.pages} pages` : 'Add page counts',
    },
    {
      icon: Star,
      label: 'AVERAGE RATING',
      title: stats.avgRating,
      subtitle: `across ${stats.thisYear.filter(b => b.rating > 0).length} rated books`,
    },
  ];

  const next = () => setCurrent(c => Math.min(c + 1, slides.length - 1));
  const prev = () => setCurrent(c => Math.max(c - 1, 0));

  if (stats.thisYear.length === 0) {
    return (
      <div className="p-6 md:p-10 flex flex-col items-center min-h-[80vh]">
        <h1 className="font-heading text-5xl md:text-6xl mb-8 self-start">WRAPPED</h1>
        <div className="w-full max-w-lg brutal-border-thick brutal-shadow-xl bg-brutal-yellow p-8 text-center my-auto">
          <Sparkles className="w-16 h-16 mx-auto mb-6 text-black opacity-80 animate-pulse" />
          <h2 className="font-heading text-3xl mb-4">NO WRAPPED DATA YET</h2>
          <p className="font-display text-lg tracking-wide mb-6">
            Finish at least one book in {stats.year} to unlock your Reading Wrapped!
          </p>
          <button
            onClick={() => navigate('/library')}
            className="brutal-btn bg-white text-black px-6 py-3 font-display tracking-widest text-lg"
          >
            EXPLORE LIBRARY
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 flex flex-col items-center min-h-[80vh]">
      <h1 className="font-heading text-5xl md:text-6xl mb-8 self-start">WRAPPED</h1>

      <div className="w-full max-w-lg flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotate: 2 }}
            transition={{ duration: 0.3 }}
            className={`w-full aspect-[3/4] brutal-border-thick brutal-shadow-xl ${slideColors[current % slideColors.length]} flex flex-col items-center justify-center p-10 text-center relative`}
          >
            <div className="absolute top-4 right-4 font-display text-sm tracking-wider opacity-50">
              {current + 1}/{slides.length}
            </div>

            {React.createElement(slides[current].icon, { className: 'w-12 h-12 mb-4 opacity-50' })}

            <p className="font-display text-xl tracking-[0.2em] mb-4 opacity-70">
              {slides[current].label}
            </p>

            <h2 className="font-heading text-5xl md:text-7xl leading-none mb-4">
              {slides[current].title}
            </h2>

            <p className="font-display text-xl tracking-wide opacity-70">
              {slides[current].subtitle}
            </p>

            <p className="absolute bottom-4 font-display text-xs tracking-[0.3em] opacity-30">
              BOOKVAULT
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center gap-4 mt-8">
          <button
            onClick={prev}
            disabled={current === 0}
            className="brutal-btn bg-white text-black p-3 disabled:opacity-30"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-3 h-3 border-2 border-foreground transition-all ${
                  i === current ? 'bg-foreground scale-125' : 'bg-transparent'
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            disabled={current === slides.length - 1}
            className="brutal-btn bg-white text-black p-3 disabled:opacity-30"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}