# 🌟 NEXORA WhatsApp Bot - Violet Edition (Firebase)

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![Firebase](https://img.shields.io/badge/database-Firebase-orange)

**The Ultimate WhatsApp Bot with Card Collection System & Firebase Database**

Created by **Kynx**

</div>

---

## ✨ Features

### 🔥 **Firebase Integration**
- **Real-time Database**: All data synced with Firebase Realtime Database
- **Cloud Storage**: Your bot data is safe in the cloud
- **Multi-Device**: Run bot on multiple devices with same data
- **Automatic Backups**: Firebase handles all backups automatically
- **No Local Storage**: No need for local JSON files

### 🎴 Advanced Card System
- **Card Spawning**: Automatically spawns cards when images are posted in groups
- **Upload Custom Cards**: Upload your own card images with metadata
- **Card Trading**: Give, sell, or auction your cards
- **Gacha System**: Roll for random cards with different rarities
- **Deck Building**: Build battle decks with your best cards
- **All cards stored in Firebase Realtime Database**

### 💰 Economy System
- Virtual wallet and bank (synced with Firebase)
- Daily rewards
- Gambling system
- Send money to friends
- Buy/sell cards
- All transactions saved to Firebase

### 🛡️ Group Management
- Promote/Demote members
- Kick/Mute users
- Warning system
- Anti-link protection
- Welcome/Goodbye messages
- Tag all members
- Group settings stored in Firebase

### 🎮 Fun Commands
- Match meter
- Roast generator
- Simp meter
- And more!

### 🔍 Utility Features
- AI chatbot
- Google search
- Image to sticker
- Image effects (blur)
- Background removal

### 📥 Download Features
- YouTube music (play command)
- Instagram downloader
- TikTok downloader

---

## 📋 Prerequisites

- Node.js v18 or higher
- NPM or Yarn
- A phone number for WhatsApp
- **Firebase Account** (Free tier is enough!)

---

## 🔥 Firebase Setup (IMPORTANT!)

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name (e.g., "nexora-bot")
4. Disable Google Analytics (optional)
5. Click "Create Project"

### Step 2: Enable Realtime Database

1. In your Firebase project, go to "Build" → "Realtime Database"
2. Click "Create Database"
3. Choose location (closest to you)
4. Start in **Test Mode** (for development)
5. Click "Enable"

### Step 3: Get Firebase Configuration

1. In Firebase Console, click the gear icon → "Project Settings"
2. Scroll down to "Your apps"
3. Click the "</>" (Web) icon
4. Register app with a nickname (e.g., "nexora-web")
5. Copy the `firebaseConfig` object

### Step 4: Configure Bot

Open `database/firebase.js` and replace the config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### Step 5: Database Security Rules (Optional but Recommended)

In Firebase Console → Realtime Database → Rules, set:

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

For development, you can use:
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

⚠️ **Warning**: Public rules are insecure. Use only for testing!

---

## 🚀 Installation

### 1. Clone/Download the Bot
```bash
# Extract the ZIP file or clone the repository
cd nexora-bot
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Firebase
- Follow the Firebase Setup steps above
- Update `database/firebase.js` with your credentials

### 4. Configure Owner Number
Edit `database/firebase.js` and update the owner in the settings:
```javascript
const defaultSettings = {
    owner: 'YOUR_NUMBER@s.whatsapp.net', // e.g., '1234567890@s.whatsapp.net'
    botName: 'Violet',
    prefix: '.'
};
```

### 5. Start the Bot
```bash
npm start
```

---

## 📱 Pairing with WhatsApp

When you first start the bot, it will ask for your WhatsApp number:

```
Enter your WhatsApp number (with country code, e.g., 1234567890):
```

1. Enter your number **WITHOUT** the '+' sign
2. The bot will generate a **pairing code**
3. Open WhatsApp on your phone
4. Go to: **Linked Devices** → **Link a Device** → **Link with phone number**
5. Enter the pairing code shown in the terminal

✅ Your bot is now connected!

---

## 🎴 Card System Guide

### How Cards Spawn

1. **Automatic Spawning**: When someone posts an image in a group (if card spawning is enabled)
2. **Upload Custom Cards**: Post an image with card details in the caption:

```
Name: Goku Ultra Instinct
Rarity: Legendary
Series: Dragon Ball
Value: 5000
```

The bot will automatically spawn this card for others to claim!

### Card Rarities

| Rarity | Emoji | Base Value | Drop Rate |
|--------|-------|------------|-----------|
| Common | ⚪ | $100 | 50% |
| Uncommon | 🟢 | $250 | 25% |
| Rare | 🔵 | $500 | 15% |
| Epic | 🟣 | $1,000 | 7% |
| Legendary | 🟡 | $2,500 | 2.5% |
| Mythic | 🔴 | $5,000 | 0.5% |

### Card Commands

```bash
.mycards              # View your card collection
.get <id>             # Claim a spawned card
.deck                 # View/Build your battle deck
.givecard @user <name> # Give a card to someone
.sellcard <name>      # Sell a card for money
.auction <name> <bid> # Auction a card
.bid <id> <amount>    # Bid on an auction
.rollcard             # Roll for a random card ($500)
.cards on/off         # Enable/disable card spawning (admin)
```

**All cards are automatically saved to Firebase!**

---

## 📖 Command List

### ⚙️ Main Menu
```
.menu          - Show all commands
.ping          - Check bot latency
.alive         - Check bot status
.afk           - Set AFK status
.register      - Register your account
.leaderboard   - View top users
.market        - View shop items
.mugen         - Special game mode
```

### 👤 Profile Menu
```
.setprofile         - Set profile picture
.setprofilequote    - Set profile quote
.setage <num>       - Set your age
.setname <name>     - Set your name
```

### 🛡️ Group Menu (Admin Only)
```
.promote @user      - Promote to admin
.demote @user       - Demote from admin
.mute @user         - Mute a user
.unmute @user       - Unmute a user
.warn @user         - Warn a user
.warncount          - Check warnings
.resetwarn          - Reset warnings
.kick @user         - Kick a user
.delete             - Delete a message
.tagall             - Tag all members
.hidetag            - Hidden tag
.welcome on/off     - Toggle welcome messages
.goodbye on/off     - Toggle goodbye messages
.antilink on/off    - Toggle anti-link
.groupinfo          - View group info
```

### 💰 Economy Menu
```
.accbal            - Check balance
.deposit <amount>  - Deposit to bank
.withdraw <amount> - Withdraw from bank
.send @user <amt>  - Send money
.daily             - Claim daily reward
.gamble <amount>   - Gamble money
.inv               - View inventory
```

### 🔍 Search Menu
```
.gpt <query>      - Ask AI
.ai <query>       - Ask AI
.google <query>   - Google search
```

### 🖼️ Image Menu
```
.sticker          - Create sticker
.blur             - Blur image
.removebg         - Remove background
```

### 🌟 Fun Menu
```
.match @user1 @user2  - Match meter
.roast @user          - Roast someone
.simp @user           - Simp meter
```

### 🪷 Download Menu
```
.play <song>         - Download music
.instagram <url>     - Download from Instagram
.tiktok <url>        - Download from TikTok
```

---

## 🔧 Configuration

### Change Bot Prefix

In Firebase Console, go to your database and update:
```
settings → prefix → "!" (or any character you want)
```

Or programmatically through the bot (add this feature if needed).

### Enable/Disable Card Spawning in Groups

```
.cards off  # Disable card spawning
.cards on   # Enable card spawning
```

---

## 🔥 Firebase Database Structure

```
nexora-bot/
├── users/
│   └── {userId}/
│       ├── registered: boolean
│       ├── name: string
│       ├── age: number
│       ├── wallet: number
│       ├── bank: number
│       ├── cards: array
│       ├── deck: array
│       ├── lastDaily: timestamp
│       ├── afk: boolean
│       └── warns: number
├── groups/
│   └── {groupId}/
│       ├── welcome: boolean
│       ├── goodbye: boolean
│       ├── antilink: boolean
│       ├── muted: array
│       └── cardSpawn: boolean
├── auctions/
│   └── {groupId}/
│       └── {auctionId}/
│           ├── card: object
│           ├── seller: string
│           ├── currentBid: number
│           └── highestBidder: string
├── spawnedCards/
│   └── {cardId}/
│       ├── name: string
│       ├── rarity: string
│       ├── series: string
│       ├── value: number
│       └── spawnedAt: timestamp
└── settings/
    ├── owner: string
    ├── botName: string
    └── prefix: string
```

---

## 🛠️ Development

### File Structure
```
nexora-bot/
├── index.js              # Main bot file
├── package.json          # Dependencies
├── database/
│   └── firebase.js       # Firebase configuration & functions
├── handlers/
│   └── messageHandler.js # Message routing
├── commands/
│   ├── main.js          # Main commands
│   ├── profile.js       # Profile commands
│   ├── group.js         # Group management
│   ├── cards.js         # Card system
│   ├── economy.js       # Economy system
│   ├── search.js        # Search features
│   ├── image.js         # Image processing
│   ├── fun.js           # Fun commands
│   └── download.js      # Download features
├── utils/
│   ├── cardSpawner.js   # Card spawning logic
│   └── cardLibrary.js   # Pre-made cards
└── auth_info/           # WhatsApp session
```

---

## 🐛 Troubleshooting

### Firebase Connection Issues

**Error: "Firebase initialization failed"**
- Check your Firebase config in `database/firebase.js`
- Ensure your Firebase project is active
- Verify database URL is correct
- Check internet connection

**Error: "Permission denied"**
- Update Firebase security rules
- For testing, use public read/write rules
- For production, implement proper authentication

### Bot Connection Issues

**Bot won't connect?**
- Make sure you entered the correct phone number
- Check your internet connection
- Try deleting `auth_info/` folder and reconnecting

**Commands not working?**
- Ensure you're using the correct prefix (default: `.`)
- Check if you're registered (`.register` command)
- Verify you have necessary permissions (admin commands)

### Card System Issues

**Cards not spawning?**
- Check if card spawning is enabled (`.cards on`)
- Ensure images are being posted in the group
- Verify the bot has group permissions

**Can't claim cards?**
- Make sure you're using the correct card ID
- Card might have expired (5-minute claim window)
- Check if card was already claimed

---

## 📝 Notes

- The bot requires an active internet connection for Firebase
- Firebase Free Tier includes:
  - 1GB stored data
  - 10GB/month downloaded data
  - 100 simultaneous connections
- All user data is stored in Firebase Realtime Database
- Card images are processed in memory (not stored in Firebase)
- Database syncs in real-time across all instances

---

## 🔒 Security Best Practices

1. **Never share your Firebase config publicly**
2. **Use environment variables for sensitive data**
3. **Implement proper Firebase security rules**
4. **Regular backup your Firebase database**
5. **Monitor Firebase usage in console**

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📜 License

MIT License - feel free to use and modify!

---

## 👨‍💻 Developer

**Kynx**
- Bot Name: Violet (Nexora Edition)
- Version: 1.0.0
- Database: Firebase Realtime Database

---

## 🆘 Support

If you encounter any issues:
1. Check the troubleshooting section
2. Review Firebase Console for errors
3. Check bot logs in terminal
4. Open an issue on GitHub

---

## 🎉 Special Thanks

- **Baileys**: WhatsApp Web API
- **Firebase**: Cloud database solution
- **Node.js Community**: Amazing ecosystem

---

<div align="center">

**Made with ❤️ by Kynx**

*Nexora Bot - Violet Edition with Firebase*

⭐ Star this repo if you find it useful!
🔥 Powered by Firebase

</div>
