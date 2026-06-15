import React from 'react';

export default function StatCard({ icon: Icon, label, value, color = 'bg-brutal-teal' }) {
  return (
    <div className={`brutal-border brutal-shadow brutal-hover ${color} p-5`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="font-display text-sm tracking-widest opacity-70 mb-1">{label}</p>
          <p className="font-heading text-4xl md:text-5xl">{value}</p>
        </div>
        {Icon && (
          <div className="w-10 h-10 bg-black/10 flex items-center justify-center border-2 border-black">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}