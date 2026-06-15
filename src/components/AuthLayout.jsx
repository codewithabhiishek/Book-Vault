import React from "react";

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
  return (
    <div className="min-h-screen flex flex-col justify-center bg-background px-6 py-10 relative overflow-hidden">
      {/* Decorative diagonal shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#0a4a4a] opacity-60" style={{clipPath: 'polygon(100% 0, 100% 100%, 0 0)'}} />
        <div className="absolute top-10 right-10 w-24 h-24 bg-[#003333] opacity-40" style={{clipPath: 'polygon(100% 0, 100% 100%, 0 100%)'}} />
        <div className="absolute bottom-20 left-0 w-32 h-48 bg-[#0a3a4a] opacity-50" style={{clipPath: 'polygon(0 0, 60% 0, 100% 100%, 0 100%)'}} />
        <div className="absolute bottom-0 right-0 w-20 h-32 bg-[#0a4a4a] opacity-30" style={{clipPath: 'polygon(100% 0, 100% 100%, 0 100%)'}} />
        {/* Yellow accent lines */}
        <div className="absolute top-32 right-6 w-1.5 h-48 bg-brutal-yellow opacity-80 rotate-12" />
        <div className="absolute bottom-16 left-8 w-1.5 h-32 bg-brutal-yellow opacity-60 -rotate-12" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-archivo text-5xl leading-none text-foreground mb-3">{title}</h1>
            {subtitle && <p className="font-body text-lg text-foreground/80">{subtitle}</p>}
          </div>
          {Icon && (
            <div className="w-16 h-16 bg-brutal-teal flex items-center justify-center flex-shrink-0 ml-4" style={{borderRadius: '12px'}}>
              <Icon className="w-8 h-8 text-black" strokeWidth={2.5} />
            </div>
          )}
        </div>

        {/* Form content */}
        <div className="space-y-0">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <p className="text-right text-sm font-bold text-foreground mt-8">{footer}</p>
        )}
      </div>
    </div>
  );
}