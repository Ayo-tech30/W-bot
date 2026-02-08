import makeWASocket, { 
    DisconnectReason, 
    useMultiFileAuthState, 
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    Browsers
} from '@whiskeysockets/baileys';
import pino from 'pino';
import chalk from 'chalk';
import readline from 'readline';
import { Boom } from '@hapi/boom';
import { handleMessage } from './handlers/messageHandler.js';
import { initializeFirebase, getSettings } from './database/firebase.js';

const logger = pino({ level: 'silent' });
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (text) => new Promise((resolve) => rl.question(text, resolve));

console.log(chalk.cyan(`
╭━━━━━━━━━━━━━━━━━━━━━━━╮
│                         │
│   🌟 NEXORA BOT 🌟     │
│   Violet Edition        │
│   Created by: Kynx      │
│   Database: Firebase 🔥 │
│                         │
╰━━━━━━━━━━━━━━━━━━━━━━━╯
`));

async function startBot() {
    // Initialize Firebase
    try {
        initializeFirebase();
        console.log(chalk.green('✅ Firebase connected successfully!\n'));
    } catch (error) {
        console.log(chalk.red('❌ Firebase connection failed!'));
        console.log(chalk.yellow('Please check your Firebase configuration in database/firebase.js\n'));
        process.exit(1);
    }

    const { state, saveCreds } = await useMultiFileAuthState('./auth_info');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger,
        printQRInTerminal: false,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, logger),
        },
        browser: Browsers.ubuntu('Chrome'),
        markOnlineOnConnect: true,
    });

    // Handle pairing code
    if (!sock.authState.creds.registered) {
        console.log(chalk.yellow('\n📱 WhatsApp Pairing Code Authentication\n'));
        const phoneNumber = await question(chalk.green('Enter your WhatsApp number (with country code, e.g., 1234567890): '));
        
        const code = await sock.requestPairingCode(phoneNumber.trim());
        console.log(chalk.cyan(`\n🔐 Your Pairing Code: ${chalk.bold.white(code)}\n`));
        console.log(chalk.yellow('Enter this code in WhatsApp: Linked Devices > Link a Device > Link with phone number\n'));
    }

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error instanceof Boom)
                ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
                : true;

            console.log(chalk.red('Connection closed due to'), lastDisconnect?.error);

            if (shouldReconnect) {
                console.log(chalk.yellow('Reconnecting...'));
                startBot();
            }
        } else if (connection === 'open') {
            console.log(chalk.green('✅ Bot Connected Successfully!'));
            console.log(chalk.cyan('🔥 Firebase Database Active!'));
            console.log(chalk.cyan('Bot is now online and ready to receive commands!\n'));
            
            // Load settings
            const settings = await getSettings();
            console.log(chalk.magenta(`Bot Name: ${settings.botName}`));
            console.log(chalk.magenta(`Prefix: ${settings.prefix}\n`));
        }
    });

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;
        
        const msg = messages[0];
        if (!msg.message) return;

        await handleMessage(sock, msg);
    });

    sock.ev.on('group-participants.update', async (update) => {
        const { id, participants, action } = update;
        const { getGroup } = await import('./database/firebase.js');
        const group = await getGroup(id);
        
        if (!group) return;
        
        const metadata = await sock.groupMetadata(id);
        
        for (const participant of participants) {
            if (action === 'add') {
                if (group.welcome) {
                    await sock.sendMessage(id, {
                        text: `👋 Welcome @${participant.split('@')[0]} to *${metadata.subject}*!\n\nType *.menu* to see available commands.`,
                        mentions: [participant]
                    });
                }
            } else if (action === 'remove') {
                if (group.goodbye) {
                    await sock.sendMessage(id, {
                        text: `👋 Goodbye @${participant.split('@')[0]}!`,
                        mentions: [participant]
                    });
                }
            }
        }
    });

    return sock;
}

startBot().catch(err => console.log(chalk.red('Error starting bot:'), err));
