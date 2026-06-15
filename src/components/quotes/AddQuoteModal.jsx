import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Quote } from '@/api/entities';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const colors = [
  { value: 'teal', bg: 'bg-brutal-teal' },
  { value: 'yellow', bg: 'bg-brutal-yellow' },
  { value: 'pink', bg: 'bg-brutal-pink' },
];

export default function AddQuoteModal({ open, onClose, book }) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    quote_text: '',
    page_number: '',
    color: 'yellow',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await Quote.create({
        ...form,
        book_id: book.id,
        book_title: book.title,
        book_author: book.author,
        page_number: form.page_number ? Number(form.page_number) : null,
      });
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      queryClient.invalidateQueries({ queryKey: ['book-quotes'] });
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to save quote. Make sure the public.quotes table exists in Supabase.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="brutal-border brutal-shadow-lg bg-background max-w-lg p-0 rounded-none">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="font-heading text-3xl tracking-wide">ADD QUOTE</DialogTitle>
          <p className="text-sm text-muted-foreground italic" style={{ fontFamily: 'Georgia, serif' }}>From "{book?.title}"</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          <div>
            <Label className="font-display text-sm tracking-wide">QUOTE TEXT *</Label>
            <Textarea
              required
              rows={4}
              value={form.quote_text}
              onChange={(e) => setForm({ ...form, quote_text: e.target.value })}
              className="brutal-border bg-white rounded-none resize-none text-lg italic leading-relaxed"
              style={{ fontFamily: 'Georgia, serif' }}
              placeholder='"Enter the quote..."'
            />
          </div>

          <div>
            <Label className="font-display text-sm tracking-wide">PAGE NUMBER</Label>
            <Input
              type="number"
              value={form.page_number}
              onChange={(e) => setForm({ ...form, page_number: e.target.value })}
              className="brutal-border bg-white h-12 rounded-none"
              placeholder="Optional"
            />
          </div>

          <div>
            <Label className="font-display text-sm tracking-wide">CARD COLOR</Label>
            <div className="flex gap-3 mt-2">
              {colors.map(c => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setForm({ ...form, color: c.value })}
                  className={`w-10 h-10 ${c.bg} border-4 border-black transition-transform ${
                    form.color === c.value ? 'scale-125 ring-2 ring-offset-2 ring-black' : 'hover:scale-110'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="brutal-btn w-full bg-brutal-yellow text-black py-3 text-xl font-display tracking-widest disabled:opacity-50"
          >
            {loading ? 'SAVING...' : 'SAVE QUOTE'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}