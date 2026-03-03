import React from 'react';
import InfoPopover from './InfoPopover';
import { OPEN_THR } from '../utils/poker';

/**
 * Reusable insights panel — used for preflop, turn, and river right columns.
 * Displays Chen score (preflop only), HU/MW win rates with deltas,
 * suggested action, confidence badge, and optional eval notes.
 */
export default function InsightsPanel({
    street, // "preflop" | "flop" | "turn" | "river"
    advice, confidence,
    hu, mw,
    prevHu, prevMw,
    evalData, // { made, notes } for post-flop streets
    chenScore: chen, // preflop only
    seatName, players, positionKey, // preflop only
    accentColor = "text-indigo-700",
    openPopoverId, setOpenPopoverId,
}) {
    const pct = (x) => x == null ? "—" : `${(x * 100).toFixed(1)}%`;
    const delta = (a, b) => (a != null && b != null) ? ` (${((a - b) * 100 >= 0 ? "+" : "")}${((a - b) * 100).toFixed(1)})` : "";

    const popoverId = street === "preflop" ? "preflop"
        : street === "flop" ? "postflop"
            : street === "turn" ? "postturn"
                : "postriver";

    const streetLabel = street === "preflop" ? "Pre‑flop"
        : street === "flop" ? "Post‑flop"
            : street === "turn" ? "Post‑turn"
                : "Post‑river";

    return (
        <div>
            <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-600">{streetLabel}</div>
                <InfoPopover insightId={popoverId} openPopoverId={openPopoverId} setOpenPopoverId={setOpenPopoverId} />
            </div>

            {/* Preflop-specific: Chen score + seat info */}
            {street === "preflop" && chen != null && (
                <>
                    <div className="text-sm mt-1 text-slate-600">Chen score: <b className="text-slate-900">{chen}</b></div>
                    <div className="text-xs text-slate-400 mt-0.5">Seat: <b>{seatName}</b> • Players: <b>{players}</b></div>
                </>
            )}

            {/* Post-flop eval info */}
            {evalData && evalData.made && (
                <div className="text-xs mt-1 text-slate-500">
                    Detected: <span className="text-slate-900 font-medium">{evalData.made}</span>
                    {evalData.notes?.length ? ` • ${evalData.notes.join(', ')}` : ''}
                </div>
            )}

            {/* Win rates */}
            <div className="text-sm mt-1 text-slate-600">
                HU: <b className="text-slate-900">{pct(hu)}</b>{delta(hu, prevHu)}
                {" • "}MW: <b className="text-slate-900">{pct(mw)}</b>{delta(mw, prevMw)}
            </div>

            {/* Action + confidence */}
            {advice && (
                <div className="text-base mt-2">
                    Action: <b className={accentColor}>{advice.label}</b>
                    {advice.size && advice.size !== "—" ? ` · ${advice.size}` : ""}
                </div>
            )}
            {confidence && (
                <div className="text-sm mt-0.5">
                    Confidence: <span className="text-xs font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded" style={{ color: confidence.color }}>{confidence.text}</span>
                </div>
            )}
        </div>
    );
}
