import React from 'react';
import { RANKS_ASC, SUITS, SUIT_SYMBOL, COLOR, label } from '../utils/poker';

/**
 * Compact card picker for single card selection (turn/river).
 * 4×13 grid of clickable card buttons. Disabled cards from usedCards are greyed out.
 *
 * Props:
 *  - value: card key string like "As" or "" for none
 *  - onChange: (cardKey: string) => void
 *  - usedCards: Set of card keys to disable
 *  - title: section title
 */
export default function SingleCardPicker({ value, onChange, usedCards = new Set(), title = "Choose a card" }) {
    return (
        <div>
            <div className="text-sm font-semibold text-slate-600 mb-2">{title}</div>

            {/* Currently selected */}
            {value && (
                <div className="mb-2 flex items-center gap-2">
                    <span className="text-lg font-bold font-mono" style={{ color: COLOR(value[value.length - 1]) }}>
                        {label(value.slice(0, -1), value[value.length - 1])}
                    </span>
                    <button
                        onClick={() => onChange("")}
                        className="text-xs px-2 py-0.5 rounded border border-slate-200 text-slate-400 hover:bg-white hover:text-slate-600 transition-colors"
                    >Clear</button>
                </div>
            )}

            {/* Card grid: suits as rows, ranks as columns */}
            <div className="overflow-x-auto">
                <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(13, minmax(0, 1fr))` }}>
                    {SUITS.map(s =>
                        RANKS_ASC.map(r => {
                            const k = `${r}${s}`;
                            const disabled = usedCards.has(k);
                            const selected = value === k;
                            return (
                                <button
                                    key={k}
                                    disabled={disabled}
                                    onClick={() => onChange(selected ? "" : k)}
                                    className={`py-1 px-0.5 rounded text-xs font-semibold transition-all border
                    ${selected
                                            ? "bg-indigo-600 text-white border-indigo-700 shadow-sm"
                                            : disabled
                                                ? "opacity-15 cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
                                                : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-400 cursor-pointer"
                                        }`}
                                    style={!selected && !disabled ? { color: COLOR(s) } : undefined}
                                    title={label(r, s)}
                                >
                                    {r === "T" ? "10" : r}{SUIT_SYMBOL[s]}
                                </button>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
