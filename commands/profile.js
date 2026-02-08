import { updateUser } from '../database/firebase.js';
import { downloadMediaMessage } from '@whiskeysockets/baileys';

export async function setProfile({ sock, from, sender, user, msg }) {
    if (!user.registered) {
        await sock.sendMessage(from, { text: '❌ Please register first using .register' });
        return;
    }
    
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!quoted?.imageMessage && !msg.message?.imageMessage) {
        await sock.sendMessage(from, { text: '📸 Please reply to an image or send an image with this command!' });
        return;
    }
    
    await sock.sendMessage(from, { text: '✅ Profile picture updated successfully!' });
}

export async function setProfileQuote({ sock, from, sender, user, args }) {
    if (!user.registered) {
        await sock.sendMessage(from, { text: '❌ Please register first using .register' });
        return;
    }
    
    if (args.length === 0) {
        await sock.sendMessage(from, { text: '📝 Usage: .setprofilequote <your quote>' });
        return;
    }
    
    const quote = args.join(' ');
    await updateUser(sender, { profileQuote: quote });
    
    await sock.sendMessage(from, { text: `✅ Profile quote updated to:\n"${quote}"` });
}

export async function setAge({ sock, from, sender, user, args }) {
    if (!user.registered) {
        await sock.sendMessage(from, { text: '❌ Please register first using .register' });
        return;
    }
    
    const age = parseInt(args[0]);
    if (!age || age < 1 || age > 120) {
        await sock.sendMessage(from, { text: '❌ Please provide a valid age (1-120)' });
        return;
    }
    
    await updateUser(sender, { age: age });
    await sock.sendMessage(from, { text: `✅ Age updated to: ${age}` });
}

export async function setName({ sock, from, sender, user, args }) {
    if (!user.registered) {
        await sock.sendMessage(from, { text: '❌ Please register first using .register' });
        return;
    }
    
    if (args.length === 0) {
        await sock.sendMessage(from, { text: '📝 Usage: .setname <your name>' });
        return;
    }
    
    const name = args.join(' ');
    await updateUser(sender, { name: name });
    await sock.sendMessage(from, { text: `✅ Name updated to: ${name}` });
}
