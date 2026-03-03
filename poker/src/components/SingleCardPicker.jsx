import React from 'react';
import { RANKS_ASC, SUITS, SUIT_SYMBOL, COLOR, label } from '../utils/poker';

/**
 * Single card picker for turn/river.
 * Fixed-height tile. Grid fills container naturally.
 * Selected card shown larger at ~25% with Clear to the right.
 */
export default function SingleCardPicker({ value, onChange, usedCards = new Set(), title = "Choose a card" }) {
    const renderSelectedCard = (cardKey) => {
        const r = cardKey.slice(0, -1);
        const s = cardKey[cardKey.length - 1];
        return (
            <div
                className="inline-flex items-center justify-center w-16 h-22 rounded-xl border-2 border-slate-200 bg-white shadow-sm text-2xl font-bold font-mono"
                style={{ color: COLOR(s) }}
            >
                {label(r, s)}
            </div>
        );
    };

    return (
        <div style={{ minHeight: '220px' }}>
            <div className="text-sm font-semibold text-slate-600 mb-2">{title}</div>

            {/* Selected card area — always reserved */}
            <div className="flex items-center mb-2" style={{ minHeight: '96px', paddingLeft: '25%' }}>
                {value ? (
                    <div className="flex items-center gap-3">
                        {renderSelectedCard(value)}
                        <button
                            onClick={() => onChange("")}
                            className="text-xs px-2 py-1 rounded-lg border border-slate-200 text-slate-400 hover:bg-white hover:text-slate-600 transition-colors"
                        >Clear</button>
                    </div>
                ) : (
                    <div className="text-xs text-slate-300">No card selected</div>
                )}
            </div>

            {/* Card grid — fills container width naturally */}
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
                                className={`py-1.5 px-0.5 rounded text-[13px] font-semibold transition-all border
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
    );
}
