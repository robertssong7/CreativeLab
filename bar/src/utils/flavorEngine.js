import { sample, maybe, generateCreativeName, getTipForIngredients } from './helpers';
import { RECIPES_DB } from '../data/recipes';

// --- Flavor Intelligence ---
// Defining the "Brain" of the bartender by categorizing ingredients
const FLAVOR_PROFILES = {
    // Bases
    "Vodka": { type: "base", tags: ["neutral", "clean"], power: 1 },
    "Gin": { type: "base", tags: ["herbal", "floral", "dry"], power: 2 },
    "Rum": { type: "base", tags: ["sweet", "tropical", "rich"], power: 2 },
    "Tequila": { type: "base", tags: ["earthy", "peppery", "vegetal"], power: 2 },
    "Whiskey": { type: "base", tags: ["oaky", "grain", "warm"], power: 3 },

    // Acids
    "Lemon Juice": { type: "acid", tags: ["sour", "bright", "citrus"], pairWith: ["Whiskey", "Gin", "Vodka"] },
    "Lime Juice": { type: "acid", tags: ["sour", "zesty", "citrus"], pairWith: ["Tequila", "Rum", "Gin"] },
    "Grapefruit Juice": { type: "acid", tags: ["bitter", "sour", "citrus"], pairWith: ["Tequila", "Gin"] },

    // Sweets
    "Simple Syrup": { type: "sweet", tags: ["neutral"], pairWith: ["*"] },
    "Honey Syrup": { type: "sweet", tags: ["floral", "rich"], pairWith: ["Whiskey", "Gin", "Tequila"] },
    "Agave Syrup": { type: "sweet", tags: ["earthy", "rich"], pairWith: ["Tequila", "Mezcal"] },
    "Grenadine": { type: "sweet", tags: ["fruity", "berry"], pairWith: ["Rum", "Non-Alcoholic Spirit"] },

    // Modifiers
    "Vermouth": { type: "modifier", tags: ["herbal", "winey"], pairWith: ["Gin", "Whiskey"] },
    "Aperol": { type: "modifier", tags: ["bitter-sweet", "orange"], pairWith: ["Prosecco", "Soda"] },
    "Coffee Liqueur": { type: "modifier", tags: ["coffee", "sweet", "dark"], pairWith: ["Vodka", "Rum"] },
    "Elderflower Liqueur": { type: "modifier", tags: ["floral", "sweet"], pairWith: ["Gin", "Vodka", "Prosecco"] },
    "Angostura Bitters": { type: "modifier", tags: ["spicy", "aromatic"], pairWith: ["Whiskey", "Rum"] },

    // Botanicals (Fresh)
    "Fresh Mint": { type: "botanical", tags: ["fresh", "cooling"], pairWith: ["Rum", "Whiskey", "Lime Juice"] },
    "Fresh Basil": { type: "botanical", tags: ["herbal", "peppery"], pairWith: ["Gin", "Vodka", "Lemon Juice"] },
    "Jalapeño": { type: "botanical", tags: ["spicy", "hot"], pairWith: ["Tequila", "Vodka", "Lime Juice"] },
    "Cucumber": { type: "botanical", tags: ["fresh", "watery"], pairWith: ["Gin", "Vodka", "Lime Juice"] },
    "Ginger": { type: "botanical", tags: ["spicy", "warm"], pairWith: ["Vodka", "Rum", "Whiskey"] },

    // Lengtheners
    "Club Soda": { type: "fizz", tags: ["neutral", "bubbly"], pairWith: ["*"] },
    "Tonic Water": { type: "fizz", tags: ["bitter", "sweet", "bubbly"], pairWith: ["Gin", "Vodka", "Coffee"] },
    "Ginger Beer": { type: "fizz", tags: ["spicy", "sweet", "bubbly"], pairWith: ["Vodka", "Rum", "Whiskey"] }
};

export function generateDrinks(mode, presentSet, count, prompt, filters, existingNames = new Set()) {
    const isMock = mode === 'mocktail';
    const db = isMock ? RECIPES_DB.mocktail : RECIPES_DB.cocktail;
    const pool = [];

    // 1. Logic for Classics (Existing Logic + Slight Enhancements)
    if (filters.classic) {
        const classics = db.map(r => {
            const missing = r.required.filter(req => !presentSet.has(req));

            // Heuristic Similarity
            let score = 0;
            if (prompt) {
                const p = prompt.toLowerCase();
                if (r.name.toLowerCase().includes(p)) score += 5;
                if (r.tags.some(t => t.toLowerCase().includes(p))) score += 3;
            }
            return { ...r, id: r.name + '::classic', score, missing };
        });

        // Exact matches
        const perfect = classics.filter(c => c.missing.length === 0);
        perfect.sort((a, b) => b.score - a.score);
        pool.push(...perfect);

        // Close matches (Missing 1)
        if (pool.length < count) {
            const close = classics.filter(c => c.missing.length === 1);
            close.sort((a, b) => b.score - a.score);
            pool.push(...close);
        }
    }

    // 2. "The Expert" Creative Generation
    if (filters.creative && pool.length < count) {
        const needed = count - pool.length;
        const generated = generateExpertCreative(mode, presentSet, needed * 2, prompt, existingNames); // Gen extra to filter
        pool.push(...generated);
    }

    // Dedup and slice
    const final = [];
    const seen = new Set();
    for (const r of pool) {
        if (!seen.has(r.name) && !existingNames.has(r.name)) {
            seen.add(r.name);
            final.push(r);
        }
        if (final.length >= count) break;
    }

    return final;
}

function generateExpertCreative(mode, presentSet, count, prompt, existingNames) {
    const available = Array.from(presentSet);
    const out = [];

    // Helper to get profile
    const prof = (name) => FLAVOR_PROFILES[name] || { type: "unknown", tags: [], pairWith: ["*"] };

    for (let i = 0; i < count * 3; i++) { // Try multiple times
        if (out.length >= count) break;

        // A. Pick a Base
        const bases = available.filter(x => prof(x).type === 'base' || (mode === 'mocktail' && (prof(x).type === 'foundation' || !prof(x).type)));
        // fallback for mocktails if no "base" defined in profile yet
        const mockBases = available.filter(x => ["Green Tea", "Black Tea", "Cold Brew Coffee", "Seedlip", "Non-Alcoholic Spirit"].some(b => x.includes(b)));

        const base = mode === 'mocktail' ? sample(mockBases.length ? mockBases : ["Club Soda"]) : sample(bases);
        if (!base) continue;

        // B. Pick Modifier (Acid/Sweet/Herbal) based on Base Affinity
        const baseProfile = prof(base);

        // Filter available ingredients that pair with this base
        const compatible = available.filter(ing => {
            const p = prof(ing);
            if (p.type === 'base' || p.type === 'foundation') return false; // Don't mix two bases usually
            if (p.pairWith.includes("*")) return true;
            if (p.pairWith.some(target => base.includes(target))) return true;
            return false;
        });

        const acid = maybe(sample(compatible.filter(x => prof(x).type === 'acid')), 0.9);
        const sweet = maybe(sample(compatible.filter(x => prof(x).type === 'sweet')), 0.9);
        const mod = maybe(sample(compatible.filter(x => prof(x).type === 'modifier' || prof(x).type === 'botanical')), 0.6);
        const fizz = maybe(sample(compatible.filter(x => prof(x).type === 'fizz')), 0.4);

        if (!acid && !mod && !fizz) continue; // Boring drink

        // Prompt Filtering
        if (prompt) {
            const p = prompt.toLowerCase();
            const allTags = [base, acid, sweet, mod, fizz].filter(Boolean).map(x => prof(x).tags).flat();
            const hasMatch = allTags.some(t => t.includes(p)) || [base, acid, sweet, mod, fizz].filter(Boolean).some(x => x.toLowerCase().includes(p));
            if (!hasMatch) continue;
        }

        // Name Generation
        const name = generateCreativeName(base, []);
        if (existingNames.has(name) || out.some(o => o.name === name)) continue;

        // Construct Spec
        let specParts = [];
        if (mod && prof(mod).type === 'botanical') specParts.push(`Muddle ${mod.toLowerCase()} gently`);

        specParts.push(`2 oz ${base}`);
        if (acid) specParts.push(`0.75 oz ${acid}`);
        if (sweet) specParts.push(`0.5 oz ${sweet}`);
        if (mod && prof(mod).type !== 'botanical') specParts.push(`0.5 oz ${mod}`);

        specParts.push("Shake with ice");
        if (fizz) specParts.push(`Top with ${fizz}`); else specParts.push("Double strain");

        // Tags
        const tags = ["Expert Pick"];
        if (fizz) tags.push("Highball");
        if (acid && sweet) tags.push("Sour");
        if (mod) tags.push("Complex");

        out.push({
            id: `exp-${Math.random()}`,
            name,
            tags: tags.slice(0, 3),
            spec: specParts.join(". "),
            tip: getTipForIngredients([base, acid, sweet, mod, fizz].filter(Boolean))
        });
    }

    return out;
}
