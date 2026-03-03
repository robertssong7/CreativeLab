import React, { useState, useCallback, useMemo } from 'react';
import { RANKS_DESC, SUITS, SUIT_SYMBOL, COLOR } from '../utils/poker';

/**
 * Fast rank-first hole card picker.
 *
 * Abstract mode (default): rank1 → rank2 → suited/offsuit → done (≤3 taps)
 * Exact mode (toggle ON): rank1 → rank2 → suitedness → suit1 → suit2 (≤5 taps)
 *
 * Props:
 *  - holeMode: "abstract" | "exact"
 *  - setHoleMode
 *  - holeAbstract: { r1, r2, suitedness } | null
 *  - setHoleAbstract
 *  - holeExact: { c1: {r,s}, c2: {r,s} } | null
 *  - setHoleExact
 *  - usedCards: Set of card keys like "As", "Kh" (from board)
 */

const STEPS = { RANK1: 0, RANK2: 1, SUITEDNESS: 2, SUIT1: 3, SUIT2: 4, DONE: 5 };

export default function HoleCardsPicker({
    holeMode, setHoleMode,
    holeAbstract, setHoleAbstract,
    holeExact, setHoleExact,
    usedCards = new Set()
}) {
    const [step, setStep] = useState(STEPS.RANK1);
    const [pendingR1, setPendingR1] = useState(null);
    const [pendingR2, setPendingR2] = useState(null);
    const [pendingSuitedness, setPendingSuitedness] = useState(null);
    const [pendingSuit1, setPendingSuit1] = useState(null);

    const resetPicker = useCallback(() => {
        setStep(STEPS.RANK1);
        setPendingR1(null);
        setPendingR2(null);
        setPendingSuitedness(null);
        setPendingSuit1(null);
    }, []);

    // Finalize abstract selection
    const finalizeAbstract = useCallback((r1, r2, suitedness) => {
        setHoleAbstract({ r1, r2, suitedness });
        setHoleExact(null);
        setStep(STEPS.DONE);
    }, [setHoleAbstract, setHoleExact]);

    // Finalize exact selection
    const finalizeExact = useCallback((r1, r2, suitedness, s1, s2) => {
        setHoleExact({ c1: { r: r1, s: s1 }, c2: { r: r2, s: s2 } });
        setHoleAbstract({ r1, r2, suitedness });
        setStep(STEPS.DONE);
    }, [setHoleExact, setHoleAbstract]);

    const handleRank1 = (r) => {
        setPendingR1(r);
        setStep(STEPS.RANK2);
    };

    const handleRank2 = (r) => {
        const r1 = pendingR1;
        const r2 = r;
        setPendingR2(r2);

        if (r1 === r2) {
            // Pair — auto suitedness
            if (holeMode === "abstract") {
                finalizeAbstract(r1, r2, "p");
            } else {
                setPendingSuitedness("p");
                setStep(STEPS.SUIT1);
            }
        } else {
            setStep(STEPS.SUITEDNESS);
        }
    };

    const handleSuitedness = (s) => {
        setPendingSuitedness(s);
        if (holeMode === "abstract") {
            finalizeAbstract(pendingR1, pendingR2, s);
        } else {
            setStep(STEPS.SUIT1);
        }
    };

    const handleSuit1 = (s) => {
        setPendingSuit1(s);
        if (pendingSuitedness === "s") {
            // Suited — auto-set suit2 = suit1
            finalizeExact(pendingR1, pendingR2, "s", s, s);
        } else {
            setStep(STEPS.SUIT2);
        }
    };

    const handleSuit2 = (s) => {
        finalizeExact(pendingR1, pendingR2, pendingSuitedness, pendingSuit1, s);
    };

    const handleToggleMode = () => {
        const newMode = holeMode === "abstract" ? "exact" : "abstract";
        setHoleMode(newMode);
        if (newMode === "abstract") {
            // Switching to abstract: clear exact, keep abstract
            setHoleExact(null);
            if (holeAbstract) setStep(STEPS.DONE);
        } else {
            // Switching to exact: keep abstract, prompt for suits
            if (holeAbstract) {
                setPendingR1(holeAbstract.r1);
                setPendingR2(holeAbstract.r2);
                setPendingSuitedness(holeAbstract.suitedness);
                setStep(STEPS.SUIT1);
            }
        }
    };

    // Compute disabled suits for suit2 picker
    const disabledSuit2 = useMemo(() => {
        const disabled = new Set();
        if (pendingSuitedness === "p" && pendingSuit1) {
            // Pair: suit2 must differ from suit1
            disabled.add(pendingSuit1);
        } else if (pendingSuitedness === "o" && pendingSuit1) {
            // Offsuit: suit2 must differ from suit1
            disabled.add(pendingSuit1);
        }
        // Also check usedCards
        if (pendingR2) {
            SUITS.forEach(s => {
                if (usedCards.has(`${pendingR2}${s}`)) disabled.add(s);
            });
        }
        return disabled;
    }, [pendingSuitedness, pendingSuit1, pendingR2, usedCards]);

    // Check if a specific suit is used for suit1
    const disabledSuit1 = useMemo(() => {
        const disabled = new Set();
        if (pendingR1) {
            SUITS.forEach(s => {
                if (usedCards.has(`${pendingR1}${s}`)) disabled.add(s);
            });
        }
        return disabled;
    }, [pendingR1, usedCards]);

    // Display current selection
    const displayHand = useMemo(() => {
        if (holeExact) {
            const c1 = holeExact.c1;
            const c2 = holeExact.c2;
            return {
                text: `${c1.r}${SUIT_SYMBOL[c1.s]} ${c2.r}${SUIT_SYMBOL[c2.s]}`,
                subtext: null,
                c1Color: COLOR(c1.s),
                c2Color: COLOR(c2.s)
            };
        }
        if (holeAbstract) {
            const { r1, r2, suitedness } = holeAbstract;
            const suffix = suitedness === "s" ? "s" : suitedness === "o" ? "o" : "";
            return {
                text: `${r1}${r2}${suffix}`,
                subtext: suitedness === "p" ? "Pocket pair" : suitedness === "s" ? "Suited" : "Offsuit",
                c1Color: "#111827",
                c2Color: "#111827"
            };
        }
        return null;
    }, [holeAbstract, holeExact]);

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold text-slate-600">Choose your cards</div>
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <span className="text-xs text-slate-400">Exact suits</span>
                    <div
                        className={`relative w-8 h-4.5 rounded-full transition-colors ${holeMode === "exact" ? "bg-indigo-600" : "bg-slate-300"}`}
                        onClick={handleToggleMode}
                    >
                        <div className={`absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full shadow transition-transform ${holeMode === "exact" ? "translate-x-4" : "translate-x-0.5"}`} />
                    </div>
                </label>
            </div>

            {/* Current selection display */}
            {displayHand && step === STEPS.DONE && (
                <div className="mb-3 p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                        <span className="text-xl font-bold font-mono tracking-wide" style={{ color: displayHand.c1Color }}>{displayHand.text}</span>
                        {displayHand.subtext && <span className="text-xs text-slate-400 ml-2">{displayHand.subtext}</span>}
                    </div>
                    <button
                        onClick={resetPicker}
                        className="text-xs px-2 py-1 rounded-lg border border-slate-200 text-slate-400 hover:bg-white hover:text-slate-600 transition-colors"
                    >Change</button>
                </div>
            )}

            {/* Step: Rank 1 */}
            {step === STEPS.RANK1 && (
                <div>
                    <div className="text-xs text-slate-400 mb-1.5">Pick first rank</div>
                    <div className="grid grid-cols-5 gap-1">
                        {RANKS_DESC.map(r => (
                            <button
                                key={r}
                                onClick={() => handleRank1(r)}
                                className="py-2 rounded-lg border border-slate-200 bg-white hover:bg-indigo-50 hover:border-indigo-300 text-sm font-semibold text-slate-800 transition-colors"
                            >{r}</button>
                        ))}
                    </div>
                </div>
            )}

            {/* Step: Rank 2 */}
            {step === STEPS.RANK2 && (
                <div>
                    <div className="text-xs text-slate-400 mb-1.5">
                        <span className="font-semibold text-indigo-600">{pendingR1}</span> → Pick second rank
                    </div>
                    <div className="grid grid-cols-5 gap-1">
                        {RANKS_DESC.map(r => (
                            <button
                                key={r}
                                onClick={() => handleRank2(r)}
                                className="py-2 rounded-lg border border-slate-200 bg-white hover:bg-indigo-50 hover:border-indigo-300 text-sm font-semibold text-slate-800 transition-colors"
                            >{r}</button>
                        ))}
                    </div>
                </div>
            )}

            {/* Step: Suitedness */}
            {step === STEPS.SUITEDNESS && (
                <div>
                    <div className="text-xs text-slate-400 mb-1.5">
                        <span className="font-semibold text-indigo-600">{pendingR1}{pendingR2}</span> — Suited or Offsuit?
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleSuitedness("s")}
                            className="flex-1 py-2.5 rounded-lg border-2 border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-sm font-semibold text-emerald-700 transition-colors"
                        >Suited</button>
                        <button
                            onClick={() => handleSuitedness("o")}
                            className="flex-1 py-2.5 rounded-lg border-2 border-amber-300 bg-amber-50 hover:bg-amber-100 text-sm font-semibold text-amber-700 transition-colors"
                        >Offsuit</button>
                    </div>
                </div>
            )}

            {/* Step: Suit 1 (exact mode) */}
            {step === STEPS.SUIT1 && (
                <div>
                    <div className="text-xs text-slate-400 mb-1.5">
                        <span className="font-semibold text-indigo-600">{pendingR1}{pendingR2}{pendingSuitedness === "p" ? "" : pendingSuitedness}</span> — Pick suit for {pendingR1}
                    </div>
                    <div className="flex gap-2">
                        {SUITS.map(s => {
                            const disabled = disabledSuit1.has(s);
                            return (
                                <button
                                    key={s}
                                    disabled={disabled}
                                    onClick={() => handleSuit1(s)}
                                    className={`flex-1 py-3 rounded-lg border-2 text-2xl transition-colors ${disabled
                                            ? "opacity-20 cursor-not-allowed border-slate-100 bg-slate-50"
                                            : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-400 cursor-pointer"
                                        }`}
                                    style={{ color: disabled ? "#9ca3af" : COLOR(s) }}
                                >{SUIT_SYMBOL[s]}</button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Step: Suit 2 (exact mode) */}
            {step === STEPS.SUIT2 && (
                <div>
                    <div className="text-xs text-slate-400 mb-1.5">
                        <span className="font-semibold text-indigo-600">{pendingR1}{SUIT_SYMBOL[pendingSuit1]}</span> — Pick suit for {pendingR2}
                    </div>
                    <div className="flex gap-2">
                        {SUITS.map(s => {
                            const disabled = disabledSuit2.has(s);
                            return (
                                <button
                                    key={s}
                                    disabled={disabled}
                                    onClick={() => handleSuit2(s)}
                                    className={`flex-1 py-3 rounded-lg border-2 text-2xl transition-colors ${disabled
                                            ? "opacity-20 cursor-not-allowed border-slate-100 bg-slate-50"
                                            : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-400 cursor-pointer"
                                        }`}
                                    style={{ color: disabled ? "#9ca3af" : COLOR(s) }}
                                >{SUIT_SYMBOL[s]}</button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
