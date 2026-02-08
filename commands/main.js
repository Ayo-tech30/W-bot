import { updateUser, getAllUsers } from '../database/firebase.js';

export async function menu({ sock, from }) {
    const menuText = `
╭━━𖣔 𝗡𝗘𝗫𝗢𝗥𝗔 𖣔━━╮
│  ✦ 𝙋𝙧𝙚𝙛𝙞𝙭   :  .
│  ✦ 𝘽𝙤𝙩 𝙉𝙖𝙢𝙚 :  𝗩𝗶𝗼𝗹𝗲𝘁
│  ✦ 𝙊𝙬𝙣𝙚𝙧    :  𝗞𝘆𝗻𝘅
│  ✦ 𝙎𝙩𝙖𝙩𝙪𝙨   :  𝙊𝙣𝙡𝙞𝙣𝙚 ✓
│  ✦ 𝘿𝘽        :  Firebase 🔥
╰━━━━━━━━━━━━━╯

⚙️ 𝙈𝘼𝙄𝙉 𝙈𝙀𝙉𝙐 ⚙️
━━━━━━━━━━━━━━
᯽ .𝙢𝙚𝙣𝙪
᯽ .𝙥𝙞𝙣𝙜
᯽ .𝙖𝙡𝙞𝙫𝙚
᯽ .𝙖𝙛𝙠
᯽ .𝙧𝙚𝙜𝙞𝙨𝙩𝙚𝙧 | .𝙧𝙚𝙜
᯽ .𝙡𝙚𝙖𝙙𝙚𝙧𝙗𝙤𝙖𝙧𝙙 | .𝙡𝙗
᯽ .𝙢𝙖𝙧𝙠𝙚𝙩
᯽ .𝙢𝙪𝙜𝙚𝙣

👤 𝙋𝙍𝙊𝙁𝙄𝙇𝙀 𝙈𝙀𝙉𝙐 👤
━━━━━━━━━━━━━━
᯽ .𝙨𝙚𝙩𝙥𝙧𝙤𝙛𝙞𝙡𝙚 | .𝙨𝙚𝙩𝙥
᯽ .𝙨𝙚𝙩𝙥𝙧𝙤𝙛𝙞𝙡𝙚𝙦𝙪𝙤𝙩𝙚
᯽ .𝙨𝙚𝙩𝙖𝙜𝙚 <𝙣𝙪𝙢>
᯽ .𝙨𝙚𝙩𝙣𝙖𝙢𝙚 <𝙣𝙖𝙢𝙚>

🛡️ 𝙂𝙍𝙊𝙐𝙋 𝙈𝙀𝙉𝙐 🛡️
━━━━━━━━━━━━━━
᯽ .𝙥𝙧𝙤𝙢𝙤𝙩𝙚 @𝙪𝙨𝙚𝙧
᯽ .𝙙𝙚𝙢𝙤𝙩𝙚 @𝙪𝙨𝙚𝙧
᯽ .𝙢𝙪𝙩𝙚 @𝙪𝙨𝙚𝙧
᯽ .𝙪𝙣𝙢𝙪𝙩𝙚 @𝙪𝙨𝙚𝙧
᯽ .𝙬𝙖𝙧𝙣 @𝙪𝙨𝙚𝙧
᯽ .𝙬𝙖𝙧𝙣𝙘𝙤𝙪𝙣𝙩
᯽ .𝙧𝙚𝙨𝙚𝙩𝙬𝙖𝙧𝙣
᯽ .𝙠𝙞𝙘𝙠 @𝙪𝙨𝙚𝙧
᯽ .𝙙𝙚𝙡𝙚𝙩𝙚
᯽ .𝙩𝙖𝙜𝙖𝙡𝙡
᯽ .𝙝𝙞𝙙𝙚𝙩𝙖𝙜
᯽ .𝙬𝙚𝙡𝙘𝙤𝙢𝙚 <𝙤𝙣/𝙤𝙛𝙛>
᯽ .𝙜𝙤𝙤𝙙𝙗𝙮𝙚 <𝙤𝙣/𝙤𝙛𝙛>
᯽ .𝙖𝙣𝙩𝙞𝙡𝙞𝙣𝙠 <𝙤𝙣/𝙤𝙛𝙛>
᯽ .𝙜𝙧𝙤𝙪𝙥𝙞𝙣𝙛𝙤

🎴 𝘾𝘼𝙍𝘿𝙎 𝙈𝙀𝙉𝙐 🎴
━━━━━━━━━━━━━━
᯽ .𝙢𝙮𝙘𝙖𝙧𝙙𝙨
᯽ .𝙜𝙚𝙩 <𝙞𝙙>
᯽ .𝙙𝙚𝙘𝙠
᯽ .𝙜𝙞𝙫𝙚𝙘𝙖𝙧𝙙
᯽ .𝙨𝙚𝙡𝙡𝙘𝙖𝙧𝙙
᯽ .𝙖𝙪𝙘𝙩𝙞𝙤𝙣
᯽ .𝙗𝙞𝙙
᯽ .𝙧𝙤𝙡𝙡𝙘𝙖𝙧𝙙
᯽ .𝙘𝙖𝙧𝙙𝙨 𝙤𝙣/𝙤𝙛𝙛

💰 𝙀𝘾𝙊𝙉𝙊𝙈𝙔 𝙈𝙀𝙉𝙐 💰
━━━━━━━━━━━━━━
᯽ .𝙖𝙘𝙘𝙗𝙖𝙡
᯽ .𝙙𝙚𝙥𝙤𝙨𝙞𝙩
᯽ .𝙬𝙞𝙩𝙝𝙙𝙧𝙖𝙬
᯽ .𝙨𝙚𝙣𝙙
᯽ .𝙙𝙖𝙞𝙡𝙮
᯽ .𝙜𝙖𝙢𝙗𝙡𝙚
᯽ .𝙞𝙣𝙫

🔍 𝙎𝙀𝘼𝙍𝘾𝙃 𝙈𝙀𝙉𝙐 🔍
━━━━━━━━━━━━━━
᯽ .𝙜𝙥𝙩
᯽ .𝙖𝙞
᯽ .𝙜𝙤𝙤𝙜𝙡𝙚

🖼️ 𝙄𝙈𝘼𝙂𝙀 𝙈𝙀𝙉𝙐 🖼️
━━━━━━━━━━━━━━
᯽ .𝙨𝙩𝙞𝙘𝙠𝙚𝙧
᯽ .𝙗𝙡𝙪𝙧
᯽ .𝙧𝙚𝙢𝙤𝙫𝙚𝙗𝙜

🌟 𝙁𝙐𝙉 𝙈𝙀𝙉𝙐 🌟
━━━━━━━━━━━━━━
᯽ .𝙢𝙖𝙩𝙘𝙝
᯽ .𝙧𝙤𝙖𝙨𝙩
᯽ .𝙨𝙞𝙢𝙥

🪷 𝘿𝙊𝙒𝙉𝙇𝙊𝘼𝘿 𝙈𝙀𝙉𝙐 🪷
━━━━━━━━━━━━━━
᯽ .𝙥𝙡𝙖𝙮
᯽ .𝙞𝙣𝙨𝙩𝙖𝙜𝙧𝙖𝙢
᯽ .𝙩𝙞𝙠𝙩𝙤𝙠
━━━━━━━━━━━━━━

💜 Nexora Bot - Violet Edition
🔥 Powered by Firebase
`.trim();

    await sock.sendMessage(from, { text: menuText });
}

export async function ping({ sock, from }) {
    const start = Date.now();
    await sock.sendMessage(from, { text: '🏓 Pinging...' });
    const end = Date.now();
    const ping = end - start;
    
    await sock.sendMessage(from, { 
        text: `🏓 *Pong!*\n⚡ Response Time: ${ping}ms\n🔥 Firebase: Active` 
    });
}

export async function alive({ sock, from }) {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    
    const aliveText = `
✨ *BOT STATUS* ✨

🤖 *Bot Name:* Violet (Nexora)
👑 *Owner:* Kynx
⚡ *Status:* Online & Active
🔥 *Database:* Firebase
⏱️ *Uptime:* ${hours}h ${minutes}m ${seconds}s
🌟 *Version:* 1.0.0

━━━━━━━━━━━━━━
💜 Ready to serve you!
Type .menu for commands
    `.trim();
    
    await sock.sendMessage(from, { text: aliveText });
}

export async function afk({ sock, from, sender, args, user }) {
    const reason = args.join(' ') || 'No reason provided';
    await updateUser(sender, { afk: true, afkReason: reason });
    
    await sock.sendMessage(from, { 
        text: `⏰ You are now AFK\n📝 Reason: ${reason}` 
    });
}

export async function register({ sock, from, sender, args, user }) {
    if (user.registered) {
        await sock.sendMessage(from, { 
            text: '❌ You are already registered!' 
        });
        return;
    }
    
    if (args.length < 1) {
        await sock.sendMessage(from, { 
            text: '📝 Usage: .register <name>.<age>\nExample: .register John.25' 
        });
        return;
    }
    
    const [name, age] = args[0].split('.');
    
    if (!name || !age || isNaN(age)) {
        await sock.sendMessage(from, { 
            text: '❌ Invalid format! Use: .register <name>.<age>' 
        });
        return;
    }
    
    await updateUser(sender, {
        registered: true,
        name: name,
        age: parseInt(age),
        wallet: 500
    });
    
    const regText = `
✅ *REGISTRATION SUCCESSFUL!*

👤 Name: ${name}
🎂 Age: ${age}
💰 Starting Wallet: $500
🎁 Welcome Bonus Received!
🔥 Data saved to Firebase!

Type .menu to explore commands!
    `.trim();
    
    await sock.sendMessage(from, { text: regText });
}

export async function leaderboard({ sock, from }) {
    const allUsers = await getAllUsers();
    
    const users = Object.entries(allUsers)
        .filter(([_, user]) => user.registered)
        .sort((a, b) => (b[1].wallet + b[1].bank) - (a[1].wallet + a[1].bank))
        .slice(0, 10);
    
    if (users.length === 0) {
        await sock.sendMessage(from, { 
            text: '📊 No registered users yet!' 
        });
        return;
    }
    
    let leaderboardText = `
🏆 *LEADERBOARD* 🏆
━━━━━━━━━━━━━━

`;
    
    users.forEach(([jid, user], index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
        const total = user.wallet + user.bank;
        leaderboardText += `${medal} *${user.name}*\n💰 $${total.toLocaleString()}\n\n`;
    });
    
    leaderboardText += '🔥 Live from Firebase Database';
    
    await sock.sendMessage(from, { text: leaderboardText.trim() });
}

export async function market({ sock, from }) {
    const marketText = `
🛒 *NEXORA MARKET* 🛒
━━━━━━━━━━━━━━

📦 *Items for Sale:*

1️⃣ Card Pack (Common)
   💰 Price: $100
   📦 Contains: 3 random cards

2️⃣ Card Pack (Rare)
   💰 Price: $500
   📦 Contains: 5 cards (1 guaranteed rare)

3️⃣ Card Pack (Epic)
   💰 Price: $1000
   📦 Contains: 5 cards (1 guaranteed epic)

4️⃣ XP Boost
   💰 Price: $250
   ⚡ Effect: 2x XP for 1 hour

5️⃣ Luck Charm
   💰 Price: $500
   🍀 Effect: Better card drop rates

━━━━━━━━━━━━━━
🛍️ Coming Soon: More items!
🔥 All purchases saved to Firebase
    `.trim();
    
    await sock.sendMessage(from, { text: marketText });
}

export async function mugen({ sock, from }) {
    const mugenText = `
⚔️ *MUGEN INFINITE TSUKUYOMI* ⚔️
━━━━━━━━━━━━━━

🌙 *Special Event Mode*

This is a special game mode where players can:
• Battle with their card decks
• Compete in tournaments
• Earn exclusive rewards
• Unlock special cards

🎮 *How to Play:*
1. Build your deck with .deck
2. Challenge other players
3. Win battles to earn rewards

⚡ Status: Coming Soon
🏆 Rewards: Exclusive Legendary Cards

━━━━━━━━━━━━━━
Stay tuned for updates!
    `.trim();
    
    await sock.sendMessage(from, { text: mugenText });
}
