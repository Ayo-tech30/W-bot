// Sample Card Library for Nexora Bot
// Use these as templates when spawning cards

export const cardLibrary = {
    // Anime Cards
    anime: [
        {
            name: "Goku Ultra Instinct",
            rarity: "Mythic",
            series: "Dragon Ball Super",
            value: 5000,
            description: "The ultimate form achieved through mastery of self-movement"
        },
        {
            name: "Naruto Hokage",
            rarity: "Legendary",
            series: "Naruto Shippuden",
            value: 2500,
            description: "The Seventh Hokage who never gives up"
        },
        {
            name: "Luffy Gear 5",
            rarity: "Mythic",
            series: "One Piece",
            value: 5000,
            description: "The Sun God Nika awakening"
        },
        {
            name: "Saitama",
            rarity: "Mythic",
            series: "One Punch Man",
            value: 5000,
            description: "The hero who defeats enemies with one punch"
        },
        {
            name: "Tanjiro Kamado",
            rarity: "Epic",
            series: "Demon Slayer",
            value: 1000,
            description: "Water breathing swordsman seeking cure"
        },
        {
            name: "Eren Yeager",
            rarity: "Epic",
            series: "Attack on Titan",
            value: 1000,
            description: "The Attack Titan seeking freedom"
        },
        {
            name: "Gojo Satoru",
            rarity: "Mythic",
            series: "Jujutsu Kaisen",
            value: 5000,
            description: "The strongest jujutsu sorcerer"
        },
        {
            name: "Sukuna",
            rarity: "Legendary",
            series: "Jujutsu Kaisen",
            value: 2500,
            description: "The King of Curses"
        },
        {
            name: "Deku",
            rarity: "Rare",
            series: "My Hero Academia",
            value: 500,
            description: "Inheritor of One For All"
        },
        {
            name: "Ichigo Kurosaki",
            rarity: "Epic",
            series: "Bleach",
            value: 1000,
            description: "Substitute Soul Reaper with hollow powers"
        }
    ],

    // Gaming Cards
    gaming: [
        {
            name: "Master Chief",
            rarity: "Legendary",
            series: "Halo",
            value: 2500,
            description: "The legendary Spartan-II super-soldier"
        },
        {
            name: "Kratos",
            rarity: "Mythic",
            series: "God of War",
            value: 5000,
            description: "The God of War seeking redemption"
        },
        {
            name: "Link",
            rarity: "Legendary",
            series: "The Legend of Zelda",
            value: 2500,
            description: "Hero of Time and Champion of Hyrule"
        },
        {
            name: "Mario",
            rarity: "Epic",
            series: "Super Mario",
            value: 1000,
            description: "The iconic plumber hero"
        },
        {
            name: "Sonic",
            rarity: "Rare",
            series: "Sonic the Hedgehog",
            value: 500,
            description: "The fastest thing alive"
        }
    ],

    // Mythological Cards
    mythology: [
        {
            name: "Zeus",
            rarity: "Mythic",
            series: "Greek Gods",
            value: 5000,
            description: "King of the Gods and ruler of Mount Olympus"
        },
        {
            name: "Thor",
            rarity: "Legendary",
            series: "Norse Gods",
            value: 2500,
            description: "God of Thunder wielding Mjolnir"
        },
        {
            name: "Ra",
            rarity: "Legendary",
            series: "Egyptian Gods",
            value: 2500,
            description: "The Sun God and creator deity"
        },
        {
            name: "Odin",
            rarity: "Mythic",
            series: "Norse Gods",
            value: 5000,
            description: "The All-Father and god of wisdom"
        }
    ],

    // Superhero Cards
    superheroes: [
        {
            name: "Superman",
            rarity: "Mythic",
            series: "DC Comics",
            value: 5000,
            description: "The Man of Steel from Krypton"
        },
        {
            name: "Batman",
            rarity: "Legendary",
            series: "DC Comics",
            value: 2500,
            description: "The Dark Knight of Gotham"
        },
        {
            name: "Spider-Man",
            rarity: "Legendary",
            series: "Marvel Comics",
            value: 2500,
            description: "Your friendly neighborhood web-slinger"
        },
        {
            name: "Iron Man",
            rarity: "Epic",
            series: "Marvel Comics",
            value: 1000,
            description: "Genius billionaire in high-tech armor"
        },
        {
            name: "Wonder Woman",
            rarity: "Legendary",
            series: "DC Comics",
            value: 2500,
            description: "Amazonian warrior princess"
        }
    ],

    // Common Cards (for beginners)
    common: [
        {
            name: "Starter Dragon",
            rarity: "Common",
            series: "Fantasy",
            value: 100,
            description: "A young dragon learning to fly"
        },
        {
            name: "Forest Wolf",
            rarity: "Common",
            series: "Nature",
            value: 100,
            description: "A swift hunter of the woods"
        },
        {
            name: "Water Sprite",
            rarity: "Uncommon",
            series: "Fantasy",
            value: 250,
            description: "Playful spirit of the waters"
        },
        {
            name: "Fire Phoenix",
            rarity: "Rare",
            series: "Mythical Beasts",
            value: 500,
            description: "Reborn from ashes"
        }
    ]
};

// Rarity Configuration
export const rarityConfig = {
    Common: {
        emoji: '⚪',
        baseValue: 100,
        dropRate: 0.50,
        color: '#FFFFFF'
    },
    Uncommon: {
        emoji: '🟢',
        baseValue: 250,
        dropRate: 0.25,
        color: '#00FF00'
    },
    Rare: {
        emoji: '🔵',
        baseValue: 500,
        dropRate: 0.15,
        color: '#0000FF'
    },
    Epic: {
        emoji: '🟣',
        baseValue: 1000,
        dropRate: 0.07,
        color: '#9B30FF'
    },
    Legendary: {
        emoji: '🟡',
        baseValue: 2500,
        dropRate: 0.025,
        color: '#FFD700'
    },
    Mythic: {
        emoji: '🔴',
        baseValue: 5000,
        dropRate: 0.005,
        color: '#FF0000'
    }
};

// Helper function to get a random card from a category
export function getRandomCard(category = 'anime') {
    const cards = cardLibrary[category] || cardLibrary.anime;
    return cards[Math.floor(Math.random() * cards.length)];
}

// Helper function to get card by rarity
export function getCardsByRarity(rarity) {
    const allCards = Object.values(cardLibrary).flat();
    return allCards.filter(card => card.rarity === rarity);
}

// Example usage in caption:
/*
To spawn a card, post an image with this caption format:

Name: Goku Ultra Instinct
Rarity: Mythic
Series: Dragon Ball Super
Value: 5000

OR just use:
Name: [Card Name]
Rarity: [Common/Uncommon/Rare/Epic/Legendary/Mythic]

The bot will auto-assign series and value based on rarity!
*/
