export const RANKS_ASC = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];
export const RANKS_DESC = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
export const SUITS = ["s", "c", "d", "h"];
export const SUIT_SYMBOL = { s: "♠", c: "♣", d: "♦", h: "♥" };

export const RAND = (arr) => arr[Math.floor(Math.random() * arr.length)];
export const COLOR = (s) => (s === "h" || s === "d") ? "#dc2626" : "#111827"; // Tailwind red-600 : gray-900
export const label = (r, s) => `${r === "T" ? "10" : r}${SUIT_SYMBOL[s]}`;
export const idx = (r) => RANKS_ASC.indexOf(r);

// Chen Score
const RVAL = { A: 10, K: 8, Q: 7, J: 6, T: 5, 9: 4, 8: 3, 7: 2, 6: 1, 5: 0, 4: 0, 3: 0, 2: 0 };
const isPair = (a, b) => a.r === b.r;
const isSuited = (a, b) => a.s === b.s;
const gaps = (a, b) => Math.max(0, Math.abs(idx(a.r) - idx(b.r)) - 1);

export function chenScore(a, b) {
    let hi = a, lo = b;
    if (RVAL[b.r] > RVAL[a.r] || (RVAL[b.r] === RVAL[a.r] && idx(b.r) > idx(a.r))) { hi = b; lo = a; }
    let sc = RVAL[hi.r];
    if (isPair(a, b)) sc = Math.max(5, 2 * RVAL[hi.r] + 10);
    if (isSuited(a, b)) sc += 2;
    const g = gaps(a, b);
    if (g === 1) sc -= 1; else if (g === 2) sc -= 2; else if (g === 3) sc -= 4; else if (g >= 4) sc -= 5;
    if (Math.abs(idx(hi.r) - idx(lo.r)) <= 1) sc += 1;
    return Math.max(0, Math.round(sc));
}

export function huFromChen(sc) {
    const P = [{ s: 0, e: 0.22 }, { s: 5, e: 0.40 }, { s: 8, e: 0.50 }, { s: 12, e: 0.66 }, { s: 16, e: 0.78 }, { s: 20, e: 0.85 }];
    if (sc <= 0) return 0.22; if (sc >= 20) return 0.85;
    let L = P[0], R = P[P.length - 1];
    for (let i = 0; i < P.length - 1; i++) { if (sc >= P[i].s && sc <= P[i + 1].s) { L = P[i]; R = P[i + 1]; break; } }
    const t = (sc - L.s) / (R.s - L.s);
    return L.e + t * (R.e - L.e);
}

export const mwFromHU = (p, n) => p == null ? null : Math.max(0.01, Math.min(0.95, Math.pow(p, Math.max(1, Math.min(8, n - 1)))));
export const confFromP = (p) => p == null ? { text: "—", color: "#9ca3af" } : (p >= 0.70 ? { text: "High", color: "#16a34a" } : (p >= 0.55 ? { text: "Medium", color: "#eab308" } : { text: "Low", color: "#dc2626" }));

// Positions
export const OPEN_THR = { EP: 12, MP: 10, CO: 8, BTN: 6, SB: 10, BB: 9 };

export function seatNames(n) {
    const tail = {
        0: [], 1: ["Cutoff (CO)"], 2: ["Under the Gun (UTG)", "Cutoff (CO)"],
        3: ["Under the Gun (UTG)", "Hijack (HJ)", "Cutoff (CO)"],
        4: ["Under the Gun (UTG)", "Middle Position (MP)", "Hijack (HJ)", "Cutoff (CO)"],
        5: ["Under the Gun (UTG)", "UTG+1", "Middle Position (MP)", "Hijack (HJ)", "Cutoff (CO)"],
        6: ["Under the Gun (UTG)", "UTG+1", "Middle Position (MP)", "Lojack (LJ)", "Hijack (HJ)", "Cutoff (CO)"]
    };
    return ["Button (BTN)", "Small Blind (SB)", "Big Blind (BB)", ...(tail[Math.max(0, Math.min(6, n - 3))] || [])];
}

export function posKey(n, seats) {
    const name = seatNames(n)[((seats % n) + n) % n] || "";
    if (name.includes("Under the Gun") || name.includes("UTG+1")) return "EP";
    if (name.includes("Lojack") || name.includes("Middle Position")) return "MP";
    if (name.includes("Cutoff")) return "CO";
    if (name.includes("Button")) return "BTN";
    if (name.includes("Small")) return "SB";
    if (name.includes("Big Blind")) return "BB";
    return "MP";
}

export function preflopAdvice(sc, pk, n) {
    const thr = OPEN_THR[pk] + (n >= 8 ? 1 : (n <= 5 ? -1 : 0));
    const m = sc - thr;
    let label = "FOLD", size = "—", reason = "Below opening threshold";
    if (m >= 4) { label = "RAISE BIG"; size = "3.5–4 bb"; reason = "Premium vs seat; strong playability"; }
    else if (m >= 0) { label = "OPEN RAISE"; size = "2.2–3 bb"; reason = "Meets seat threshold; take initiative"; }
    else if (m >= -2) { label = "MIX / CAUTIOUS"; size = "Open if table tight"; reason = "Borderline vs bar"; }
    return { label, size, reason, margin: m };
}

// Postflop
export function evalBoard(hole, board) {
    const all = [...hole, ...board];
    const counts = {}; const suitCount = { s: 0, c: 0, d: 0, h: 0 };
    all.forEach(x => { counts[x.r] = (counts[x.r] || 0) + 1; suitCount[x.s] = (suitCount[x.s] || 0) + 1; });
    const fd = Math.max(suitCount.s, suitCount.c, suitCount.d, suitCount.h) >= 4;
    const idxs = board.map(b => idx(b.r)); const top = idxs.length ? Math.max(...idxs) : 0; const topR = RANKS_ASC[top];
    const pair = (counts[hole[0].r] >= 2) || (counts[hole[1].r] >= 2) || board.some(b => b.r === hole[0].r || b.r === hole[1].r);
    const holePair = (hole[0].r === hole[1].r);
    const overpair = holePair && idx(hole[0].r) > top;
    const topPair = !holePair && (hole[0].r === topR || hole[1].r === topR);
    const uniq = Array.from(new Set(all.map(x => idx(x.r)))).sort((a, b) => a - b);
    let run = 1, best = 1; for (let i = 1; i < uniq.length; i++) { run = (uniq[i] === uniq[i - 1] + 1) ? run + 1 : 1; best = Math.max(best, run); }
    const oesd = best >= 4; let gut = false; for (let i = 0; i < uniq.length; i++) { const s = uniq[i]; const w = uniq.filter(x => x >= s && x <= s + 4); if (w.length === 4) { gut = true; break; } }
    let base = 0.35; let made = "air";
    if (Object.values(counts).some(v => v >= 4)) { base = 0.95; made = "quads+"; }
    else if (Object.values(counts).some(v => v === 3)) { base = 0.78; made = "trips"; }
    else if (Object.values(counts).filter(v => v >= 2).length >= 2) { base = 0.65; made = "two pair"; }
    else if (overpair) { base = 0.62; made = "overpair"; }
    else if (topPair) { base = Math.max(base, 0.58); made = (made === "air" ? "top pair" : made); }
    else if (pair) { base = Math.max(base, 0.48); made = (made === "air" ? "pair" : made); }
    else if ((hole[0].r === "A" || hole[1].r === "A") && made === "air") { base = 0.38; made = "A‑high"; }
    if (fd) base += 0.08; if (oesd) base += 0.08; else if (gut) base += 0.04;
    const pHU = Math.max(0.05, Math.min(0.9, base));
    const notes = []; if (fd) notes.push("flush draw"); if (oesd) notes.push("OESD"); if (gut) notes.push("gutshot");
    return { pHU, made, notes };
}

export function streetAdvice(pHU, notes) {
    if (pHU == null) return null;
    const hasFD = notes.includes("flush draw");
    const hasOESD = notes.includes("OESD");
    const hasGut = notes.includes("gutshot");
    if (pHU >= 0.75) return { label: "VALUE BET / RAISE", size: "66–100%", blurb: "Press advantage; deny equity." };
    if (pHU >= 0.60) return { label: "BET FOR VALUE", size: "33–66%", blurb: "Build pot vs worse; avoid over‑inflating OOP." };
    if (pHU >= 0.45) return { label: "CONTROL POT", size: "Check/25–33%", blurb: "Pot control; fold to strong lines." };
    if (hasFD || hasOESD || hasGut) return { label: "SEMI‑BLUFF", size: "33–50%", blurb: "Leverage fold equity; continue on good turns/rivers." };
    return { label: "CHECK / FOLD", size: "—", blurb: "Give up vs resistance." };
}
