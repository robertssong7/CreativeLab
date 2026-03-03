import React, { useState, useMemo, useCallback } from 'react';
import {
  RAND, RANKS_ASC, RANKS_DESC, SUITS, COLOR, label, idx,
  chenScore, huFromChen, mwFromHU, confFromP,
  OPEN_THR, seatNames, posKey, preflopAdvice,
  evalBoard, streetAdvice
} from './utils/poker';

import TopControlsRow from './components/TopControlsRow';
import StreetSection from './components/StreetSection';
import HoleCardsPicker from './components/HoleCardsPicker';
import SingleCardPicker from './components/SingleCardPicker';
import InsightsPanel from './components/InsightsPanel';
import MatrixPanel from './components/MatrixPanel';

export default function App() {
  // ── Stage ──
  const [stage, setStage] = useState(0);

  // ── Table ──
  const [players, setPlayers] = useState(6);
  const [seats, setSeats] = useState(1);

  // ── Hole cards: dual-mode ──
  const [holeMode, setHoleMode] = useState("abstract");
  const [holeAbstract, setHoleAbstract] = useState({ r1: "A", r2: "K", suitedness: "o" });
  const [holeExact, setHoleExact] = useState(null);

  // ── Board ──
  const [f1, setF1] = useState("");
  const [f2, setF2] = useState("");
  const [f3, setF3] = useState("");
  const [t, setT] = useState("");
  const [r, setR] = useState("");

  // ── Popover coordination ──
  const [openPopoverId, setOpenPopoverId] = useState(null);

  // ── Deck helper ──
  const DECK = useMemo(() => RANKS_ASC.flatMap(r => SUITS.map(s => ({ r, s }))), []);
  const key = (c) => c ? `${c.r}${c.s}` : "";
  const find = (k) => DECK.find(x => key(x) === k) || null;

  // ── Synthesize c1/c2 for poker logic ──
  // In abstract mode we create representative cards from the abstract selection.
  // In exact mode we use the actual cards.
  const { c1, c2 } = useMemo(() => {
    if (holeMode === "exact" && holeExact) {
      return { c1: holeExact.c1, c2: holeExact.c2 };
    }
    if (holeAbstract) {
      const { r1, r2, suitedness } = holeAbstract;
      if (suitedness === "s") return { c1: { r: r1, s: "s" }, c2: { r: r2, s: "s" } };
      if (suitedness === "p") return { c1: { r: r1, s: "s" }, c2: { r: r2, s: "h" } };
      return { c1: { r: r1, s: "s" }, c2: { r: r2, s: "h" } }; // offsuit
    }
    return { c1: { r: "A", s: "s" }, c2: { r: "K", s: "h" } };
  }, [holeMode, holeExact, holeAbstract]);

  // ── Board card objects ──
  const f1c = useMemo(() => find(f1), [f1]);
  const f2c = useMemo(() => find(f2), [f2]);
  const f3c = useMemo(() => find(f3), [f3]);
  const tc = useMemo(() => find(t), [t]);
  const rc = useMemo(() => find(r), [r]);

  // ── usedCardsSet ──
  const usedCards = useMemo(() => {
    const set = new Set();
    // Board cards always
    [f1, f2, f3, t, r].forEach(k => { if (k) set.add(k); });
    // Hole cards only in exact mode
    if (holeMode === "exact" && holeExact) {
      set.add(key(holeExact.c1));
      set.add(key(holeExact.c2));
    }
    return set;
  }, [holeMode, holeExact, f1, f2, f3, t, r]);

  // ── Preflop computations ──
  const sc = useMemo(() => chenScore(c1, c2), [c1, c2]);
  const hu0 = useMemo(() => huFromChen(sc), [sc]);
  const mw0 = useMemo(() => mwFromHU(hu0, players), [hu0, players]);
  const pk = useMemo(() => posKey(players, seats), [players, seats]);
  const seatName = useMemo(() => seatNames(players)[((seats % players) + players) % players], [players, seats]);
  const adv0 = useMemo(() => preflopAdvice(sc, pk, players), [sc, pk, players]);
  const conf0 = useMemo(() => confFromP(hu0), [hu0]);

  // ── Board eval ──
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

  // ── Matrix grid ──
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

  // ── New round ──
  const newRound = useCallback(() => {
    setF1(""); setF2(""); setF3(""); setT(""); setR("");
    setSeats(s => (s - 1 + players) % Math.max(1, players));
    setHoleAbstract(null);
    setHoleExact(null);
    setStage(0);
  }, [players]);

  // ── Flop card used set (for dropdown disabling) ──
  const flopUsedCards = useMemo(() => {
    const set = new Set();
    if (holeMode === "exact" && holeExact) {
      set.add(key(holeExact.c1));
      set.add(key(holeExact.c2));
    }
    [f1, f2, f3].forEach(k => { if (k) set.add(k); });
    return set;
  }, [holeMode, holeExact, f1, f2, f3]);

  // ── Has valid hole cards selected ──
  const hasHoleCards = !!(holeAbstract || holeExact);

  return (
    <div className="p-5 max-w-4xl mx-auto min-h-screen">
      <h1 className="text-2xl font-bold mb-3 text-slate-900">Poker GTO Lite</h1>

      {/* ======= 1.1 Top Controls Row ======= */}
      <TopControlsRow
        players={players} setPlayers={setPlayers}
        seats={seats} setSeats={setSeats}
        seatName={seatName}
        openPopoverId={openPopoverId} setOpenPopoverId={setOpenPopoverId}
      />

      {/* ======= 1.2 Preflop Section (two-column) ======= */}
      <StreetSection
        bgClass="bg-indigo-50" borderClass="border-indigo-100"
        leftPanel={
          <HoleCardsPicker
            holeMode={holeMode} setHoleMode={setHoleMode}
            holeAbstract={holeAbstract} setHoleAbstract={setHoleAbstract}
            holeExact={holeExact} setHoleExact={setHoleExact}
            usedCards={usedCards}
          />
        }
        rightPanel={
          <InsightsPanel
            street="preflop"
            advice={hasHoleCards ? adv0 : null}
            confidence={hasHoleCards ? conf0 : null}
            hu={hasHoleCards ? hu0 : null}
            mw={hasHoleCards ? mw0 : null}
            prevHu={null} prevMw={null}
            chenScore={hasHoleCards ? sc : null}
            seatName={seatName} players={players} positionKey={pk}
            accentColor="text-indigo-700"
            openPopoverId={openPopoverId} setOpenPopoverId={setOpenPopoverId}
          />
        }
        actionRow={
          hasHoleCards && (
            <div className="flex gap-2">
              <button className="px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors shadow-sm" onClick={() => setStage(1)}>Play</button>
              <button className="px-3 py-2 rounded-md border border-slate-300 hover:bg-slate-50 text-slate-600" onClick={newRound}>Fold</button>
            </div>
          )
        }
      />

      {/* ======= 1.3 Flop Section (keep as-is dimensions) ======= */}
      {stage >= 1 && (
        <div className="p-4 mt-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-sm font-semibold text-slate-600">Choose the flop</div>
          <div className="grid md:grid-cols-3 gap-2 mt-1">
            {[
              { val: f1, set: setF1, prefix: "f1", card: f1c },
              { val: f2, set: setF2, prefix: "f2", card: f2c },
              { val: f3, set: setF3, prefix: "f3", card: f3c }
            ].map(({ val, set, prefix, card }) => (
              <select
                key={prefix}
                value={card ? key(card) : ""}
                onChange={e => set(e.target.value)}
                className="border border-slate-300 bg-slate-50 rounded-xl p-1 h-28 text-lg text-center focus:ring-2 focus:ring-indigo-500 outline-none"
                style={{ color: card ? COLOR(card.s) : undefined }}
              >
                <option value="">—</option>
                {RANKS_ASC.flatMap(rank => SUITS.map(suit => {
                  const k = `${rank}${suit}`;
                  const disabled = flopUsedCards.has(k) && k !== (card ? key(card) : "");
                  return (
                    <option key={`${prefix}${k}`} value={k} disabled={disabled} style={{ color: COLOR(suit) }}>
                      {label(rank, suit)}
                    </option>
                  );
                }))}
              </select>
            ))}
          </div>
          {flop && (
            <div className="text-xs mt-2 text-slate-500">
              Detected: <span className="text-slate-900 font-medium">{flEval?.made}</span>
              {flEval?.notes?.length ? ` • ${flEval.notes.join(', ')}` : ''}
            </div>
          )}
          {/* Flop insights inline (not two-column per spec: flop stays as-is) */}
          <div className="mt-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <InsightsPanel
              street="flop"
              advice={adv1} confidence={conf1}
              hu={hu1} mw={mw1}
              prevHu={hu0} prevMw={mw0}
              evalData={flEval}
              accentColor="text-emerald-600"
              openPopoverId={openPopoverId} setOpenPopoverId={setOpenPopoverId}
            />
            <div className="mt-2 flex gap-2">
              {flop && <button className="px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors shadow-sm" onClick={() => setStage(2)}>Play</button>}
              <button className="px-3 py-2 rounded-md border border-slate-300 hover:bg-white text-slate-600" onClick={newRound}>Fold</button>
            </div>
          </div>
        </div>
      )}

      {/* ======= 1.4 Turn Section (two-column) ======= */}
      {stage >= 2 && (
        <StreetSection
          leftPanel={
            <SingleCardPicker
              title="Choose the turn"
              value={t}
              onChange={setT}
              usedCards={usedCards}
            />
          }
          rightPanel={
            <>
              <InsightsPanel
                street="turn"
                advice={adv2} confidence={conf2}
                hu={hu2} mw={mw2}
                prevHu={hu1} prevMw={mw1}
                evalData={tuEval}
                accentColor="text-amber-600"
                openPopoverId={openPopoverId} setOpenPopoverId={setOpenPopoverId}
              />
              <div className="mt-2 flex gap-2">
                {turn && <button className="px-3 py-2 rounded-md bg-amber-600 hover:bg-amber-500 text-white font-semibold transition-colors shadow-sm" onClick={() => setStage(3)}>Play</button>}
                <button className="px-3 py-2 rounded-md border border-slate-300 hover:bg-white text-slate-600" onClick={newRound}>Fold</button>
              </div>
            </>
          }
        />
      )}

      {/* ======= 1.5 River Section (two-column) ======= */}
      {stage >= 3 && (
        <StreetSection
          leftPanel={
            <SingleCardPicker
              title="Choose the river"
              value={r}
              onChange={setR}
              usedCards={usedCards}
            />
          }
          rightPanel={
            <>
              <InsightsPanel
                street="river"
                advice={adv3} confidence={conf3}
                hu={hu3} mw={mw3}
                prevHu={hu2} prevMw={mw2}
                evalData={rvEval}
                accentColor="text-slate-700"
                openPopoverId={openPopoverId} setOpenPopoverId={setOpenPopoverId}
              />
              <div className="mt-2 flex gap-2">
                <button className="px-3 py-2 rounded-md bg-slate-700 hover:bg-slate-800 text-white border border-slate-700 shadow-sm" onClick={newRound}>New round</button>
                <button className="px-3 py-2 rounded-md border border-slate-300 hover:bg-white text-slate-600" onClick={newRound}>Fold</button>
              </div>
            </>
          }
        />
      )}

      {/* ======= 1.6 Matrix Section (unchanged) ======= */}
      <MatrixPanel
        grid={grid} c1={c1} c2={c2}
        seatName={seatName}
        openPopoverId={openPopoverId} setOpenPopoverId={setOpenPopoverId}
      />
    </div>
  );
}
