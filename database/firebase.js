import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, update, remove, child } from 'firebase/database';

// Firebase configuration
// IMPORTANT: Replace these with your Firebase project credentials
const firebaseConfig = {
  apiKey: "AIzaSyDmzi6abkCHKeO4QaR8F7ubsFRP6_gADyA",
  authDomain: "nexora-d94b9.firebaseapp.com",
  databaseURL: "https://nexora-d94b9-default-rtdb.firebaseio.com",
  projectId: "nexora-d94b9",
  storageBucket: "nexora-d94b9.firebasestorage.app",
  messagingSenderId: "42233556793",
  appId: "1:42233556793:web:81d338172a683b42b6c2e8",
  measurementId: "G-3VBCWE94L4"
};
// Initialize Firebase
let app;
let database;

export function initializeFirebase() {
  try {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
    console.log('✅ Firebase initialized successfully!');
    return database;
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
    throw error;
  }
}

// Get database instance
export function getDb() {
  if (!database) {
    return initializeFirebase();
  }
  return database;
}

// User operations
export async function getUser(userId) {
  try {
    const db = getDb();
    const userRef = ref(db, `users/${userId}`);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      // Create new user with default values
      const newUser = {
        registered: false,
        name: '',
        age: 0,
        profileQuote: 'No quote set',
        wallet: 0,
        bank: 1000,
        cards: [],
        deck: [],
        lastDaily: 0,
        afk: false,
        afkReason: '',
        warns: 0,
        level: 1,
        xp: 0,
        createdAt: Date.now()
      };
      await set(userRef, newUser);
      return newUser;
    }
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

export async function updateUser(userId, data) {
  try {
    const db = getDb();
    const userRef = ref(db, `users/${userId}`);
    await update(userRef, data);
    return true;
  } catch (error) {
    console.error('Error updating user:', error);
    return false;
  }
}

export async function getAllUsers() {
  try {
    const db = getDb();
    const usersRef = ref(db, 'users');
    const snapshot = await get(usersRef);
    
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return {};
  } catch (error) {
    console.error('Error getting all users:', error);
    return {};
  }
}

// Group operations
export async function getGroup(groupId) {
  try {
    const db = getDb();
    const groupRef = ref(db, `groups/${groupId}`);
    const snapshot = await get(groupRef);
    
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      const newGroup = {
        welcome: false,
        goodbye: false,
        antilink: false,
        muted: [],
        cardSpawn: true,
        createdAt: Date.now()
      };
      await set(groupRef, newGroup);
      return newGroup;
    }
  } catch (error) {
    console.error('Error getting group:', error);
    return null;
  }
}

export async function updateGroup(groupId, data) {
  try {
    const db = getDb();
    const groupRef = ref(db, `groups/${groupId}`);
    await update(groupRef, data);
    return true;
  } catch (error) {
    console.error('Error updating group:', error);
    return false;
  }
}

// Card operations
export async function addCard(userId, card) {
  try {
    const user = await getUser(userId);
    if (!user.cards) user.cards = [];
    user.cards.push(card);
    await updateUser(userId, { cards: user.cards });
    return true;
  } catch (error) {
    console.error('Error adding card:', error);
    return false;
  }
}

export async function removeCard(userId, cardId) {
  try {
    const user = await getUser(userId);
    if (!user.cards) return false;
    user.cards = user.cards.filter(c => c.id !== cardId);
    await updateUser(userId, { cards: user.cards });
    return true;
  } catch (error) {
    console.error('Error removing card:', error);
    return false;
  }
}

export async function getUserCards(userId) {
  try {
    const user = await getUser(userId);
    return user.cards || [];
  } catch (error) {
    console.error('Error getting user cards:', error);
    return [];
  }
}

// Auction operations
export async function createAuction(groupId, auction) {
  try {
    const db = getDb();
    const auctionRef = ref(db, `auctions/${groupId}/${auction.id}`);
    await set(auctionRef, auction);
    return true;
  } catch (error) {
    console.error('Error creating auction:', error);
    return false;
  }
}

export async function getAuction(groupId, auctionId) {
  try {
    const db = getDb();
    const auctionRef = ref(db, `auctions/${groupId}/${auctionId}`);
    const snapshot = await get(auctionRef);
    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    console.error('Error getting auction:', error);
    return null;
  }
}

export async function updateAuction(groupId, auctionId, data) {
  try {
    const db = getDb();
    const auctionRef = ref(db, `auctions/${groupId}/${auctionId}`);
    await update(auctionRef, data);
    return true;
  } catch (error) {
    console.error('Error updating auction:', error);
    return false;
  }
}

export async function deleteAuction(groupId, auctionId) {
  try {
    const db = getDb();
    const auctionRef = ref(db, `auctions/${groupId}/${auctionId}`);
    await remove(auctionRef);
    return true;
  } catch (error) {
    console.error('Error deleting auction:', error);
    return false;
  }
}

export async function getGroupAuctions(groupId) {
  try {
    const db = getDb();
    const auctionsRef = ref(db, `auctions/${groupId}`);
    const snapshot = await get(auctionsRef);
    
    if (snapshot.exists()) {
      return Object.values(snapshot.val());
    }
    return [];
  } catch (error) {
    console.error('Error getting group auctions:', error);
    return [];
  }
}

// Settings operations
export async function getSettings() {
  try {
    const db = getDb();
    const settingsRef = ref(db, 'settings');
    const snapshot = await get(settingsRef);
    
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      const defaultSettings = {
        owner: '1234567890@s.whatsapp.net', // Change this
        botName: 'Violet',
        prefix: '.'
      };
      await set(settingsRef, defaultSettings);
      return defaultSettings;
    }
  } catch (error) {
    console.error('Error getting settings:', error);
    return null;
  }
}

export async function updateSettings(data) {
  try {
    const db = getDb();
    const settingsRef = ref(db, 'settings');
    await update(settingsRef, data);
    return true;
  } catch (error) {
    console.error('Error updating settings:', error);
    return false;
  }
}

// Spawned cards (temporary storage)
export async function saveSpawnedCard(cardId, cardData) {
  try {
    const db = getDb();
    const spawnRef = ref(db, `spawnedCards/${cardId}`);
    await set(spawnRef, cardData);
    return true;
  } catch (error) {
    console.error('Error saving spawned card:', error);
    return false;
  }
}

export async function getSpawnedCard(cardId) {
  try {
    const db = getDb();
    const spawnRef = ref(db, `spawnedCards/${cardId}`);
    const snapshot = await get(spawnRef);
    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    console.error('Error getting spawned card:', error);
    return null;
  }
}

export async function deleteSpawnedCard(cardId) {
  try {
    const db = getDb();
    const spawnRef = ref(db, `spawnedCards/${cardId}`);
    await remove(spawnRef);
    return true;
  } catch (error) {
    console.error('Error deleting spawned card:', error);
    return false;
  }
}
