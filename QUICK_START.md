# 🚀 QUICK START GUIDE - Firebase Edition

## Get Your Bot Running in 10 Minutes!

### Prerequisites
- ✅ Node.js installed (v18+)
- ✅ WhatsApp number
- ✅ Google account (for Firebase)

---

### Step 1: Setup Firebase (5 minutes)

See **FIREBASE_SETUP.md** for detailed instructions, or:

1. Create Firebase project at https://console.firebase.google.com/
2. Enable Realtime Database (test mode)
3. Copy your Firebase config
4. Paste it in `database/firebase.js`

---

### Step 2: Install Bot (2 minutes)

```bash
# Navigate to bot directory
cd nexora-bot

# Install dependencies
npm install
```

---

### Step 3: Configure (1 minute)

Edit `database/firebase.js`:
```javascript
// 1. Paste your Firebase config (line 7)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  // ... rest of config
};

// 2. Set your number (line 141)
const defaultSettings = {
  owner: 'YOUR_NUMBER@s.whatsapp.net',
  botName: 'Violet',
  prefix: '.'
};
```

---

### Step 4: Start Bot (1 minute)

```bash
npm start
```

You'll see:
```
✅ Firebase initialized successfully!
✅ Firebase connected successfully!

📱 WhatsApp Pairing Code Authentication

Enter your WhatsApp number: 
```

---

### Step 5: Pair WhatsApp (1 minute)

1. Enter your number (e.g., `1234567890`)
2. Get pairing code
3. Open WhatsApp → Linked Devices
4. Link with phone number
5. Enter the pairing code

Done! ✅

---

## 🎮 First Steps

### 1. Register Yourself
```
.register YourName.25
```

### 2. Check Balance
```
.accbal
```

### 3. View Menu
```
.menu
```

### 4. Enable Cards in Group
Add bot to a group, then:
```
.cards on
```

### 5. Post a Card
Upload an image with caption:
```
Name: Goku
Rarity: Legendary
Series: Dragon Ball
Value: 2500
```

The bot will automatically spawn it! 🎴

---

## 🔥 Quick Commands Reference

**Economy**
- `.daily` - Get daily reward
- `.gamble 100` - Gamble money
- `.send @user 100` - Send money

**Cards**
- `.mycards` - View collection
- `.get <id>` - Claim spawned card
- `.rollcard` - Random card ($500)
- `.deck` - View battle deck

**Fun**
- `.match @user1 @user2` - Match%
- `.roast @user` - Roast someone
- `.simp @user` - Simp meter

**Admin** (Group only)
- `.promote @user` - Make admin
- `.kick @user` - Remove user
- `.warn @user` - Warn user
- `.welcome on` - Enable welcome

---

## 📊 Check Your Data

1. Go to Firebase Console
2. Click "Realtime Database"
3. See your data update in real-time!

---

## 🐛 Troubleshooting

**Bot won't start?**
→ Check Firebase config in `database/firebase.js`

**"Permission denied"**
→ Set Firebase rules to test mode

**Commands not working?**
→ Make sure you registered: `.register Name.Age`

**Cards not spawning?**
→ Use `.cards on` in group

---

## 🎉 You're All Set!

Your bot is now:
- ✅ Connected to WhatsApp
- ✅ Synced with Firebase
- ✅ Ready to use!

**Next**: Invite bot to groups and start playing! 🚀

---

Need help? Check:
- `README.md` - Full documentation
- `FIREBASE_SETUP.md` - Detailed Firebase guide
- Firebase Console - View your data

Happy botting! 💜🔥
