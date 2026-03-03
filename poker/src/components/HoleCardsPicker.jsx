import React, { useMemo } from 'react';
import { RANKS_ASC, SUITS, SUIT_SYMBOL, COLOR, label } from '../utils/poker';

/**
 * Hole card picker — 4×13 card grid.
 * Fixed-height tile: grid always occupies the bottom, selected cards shown at top.
 * No height change when cards are selected/deselected.
 */
export default function HoleCardsPicker({
    card1, card2, setCard1, setCard2,
    usedCards = new Set(),
    showGrid, setShowGrid
}) {
    const bothSelected = !!(card1 && card2);

    const holeUsed = useMemo(() => {
        const s = new Set(usedCards);
        if (card1) s.add(card1);
        if (card2) s.add(card2);
        return s;
    }, [usedCards, card1, card2]);

    const handleCardClick = (k) => {
        if (!card1) {
            setCard1(k);
        } else if (!card2) {
            setCard2(k);
            setShowGrid(false);
        } else {
            setCard1(k);
            setCard2("");
        }
    };

    const handleChange = () => {
        setCard1("");
        setCard2("");
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
        /* Fixed-height container — tall enough for header + selected cards + grid */
        <div style={{ minHeight: '220px' }}>
            <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold text-slate-600">Choose your cards</div>
                {bothSelected && !showGrid && (
                    <button
                        onClick={handleChange}
                        className="text-xs px-2 py-1 rounded-lg border border-slate-200 text-slate-400 hover:bg-white hover:text-slate-600 transition-colors"
                    >Change</button>
                )}
            </div>

            {/* Always-visible selected cards area (fixed height reservation) */}
            <div className="flex items-center gap-3 justify-center" style={{ minHeight: '88px' }}>
                {bothSelected && !showGrid ? (
                    <>
                        {renderCard(card1)}
                        {renderCard(card2)}
                    </>
                ) : showGrid ? (
                    <>
                        {renderCard(card1 || null)}
                        {renderCard(card2 || null)}
                    </>
                ) : null}
            </div>

            {/* Card grid — always takes bottom space */}
            {showGrid ? (
                <div className="mt-1">
                    <div className="text-xs text-slate-400 mb-1">
                        {!card1 ? "Pick your first card" : !card2 ? "Pick your second card" : "Pick your first card"}
                    </div>
                    <div className="overflow-x-auto" style={{ maxWidth: '55%' }}>
                        <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(13, minmax(0, 1fr))` }}>
                            {SUITS.map(s =>
                                RANKS_ASC.map(r => {
                                    const k = `${r}${s}`;
                                    const disabled = holeUsed.has(k) && k !== card1 && k !== card2;
                                    const selected = card1 === k || card2 === k;
                                    return (
                                        <button
                                            key={k}
                                            disabled={disabled}
                                            onClick={() => handleCardClick(k)}
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
                </div>
            ) : (
                /* Invisible spacer — same height as the grid would take */
                <div style={{ minHeight: '110px' }} />
            )}
        </div>
    );
}
