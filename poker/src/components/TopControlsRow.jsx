import React from 'react';
import InfoPopover from './InfoPopover';
import { seatNames } from '../utils/poker';

/**
 * Top row: Players at table (LEFT), Seats from dealer (RIGHT).
 */
export default function TopControlsRow({
    players, setPlayers, seats, setSeats, seatName,
    openPopoverId, setOpenPopoverId
}) {
    return (
        <div className="grid grid-cols-2 gap-3">
            {/* Players at table — LEFT */}
            <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200 text-sm">
                <div className="flex items-center justify-between">
                    <div className="font-semibold text-slate-600">Players at table</div>
                    <InfoPopover insightId="multiway" openPopoverId={openPopoverId} setOpenPopoverId={setOpenPopoverId} />
                </div>
                <input
                    type="range" min={2} max={9} value={players}
                    onChange={e => setPlayers(parseInt(e.target.value))}
                    className="w-full mt-1 accent-indigo-600"
                />
                <div className="mt-1 text-slate-500">{players} players</div>
            </div>

            {/* Seats from dealer — RIGHT */}
            <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200 text-sm">
                <div className="flex items-center justify-between">
                    <div className="font-semibold text-slate-600">Seats from dealer</div>
                    <button
                        className="text-xs px-2 py-1 rounded-full border border-slate-200 text-slate-400 hover:bg-slate-50"
                        onClick={() => {
                            const msg = seatNames(players).map((n, i) => `${i}: ${n}`).join("\n");
                            alert(msg);
                        }}
                    >⋯</button>
                </div>
                <input
                    type="range" min={0} max={Math.max(1, players - 1)} value={seats}
                    onChange={e => setSeats(parseInt(e.target.value))}
                    className="w-full mt-1 accent-indigo-600"
                />
                <div className="mt-1 text-slate-500">{seats} seat(s) away • <b className="text-slate-900">{seatName}</b></div>
            </div>
        </div>
    );
}
