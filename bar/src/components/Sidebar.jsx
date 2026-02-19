import React from 'react';
import { Sparkles } from 'lucide-react';

export default function Sidebar({ mode, pantry, config, currentStep, onJumpTo, onGenerate, theme }) {
    return (
        <aside className={`h-fit sticky top-4 md:col-span-4 rounded-2xl border p-6 shadow-sm backdrop-blur-sm ${theme.sidebar}`}>
            <div className={`mb-4 flex items-center justify-between border-b pb-2 ${mode === 'mocktail' ? 'border-black/5' : 'border-cocktail-800'}`}>
                <h3 className="serif text-lg italic">Your Bar</h3>
                <span className="text-xs uppercase tracking-wider opacity-50">{mode} Pantry</span>
            </div>

            <div className="mb-6 space-y-4 max-h-[60vh] overflow-y-auto thin-scroll pr-2">
                {config.map((c, idx) => {
                    const items = pantry[c.key] ? Array.from(pantry[c.key]) : [];
                    if (items.length === 0 && currentStep !== idx) return null;
                    const isActive = currentStep === idx;
                    return (
                        <div key={c.key} className={`transition-opacity ${isActive ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}>
                            <button onClick={() => onJumpTo(idx)} className="mb-1 flex w-full items-center justify-between text-left text-sm font-medium hover:underline">
                                <span>{c.title}</span>
                                <span className="text-xs opacity-50">{items.length}</span>
                            </button>
                            <div className="flex flex-wrap gap-1.5">
                                {items.map(v => (
                                    <span key={v} className={`rounded-md border px-1.5 py-0.5 text-[10px] ${mode === 'mocktail' ? 'border-mocktail-accent/30 bg-mocktail-50 text-mocktail-accent' : 'border-cocktail-700 bg-cocktail-950 text-cocktail-muted'}`}>
                                        {v}
                                    </span>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <button
                onClick={onGenerate}
                className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0 ${theme.accent} ${mode === 'mocktail' ? 'text-white' : 'text-cocktail-950'}`}
            >
                <Sparkles className="h-4 w-4" /> Generate Menu
            </button>
        </aside>
    );
}
