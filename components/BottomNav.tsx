import React from 'react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onChange: (tab: ActiveTab) => void;
}

const TABS: { id: ActiveTab; icon: string; label: string }[] = [
  { id: 'home', icon: 'home', label: 'Home' },
  { id: 'style', icon: 'palette', label: 'Style' },
  { id: 'identify', icon: 'center_focus_strong', label: 'Identify' },
  { id: 'lists', icon: 'potted_plant', label: 'Lists' },
];

export default function BottomNav({ activeTab, onChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-[#fbf9f4] rounded-t-[3rem] border-t border-outline-variant/15 shadow-[0_-20px_40px_rgba(27,28,25,0.05)]">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex flex-col items-center justify-center p-3 transition-all ${
              isActive
                ? 'bg-primary-container text-on-primary rounded-full'
                : 'text-secondary hover:opacity-80'
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {tab.icon}
            </span>
            <span className="font-label text-[10px] uppercase tracking-widest font-semibold mt-1">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
