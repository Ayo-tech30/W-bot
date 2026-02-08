import { saveDatabase } from '../database/db.js';

async function isAdmin(sock, groupId, userId) {
    try {
        const metadata = await sock.groupMetadata(groupId);
        const participant = metadata.participants.find(p => p.id === userId);
        return participant?.admin === 'admin' || participant?.admin === 'superadmin';
    } catch {
        return false;
    }
}

async function isBotAdmin(sock, groupId) {
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    return await isAdmin(sock, groupId, botId);
}

export async function promote({ sock, from, sender, msg, isGroup }) {
    if (!isGroup) {
        await sock.sendMessage(from, { text: '❌ This command can only be used in groups!' });
        return;
    }
    
    if (!await isAdmin(sock, from, sender)) {
        await sock.sendMessage(from, { text: '❌ Only admins can use this command!' });
        return;
    }
    
    if (!await isBotAdmin(sock, from)) {
        await sock.sendMessage(from, { text: '❌ Bot needs to be admin to promote members!' });
        return;
    }
    
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    if (!mentioned) {
        await sock.sendMessage(from, { text: '❌ Please mention a user to promote!' });
        return;
    }
    
    await sock.groupParticipantsUpdate(from, [mentioned], 'promote');
    await sock.sendMessage(from, { 
        text: `✅ @${mentioned.split('@')[0]} has been promoted to admin!`,
        mentions: [mentioned]
    });
}

export async function demote({ sock, from, sender, msg, isGroup }) {
    if (!isGroup) {
        await sock.sendMessage(from, { text: '❌ This command can only be used in groups!' });
        return;
    }
    
    if (!await isAdmin(sock, from, sender)) {
        await sock.sendMessage(from, { text: '❌ Only admins can use this command!' });
        return;
    }
    
    if (!await isBotAdmin(sock, from)) {
        await sock.sendMessage(from, { text: '❌ Bot needs to be admin to demote members!' });
        return;
    }
    
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    if (!mentioned) {
        await sock.sendMessage(from, { text: '❌ Please mention a user to demote!' });
        return;
    }
    
    await sock.groupParticipantsUpdate(from, [mentioned], 'demote');
    await sock.sendMessage(from, { 
        text: `✅ @${mentioned.split('@')[0]} has been demoted!`,
        mentions: [mentioned]
    });
}

export async function mute({ sock, from, sender, msg, isGroup, group }) {
    if (!isGroup) {
        await sock.sendMessage(from, { text: '❌ This command can only be used in groups!' });
        return;
    }
    
    if (!await isAdmin(sock, from, sender)) {
        await sock.sendMessage(from, { text: '❌ Only admins can use this command!' });
        return;
    }
    
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    if (!mentioned) {
        await sock.sendMessage(from, { text: '❌ Please mention a user to mute!' });
        return;
    }
    
    if (!group.muted) group.muted = [];
    if (!group.muted.includes(mentioned)) {
        group.muted.push(mentioned);
        saveDatabase();
        await sock.sendMessage(from, { 
            text: `🔇 @${mentioned.split('@')[0]} has been muted!`,
            mentions: [mentioned]
        });
    } else {
        await sock.sendMessage(from, { text: '❌ User is already muted!' });
    }
}

export async function unmute({ sock, from, sender, msg, isGroup, group }) {
    if (!isGroup) {
        await sock.sendMessage(from, { text: '❌ This command can only be used in groups!' });
        return;
    }
    
    if (!await isAdmin(sock, from, sender)) {
        await sock.sendMessage(from, { text: '❌ Only admins can use this command!' });
        return;
    }
    
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    if (!mentioned) {
        await sock.sendMessage(from, { text: '❌ Please mention a user to unmute!' });
        return;
    }
    
    if (group.muted?.includes(mentioned)) {
        group.muted = group.muted.filter(m => m !== mentioned);
        saveDatabase();
        await sock.sendMessage(from, { 
            text: `🔊 @${mentioned.split('@')[0]} has been unmuted!`,
            mentions: [mentioned]
        });
    } else {
        await sock.sendMessage(from, { text: '❌ User is not muted!' });
    }
}

export async function warn({ sock, from, sender, msg, isGroup }) {
    if (!isGroup) {
        await sock.sendMessage(from, { text: '❌ This command can only be used in groups!' });
        return;
    }
    
    if (!await isAdmin(sock, from, sender)) {
        await sock.sendMessage(from, { text: '❌ Only admins can use this command!' });
        return;
    }
    
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    if (!mentioned) {
        await sock.sendMessage(from, { text: '❌ Please mention a user to warn!' });
        return;
    }
    
    const warnedUser = global.db.users[mentioned] || { warns: 0 };
    warnedUser.warns = (warnedUser.warns || 0) + 1;
    global.db.users[mentioned] = warnedUser;
    saveDatabase();
    
    await sock.sendMessage(from, { 
        text: `⚠️ @${mentioned.split('@')[0]} has been warned!\nWarnings: ${warnedUser.warns}/3\n\n${warnedUser.warns >= 3 ? '🚫 User will be kicked!' : ''}`,
        mentions: [mentioned]
    });
    
    if (warnedUser.warns >= 3 && await isBotAdmin(sock, from)) {
        await sock.groupParticipantsUpdate(from, [mentioned], 'remove');
        warnedUser.warns = 0;
        saveDatabase();
    }
}

export async function warnCount({ sock, from, msg, isGroup }) {
    if (!isGroup) {
        await sock.sendMessage(from, { text: '❌ This command can only be used in groups!' });
        return;
    }
    
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    if (!mentioned) {
        await sock.sendMessage(from, { text: '❌ Please mention a user!' });
        return;
    }
    
    const warnedUser = global.db.users[mentioned] || { warns: 0 };
    await sock.sendMessage(from, { 
        text: `⚠️ @${mentioned.split('@')[0]} has ${warnedUser.warns || 0}/3 warnings`,
        mentions: [mentioned]
    });
}

export async function resetWarn({ sock, from, sender, msg, isGroup }) {
    if (!isGroup) {
        await sock.sendMessage(from, { text: '❌ This command can only be used in groups!' });
        return;
    }
    
    if (!await isAdmin(sock, from, sender)) {
        await sock.sendMessage(from, { text: '❌ Only admins can use this command!' });
        return;
    }
    
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    if (!mentioned) {
        await sock.sendMessage(from, { text: '❌ Please mention a user!' });
        return;
    }
    
    if (global.db.users[mentioned]) {
        global.db.users[mentioned].warns = 0;
        saveDatabase();
        await sock.sendMessage(from, { 
            text: `✅ Warnings reset for @${mentioned.split('@')[0]}`,
            mentions: [mentioned]
        });
    }
}

export async function kick({ sock, from, sender, msg, isGroup }) {
    if (!isGroup) {
        await sock.sendMessage(from, { text: '❌ This command can only be used in groups!' });
        return;
    }
    
    if (!await isAdmin(sock, from, sender)) {
        await sock.sendMessage(from, { text: '❌ Only admins can use this command!' });
        return;
    }
    
    if (!await isBotAdmin(sock, from)) {
        await sock.sendMessage(from, { text: '❌ Bot needs to be admin to kick members!' });
        return;
    }
    
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    if (!mentioned) {
        await sock.sendMessage(from, { text: '❌ Please mention a user to kick!' });
        return;
    }
    
    await sock.groupParticipantsUpdate(from, [mentioned], 'remove');
    await sock.sendMessage(from, { 
        text: `🚫 @${mentioned.split('@')[0]} has been kicked!`,
        mentions: [mentioned]
    });
}

export async function deleteMessage({ sock, from, sender, msg, isGroup }) {
    if (!isGroup) {
        await sock.sendMessage(from, { text: '❌ This command can only be used in groups!' });
        return;
    }
    
    if (!await isAdmin(sock, from, sender)) {
        await sock.sendMessage(from, { text: '❌ Only admins can use this command!' });
        return;
    }
    
    const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!quotedMsg) {
        await sock.sendMessage(from, { text: '❌ Please reply to a message to delete it!' });
        return;
    }
    
    const key = msg.message.extendedTextMessage.contextInfo.stanzaId;
    const participant = msg.message.extendedTextMessage.contextInfo.participant;
    
    await sock.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: key, participant } });
}

export async function tagAll({ sock, from, sender, isGroup, args }) {
    if (!isGroup) {
        await sock.sendMessage(from, { text: '❌ This command can only be used in groups!' });
        return;
    }
    
    if (!await isAdmin(sock, from, sender)) {
        await sock.sendMessage(from, { text: '❌ Only admins can use this command!' });
        return;
    }
    
    const metadata = await sock.groupMetadata(from);
    const participants = metadata.participants.map(p => p.id);
    const message = args.join(' ') || 'Tag All!';
    
    let tagText = `📢 *${message}*\n\n`;
    participants.forEach(jid => {
        tagText += `@${jid.split('@')[0]}\n`;
    });
    
    await sock.sendMessage(from, { text: tagText, mentions: participants });
}

export async function hideTag({ sock, from, sender, isGroup, args }) {
    if (!isGroup) {
        await sock.sendMessage(from, { text: '❌ This command can only be used in groups!' });
        return;
    }
    
    if (!await isAdmin(sock, from, sender)) {
        await sock.sendMessage(from, { text: '❌ Only admins can use this command!' });
        return;
    }
    
    const metadata = await sock.groupMetadata(from);
    const participants = metadata.participants.map(p => p.id);
    const message = args.join(' ') || 'Hidden Tag!';
    
    await sock.sendMessage(from, { text: message, mentions: participants });
}

export async function welcome({ sock, from, sender, isGroup, group, args }) {
    if (!isGroup) {
        await sock.sendMessage(from, { text: '❌ This command can only be used in groups!' });
        return;
    }
    
    if (!await isAdmin(sock, from, sender)) {
        await sock.sendMessage(from, { text: '❌ Only admins can use this command!' });
        return;
    }
    
    const status = args[0]?.toLowerCase();
    if (status === 'on') {
        group.welcome = true;
        saveDatabase();
        await sock.sendMessage(from, { text: '✅ Welcome messages enabled!' });
    } else if (status === 'off') {
        group.welcome = false;
        saveDatabase();
        await sock.sendMessage(from, { text: '❌ Welcome messages disabled!' });
    } else {
        await sock.sendMessage(from, { text: '📝 Usage: .welcome on/off' });
    }
}

export async function goodbye({ sock, from, sender, isGroup, group, args }) {
    if (!isGroup) {
        await sock.sendMessage(from, { text: '❌ This command can only be used in groups!' });
        return;
    }
    
    if (!await isAdmin(sock, from, sender)) {
        await sock.sendMessage(from, { text: '❌ Only admins can use this command!' });
        return;
    }
    
    const status = args[0]?.toLowerCase();
    if (status === 'on') {
        group.goodbye = true;
        saveDatabase();
        await sock.sendMessage(from, { text: '✅ Goodbye messages enabled!' });
    } else if (status === 'off') {
        group.goodbye = false;
        saveDatabase();
        await sock.sendMessage(from, { text: '❌ Goodbye messages disabled!' });
    } else {
        await sock.sendMessage(from, { text: '📝 Usage: .goodbye on/off' });
    }
}

export async function antilink({ sock, from, sender, isGroup, group, args }) {
    if (!isGroup) {
        await sock.sendMessage(from, { text: '❌ This command can only be used in groups!' });
        return;
    }
    
    if (!await isAdmin(sock, from, sender)) {
        await sock.sendMessage(from, { text: '❌ Only admins can use this command!' });
        return;
    }
    
    const status = args[0]?.toLowerCase();
    if (status === 'on') {
        group.antilink = true;
        saveDatabase();
        await sock.sendMessage(from, { text: '✅ Antilink enabled! Group links will be deleted.' });
    } else if (status === 'off') {
        group.antilink = false;
        saveDatabase();
        await sock.sendMessage(from, { text: '❌ Antilink disabled!' });
    } else {
        await sock.sendMessage(from, { text: '📝 Usage: .antilink on/off' });
    }
}

export async function groupInfo({ sock, from, isGroup }) {
    if (!isGroup) {
        await sock.sendMessage(from, { text: '❌ This command can only be used in groups!' });
        return;
    }
    
    const metadata = await sock.groupMetadata(from);
    const admins = metadata.participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');
    
    const infoText = `
📊 *GROUP INFO* 📊

👥 *Name:* ${metadata.subject}
📝 *Description:* ${metadata.desc || 'No description'}
👤 *Members:* ${metadata.participants.length}
👑 *Admins:* ${admins.length}
🆔 *Group ID:* ${from}
📅 *Created:* ${new Date(metadata.creation * 1000).toLocaleDateString()}
    `.trim();
    
    await sock.sendMessage(from, { text: infoText });
}
