import { getUser, getGroup, updateUser } from '../database/firebase.js';
import * as mainCommands from '../commands/main.js';
import * as profileCommands from '../commands/profile.js';
import * as groupCommands from '../commands/group.js';
import * as cardCommands from '../commands/cards.js';
import * as economyCommands from '../commands/economy.js';
import * as searchCommands from '../commands/search.js';
import * as imageCommands from '../commands/image.js';
import * as funCommands from '../commands/fun.js';
import * as downloadCommands from '../commands/download.js';
import { handleCardSpawn } from '../utils/cardSpawner.js';
import { getSettings } from '../database/firebase.js';

export async function handleMessage(sock, msg) {
    try {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const isGroup = from.endsWith('@g.us');
        
        // Get message content
        const messageType = Object.keys(msg.message)[0];
        let body = '';
        
        if (messageType === 'conversation') {
            body = msg.message.conversation;
        } else if (messageType === 'extendedTextMessage') {
            body = msg.message.extendedTextMessage.text;
        } else if (messageType === 'imageMessage') {
            body = msg.message.imageMessage.caption || '';
        } else if (messageType === 'videoMessage') {
            body = msg.message.videoMessage.caption || '';
        }

        // Get user and group from Firebase
        const user = await getUser(sender);
        const group = isGroup ? await getGroup(from) : null;
        const settings = await getSettings();

        // Check AFK
        if (user.afk) {
            await updateUser(sender, { afk: false, afkReason: '' });
            await sock.sendMessage(from, { text: `Welcome back! You're no longer AFK.` });
        }

        // Check for mentioned AFK users
        if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid) {
            const mentioned = msg.message.extendedTextMessage.contextInfo.mentionedJid;
            for (const jid of mentioned) {
                const mentionedUser = await getUser(jid);
                if (mentionedUser && mentionedUser.afk) {
                    await sock.sendMessage(from, {
                        text: `⏰ @${jid.split('@')[0]} is currently AFK\nReason: ${mentionedUser.afkReason || 'No reason'}`,
                        mentions: [jid]
                    });
                }
            }
        }

        // Card spawn system - check if message has image
        if (isGroup && group && group.cardSpawn && msg.message?.imageMessage) {
            await handleCardSpawn(sock, msg, from);
        }

        // Command handling
        const prefix = settings.prefix;
        if (!body.startsWith(prefix)) return;

        const args = body.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        const context = { sock, msg, from, sender, args, isGroup, user, group, prefix };

        // Route commands
        switch (command) {
            // Main Menu
            case 'menu':
                await mainCommands.menu(context);
                break;
            case 'ping':
                await mainCommands.ping(context);
                break;
            case 'alive':
                await mainCommands.alive(context);
                break;
            case 'afk':
                await mainCommands.afk(context);
                break;
            case 'register':
            case 'reg':
                await mainCommands.register(context);
                break;
            case 'leaderboard':
            case 'lb':
                await mainCommands.leaderboard(context);
                break;
            case 'market':
                await mainCommands.market(context);
                break;
            case 'mugen':
                await mainCommands.mugen(context);
                break;

            // Profile Menu
            case 'setprofile':
            case 'setp':
                await profileCommands.setProfile(context);
                break;
            case 'setprofilequote':
                await profileCommands.setProfileQuote(context);
                break;
            case 'setage':
                await profileCommands.setAge(context);
                break;
            case 'setname':
                await profileCommands.setName(context);
                break;

            // Group Menu
            case 'promote':
                await groupCommands.promote(context);
                break;
            case 'demote':
                await groupCommands.demote(context);
                break;
            case 'mute':
                await groupCommands.mute(context);
                break;
            case 'unmute':
                await groupCommands.unmute(context);
                break;
            case 'warn':
                await groupCommands.warn(context);
                break;
            case 'warncount':
                await groupCommands.warnCount(context);
                break;
            case 'resetwarn':
                await groupCommands.resetWarn(context);
                break;
            case 'kick':
                await groupCommands.kick(context);
                break;
            case 'delete':
                await groupCommands.deleteMessage(context);
                break;
            case 'tagall':
                await groupCommands.tagAll(context);
                break;
            case 'hidetag':
                await groupCommands.hideTag(context);
                break;
            case 'welcome':
                await groupCommands.welcome(context);
                break;
            case 'goodbye':
                await groupCommands.goodbye(context);
                break;
            case 'antilink':
                await groupCommands.antilink(context);
                break;
            case 'groupinfo':
                await groupCommands.groupInfo(context);
                break;

            // Cards Menu
            case 'mycards':
                await cardCommands.myCards(context);
                break;
            case 'get':
                await cardCommands.getCard(context);
                break;
            case 'deck':
                await cardCommands.deck(context);
                break;
            case 'givecard':
                await cardCommands.giveCard(context);
                break;
            case 'sellcard':
                await cardCommands.sellCard(context);
                break;
            case 'auction':
                await cardCommands.auction(context);
                break;
            case 'bid':
                await cardCommands.bid(context);
                break;
            case 'rollcard':
                await cardCommands.rollCard(context);
                break;
            case 'cards':
                await cardCommands.toggleCards(context);
                break;

            // Economy Menu
            case 'accbal':
                await economyCommands.balance(context);
                break;
            case 'deposit':
                await economyCommands.deposit(context);
                break;
            case 'withdraw':
                await economyCommands.withdraw(context);
                break;
            case 'send':
                await economyCommands.send(context);
                break;
            case 'daily':
                await economyCommands.daily(context);
                break;
            case 'gamble':
                await economyCommands.gamble(context);
                break;
            case 'inv':
                await economyCommands.inventory(context);
                break;

            // Search Menu
            case 'gpt':
            case 'ai':
                await searchCommands.ai(context);
                break;
            case 'google':
                await searchCommands.google(context);
                break;

            // Image Menu
            case 'sticker':
                await imageCommands.sticker(context);
                break;
            case 'blur':
                await imageCommands.blur(context);
                break;
            case 'removebg':
                await imageCommands.removeBg(context);
                break;

            // Fun Menu
            case 'match':
                await funCommands.match(context);
                break;
            case 'roast':
                await funCommands.roast(context);
                break;
            case 'simp':
                await funCommands.simp(context);
                break;

            // Download Menu
            case 'play':
                await downloadCommands.play(context);
                break;
            case 'instagram':
                await downloadCommands.instagram(context);
                break;
            case 'tiktok':
                await downloadCommands.tiktok(context);
                break;
        }

    } catch (error) {
        console.error('Error handling message:', error);
    }
}
