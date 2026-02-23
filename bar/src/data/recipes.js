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

export const RECIPES_DB = {
    cocktail: [
        { name: "Whiskey Sour", tags: ["Classic", "Tart", "Complex"], flavor: "Sour", required: ["Whiskey", "Lemon Juice", "Simple Syrup"], spec: "2 oz whiskey. 1 oz lemon. 1 oz simple. Shake hard, double strain.", tip: "Dry shake (no ice) first if using egg white for extra foam.", substitution: { "Lemon Juice": "Lime Juice or Grapefruit for a twist", "Simple Syrup": "Honey Syrup or Agave" }, batchDilution: 0.25 },
        { name: "Margarita", tags: ["Classic", "Tart"], flavor: "Sour", required: ["Tequila", "Lime Juice", "Agave Syrup"], spec: "2 oz tequila. 1 oz lime. 0.75 oz agave. Shake, strain over fresh ice.", tip: "Use a lime wedge to wet the rim for salt, not water.", substitution: { "Tequila": "Mezcal for smoke", "Agave Syrup": "Simple Syrup or Triple Sec" }, batchDilution: 0.25 },
        { name: "Gin & Tonic", tags: ["Highball", "Refresher"], flavor: "Bitter-Sweet", required: ["Gin", "Tonic Water"], spec: "2 oz gin. Build over ice. Top with tonic.", tip: "Pour the tonic down a bar spoon to keep the bubbles alive.", substitution: { "Gin": "Vodka or Tequila Blanco", "Tonic Water": "Club Soda + a dash of Bitters" }, batchDilution: 0 },
        { name: "Espresso Martini", tags: ["Modern Classic", "Sweet", "Complex"], flavor: "Rich", required: ["Vodka", "Coffee Liqueur", "Cold Brew Coffee"], spec: "1.5 oz vodka. 1 oz coffee liqueur. 1 oz cold brew. Shake hard.", tip: "Shake until your hands freeze to get that perfect crema foam.", substitution: { "Vodka": "Dark Rum or Bourbon", "Coffee Liqueur": "Simple Syrup + extra Cold Brew" }, batchDilution: 0.20 },
        { name: "Aperol Spritz", tags: ["Spritz", "Classic"], flavor: "Bitter-Sweet", required: ["Aperol", "Sparkling Water"], spec: "2 oz Aperol. 3 oz Sparkling Water. Splash of Soda. Build in glass over ice.", tip: "Add the sparkling water before the Aperol to prevent it from settling at the bottom.", substitution: { "Aperol": "Campari (will be more bitter)", "Sparkling Water": "Prosecco or Club Soda alone" }, batchDilution: 0 },
        { name: "Manhattan", tags: ["Classic", "Strong"], flavor: "Spirit-Forward", required: ["Whiskey", "Vermouth", "Angostura Bitters"], spec: "2 oz Whiskey. 1 oz Sweet Vermouth. 2 dashes Bitters. Stir with ice, strain.", tip: "Never shake a Manhattan; stirring preserves the silky texture.", substitution: { "Whiskey": "Aged Rum", "Vermouth": "Amaro" }, batchDilution: 0.30 }
    ],
    mocktail: [
        { name: "Virgin Mojito", tags: ["Classic Mocktail", "Refresher", "Herbal"], flavor: "Herbaceous", required: ["Fresh Mint", "Lime Juice", "Simple Syrup", "Club Soda"], spec: "Muddle mint lightly. 1 oz lime. 1 oz simple. Shake with ice. Top with soda.", tip: "Clap the mint garnish between your hands to release oils before serving.", substitution: { "Fresh Mint": "Fresh Basil", "Simple Syrup": "Agave Syrup" }, batchDilution: 0.15 },
        { name: "Grapefruit Rosemary Shrub", tags: ["Culinary", "Complex"], flavor: "Bitter", required: ["Grapefruit Juice", "Rosemary", "Apple Cider Vinegar", "Honey Syrup", "Sparkling Water"], spec: "2 oz grapefruit. 1 oz honey syrup. 0.5 oz vinegar. Sprig of rosemary. Shake. Top with soda.", tip: "Muddle the rosemary lightly before shaking to release the pine notes.", substitution: { "Grapefruit Juice": "Blood Orange Juice", "Apple Cider Vinegar": "White Wine Vinegar" }, batchDilution: 0.20 },
        { name: "Arnold Palmer", tags: ["Classic Mocktail", "Refresher"], flavor: "Sweet-Tart", required: ["Black Tea", "Lemon Juice", "Simple Syrup"], spec: "Equal parts iced black tea and lemonade. Build over ice.", tip: "Use cold brew tea for less bitterness.", substitution: { "Black Tea": "Green Tea", "Lemon Juice": "Lime Juice" }, batchDilution: 0 },
        { name: "Spicy Agave Zero", tags: ["Spicy", "Complex"], flavor: "Spicy", required: ["Lime Juice", "Agave Syrup", "Jalapeño", "Non-Alcoholic Spirit"], spec: "2 oz NA spirit or water. 1 oz lime. 0.75 oz agave. 2 jalapeño coins. Shake, strain.", tip: "Muddle the seeds of the jalapeño for extra heat.", substitution: { "Agave Syrup": "Honey Syrup", "Jalapeño": "Dash of Hot Sauce" }, batchDilution: 0.25 },
        { name: "Cold Brew Tonic", tags: ["Pick-Me-Up", "Bitter"], flavor: "Bitter-Sweet", required: ["Cold Brew Coffee", "Tonic Water"], spec: "Fill glass with ice. 1 part cold brew. 2 parts tonic. Garnish with orange.", tip: "Express an orange peel over the top for aroma.", substitution: { "Cold Brew Coffee": "Chilled Black Tea", "Tonic Water": "Club Soda + simple syrup" }, batchDilution: 0 },
        { name: "Oleo-Saccharum Lemonade", tags: ["Culinary", "Sweet-Tart"], flavor: "Citrus", required: ["Lemon Juice", "Club Soda", "Sea Salt"], spec: "1 oz lemon juice. 1 oz lemon oleo-saccharum. Pinch of salt. Shake. Top with soda.", tip: "Make oleo-saccharum by letting lemon peels sit in sugar overnight to extract the oils.", substitution: { "Club Soda": "Ginger Beer" }, batchDilution: 0.20 }
    ]
};
