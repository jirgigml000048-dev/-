import React from 'react';

interface TopAppBarProps {
  showBack?: boolean;
  onBack?: () => void;
}

export default function TopAppBar({ showBack, onBack }: TopAppBarProps) {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#fbf9f4]/80 backdrop-blur-md flex justify-between items-center px-6 py-4">
      <button
        className="p-2 rounded-full hover:bg-surface-container-low transition-colors w-10 h-10 flex items-center justify-center"
        onClick={onBack}
      >
        <span className="material-symbols-outlined text-primary">
          {showBack ? 'arrow_back' : 'menu'}
        </span>
      </button>
      <h1 className="font-headline font-bold text-primary text-2xl tracking-tight">
        Plant Instinct
      </h1>
      <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/20">
        <img
          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&fit=crop&auto=format"
          alt="User"
          className="w-full h-full object-cover"
        />
      </div>
    </header>
  );
}
