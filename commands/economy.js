import { updateUser, getUser } from '../database/firebase.js';

export async function balance({ sock, from, sender, user }) {
    if (!user.registered) {
        await sock.sendMessage(from, { text: '❌ Please register first using .register' });
        return;
    }
    
    const balanceText = `
💰 *YOUR BALANCE* 💰

👛 Wallet: $${user.wallet.toLocaleString()}
🏦 Bank: $${user.bank.toLocaleString()}
💎 Total: $${(user.wallet + user.bank).toLocaleString()}

━━━━━━━━━━━━━━
📊 Level: ${user.level}
⭐ XP: ${user.xp}
🔥 Synced with Firebase
    `.trim();
    
    await sock.sendMessage(from, { text: balanceText });
}

export async function deposit({ sock, from, sender, user, args }) {
    if (!user.registered) {
        await sock.sendMessage(from, { text: '❌ Please register first using .register' });
        return;
    }
    
    let amount;
    if (args[0]?.toLowerCase() === 'all') {
        amount = user.wallet;
    } else {
        amount = parseInt(args[0]);
    }
    
    if (!amount || amount < 1) {
        await sock.sendMessage(from, { text: '❌ Please provide a valid amount!' });
        return;
    }
    
    if (user.wallet < amount) {
        await sock.sendMessage(from, { text: '❌ Insufficient funds in wallet!' });
        return;
    }
    
    await updateUser(sender, {
        wallet: user.wallet - amount,
        bank: user.bank + amount
    });
    
    await sock.sendMessage(from, { 
        text: `✅ Deposited $${amount.toLocaleString()} to your bank!\n\n👛 Wallet: $${(user.wallet - amount).toLocaleString()}\n🏦 Bank: $${(user.bank + amount).toLocaleString()}` 
    });
}

export async function withdraw({ sock, from, sender, user, args }) {
    if (!user.registered) {
        await sock.sendMessage(from, { text: '❌ Please register first using .register' });
        return;
    }
    
    let amount;
    if (args[0]?.toLowerCase() === 'all') {
        amount = user.bank;
    } else {
        amount = parseInt(args[0]);
    }
    
    if (!amount || amount < 1) {
        await sock.sendMessage(from, { text: '❌ Please provide a valid amount!' });
        return;
    }
    
    if (user.bank < amount) {
        await sock.sendMessage(from, { text: '❌ Insufficient funds in bank!' });
        return;
    }
    
    await updateUser(sender, {
        wallet: user.wallet + amount,
        bank: user.bank - amount
    });
    
    await sock.sendMessage(from, { 
        text: `✅ Withdrew $${amount.toLocaleString()} from your bank!\n\n👛 Wallet: $${(user.wallet + amount).toLocaleString()}\n🏦 Bank: $${(user.bank - amount).toLocaleString()}` 
    });
}

export async function send({ sock, from, sender, user, args, msg }) {
    if (!user.registered) {
        await sock.sendMessage(from, { text: '❌ Please register first using .register' });
        return;
    }
    
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    if (!mentioned) {
        await sock.sendMessage(from, { text: '❌ Please mention a user to send money to!' });
        return;
    }
    
    const amount = parseInt(args[1]);
    if (!amount || amount < 1) {
        await sock.sendMessage(from, { text: '📝 Usage: .send @user <amount>' });
        return;
    }
    
    if (user.wallet < amount) {
        await sock.sendMessage(from, { text: '❌ Insufficient funds in wallet!' });
        return;
    }
    
    const receiver = await getUser(mentioned);
    if (!receiver || !receiver.registered) {
        await sock.sendMessage(from, { text: '❌ User is not registered!' });
        return;
    }
    
    await updateUser(sender, { wallet: user.wallet - amount });
    await updateUser(mentioned, { wallet: receiver.wallet + amount });
    
    await sock.sendMessage(from, { 
        text: `✅ Sent $${amount.toLocaleString()} to @${mentioned.split('@')[0]}!\n\n💰 Your new balance: $${(user.wallet - amount).toLocaleString()}`,
        mentions: [mentioned]
    });
}

export async function daily({ sock, from, sender, user }) {
    if (!user.registered) {
        await sock.sendMessage(from, { text: '❌ Please register first using .register' });
        return;
    }
    
    const now = Date.now();
    const cooldown = 86400000; // 24 hours
    
    if (user.lastDaily && (now - user.lastDaily) < cooldown) {
        const timeLeft = cooldown - (now - user.lastDaily);
        const hours = Math.floor(timeLeft / 3600000);
        const minutes = Math.floor((timeLeft % 3600000) / 60000);
        
        await sock.sendMessage(from, { 
            text: `⏰ Daily reward already claimed!\n\nCome back in ${hours}h ${minutes}m` 
        });
        return;
    }
    
    const reward = 1000 + Math.floor(Math.random() * 500);
    await updateUser(sender, {
        wallet: user.wallet + reward,
        lastDaily: now
    });
    
    await sock.sendMessage(from, { 
        text: `🎁 Daily Reward!\n\n💰 You received: $${reward.toLocaleString()}\n\n👛 New balance: $${(user.wallet + reward).toLocaleString()}\n\n⏰ Come back in 24 hours!` 
    });
}

export async function gamble({ sock, from, sender, user, args }) {
    if (!user.registered) {
        await sock.sendMessage(from, { text: '❌ Please register first using .register' });
        return;
    }
    
    const amount = parseInt(args[0]);
    if (!amount || amount < 1) {
        await sock.sendMessage(from, { text: '📝 Usage: .gamble <amount>' });
        return;
    }
    
    if (user.wallet < amount) {
        await sock.sendMessage(from, { text: '❌ Insufficient funds in wallet!' });
        return;
    }
    
    const win = Math.random() > 0.5;
    
    if (win) {
        const winAmount = Math.floor(amount * (1 + Math.random()));
        await updateUser(sender, { wallet: user.wallet + winAmount });
        
        await sock.sendMessage(from, { 
            text: `🎰 *JACKPOT!* 🎰\n\n✅ You won $${winAmount.toLocaleString()}!\n💰 New balance: $${(user.wallet + winAmount).toLocaleString()}` 
        });
    } else {
        await updateUser(sender, { wallet: user.wallet - amount });
        
        await sock.sendMessage(from, { 
            text: `🎰 *GAMBLE* 🎰\n\n❌ You lost $${amount.toLocaleString()}!\n💰 New balance: $${(user.wallet - amount).toLocaleString()}` 
        });
    }
}

export async function inventory({ sock, from, sender, user }) {
    if (!user.registered) {
        await sock.sendMessage(from, { text: '❌ Please register first using .register' });
        return;
    }
    
    const cards = user.cards || [];
    const cardValue = cards.reduce((sum, card) => sum + card.value, 0);
    
    const invText = `
🎒 *YOUR INVENTORY* 🎒

━━━━━━━━━━━━━━
💰 *ECONOMY*
👛 Wallet: $${user.wallet.toLocaleString()}
🏦 Bank: $${user.bank.toLocaleString()}
💎 Total: $${(user.wallet + user.bank).toLocaleString()}

━━━━━━━━━━━━━━
🎴 *CARDS*
📦 Total Cards: ${cards.length}
💰 Cards Value: $${cardValue.toLocaleString()}

━━━━━━━━━━━━━━
📊 *STATS*
⭐ Level: ${user.level}
🌟 XP: ${user.xp}
⚠️ Warnings: ${user.warns || 0}/3

🔥 Synced with Firebase
    `.trim();
    
    await sock.sendMessage(from, { text: invText });
}
