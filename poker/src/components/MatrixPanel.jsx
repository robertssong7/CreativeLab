import React from 'react';
import { RANKS_DESC } from '../utils/poker';
import InfoPopover from './InfoPopover';

/**
 * 13×13 range matrix — extracted from App.jsx.
 * No logic changes, just repositioned into its own component.
 */
export default function MatrixPanel({ grid, c1, c2, seatName, openPopoverId, setOpenPopoverId }) {
    return (
        <div className="p-4 mt-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-600">13×13 Range Matrix — {seatName}</div>
                <InfoPopover insightId="matrix" openPopoverId={openPopoverId} setOpenPopoverId={setOpenPopoverId} />
            </div>
            <div className="overflow-auto mt-2">
                <table className="border-collapse text-[11px] w-full text-slate-500">
                    <thead>
                        <tr>
                            <th></th>
                            {RANKS_DESC.map(h => <th key={`h${h}`} className="px-1 py-0.5 text-center">{h}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {grid.map((row, ri) => (
                            <tr key={`r${ri}`}>
                                <th className="px-1 py-0.5 text-center">{RANKS_DESC[ri]}</th>
                                {row.map((lab, ci) => {
                                    const i1 = RANKS_DESC.indexOf(c1.r), i2 = RANKS_DESC.indexOf(c2.r);
                                    const sel = (c1.r === c2.r && i1 === ri && ci === ri) ||
                                        (c1.r !== c2.r && ((c1.s === c2.s && Math.min(i1, i2) === ri && Math.max(i1, i2) === ci) ||
                                            (c1.s !== c2.s && Math.max(i1, i2) === ri && Math.min(i1, i2) === ci)));
                                    const bg = (lab === "RAISE BIG" ? "#15803d" : lab === "OPEN RAISE" ? "#16a34a" : lab === "MIX / CAUTIOUS" ? "#eab308" : "#b91c1c");
                                    const tag = `${RANKS_DESC[ri]}${RANKS_DESC[ci]}${ri < ci ? "s" : (ri === ci ? "" : "o")}`;
                                    return (
                                        <td key={`c${ri}-${ci}`}
                                            style={{
                                                backgroundColor: bg,
                                                color: '#fff',
                                                padding: '4px',
                                                border: sel ? '3px solid #1e293b' : '1px solid rgba(255,255,255,0.2)',
                                                borderRadius: '2px',
                                                opacity: 0.9
                                            }}
                                            title={`${tag}: ${lab}`}>
                                            {tag}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
