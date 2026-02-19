const NORM = {
    "salt": "Sea Salt", "sea salt": "Sea Salt",
    "soda": "Club Soda", "club soda": "Club Soda",
    "ginger ale": "Ginger Ale", "ginger beer": "Ginger Beer",
    "sparkling lemonade": "Sparkling Lemonade",
    "tea": "Black Tea", "coffee": "Cold Brew Coffee",
    "ice": "Ice Cubes"
};

export function titleCase(s) {
    return s.toLowerCase().split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export function normalize(item) {
    const trimmed = item.trim();
    const lower = trimmed.toLowerCase();
    if (NORM[lower]) return NORM[lower];
    return titleCase(trimmed);
}

// Returns { valid: boolean, missing: [] }
export function checkIngredients(present, required) {
    const missing = required.filter(r => !present.has(normalize(r)));
    return { valid: missing.length === 0, missing };
}

export function sample(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function maybe(val, chance = 0.5) {
    return val && Math.random() < chance ? val : undefined;
}

const ADJECTIVES = ["Velvet", "Golden", "Garden", "Dark", "Bright", "Spiced", "Royal", "Wild", "Cool", "Hidden", "Bitter", "Sweet", "Iron"];
const NOUNS = ["Smash", "Fizz", "Lift", "Sip", "Tonic", "Drift", "Crush", "Sour", "Mule", "Spritz", "Reviver", "Dram"];

export function generateCreativeName(base, ingredients) {
    const adj = sample(ADJECTIVES);
    const noun = sample(NOUNS);
    return `${adj} ${noun}`;
}

export function getTipForIngredients(ingredients) {
    if (ingredients.some(i => i.includes("Egg"))) return "Dry shake without ice first to emulsify the egg white.";
    if (ingredients.some(i => i.includes("Mint") || i.includes("Basil"))) return "Slap the herbs before garnishing to release the aromatics.";
    if (ingredients.some(i => i.includes("Cucumber"))) return "Double strain to ensure a silky smooth texture without pulp.";
    if (ingredients.some(i => i.includes("Tonic") || i.includes("Soda"))) return "Ensure your carbonated mixer is ice cold for maximum fizz.";
    if (ingredients.some(i => i.includes("Coffee") || i.includes("Brew"))) return "Use plenty of ice to dilute the concentration slightly.";
    if (ingredients.some(i => i.includes("Jalapeño") || i.includes("Ginger"))) return "Adjust the muddle time to control the spice level.";
    return "Chill your glassware beforehand for a pro touch.";
}
