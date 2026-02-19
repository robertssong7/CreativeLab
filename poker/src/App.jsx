import React, { useState, useMemo } from 'react';
import {
  RAND, RANKS_ASC, RANKS_DESC, SUITS, COLOR, label, idx,
  chenScore, huFromChen, mwFromHU, confFromP,
  OPEN_THR, seatNames, posKey, preflopAdvice,
  evalBoard, streetAdvice
} from './utils/poker';

export default function App() {
  const [stage, setStage] = useState(0);
  const [players, setPlayers] = useState(6);
  const [seats, setSeats] = useState(1);

  const [c1, setC1] = useState({ r: RAND(RANKS_ASC), s: "s" });
  const [c2, setC2] = useState({ r: RAND(RANKS_ASC), s: "h" });

  const [f1, setF1] = useState("");
  const [f2, setF2] = useState("");
  const [f3, setF3] = useState("");
  const [t, setT] = useState("");
  const [r, setR] = useState("");

  const DECK = useMemo(() => RANKS_ASC.flatMap(r => SUITS.map(s => ({ r, s }))), []);
  const key = (c) => c ? `${c.r}${c.s}` : "";
  const find = (k) => DECK.find(x => key(x) === k) || null;

  const f1c = useMemo(() => find(f1), [f1]);
  const f2c = useMemo(() => find(f2), [f2]);
  const f3c = useMemo(() => find(f3), [f3]);
  const tc = useMemo(() => find(t), [t]);
  const rc = useMemo(() => find(r), [r]);

  const sc = useMemo(() => chenScore(c1, c2), [c1, c2]);
  const hu0 = useMemo(() => huFromChen(sc), [sc]);
  const mw0 = useMemo(() => mwFromHU(hu0, players), [hu0, players]);
  const pk = useMemo(() => posKey(players, seats), [players, seats]);
  const seatName = useMemo(() => seatNames(players)[((seats % players) + players) % players], [players, seats]);
  const adv0 = useMemo(() => preflopAdvice(sc, pk, players), [sc, pk, players]);
  const conf0 = useMemo(() => confFromP(hu0), [hu0]);

  const flop = useMemo(() => (f1c && f2c && f3c && new Set([key(c1), key(c2), key(f1c), key(f2c), key(f3c)]).size === 5) ? [f1c, f2c, f3c] : null, [c1, c2, f1c, f2c, f3c]);
  const turn = useMemo(() => (flop && tc && !new Set([key(c1), key(c2), key(f1c), key(f2c), key(f3c)]).has(key(tc))) ? [...flop, tc] : null, [flop, tc, c1, c2, f1c, f2c, f3c]);
  const riv = useMemo(() => (turn && rc && !new Set([key(c1), key(c2), key(f1c), key(f2c), key(f3c), key(tc || { r: "", s: "" })]).has(key(rc))) ? [...turn, rc] : null, [turn, rc, c1, c2, f1c, f2c, f3c, tc]);

  const flEval = useMemo(() => flop ? evalBoard([c1, c2], flop) : null, [c1, c2, flop]);
  const tuEval = useMemo(() => turn ? evalBoard([c1, c2], turn) : null, [c1, c2, turn]);
  const rvEval = useMemo(() => riv ? evalBoard([c1, c2], riv) : null, [c1, c2, riv]);

  const hu1 = flEval?.pHU ?? null, hu2 = tuEval?.pHU ?? null, hu3 = rvEval?.pHU ?? null;
  const mw1 = useMemo(() => mwFromHU(hu1, players), [hu1, players]);
  const mw2 = useMemo(() => mwFromHU(hu2, players), [hu2, players]);
  const mw3 = useMemo(() => mwFromHU(hu3, players), [hu3, players]);

  const adv1 = useMemo(() => (hu1 != null ? streetAdvice(hu1, flEval?.notes || []) : null), [hu1, flEval]);
  const adv2 = useMemo(() => (hu2 != null ? streetAdvice(hu2, tuEval?.notes || []) : null), [hu2, tuEval]);
  const adv3 = useMemo(() => (hu3 != null ? streetAdvice(hu3, rvEval?.notes || []) : null), [hu3, rvEval]);

  const conf1 = useMemo(() => confFromP(hu1), [hu1]);
  const conf2 = useMemo(() => confFromP(hu2), [hu2]);
  const conf3 = useMemo(() => confFromP(hu3), [hu3]);

  const grid = useMemo(() => {
    const g = [];
    for (let r = 0; r < RANKS_DESC.length; r++) {
      g[r] = [];
      for (let c = 0; c < RANKS_DESC.length; c++) {
        const a = { r: RANKS_DESC[r], s: "s" };
        const b = { r: RANKS_DESC[c], s: (r < c ? "s" : "h") };
        const scc = chenScore(a, b);
        g[r][c] = preflopAdvice(scc, pk, players).label;
      }
    }
    return g;
  }, [pk, players]);

  const pct = (x) => x == null ? "—" : `${(x * 100).toFixed(1)}%`;
  const d = (a, b) => (a != null && b != null) ? ` (${((a - b) * 100 >= 0 ? "+" : "")}${((a - b) * 100).toFixed(1)})` : "";

  function newRound() {
    setF1(""); setF2(""); setF3(""); setT(""); setR("");
    setSeats(s => (s - 1 + players) % Math.max(1, players));
    setC1({ r: RAND(RANKS_ASC), s: "s" });
    setC2({ r: RAND(RANKS_ASC), s: "h" });
    setStage(0);
  }

  return (
    <div className="p-5 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-2xl font-bold mb-3 text-slate-900">Poker GTO Lite — MVP</h1>

      {/* Top controls */}
      <div className="gap-3 grid md:grid-cols-3">
        {/* Hole cards */}
        <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200">
          <div className="text-sm font-semibold text-slate-600">Choose your cards</div>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <select value={key(c1)} onChange={e => setC1(find(e.target.value))} className="border border-slate-300 bg-slate-50 rounded-xl p-1 h-28 text-lg text-center cursor-pointer focus:ring-2 focus:ring-indigo-500 outline-none" style={{ color: COLOR(c1.s) }}>
              {RANKS_ASC.flatMap(r => SUITS.map(s => (
                <option key={`${r}${s}`} value={`${r}${s}`} style={{ color: COLOR(s) }}>{label(r, s)}</option>
              )))}
            </select>
            <select value={key(c2)} onChange={e => setC2(find(e.target.value))} className="border border-slate-300 bg-slate-50 rounded-xl p-1 h-28 text-lg text-center cursor-pointer focus:ring-2 focus:ring-indigo-500 outline-none" style={{ color: COLOR(c2.s) }}>
              {RANKS_ASC.flatMap(r => SUITS.map(s => (
                <option key={`b${r}${s}`} value={`${r}${s}`} style={{ color: COLOR(s) }}>{label(r, s)}</option>
              )))}
            </select>
          </div>
        </div>

        {/* Seats */}
        <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200 text-sm">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-slate-600">Seats from dealer</div>
            <button className="text-xs px-2 py-1 rounded-full border border-slate-200 text-slate-400 hover:bg-slate-50" onClick={() => {
              const msg = seatNames(players).map((n, i) => `${i}: ${n}`).join("\n");
              alert(msg);
            }}>⋯</button>
          </div>
          <input type="range" min={0} max={Math.max(1, players - 1)} value={seats} onChange={e => setSeats(parseInt(e.target.value))} className="w-full mt-1 accent-indigo-600" />
          <div className="mt-1 text-slate-500">{seats} seat(s) away • <b className="text-slate-900">{seatName}</b></div>
        </div>

        {/* Players */}
        <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200 text-sm">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-slate-600">Players at table</div>
            <button className="text-xs px-2 py-1 rounded-full border border-slate-200 text-slate-400 hover:bg-slate-50" onClick={() => {
              alert("Multiway ≈ (HU%)^opponents; more players → lower single‑hand win rate.");
            }}>⋯</button>
          </div>
          <input type="range" min={2} max={9} value={players} onChange={e => setPlayers(parseInt(e.target.value))} className="w-full mt-1 accent-indigo-600" />
          <div className="mt-1 text-slate-500">{players} players</div>
        </div>
      </div>

      {/* Pre‑flop box */}
      <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 shadow-sm mt-4">
        <div className="flex items-start justify-between">
          <div className="text-sm font-semibold text-indigo-800">Pre‑flop</div>
          <button className="text-xs px-2 py-1 rounded-full border border-indigo-200 text-indigo-500 hover:bg-indigo-100" onClick={() => {
            const msg = `Why: ${adv0.reason}\nOpen bar: ${OPEN_THR[pk]} (adj by table size)`; alert(msg);
          }}>i</button>
        </div>
        <div className="text-sm mt-1 text-slate-600">Chen score: <b className="text-slate-900">{sc}</b></div>
        <div className="text-sm text-slate-600">Win (heads‑up): <b className="text-slate-900">{pct(hu0)}</b> • Win (multiway): <b className="text-slate-900">{pct(mw0)}</b></div>
        <div className="text-base mt-2">Suggested action: <b className="text-indigo-700">{adv0.label}</b> {adv0.size !== "—" ? `· ${adv0.size}` : ""} {conf0 && <span className="text-xs font-mono bg-white border border-slate-200 px-1 rounded ml-1" style={{ color: conf0.color }}>({conf0.text})</span>}</div>
        <div className="text-xs text-slate-400 mt-1">Seat: <b>{seatName}</b> • Players: <b>{players}</b></div>
        <div className="mt-3 flex gap-2">
          <button className="px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors shadow-sm" onClick={() => setStage(1)}>Play</button>
          <button className="px-3 py-2 rounded-md border border-slate-300 hover:bg-slate-50 text-slate-600" onClick={newRound}>Fold</button>
        </div>
      </div>

      {/* FLOP box */}
      {stage >= 1 && (
        <div className="p-4 mt-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-sm font-semibold text-slate-600">Choose the flop</div>
          <div className="grid md:grid-cols-3 gap-2 mt-1">
            <select value={key(f1c)} onChange={e => setF1(e.target.value)} className="border border-slate-300 bg-slate-50 rounded-xl p-1 h-28 text-lg text-center focus:ring-2 focus:ring-indigo-500 outline-none" style={{ color: f1c ? COLOR(f1c.s) : undefined }}>
              <option value="">—</option>
              {RANKS_ASC.flatMap(r => SUITS.map(s => (
                <option key={`f1${r}${s}`} value={`${r}${s}`} style={{ color: COLOR(s) }}>{label(r, s)}</option>
              )))}
            </select>
            <select value={key(f2c)} onChange={e => setF2(e.target.value)} className="border border-slate-300 bg-slate-50 rounded-xl p-1 h-28 text-lg text-center focus:ring-2 focus:ring-indigo-500 outline-none" style={{ color: f2c ? COLOR(f2c.s) : undefined }}>
              <option value="">—</option>
              {RANKS_ASC.flatMap(r => SUITS.map(s => (
                <option key={`f2${r}${s}`} value={`${r}${s}`} style={{ color: COLOR(s) }}>{label(r, s)}</option>
              )))}
            </select>
            <select value={key(f3c)} onChange={e => setF3(e.target.value)} className="border border-slate-300 bg-slate-50 rounded-xl p-1 h-28 text-lg text-center focus:ring-2 focus:ring-indigo-500 outline-none" style={{ color: f3c ? COLOR(f3c.s) : undefined }}>
              <option value="">—</option>
              {RANKS_ASC.flatMap(r => SUITS.map(s => (
                <option key={`f3${r}${s}`} value={`${r}${s}`} style={{ color: COLOR(s) }}>{label(r, s)}</option>
              )))}
            </select>
          </div>
          {flop && <div className="text-xs mt-2 text-slate-500">Detected: <span className="text-slate-900 font-medium">{flEval?.made}</span>{flEval?.notes?.length ? ` • ${flEval.notes.join(', ')}` : ''}</div>}
          <div className="mt-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-slate-600">Post‑flop</div>
              <button className="text-xs px-2 py-1 rounded-full border border-slate-200 text-slate-400 hover:bg-white" onClick={() => {
                const msg = `Equity: ${pct(hu1)}\nDraws: ${(flEval?.notes || []).join(', ') || 'none'}`; alert(msg);
              }}>i</button>
            </div>
            <div className="text-lg mt-1">Action: <b className="text-emerald-600">{adv1?.label || '—'}</b> {adv1?.size && adv1.size !== "—" ? `· ${adv1.size}` : ''}</div>
            <div className="text-sm mt-1">Confidence: <span style={{ color: conf1.color }}>{conf1.text}</span></div>
            <div className="text-sm text-slate-500">HU: <b className="text-slate-900">{pct(hu1)}</b>{d(hu1, hu0)} • MW: <b className="text-slate-900">{pct(mw1)}</b>{d(mw1, mw0)}</div>
            <div className="mt-2 flex gap-2">
              {flop && <button className="px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors shadow-sm" onClick={() => setStage(2)}>Play</button>}
              <button className="px-3 py-2 rounded-md border border-slate-300 hover:bg-white text-slate-600" onClick={newRound}>Fold</button>
            </div>
          </div>
        </div>
      )}

      {/* TURN box */}
      {stage >= 2 && (
        <div className="p-4 mt-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-sm font-semibold text-slate-600">Choose the turn</div>
          <div className="mt-1">
            <select value={key(tc)} onChange={e => setT(e.target.value)} className="border border-slate-300 bg-slate-50 rounded-xl p-1 h-28 text-lg text-center focus:ring-2 focus:ring-indigo-500 outline-none" style={{ color: tc ? COLOR(tc.s) : undefined }}>
              <option value="">—</option>
              {RANKS_ASC.flatMap(r => SUITS.map(s => {
                const k = `${r}${s}`;
                const used = new Set([key(c1), key(c2), key(f1c), key(f2c), key(f3c)]);
                return <option key={`t${k}`} value={k} disabled={used.has(k)} style={{ color: COLOR(s) }}>{label(r, s)}</option>;
              }))}
            </select>
          </div>
          {turn && <div className="text-xs mt-2 text-slate-500">Detected: <span className="text-slate-900 font-medium">{tuEval?.made}</span>{tuEval?.notes?.length ? ` • ${tuEval.notes.join(', ')}` : ''}</div>}
          <div className="mt-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-slate-600">Post‑turn</div>
              <button className="text-xs px-2 py-1 rounded-full border border-slate-200 text-slate-400 hover:bg-white" onClick={() => {
                const msg = `Equity: ${pct(hu2)}\nDraws: ${(tuEval?.notes || []).join(', ') || 'none'}`; alert(msg);
              }}>i</button>
            </div>
            <div className="text-lg mt-1">Action: <b className="text-amber-600">{adv2?.label || '—'}</b> {adv2?.size && adv2.size !== "—" ? `· ${adv2.size}` : ''}</div>
            <div className="text-sm mt-1">Confidence: <span style={{ color: conf2.color }}>{conf2.text}</span></div>
            <div className="text-sm text-slate-500">HU: <b className="text-slate-900">{pct(hu2)}</b>{d(hu2, hu1)} • MW: <b className="text-slate-900">{pct(mw2)}</b>{d(mw2, mw1)}</div>
            <div className="mt-2 flex gap-2">
              {turn && <button className="px-3 py-2 rounded-md bg-amber-600 hover:bg-amber-500 text-white font-semibold transition-colors shadow-sm" onClick={() => setStage(3)}>Play</button>}
              <button className="px-3 py-2 rounded-md border border-slate-300 hover:bg-white text-slate-600" onClick={newRound}>Fold</button>
            </div>
          </div>
        </div>
      )}

      {/* RIVER box */}
      {stage >= 3 && (
        <div className="p-4 mt-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-sm font-semibold text-slate-600">Choose the river</div>
          <div className="mt-1">
            <select value={key(rc)} onChange={e => setR(e.target.value)} className="border border-slate-300 bg-slate-50 rounded-xl p-1 h-28 text-lg text-center focus:ring-2 focus:ring-indigo-500 outline-none" style={{ color: rc ? COLOR(rc.s) : undefined }}>
              <option value="">—</option>
              {RANKS_ASC.flatMap(r0 => SUITS.map(s0 => {
                const k = `${r0}${s0}`;
                const used = new Set([key(c1), key(c2), key(f1c), key(f2c), key(f3c), key(tc || { r: "", s: "" })]);
                return <option key={`r${k}`} value={k} disabled={used.has(k)} style={{ color: COLOR(s0) }}>{label(r0, s0)}</option>;
              }))}
            </select>
          </div>
          {riv && <div className="text-xs mt-2 text-slate-500">Detected: <span className="text-slate-900 font-medium">{rvEval?.made}</span>{rvEval?.notes?.length ? ` • ${rvEval.notes.join(', ')}` : ''}</div>}
          <div className="mt-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-slate-600">Post‑river</div>
              <button className="text-xs px-2 py-1 rounded-full border border-slate-200 text-slate-400 hover:bg-white" onClick={() => {
                const msg = `Equity: ${pct(hu3)}\nDraws: ${(rvEval?.notes || []).join(', ') || 'none'}`; alert(msg);
              }}>i</button>
            </div>
            <div className="text-lg mt-1">Action: <b className="text-slate-700">{adv3?.label || '—'}</b> {adv3?.size && adv3.size !== "—" ? `· ${adv3.size}` : ''}</div>
            <div className="text-sm mt-1">Confidence: <span style={{ color: conf3.color }}>{conf3.text}</span></div>
            <div className="text-sm text-slate-500">HU: <b className="text-slate-900">{pct(hu3)}</b>{d(hu3, hu2)} • MW: <b className="text-slate-900">{mw3 == null ? '—' : pct(mw3)}</b>{d(mw3 ?? null, mw2)}</div>
            <div className="mt-2 flex gap-2">
              <button className="px-3 py-2 rounded-md bg-slate-700 hover:bg-slate-800 text-white border border-slate-700 shadow-sm" onClick={newRound}>New round</button>
              <button className="px-3 py-2 rounded-md border border-slate-300 hover:bg-white text-slate-600" onClick={newRound}>Fold</button>
            </div>
          </div>
        </div>
      )}

      {/* Range matrix */}
      <div className="p-4 mt-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-600">13×13 Range Matrix — {seatName}</div>
          <button className="text-xs px-2 py-1 rounded-full border border-slate-200 text-slate-400 hover:bg-slate-50" onClick={() => {
            alert("Matrix uses Chen + seat‑dependent open bars.");
          }}>⋯</button>
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
    </div>
  );
}
