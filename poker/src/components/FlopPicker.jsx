import React, { useMemo } from 'react';
import { RANKS_ASC, SUITS, SUIT_SYMBOL, COLOR, label } from '../utils/poker';

/**
 * Flop card picker — card grid with fixed-height tile.
 * Selected cards fill the top area, grid sits at the bottom.
 * Height is locked to prevent any tile movement.
 */
export default function FlopPicker({
    cards, setCards,
    usedCards = new Set(),
    showGrid, setShowGrid
}) {
    const selectedCount = cards.filter(Boolean).length;
    const allSelected = selectedCount === 3;

    const allUsed = useMemo(() => {
        const s = new Set(usedCards);
        cards.forEach(k => { if (k) s.add(k); });
        return s;
    }, [usedCards, cards]);

    const handleCardClick = (k) => {
        const emptyIdx = cards.findIndex(c => !c);
        if (emptyIdx !== -1) {
            setCards(emptyIdx, k);
            if (emptyIdx === 2 || cards.filter(Boolean).length === 2) {
                setShowGrid(false);
            }
        }
    };

    const handleChange = () => {
        setCards(0, "");
        setCards(1, "");
        setCards(2, "");
        setShowGrid(true);
    };

    const renderCard = (cardKey) => {
        if (!cardKey) return (
            <div className="inline-flex items-center justify-center w-14 h-20 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 text-slate-300 text-sm">
                —
            </div>
        );
        const r = cardKey.slice(0, -1);
        const s = cardKey[cardKey.length - 1];
        return (
            <div
                className="inline-flex items-center justify-center w-14 h-20 rounded-xl border-2 border-slate-200 bg-white shadow-sm text-2xl font-bold font-mono"
                style={{ color: COLOR(s) }}
            >
                {label(r, s)}
            </div>
        );
    };

    return (
        /* Fixed-height container */
        <div style={{ minHeight: '240px' }}>
            <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold text-slate-600">Choose the flop</div>
                {allSelected && !showGrid && (
                    <button
                        onClick={handleChange}
                        className="text-xs px-2 py-1 rounded-lg border border-slate-200 text-slate-400 hover:bg-white hover:text-slate-600 transition-colors"
                    >Change</button>
                )}
            </div>

            {/* Always-visible selected cards area — 3 slots */}
            <div className="flex items-center gap-3 justify-center" style={{ minHeight: '88px' }}>
                {cards.map((c, i) => <div key={i}>{renderCard(c)}</div>)}
            </div>

            {/* Card grid at the bottom */}
            {showGrid ? (
                <div className="mt-1">
                    <div className="text-xs text-slate-400 mb-1">
                        {selectedCount === 0 ? "Pick first flop card" : selectedCount === 1 ? "Pick second flop card" : "Pick third flop card"}
                    </div>
                    <div className="overflow-x-auto" style={{ maxWidth: '55%' }}>
                        <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(13, minmax(0, 1fr))` }}>
                            {SUITS.map(s =>
                                RANKS_ASC.map(r => {
                                    const k = `${r}${s}`;
                                    const isSelected = cards.includes(k);
                                    const disabled = allUsed.has(k) && !isSelected;
                                    return (
                                        <button
                                            key={k}
                                            disabled={disabled || isSelected}
                                            onClick={() => handleCardClick(k)}
                                            className={`py-1.5 px-0.5 rounded text-[13px] font-semibold transition-all border
                        ${isSelected
                                                    ? "bg-emerald-600 text-white border-emerald-700 shadow-sm"
                                                    : disabled
                                                        ? "opacity-15 cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
                                                        : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-400 cursor-pointer"
                                                }`}
                                            style={!isSelected && !disabled ? { color: COLOR(s) } : undefined}
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
            ) : (
                <div style={{ minHeight: '110px' }} />
            )}
        </div>
    );
}
