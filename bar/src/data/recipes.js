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
        { name: "Whiskey Sour", tags: ["Classic", "Tart", "Complex"], required: ["Whiskey", "Lemon Juice", "Simple Syrup"], spec: "2 oz whiskey. 1 oz lemon. 1 oz simple. Shake hard, double strain.", tip: "Dry shake (no ice) first if using egg white for extra foam." },
        { name: "Margarita", tags: ["Classic", "Tart"], required: ["Tequila", "Lime Juice", "Agave Syrup"], spec: "2 oz tequila. 1 oz lime. 0.75 oz agave. Shake, strain over fresh ice.", tip: "Use a lime wedge to wet the rim for salt, not water." },
        { name: "Gin & Tonic", tags: ["Highball", "Refresher"], required: ["Gin", "Tonic Water"], spec: "2 oz gin. Build over ice. Top with tonic.", tip: "Pour the tonic down a bar spoon to keep the bubbles alive." },
        { name: "Espresso Martini", tags: ["Modern Classic", "Sweet", "Complex"], required: ["Vodka", "Coffee Liqueur", "Cold Brew Coffee"], spec: "1.5 oz vodka. 1 oz coffee liqueur. 1 oz cold brew. Shake hard.", tip: "Shake until your hands freeze to get that perfect crema foam." },
        { name: "Aperol Spritz", tags: ["Spritz", "Classic"], required: ["Aperol", "Sparkling Water"], spec: "2 oz Aperol. 3 oz Sparkling Water. Splash of Soda. Build in glass over ice.", tip: "Add the sparkling water before the Aperol to prevent it from settling at the bottom." },
        { name: "Manhattan", tags: ["Classic", "Strong"], required: ["Whiskey", "Vermouth", "Angostura Bitters"], spec: "2 oz Whiskey. 1 oz Sweet Vermouth. 2 dashes Bitters. Stir with ice, strain.", tip: "Never shake a Manhattan; stirring preserves the silky texture." }
    ],
    mocktail: [
        { name: "Virgin Mojito", tags: ["Classic Mocktail", "Refresher", "Herbal"], required: ["Fresh Mint", "Lime Juice", "Simple Syrup", "Club Soda"], spec: "Muddle mint lightly. 1 oz lime. 1 oz simple. Shake with ice. Top with soda.", tip: "Clap the mint garnish between your hands to release oils before serving." },
        { name: "Shirley Temple", tags: ["Classic Mocktail", "Sweet"], required: ["Ginger Ale", "Grenadine", "Lime Juice"], spec: "Build in glass. 4 oz ginger ale. 0.5 oz grenadine. Squeeze of lime. Stir.", tip: "Add a splash of soda water to cut the sweetness." },
        { name: "Arnold Palmer", tags: ["Classic Mocktail", "Refresher"], required: ["Black Tea", "Lemon Juice", "Simple Syrup"], spec: "Equal parts iced black tea and lemonade. Build over ice.", tip: "Use cold brew tea for less bitterness." },
        { name: "Spicy Agave Zero", tags: ["Spicy", "Complex"], required: ["Lime Juice", "Agave Syrup", "Jalapeño"], spec: "2 oz water/NA spirit. 1 oz lime. 0.75 oz agave. 2 jalapeño coins. Shake, strain.", tip: "Muddle the seeds of the jalapeño for extra heat." },
        { name: "Cold Brew Tonic", tags: ["Pick-Me-Up", "Bitter"], required: ["Cold Brew Coffee", "Tonic Water"], spec: "Fill glass with ice. 1 part cold brew. 2 parts tonic. Garnish with orange.", tip: "Express an orange peel over the top for aroma." },
        { name: "Gunner", tags: ["Classic Mocktail", "Spicy"], required: ["Ginger Beer", "Ginger Ale", "Lime Juice"], spec: "Equal parts Ginger Beer and Ginger Ale. Squeeze of lime. Stir.", tip: "Add a dash of Angostura bitters if you allow trace alcohol, or use aromatic NA bitters." }
    ]
};
