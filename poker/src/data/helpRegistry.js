/**
 * Centralized help text registry for all insight "i" popovers.
 * Keyed by insightId used across all streets.
 * Each entry can have an optional `glossary` array with {term, def} pairs.
 */
const helpRegistry = {
  tight_table: {
    title: "Tight Table",
    body: "A tight table means players generally play fewer starting hands, stick to stronger ranges, and make fewer loose calls or raises preflop. Against a tight table, you can widen your opening range slightly since opponents are folding more often — but respect their raises, as they usually represent real strength."
  },
  multiway: {
    title: "Multiway Approximation",
    body: "Multiway win rate is estimated as (heads-up %)^(opponents). More players at the table means a lower single-hand win rate, even for strong holdings. This is an approximation — real multiway equity depends on opponents' ranges.",
    glossary: [
      { term: "Heads-up (HU)", def: "A pot contested between just two players." },
      { term: "Equity", def: "Your share of the pot based on the probability of winning at showdown." },
      { term: "Range", def: "The set of all possible hands a player could be holding in a given situation." }
    ]
  },
  preflop: {
    title: "Pre-flop Insights",
    body: "Uses the Chen formula to score your starting hand, then compares against a seat-dependent opening threshold. Premium hands get a RAISE BIG suggestion, playable hands get OPEN RAISE, and borderline hands are marked MIX / CAUTIOUS — open if the table is tight.",
    glossary: [
      { term: "Chen score", def: "A numerical formula that rates starting hands based on card ranks, suitedness, gaps, and pairs. Higher = stronger." },
      { term: "Opening threshold", def: "The minimum Chen score needed to open-raise from a given seat position." },
      { term: "Open raise", def: "Being the first player to put in a raise preflop (no one has raised before you)." },
      { term: "Tight table", def: "Players generally play fewer hands, sticking to stronger ranges with fewer loose calls." },
      { term: "Position (seat)", def: "Where you sit relative to the dealer. Later positions (Button, Cutoff) can play more hands because they act last." },
      { term: "bb (big blind)", def: "The standard unit for sizing bets and raises. 1 bb = the big blind amount." }
    ]
  },
  postflop: {
    title: "Post-flop Insights",
    body: "Evaluates your hand + board to estimate equity. Considers made hands (pairs, two pair, trips, etc.) plus draws (flush draws, open-ended straight draws, gutshots). Action sizing is keyed to your estimated equity vs. a single opponent.",
    glossary: [
      { term: "Made hand", def: "A complete hand like a pair, two pair, trips, straight, or flush." },
      { term: "Draw", def: "An incomplete hand that needs one or more cards to become a strong made hand." },
      { term: "Flush draw", def: "Having 4 cards of the same suit — one more card completes the flush." },
      { term: "OESD (Open-Ended Straight Draw)", def: "Having 4 consecutive cards — either end can complete the straight (8 outs)." },
      { term: "Gutshot", def: "A straight draw needing one specific middle card to complete (4 outs)." },
      { term: "Outs", def: "The number of unseen cards that would improve your hand." },
      { term: "Pot control", def: "Keeping the pot small when you have a medium-strength hand to avoid losing a big pot." },
      { term: "Semi-bluff", def: "Betting with a draw — you can win if opponents fold OR if you hit your draw." },
      { term: "Value bet", def: "Betting because you believe you have the best hand and want worse hands to call." }
    ]
  },
  postturn: {
    title: "Post-turn Insights",
    body: "Re-evaluates your equity with the turn card added. The delta shows how the turn changed your position. With one card left, draw probabilities become more concrete — flush draws and straight draws are either hit or miss on the river.",
    glossary: [
      { term: "Delta", def: "The change in your equity from the previous street (shown as +/− percentage)." },
      { term: "River", def: "The fifth and final community card dealt." },
      { term: "Fold equity", def: "The added value of a bet from the chance that your opponent folds." }
    ]
  },
  postriver: {
    title: "Post-river Insights",
    body: "Final street evaluation — your hand is complete. No more draws exist. Action suggestions are based purely on made-hand strength. Value bet strong hands, check/fold weak ones.",
    glossary: [
      { term: "Showdown", def: "When remaining players reveal their cards to determine the winner." },
      { term: "Bluff", def: "Betting with a weak hand to try to make opponents fold better hands." },
      { term: "Check/fold", def: "Checking when it's your action, then folding if an opponent bets — giving up on the pot." }
    ]
  },
  matrix: {
    title: "Range Matrix",
    body: "13×13 grid showing all 169 starting hand combos. Green = raise, yellow = borderline/mix, red = fold. The thresholds adapt to your seat position and table size using the Chen score system. Your current hand is highlighted with a dark border.",
    glossary: [
      { term: "Suited (s)", def: "Both hole cards share the same suit (e.g. A♠K♠). Shown above the diagonal." },
      { term: "Offsuit (o)", def: "Hole cards have different suits (e.g. A♠K♥). Shown below the diagonal." },
      { term: "Pocket pair", def: "Both hole cards are the same rank (e.g. TT). Shown on the diagonal." }
    ]
  }
};

export default helpRegistry;
