import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Download, Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';

const themes = [
  {
    id: 'dark',
    label: 'DARK',
    bg: '#0B1120',
    text: '#F0EBD8',
    accent: '#00C2CB',
    border: '#F0EBD8',
  },
  {
    id: 'teal',
    label: 'TEAL',
    bg: '#00C2CB',
    text: '#000000',
    accent: '#FFD600',
    border: '#000000',
  },
  {
    id: 'yellow',
    label: 'YELLOW',
    bg: '#FFD600',
    text: '#000000',
    accent: '#0B1120',
    border: '#000000',
  },
  {
    id: 'pink',
    label: 'PINK',
    bg: '#FF00D6',
    text: '#ffffff',
    accent: '#FFD600',
    border: '#000000',
  },
];

export default function ShareQuoteModal({ open, onClose, quote }) {
  const cardRef = useRef(null);
  const [activeTheme, setActiveTheme] = useState(themes[0]);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    const canvas = await html2canvas(cardRef.current, {
      scale: 3,
      useCORS: true,
      backgroundColor: null,
    });
    const link = document.createElement('a');
    link.download = `quote-${quote.id || 'card'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    setDownloading(false);
  };

  if (!quote) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="brutal-border brutal-shadow-lg bg-background max-w-xl p-0 rounded-none">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="font-heading text-3xl tracking-wide flex items-center gap-2">
            <Share2 className="w-6 h-6 text-brutal-teal" />
            SHARE QUOTE
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-5">
          {/* Theme Selector */}
          <div className="flex gap-2 mt-4">
            {themes.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTheme(t)}
                className="font-display text-sm tracking-wide px-3 py-2 brutal-border transition-all"
                style={{
                  background: t.bg,
                  color: t.text,
                  borderColor: t.border,
                  boxShadow: activeTheme.id === t.id ? `4px 4px 0px ${t.border}` : 'none',
                  transform: activeTheme.id === t.id ? 'translate(-2px, -2px)' : 'none',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Quote Card Preview */}
          <div
            ref={cardRef}
            style={{
              background: activeTheme.bg,
              color: activeTheme.text,
              borderColor: activeTheme.border,
              fontFamily: 'Inter, sans-serif',
            }}
            className="p-8 border-4 relative overflow-hidden"
          >
            {/* Decorative corner accent */}
            <div
              style={{ background: activeTheme.accent }}
              className="absolute top-0 right-0 w-16 h-16"
            />
            <div
              style={{ background: activeTheme.accent, opacity: 0.3 }}
              className="absolute bottom-0 left-0 w-8 h-8"
            />

            {/* Big quote mark */}
            <div
              style={{ color: activeTheme.accent, fontFamily: 'Anton, sans-serif', lineHeight: 1 }}
              className="text-8xl mb-2 leading-none select-none"
            >
              "
            </div>

            {/* Quote text */}
            <p
              style={{ fontFamily: 'Inter, sans-serif', color: activeTheme.text }}
              className="text-lg md:text-xl leading-relaxed font-medium italic mb-6 relative z-10"
            >
              {quote.quote_text}
            </p>

            {/* Divider */}
            <div style={{ borderColor: activeTheme.border, opacity: 0.3 }} className="border-t-2 pt-4">
              <p
                style={{ fontFamily: 'Bebas Neue, Bebas Neue, sans-serif', color: activeTheme.text, letterSpacing: '0.1em' }}
                className="text-xl font-bold"
              >
                {quote.book_title}
              </p>
              <p style={{ color: activeTheme.text, opacity: 0.6 }} className="text-sm mt-1">
                {quote.book_author}
              </p>
            </div>

            {/* BookVault branding */}
            <div
              className="absolute bottom-4 right-6 text-xs font-bold tracking-widest opacity-40"
              style={{ fontFamily: 'Bebas Neue, sans-serif', color: activeTheme.text }}
            >
              BOOKVAULT
            </div>
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="brutal-btn w-full bg-brutal-teal text-black py-3 text-xl font-display tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
            {downloading ? 'GENERATING...' : 'DOWNLOAD IMAGE'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}