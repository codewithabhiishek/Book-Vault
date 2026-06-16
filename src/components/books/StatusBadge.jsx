import React from 'react';

const statusConfig = {
  reading: { label: 'READING', bg: 'bg-brutal-teal', text: 'text-black' },
  finished: { label: 'FINISHED', bg: 'bg-brutal-yellow', text: 'text-black' },
  abandoned: { label: 'ABANDONED', bg: 'bg-brutal-pink', text: 'text-white' },
  want_to_read: { label: 'WANT TO READ', bg: 'bg-indigo-300', text: 'text-black' },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.want_to_read;
  return (
    <span className={`inline-block px-2 py-1 text-xs font-display tracking-wider border-2 border-foreground ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}