# 🔥 Firebase Setup Guide

## Quick Setup in 5 Minutes!

### Step 1: Create Firebase Account
1. Go to https://console.firebase.google.com/
2. Sign in with your Google account
3. Click "Add Project"
4. Name it "nexora-bot" (or any name)
5. Click "Continue" → "Continue" → "Create Project"

### Step 2: Create Realtime Database
1. In left sidebar, click "Build" → "Realtime Database"
2. Click "Create Database"
3. Select location closest to you
4. Select "Start in **test mode**"
5. Click "Enable"

### Step 3: Get Your Config
1. Click the gear icon ⚙️ → "Project settings"
2. Scroll to "Your apps" section
3. Click "</>" (Web app icon)
4. Register app name: "nexora-web"
5. **DON'T** check "Also set up Firebase Hosting"
6. Click "Register app"
7. Copy the `firebaseConfig` object

It will look like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "nexora-bot.firebaseapp.com",
  databaseURL: "https://nexora-bot-default-rtdb.firebaseio.com",
  projectId: "nexora-bot",
  storageBucket: "nexora-bot.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

### Step 4: Update Bot Config
1. Open `database/firebase.js` in your bot folder
2. Find the `firebaseConfig` object (line 7)
3. Replace it with YOUR config from Step 3
4. Save the file

### Step 5: Set Owner Number
In the same `database/firebase.js` file:
```javascript
const defaultSettings = {
    owner: '1234567890@s.whatsapp.net', // YOUR NUMBER HERE
    botName: 'Violet',
    prefix: '.'
};
```

Replace `1234567890` with your WhatsApp number (with country code, no +).

Example:
- US number: `12025551234@s.whatsapp.net`
- UK number: `447123456789@s.whatsapp.net`

### Step 6: Start Bot
```bash
npm install
npm start
```

That's it! Your bot is now connected to Firebase! 🎉

---

## Database Security Rules

### For Development (TESTING ONLY):
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

### For Production (RECOMMENDED):
```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

To update rules:
1. Go to Firebase Console
2. Realtime Database → Rules tab
3. Paste the rules
4. Click "Publish"

---

## Verify Firebase Connection

After starting the bot, you should see:
```
✅ Firebase initialized successfully!
✅ Firebase connected successfully!
```

If you see errors, check:
- Your Firebase config is correct
- Database URL includes `-default-rtdb`
- Internet connection is working
- Firebase project is active

---

## View Your Data

1. Go to Firebase Console
2. Click "Realtime Database"
3. You'll see your data structure:
   - users/
   - groups/
   - settings/
   - spawnedCards/
   - auctions/

Data updates in real-time! 🔥

---

## Free Tier Limits

Firebase Free Plan (Spark) includes:
- ✅ 1GB stored data
- ✅ 10GB/month downloads
- ✅ 100 simultaneous connections
- ✅ Unlimited reads/writes

This is MORE than enough for most bots!

---

## Troubleshooting

**Error: "Firebase initialization failed"**
→ Check your config in `database/firebase.js`

**Error: "Permission denied"**
→ Update your database rules to test mode

**Data not saving**
→ Check Firebase Console → Realtime Database for errors

**Bot slow to respond**
→ Choose Firebase region closer to your location

---

## Next Steps

1. ✅ Firebase configured
2. ✅ Bot connected
3. 🎮 Test commands: `.register`, `.menu`
4. 🎴 Enable cards: `.cards on` in a group
5. 📊 Check Firebase Console to see your data!

---

Happy botting! 🚀🔥
