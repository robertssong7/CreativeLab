export const COCKTAIL_CATEGORIES = [
    { key: "base", title: "Base Spirits", helper: "The foundation.", options: ["Vodka", "Gin", "Rum", "Tequila", "Whiskey"], min: 1 },
    { key: "liqueurs", title: "Modifiers", helper: "Flavor enhancers.", options: ["Amaretto", "Vermouth", "Aperol", "Coffee Liqueur", "Elderflower Liqueur"] },
    { key: "mixers", title: "Mixers", helper: "Lengtheners.", options: ["Club Soda", "Tonic Water", "Cola", "Lemonade", "Sparkling Water"] },
    { key: "juices", title: "Juices", helper: "Acidity.", options: ["Lemon Juice", "Lime Juice", "Orange Juice", "Pineapple Juice", "Cranberry Juice"] },
    { key: "syrups", title: "Syrups", helper: "Balance.", options: ["Simple Syrup", "Agave Syrup", "Grenadine", "Honey Syrup"] },
    { key: "bitters", title: "Bitters", helper: "Complexity.", options: ["Angostura Bitters", "Orange Bitters", "Absinthe"] },
    { key: "essentials", title: "Essentials", helper: "Texture.", options: ["Ice Cubes", "Salt", "Sugar", "Egg Whites"] },
];

export const MOCKTAIL_CATEGORIES = [
    { key: "foundation", title: "The Foundation", helper: "Structure & body.", options: ["Green Tea", "Black Tea", "Cold Brew Coffee", "Coconut Water", "Non-Alcoholic Spirit", "Ginger Beer", "Kombucha"], min: 1 },
    { key: "acids", title: "Acids & Shrubs", helper: "The 'Bite'.", options: ["Lemon Juice", "Lime Juice", "Apple Cider Vinegar", "Verjus", "Grapefruit Juice", "Yuzu Juice"] },
    { key: "sweeteners", title: "Sweet & Viscosity", helper: "Texture.", options: ["Simple Syrup", "Honey Syrup", "Agave Syrup", "Maple Syrup", "Grenadine"] },
    { key: "botanicals", title: "Botanicals & Heat", helper: "Nose & spice.", options: ["Fresh Mint", "Fresh Basil", "Rosemary", "Jalapeño", "Ginger", "Cucumber", "Sea Salt"] },
    { key: "lengtheners", title: "The Sparkle", helper: "Effervescence.", options: ["Club Soda", "Tonic Water", "Sparkling Lemonade", "Ginger Ale", "Sparkling Water"] },
];

// Flavor profile tags used for the Flavor Matrix navigation
export const FLAVOR_TAGS = [
    { id: "refreshing", label: "Refreshing", emoji: "💧" },
    { id: "spirit-forward", label: "Spirit-Forward", emoji: "🥃" },
    { id: "bitter", label: "Bitter", emoji: "🍊" },
    { id: "herbaceous", label: "Herbaceous", emoji: "🌿" },
    { id: "sweet", label: "Sweet", emoji: "🍯" },
    { id: "tart", label: "Tart", emoji: "🍋" },
    { id: "smoky", label: "Smoky", emoji: "🔥" },
    { id: "tropical", label: "Tropical", emoji: "🌴" },
    { id: "creamy", label: "Creamy", emoji: "🥛" },
    { id: "spicy", label: "Spicy", emoji: "🌶️" },
];

// Substitution map: ingredient -> { reason, alternatives: [{ name, note }] }
export const SUBSTITUTIONS = {
    "Campari": { reason: "Bitterness & colour", alternatives: [{ name: "Aperol", note: "Sweeter, less bitter — add a dash of Angostura Bitters to compensate" }, { name: "Grapefruit Juice", note: "Muddle peel for bitter oil; add 0.25 oz grenadine for colour" }] },
    "Aperol": { reason: "Bitter-sweet orange", alternatives: [{ name: "Campari", note: "More intensely bitter — reduce amount by half" }, { name: "Orange Juice", note: "Add 2 dashes Orange Bitters to approximate the bitterness" }] },
    "Vermouth": { reason: "Herbal depth & wine body", alternatives: [{ name: "Lillet Blanc", note: "Lighter, more floral — beautiful in a Vesper riff" }, { name: "Dry White Wine", note: "Add a pinch of dried herbs (thyme/oregano) for complexity" }] },
    "Coffee Liqueur": { reason: "Coffee sweetness & viscosity", alternatives: [{ name: "Cold Brew Coffee", note: "Add 0.5 oz Simple Syrup to match sweetness" }, { name: "Amaretto", note: "Nutty rather than coffee-forward, but texturally similar" }] },
    "Elderflower Liqueur": { reason: "Floral sweetness", alternatives: [{ name: "Honey Syrup", note: "Add a few drops of rosewater for floral character" }, { name: "Simple Syrup", note: "Pair with a sprig of fresh lavender muddled gently" }] },
    "Amaretto": { reason: "Almond warmth & sweetness", alternatives: [{ name: "Honey Syrup", note: "Add a drop of almond extract if you have it" }, { name: "Maple Syrup", note: "Similar weight and warmth, different flavour direction" }] },
    "Angostura Bitters": { reason: "Aromatic spice backbone", alternatives: [{ name: "Orange Bitters", note: "Less cinnamon, more citrus — works in most recipes" }, { name: "Absinthe", note: "Use only a rinse/dash — far more potent" }] },
    "Orange Bitters": { reason: "Citrus aromatics", alternatives: [{ name: "Angostura Bitters", note: "More spice, less citrus — add a small orange twist" }, { name: "Orange Juice", note: "Use 0.25 oz with a pinch of black pepper" }] },
    "Absinthe": { reason: "Anise & herbal intensity", alternatives: [{ name: "Angostura Bitters", note: "3-4 dashes for aromatic complexity without anise" }] },
    "Tonic Water": { reason: "Quinine bitterness + fizz", alternatives: [{ name: "Club Soda", note: "Add a squeeze of grapefruit for bitterness" }, { name: "Sparkling Water", note: "Add 2 dashes of Orange Bitters for depth" }] },
    "Ginger Beer": { reason: "Spicy fizz", alternatives: [{ name: "Ginger Ale", note: "Milder — muddle a coin of fresh ginger for more fire" }, { name: "Club Soda", note: "Add 0.5 oz Ginger Syrup (or muddle fresh ginger)" }] },
    "Egg Whites": { reason: "Silky foam & body", alternatives: [{ name: "Aquafaba", note: "Chickpea water — 1 oz replaces 1 egg white perfectly (vegan)" }] },
    "Non-Alcoholic Spirit": { reason: "Complex botanical base", alternatives: [{ name: "Green Tea", note: "Cold-brewed for tannin structure" }, { name: "Kombucha", note: "Adds funk, acidity, and body" }] },
    "Kombucha": { reason: "Acidity, funk, carbonation", alternatives: [{ name: "Ginger Beer", note: "Add a splash of Apple Cider Vinegar for tang" }, { name: "Sparkling Water", note: "Add 0.5 oz shrub or Apple Cider Vinegar + honey" }] },
    "Verjus": { reason: "Grape acidity without alcohol", alternatives: [{ name: "Lemon Juice", note: "Use half the amount — verjus is softer" }, { name: "Apple Cider Vinegar", note: "Dilute 1:1 with water" }] },
    "Yuzu Juice": { reason: "Unique floral citrus", alternatives: [{ name: "Grapefruit Juice", note: "Mix 2:1 grapefruit to lemon for a similar profile" }, { name: "Lemon Juice", note: "Add a small piece of mandarin peel" }] },
};

export const RECIPES_DB = {
    cocktail: [
        { name: "Whiskey Sour", flavorTags: ["tart", "spirit-forward", "sweet"], tags: ["Classic", "Tart", "Complex"], required: ["Whiskey", "Lemon Juice", "Simple Syrup"], spec: "2 oz whiskey. 1 oz lemon. 1 oz simple. Shake hard, double strain.", tip: "Dry shake (no ice) first if using egg white for extra foam.", batchDilution: 0.25 },
        { name: "Margarita", flavorTags: ["tart", "refreshing"], tags: ["Classic", "Tart"], required: ["Tequila", "Lime Juice", "Agave Syrup"], spec: "2 oz tequila. 1 oz lime. 0.75 oz agave. Shake, strain over fresh ice.", tip: "Use a lime wedge to wet the rim for salt, not water.", batchDilution: 0.2 },
        { name: "Gin & Tonic", flavorTags: ["refreshing", "bitter", "herbaceous"], tags: ["Highball", "Refresher"], required: ["Gin", "Tonic Water"], spec: "2 oz gin. Build over ice. Top with tonic.", tip: "Pour the tonic down a bar spoon to keep the bubbles alive.", batchDilution: 0 },
        { name: "Espresso Martini", flavorTags: ["sweet", "creamy", "spirit-forward"], tags: ["Modern Classic", "Sweet", "Complex"], required: ["Vodka", "Coffee Liqueur", "Cold Brew Coffee"], spec: "1.5 oz vodka. 1 oz coffee liqueur. 1 oz cold brew. Shake hard.", tip: "Shake until your hands freeze to get that perfect crema foam.", batchDilution: 0.2 },
        { name: "Aperol Spritz", flavorTags: ["bitter", "refreshing", "sweet"], tags: ["Spritz", "Classic"], required: ["Aperol", "Sparkling Water"], spec: "2 oz Aperol. 3 oz Sparkling Water. Splash of Soda. Build in glass over ice.", tip: "Add the sparkling water before the Aperol to prevent it from settling at the bottom.", batchDilution: 0 },
        { name: "Manhattan", flavorTags: ["spirit-forward", "bitter", "herbaceous"], tags: ["Classic", "Strong"], required: ["Whiskey", "Vermouth", "Angostura Bitters"], spec: "2 oz Whiskey. 1 oz Sweet Vermouth. 2 dashes Bitters. Stir with ice, strain.", tip: "Never shake a Manhattan; stirring preserves the silky texture.", batchDilution: 0.25 },
        { name: "Negroni", flavorTags: ["bitter", "spirit-forward", "herbaceous"], tags: ["Classic", "Bitter"], required: ["Gin", "Vermouth", "Aperol"], spec: "1 oz gin. 1 oz sweet vermouth. 1 oz Aperol (or Campari). Stir with ice, strain over a large cube.", tip: "Express an orange peel over the glass — the oils are everything.", batchDilution: 0.2 },
        { name: "Daiquiri", flavorTags: ["tart", "refreshing", "sweet"], tags: ["Classic", "Tart"], required: ["Rum", "Lime Juice", "Simple Syrup"], spec: "2 oz rum. 1 oz lime. 0.75 oz simple. Shake hard, double strain.", tip: "A Daiquiri is the ultimate test of a bartender. No blender needed.", batchDilution: 0.2 },
        { name: "Old Fashioned", flavorTags: ["spirit-forward", "sweet", "smoky"], tags: ["Classic", "Strong"], required: ["Whiskey", "Angostura Bitters", "Sugar"], spec: "2 oz whiskey. 1 sugar cube. 3 dashes bitters. Stir, serve on a large rock.", tip: "Muddle the sugar with bitters and a splash of water, not the fruit.", batchDilution: 0.15 },
        { name: "Paloma", flavorTags: ["refreshing", "tart", "sweet"], tags: ["Classic", "Refresher"], required: ["Tequila", "Grapefruit Juice", "Lime Juice", "Club Soda"], spec: "2 oz tequila. 2 oz grapefruit juice. 0.5 oz lime. Top soda. Pinch of salt.", tip: "A salted rim transforms this drink.", batchDilution: 0 },
        { name: "Moscow Mule", flavorTags: ["spicy", "refreshing"], tags: ["Classic", "Spicy"], required: ["Vodka", "Ginger Beer", "Lime Juice"], spec: "2 oz vodka. 0.5 oz lime. Top with ginger beer. Build over ice.", tip: "A copper mug keeps it ice cold, but any glass works.", batchDilution: 0 },
        { name: "Amaretto Sour", flavorTags: ["sweet", "tart"], tags: ["Classic", "Sweet"], required: ["Amaretto", "Lemon Juice", "Simple Syrup"], spec: "1.5 oz amaretto. 0.75 oz lemon. 0.5 oz simple. Shake hard.", tip: "Add 0.5 oz bourbon for the 'upgraded' version.", batchDilution: 0.2 },
    ],
    mocktail: [
        { name: "Virgin Mojito", flavorTags: ["refreshing", "herbaceous", "sweet"], tags: ["Classic Mocktail", "Refresher", "Herbal"], required: ["Fresh Mint", "Lime Juice", "Simple Syrup", "Club Soda"], spec: "Muddle mint lightly. 1 oz lime. 1 oz simple. Shake with ice. Top with soda.", tip: "Clap the mint garnish between your hands to release oils before serving.", batchDilution: 0 },
        { name: "Shirley Temple", flavorTags: ["sweet", "refreshing"], tags: ["Classic Mocktail", "Sweet"], required: ["Ginger Ale", "Grenadine", "Lime Juice"], spec: "Build in glass. 4 oz ginger ale. 0.5 oz grenadine. Squeeze of lime. Stir.", tip: "Add a splash of soda water to cut the sweetness.", batchDilution: 0 },
        { name: "Arnold Palmer", flavorTags: ["refreshing", "tart"], tags: ["Classic Mocktail", "Refresher"], required: ["Black Tea", "Lemon Juice", "Simple Syrup"], spec: "Equal parts iced black tea and lemonade. Build over ice.", tip: "Use cold brew tea for less bitterness.", batchDilution: 0 },
        { name: "Spicy Agave Zero", flavorTags: ["spicy", "tart"], tags: ["Spicy", "Complex"], required: ["Lime Juice", "Agave Syrup", "Jalapeño"], spec: "2 oz water/NA spirit. 1 oz lime. 0.75 oz agave. 2 jalapeño coins. Shake, strain.", tip: "Muddle the seeds of the jalapeño for extra heat.", batchDilution: 0.2 },
        { name: "Cold Brew Tonic", flavorTags: ["bitter", "refreshing"], tags: ["Pick-Me-Up", "Bitter"], required: ["Cold Brew Coffee", "Tonic Water"], spec: "Fill glass with ice. 1 part cold brew. 2 parts tonic. Garnish with orange.", tip: "Express an orange peel over the top for aroma.", batchDilution: 0 },
        { name: "Gunner", flavorTags: ["spicy", "refreshing"], tags: ["Classic Mocktail", "Spicy"], required: ["Ginger Beer", "Ginger Ale", "Lime Juice"], spec: "Equal parts Ginger Beer and Ginger Ale. Squeeze of lime. Stir.", tip: "Add a dash of Angostura bitters if you allow trace alcohol, or use aromatic NA bitters.", batchDilution: 0 },
        // New culinary-grade mocktails
        { name: "Oleo-Saccharum Spritz", flavorTags: ["sweet", "herbaceous", "refreshing"], tags: ["Culinary", "Complex"], required: ["Lemon Juice", "Simple Syrup", "Sparkling Water"], spec: "Make oleo-saccharum: bury lemon peels in sugar for 2 hrs, press. 1 oz oleo. 0.5 oz lemon. Top sparkling water.", tip: "The oleo-saccharum is liquid gold — it's pure citrus oil extracted by sugar. Make a batch and refrigerate for a week.", batchDilution: 0 },
        { name: "Blackberry Shrub Collins", flavorTags: ["tart", "sweet", "refreshing"], tags: ["Culinary", "Shrub-Based"], required: ["Apple Cider Vinegar", "Simple Syrup", "Club Soda"], spec: "Make shrub: muddle berries + sugar + ACV, strain after 24 hrs. 1.5 oz shrub. Top with soda. Garnish with berries.", tip: "A shrub (drinking vinegar) is the secret weapon of zero-proof mixing. The vinegar gives the 'burn' that alcohol normally provides.", batchDilution: 0 },
        { name: "Rosemary-Grapefruit Cordial", flavorTags: ["herbaceous", "bitter", "refreshing"], tags: ["Culinary", "Herbal"], required: ["Grapefruit Juice", "Rosemary", "Honey Syrup", "Sparkling Water"], spec: "Simmer rosemary in honey syrup 10 min, strain. 1 oz rosemary honey. 1.5 oz grapefruit. Top sparkling water.", tip: "The rosemary infusion adds tannin-like structure that mimics a vermouth's role.", batchDilution: 0 },
        { name: "Turmeric-Ginger Tonic", flavorTags: ["spicy", "herbaceous", "bitter"], tags: ["Culinary", "Wellness"], required: ["Ginger", "Honey Syrup", "Lemon Juice", "Tonic Water"], spec: "Juice or finely grate 1 inch ginger + pinch turmeric. 0.75 oz honey. 0.5 oz lemon. Top tonic.", tip: "The turmeric will stain — but it gives the drink a stunning golden colour and anti-inflammatory properties.", batchDilution: 0 },
        { name: "Smoked Tea Old Fashioned", flavorTags: ["smoky", "sweet", "spirit-forward"], tags: ["Culinary", "Complex"], required: ["Black Tea", "Maple Syrup", "Ginger"], spec: "Brew lapsang souchong (smoked tea) concentrated: 2 bags in 4 oz water, 5 min. 3 oz smoked tea. 0.5 oz maple. 2 coins ginger. Stir over ice.", tip: "If any tea is smoky, this is it — lapsang souchong mimics the char of a barrel-aged spirit.", batchDilution: 0.15 },
    ]
};
