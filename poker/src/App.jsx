import React, { useState, useMemo, useCallback } from 'react';
import {
  RANKS_ASC, RANKS_DESC, SUITS, COLOR, label, idx,
  chenScore, huFromChen, mwFromHU, confFromP,
  OPEN_THR, seatNames, posKey, preflopAdvice,
  evalBoard, streetAdvice
} from './utils/poker';

import TopControlsRow from './components/TopControlsRow';
import StreetSection from './components/StreetSection';
import HoleCardsPicker from './components/HoleCardsPicker';
import FlopPicker from './components/FlopPicker';
import SingleCardPicker from './components/SingleCardPicker';
import InsightsPanel from './components/InsightsPanel';
import MatrixPanel from './components/MatrixPanel';

export default function App() {
  // ── Stage ──
  const [stage, setStage] = useState(0);

  // ── Table ──
  const [players, setPlayers] = useState(6);
  const [seats, setSeats] = useState(1);

  // ── Hole cards (exact card keys) ──
  const [holeCard1, setHoleCard1] = useState("");
  const [holeCard2, setHoleCard2] = useState("");
  const [holeShowGrid, setHoleShowGrid] = useState(true);

  // ── Flop ──
  const [flopCards, setFlopCards] = useState(["", "", ""]);
  const [flopShowGrid, setFlopShowGrid] = useState(true);

  // ── Turn / River ──
  const [t, setT] = useState("");
  const [r, setR] = useState("");

  // ── Popover coordination ──
  const [openPopoverId, setOpenPopoverId] = useState(null);

  // ── Deck helper ──
  const DECK = useMemo(() => RANKS_ASC.flatMap(r => SUITS.map(s => ({ r, s }))), []);
  const key = (c) => c ? `${c.r}${c.s}` : "";
  const find = (k) => k ? (DECK.find(x => key(x) === k) || null) : null;

  // ── Parse hole card keys into card objects ──
  const c1 = useMemo(() => find(holeCard1), [holeCard1]);
  const c2 = useMemo(() => find(holeCard2), [holeCard2]);

  // ── Board card objects ──
  const f1c = useMemo(() => find(flopCards[0]), [flopCards]);
  const f2c = useMemo(() => find(flopCards[1]), [flopCards]);
  const f3c = useMemo(() => find(flopCards[2]), [flopCards]);
  const tc = useMemo(() => find(t), [t]);
  const rc = useMemo(() => find(r), [r]);

  // ── usedCardsSet (always includes hole + board) ──
  const usedCards = useMemo(() => {
    const set = new Set();
    if (holeCard1) set.add(holeCard1);
    if (holeCard2) set.add(holeCard2);
    flopCards.forEach(k => { if (k) set.add(k); });
    if (t) set.add(t);
    if (r) set.add(r);
    return set;
  }, [holeCard1, holeCard2, flopCards, t, r]);

  // ── Hole cards used set (for flop picker — only hole cards) ──
  const holeUsedForFlop = useMemo(() => {
    const set = new Set();
    if (holeCard1) set.add(holeCard1);
    if (holeCard2) set.add(holeCard2);
    return set;
  }, [holeCard1, holeCard2]);

  // ── Has valid hole cards ──
  const hasHoleCards = !!(c1 && c2);

  // ── Preflop computations ──
  const sc = useMemo(() => hasHoleCards ? chenScore(c1, c2) : null, [c1, c2, hasHoleCards]);
  const hu0 = useMemo(() => sc != null ? huFromChen(sc) : null, [sc]);
  const mw0 = useMemo(() => mwFromHU(hu0, players), [hu0, players]);
  const pk = useMemo(() => posKey(players, seats), [players, seats]);
  const seatName = useMemo(() => seatNames(players)[((seats % players) + players) % players], [players, seats]);
  const adv0 = useMemo(() => sc != null ? preflopAdvice(sc, pk, players) : null, [sc, pk, players]);
  const conf0 = useMemo(() => confFromP(hu0), [hu0]);

  // ── Board eval ──
  const flop = useMemo(() => {
    if (!hasHoleCards || !f1c || !f2c || !f3c) return null;
    if (new Set([key(c1), key(c2), key(f1c), key(f2c), key(f3c)]).size !== 5) return null;
    return [f1c, f2c, f3c];
  }, [c1, c2, f1c, f2c, f3c, hasHoleCards]);

  const turn = useMemo(() => {
    if (!flop || !tc) return null;
    const used = new Set([key(c1), key(c2), key(f1c), key(f2c), key(f3c)]);
    if (used.has(key(tc))) return null;
    return [...flop, tc];
  }, [flop, tc, c1, c2, f1c, f2c, f3c]);

  const riv = useMemo(() => {
    if (!turn || !rc) return null;
    const used = new Set([key(c1), key(c2), key(f1c), key(f2c), key(f3c), key(tc || { r: "", s: "" })]);
    if (used.has(key(rc))) return null;
    return [...turn, rc];
  }, [turn, rc, c1, c2, f1c, f2c, f3c, tc]);

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
    for (let ri = 0; ri < RANKS_DESC.length; ri++) {
      g[ri] = [];
      for (let ci = 0; ci < RANKS_DESC.length; ci++) {
        const a = { r: RANKS_DESC[ri], s: "s" };
        const b = { r: RANKS_DESC[ci], s: (ri < ci ? "s" : "h") };
        const scc = chenScore(a, b);
        g[ri][ci] = preflopAdvice(scc, pk, players).label;
      }
    }
    return g;
  }, [pk, players]);

  // ── New round / Fold ──
  const newRound = useCallback(() => {
    setHoleCard1("");
    setHoleCard2("");
    setHoleShowGrid(true);
    setFlopCards(["", "", ""]);
    setFlopShowGrid(true);
    setT("");
    setR("");
    setSeats(s => (s - 1 + players) % Math.max(1, players));
    setStage(0);
  }, [players]);

  // ── Flop card setter ──
  const setFlopCard = useCallback((index, value) => {
    setFlopCards(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);

  // For matrix highlighting, provide fallback cards
  const matrixC1 = c1 || { r: "A", s: "s" };
  const matrixC2 = c2 || { r: "K", s: "h" };

  return (
    <div className="p-5 max-w-4xl mx-auto min-h-screen">
      <h1 className="text-2xl font-bold mb-3 text-slate-900">Poker GTO Lite</h1>

      {/* ======= Top Controls Row ======= */}
      <TopControlsRow
        players={players} setPlayers={setPlayers}
        seats={seats} setSeats={setSeats}
        seatName={seatName}
        openPopoverId={openPopoverId} setOpenPopoverId={setOpenPopoverId}
      />

      {/* ======= Preflop Section (two-column) ======= */}
      <StreetSection
        bgClass="bg-indigo-50" borderClass="border-indigo-100"
        leftPanel={
          <HoleCardsPicker
            card1={holeCard1} card2={holeCard2}
            setCard1={setHoleCard1} setCard2={setHoleCard2}
            usedCards={new Set([...flopCards.filter(Boolean), t, r].filter(Boolean))}
            showGrid={holeShowGrid} setShowGrid={setHoleShowGrid}
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

      {/* ======= Flop Section (two-column like others) ======= */}
      {stage >= 1 && (
        <StreetSection
          leftPanel={
            <>
              <FlopPicker
                cards={flopCards}
                setCards={setFlopCard}
                usedCards={holeUsedForFlop}
                showGrid={flopShowGrid} setShowGrid={setFlopShowGrid}
              />
              {flop && (
                <div className="text-xs mt-2 text-slate-500">
                  Detected: <span className="text-slate-900 font-medium">{flEval?.made}</span>
                  {flEval?.notes?.length ? ` • ${flEval.notes.join(', ')}` : ''}
                </div>
              )}
            </>
          }
          rightPanel={
            <>
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
            </>
          }
        />
      )}

      {/* ======= Turn Section (two-column, untouched) ======= */}
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

      {/* ======= River Section (two-column, untouched) ======= */}
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

      {/* ======= Matrix Section (unchanged) ======= */}
      <MatrixPanel
        grid={grid} c1={matrixC1} c2={matrixC2}
        seatName={seatName}
        openPopoverId={openPopoverId} setOpenPopoverId={setOpenPopoverId}
      />
    </div>
  );
}
