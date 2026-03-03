/**
 * Centralized help text registry for all insight "i" popovers.
 * Keyed by insightId used across all streets.
 */
const helpRegistry = {
  tight_table: {
    title: "Tight Table",
    body: "A tight table means players generally play fewer starting hands, stick to stronger ranges, and make fewer loose calls or raises preflop. Against a tight table, you can widen your opening range slightly since opponents are folding more often — but respect their raises, as they usually represent real strength."
  },
  multiway: {
    title: "Multiway Approximation",
    body: "Multiway win rate is estimated as (heads-up %)^(opponents). More players at the table means a lower single-hand win rate, even for strong holdings. This is an approximation — real multiway equity depends on opponents' ranges."
  },
  preflop: {
    title: "Pre-flop Insights",
    body: "Uses the Chen formula to score your starting hand, then compares against a seat-dependent opening threshold. Premium hands get a RAISE BIG suggestion, playable hands get OPEN RAISE, and borderline hands are marked MIX / CAUTIOUS — open if the table is tight."
  },
  postflop: {
    title: "Post-flop Insights",
    body: "Evaluates your hand + board to estimate equity. Considers made hands (pairs, two pair, trips, etc.) plus draws (flush draws, open-ended straight draws, gutshots). Action sizing is keyed to your estimated equity vs. a single opponent."
  },
  postturn: {
    title: "Post-turn Insights",
    body: "Re-evaluates your equity with the turn card added. The delta shows how the turn changed your position. With one card left, draw probabilities become more concrete — flush draws and straight draws are either hit or miss on the river."
  },
  postriver: {
    title: "Post-river Insights",
    body: "Final street evaluation — your hand is complete. No more draws exist. Action suggestions are based purely on made-hand strength. Value bet strong hands, check/fold weak ones."
  },
  matrix: {
    title: "Range Matrix",
    body: "13×13 grid showing all possible starting hand combos. Green = raise, yellow = borderline/mix, red = fold. The thresholds adapt to your seat position and table size using the Chen score system. Your current hand is highlighted with a dark border."
  }
};

export default helpRegistry;
