export async function match({ sock, from, msg }) {
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    
    if (!mentioned || mentioned.length < 2) {
        await sock.sendMessage(from, { 
            text: '❌ Please mention 2 users!\n📝 Usage: .match @user1 @user2' 
        });
        return;
    }
    
    const user1 = mentioned[0];
    const user2 = mentioned[1];
    
    const matchPercentage = Math.floor(Math.random() * 101);
    
    let matchEmoji = '💔';
    let matchText = 'Not compatible';
    
    if (matchPercentage >= 80) {
        matchEmoji = '💖';
        matchText = 'Perfect Match!';
    } else if (matchPercentage >= 60) {
        matchEmoji = '💕';
        matchText = 'Great Match!';
    } else if (matchPercentage >= 40) {
        matchEmoji = '💗';
        matchText = 'Good Match';
    } else if (matchPercentage >= 20) {
        matchEmoji = '💛';
        matchText = 'Could work';
    }
    
    const matchResult = `
💘 *MATCH METER* 💘

@${user1.split('@')[0]}
      ${matchEmoji}
@${user2.split('@')[0]}

━━━━━━━━━━━━━━
📊 Match: ${matchPercentage}%
${matchText}
━━━━━━━━━━━━━━
    `.trim();
    
    await sock.sendMessage(from, { 
        text: matchResult,
        mentions: mentioned
    });
}

export async function roast({ sock, from, msg }) {
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    
    if (!mentioned) {
        await sock.sendMessage(from, { 
            text: '❌ Please mention a user to roast!\n📝 Usage: .roast @user' 
        });
        return;
    }
    
    const roasts = [
        "You're like a cloud. When you disappear, it's a beautiful day! ☁️",
        "I'd agree with you, but then we'd both be wrong! 🤷",
        "You're not stupid; you just have bad luck thinking! 🧠",
        "If I wanted to hear from someone with your IQ, I'd watch paint dry! 🎨",
        "You bring everyone so much joy... when you leave the room! 🚪",
        "I'm not saying you're dumb, but you could throw yourself on the ground and miss! 🎯",
        "You're the reason the gene pool needs a lifeguard! 🏊",
        "I'd explain it to you, but I don't have any crayons! 🖍️",
        "You're like a Monday morning... nobody likes you! 📅",
        "If you were any more inbred, you'd be a sandwich! 🥪"
    ];
    
    const randomRoast = roasts[Math.floor(Math.random() * roasts.length)];
    
    await sock.sendMessage(from, { 
        text: `🔥 *ROASTED* 🔥\n\n@${mentioned.split('@')[0]}\n\n${randomRoast}`,
        mentions: [mentioned]
    });
}

export async function simp({ sock, from, msg, sender }) {
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    
    if (!mentioned) {
        await sock.sendMessage(from, { 
            text: '❌ Please mention a user!\n📝 Usage: .simp @user' 
        });
        return;
    }
    
    const simpPercentage = Math.floor(Math.random() * 101);
    
    let simpLevel = 'Not a simp';
    let emoji = '😎';
    
    if (simpPercentage >= 80) {
        simpLevel = 'MEGA SIMP';
        emoji = '🤡';
    } else if (simpPercentage >= 60) {
        simpLevel = 'Big Simp';
        emoji = '😍';
    } else if (simpPercentage >= 40) {
        simpLevel = 'Moderate Simp';
        emoji = '🥰';
    } else if (simpPercentage >= 20) {
        simpLevel = 'Little Simp';
        emoji = '😊';
    }
    
    const simpText = `
🎭 *SIMP METER* 🎭

@${sender.split('@')[0]} → @${mentioned.split('@')[0]}

━━━━━━━━━━━━━━
${emoji} Simp Level: ${simpPercentage}%
${simpLevel}!
━━━━━━━━━━━━━━
    `.trim();
    
    await sock.sendMessage(from, { 
        text: simpText,
        mentions: [sender, mentioned]
    });
}
