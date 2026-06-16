import React, { useMemo } from 'react';
import { Book, Quote } from '@/api/entities';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, FileText, Star, User, BookMarked, Flame } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StatCard from '@/components/shared/StatCard';

const COLORS = ['#00C2CB', '#FFD600', '#FF00D6', '#000000', '#F5F1E8', '#FF6B6B'];

export default function Stats() {
  const { data: books = [] } = useQuery({
    queryKey: ['books'],
    queryFn: () => Book.list('-created_date'),
  });

  const { data: quotes = [] } = useQuery({
    queryKey: ['quotes'],
    queryFn: () => Quote.list(),
  });

  const analytics = useMemo(() => {
    const finished = books.filter(b => b.status === 'finished');
    const totalPages = books.reduce((s, b) => s + (b.pages_read || 0), 0);
    const ratedFinished = finished.filter(b => b.rating > 0);
    const avgRating = ratedFinished.length > 0
      ? (ratedFinished.reduce((s, b) => s + (b.rating || 0), 0) / ratedFinished.length).toFixed(1)
      : '0';

    const authorCounts = {};
    books.forEach(b => {
      if (b.author) authorCounts[b.author] = (authorCounts[b.author] || 0) + 1;
    });
    const favAuthor = Object.entries(authorCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

    const longestBook = [...books].sort((a, b) => (b.pages || 0) - (a.pages || 0))[0];

    // Books per month
    const monthlyData = {};
    finished.forEach(b => {
      if (b.finish_date) {
        const d = new Date(b.finish_date);
        if (!isNaN(d.getTime())) {
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          monthlyData[key] = (monthlyData[key] || 0) + 1;
        }
      }
    });
    const booksPerMonth = Object.entries(monthlyData)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-12)
      .map(([month, count]) => {
        const [yearStr, monthStr] = month.split('-');
        const monthIndex = Number(monthStr) - 1;
        const yearShort = yearStr.slice(-2);
        const shortMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return {
          month: `${shortMonthNames[monthIndex]} ${yearShort}`,
          count,
        };
      });

    // Genre distribution
    const genreCounts = {};
    books.forEach(b => {
      if (b.genre) genreCounts[b.genre] = (genreCounts[b.genre] || 0) + 1;
    });
    const genreData = Object.entries(genreCounts).map(([name, value]) => ({ name, value }));

    return {
      finished: finished.length,
      totalPages,
      avgRating,
      favAuthor,
      longestBook,
      totalQuotes: quotes.length,
      booksPerMonth,
      genreData,
    };
  }, [books, quotes]);

  return (
    <div className="p-6 md:p-10">
      <h1 className="font-heading text-5xl md:text-6xl mb-8">STATS</h1>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <StatCard icon={BookOpen} label="BOOKS FINISHED" value={analytics.finished} color="bg-brutal-teal" />
        <StatCard icon={FileText} label="PAGES READ" value={analytics.totalPages.toLocaleString()} color="bg-brutal-yellow" />
        <StatCard icon={Star} label="AVG RATING" value={analytics.avgRating} color="bg-brutal-pink text-white" />
        <StatCard icon={User} label="FAV AUTHOR" value={analytics.favAuthor} color="bg-white" />
        <StatCard icon={BookMarked} label="LONGEST BOOK" value={analytics.longestBook?.pages ? `${analytics.longestBook.pages}p` : '—'} color="bg-brutal-teal" />
        <StatCard icon={Flame} label="TOTAL QUOTES" value={analytics.totalQuotes} color="bg-brutal-yellow" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="brutal-border brutal-shadow bg-white p-6">
          <h3 className="font-heading text-2xl mb-4">BOOKS PER MONTH</h3>
          {analytics.booksPerMonth.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analytics.booksPerMonth}>
                <XAxis dataKey="month" tick={{ fontFamily: 'Bebas Neue', fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontFamily: 'Bebas Neue', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    border: '4px solid #000',
                    borderRadius: 0,
                    fontFamily: 'Bebas Neue',
                    boxShadow: '4px 4px 0 #000',
                  }}
                />
                <Bar dataKey="count" fill="#00C2CB" stroke="#000" strokeWidth={2} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-muted-foreground font-display py-10">NO DATA YET</p>
          )}
        </div>

        <div className="brutal-border brutal-shadow bg-white p-6">
          <h3 className="font-heading text-2xl mb-4">GENRE DISTRIBUTION</h3>
          {analytics.genreData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={analytics.genreData} cx="50%" cy="50%" outerRadius={90} dataKey="value" stroke="#000" strokeWidth={3} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {analytics.genreData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    border: '4px solid #000',
                    borderRadius: 0,
                    fontFamily: 'Bebas Neue',
                    boxShadow: '4px 4px 0 #000',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-muted-foreground font-display py-10">NO DATA YET</p>
          )}
        </div>
      </div>
    </div>
  );
}