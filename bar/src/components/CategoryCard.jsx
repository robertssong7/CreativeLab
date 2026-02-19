import React, { useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

export default function CategoryCard({ cat, stepIndex, totalSteps, options, isSelected, onToggle, onAddOther, onNext, onPrev, mode, theme }) {
    const [otherVal, setOtherVal] = useState("");

    // Dynamic Classes for buttons and inputs based on theme
    const activeClass = mode === 'mocktail'
        ? 'border-mocktail-accent bg-mocktail-50 text-mocktail-accent font-semibold shadow-sm'
        : 'border-cocktail-accent bg-cocktail-950 text-cocktail-accent font-semibold shadow-sm';

    const inactiveClass = mode === 'mocktail'
        ? 'border-black/10 bg-white hover:bg-mocktail-50 hover:border-mocktail-accent/30 text-mocktail-text'
        : 'border-cocktail-800 bg-cocktail-900/50 hover:bg-cocktail-800 hover:border-cocktail-700 text-cocktail-muted';

    const inputClass = mode === 'mocktail'
        ? 'border-black/10 bg-transparent text-mocktail-text focus:border-mocktail-accent'
        : 'border-cocktail-700 bg-cocktail-950/50 text-cocktail-text focus:border-cocktail-accent placeholder-cocktail-muted/50';

    const btnIconClass = mode === 'mocktail' ? 'border-black/10 hover:bg-mocktail-50' : 'border-cocktail-700 hover:bg-cocktail-800 text-cocktail-muted hover:text-cocktail-text';

    return (
        <div className={`fade-in rounded-3xl border p-6 shadow-xl md:p-10 ${theme.card} ${theme.cardBorder}`}>
            <div className="mb-6 flex items-start justify-between">
                <div>
                    <h2 className="serif text-3xl mb-1">{cat.title}</h2>
                    <p className="text-sm opacity-60 max-w-md">{cat.helper}</p>
                </div>
                <div className="text-xs font-mono uppercase tracking-widest opacity-40">Step {stepIndex + 1}/{totalSteps + 1}</div>
            </div>

            <div className="mb-8 flex flex-col gap-2">
                {options.map(opt => {
                    const active = isSelected(opt);
                    return (
                        <button
                            key={opt}
                            onClick={() => onToggle(opt)}
                            className={`group flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-all duration-200 ${active ? activeClass : inactiveClass}`}
                        >
                            <span>{opt}</span>
                            {active ? <Check className="h-4 w-4" /> : <div className={`h-4 w-4 rounded-full border ${mode === 'mocktail' ? 'border-black/10' : 'border-cocktail-700'}`}></div>}
                        </button>
                    );
                })}
            </div>

            <div className={`mb-8 border-t pt-4 ${mode === 'mocktail' ? 'border-black/5' : 'border-cocktail-800'}`}>
                <div className="flex items-center gap-2">
                    <input
                        value={otherVal}
                        onChange={e => setOtherVal(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (onAddOther(otherVal), setOtherVal(""))}
                        placeholder={`Add custom ${cat.title.toLowerCase()}...`}
                        className={`flex-1 rounded-xl border px-4 py-3 text-sm outline-none ${inputClass}`}
                    />
                    <button onClick={() => { onAddOther(otherVal); setOtherVal(""); }} className={`rounded-xl border p-3 ${btnIconClass}`}>
                        <Plus className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between pt-2">
                {onPrev ? (
                    <button onClick={onPrev} className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium hover:underline opacity-60 hover:opacity-100`}>
                        <ChevronLeft className="h-4 w-4" /> Back
                    </button>
                ) : <span />}
                <button onClick={onNext} className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0 ${theme.accent} ${mode === 'mocktail' ? 'text-white' : 'text-cocktail-950'}`}>
                    Next Step <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
