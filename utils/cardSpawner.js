import { downloadMediaMessage } from '@whiskeysockets/baileys';
import { addCard, saveSpawnedCard, getSpawnedCard, deleteSpawnedCard } from '../database/firebase.js';
import crypto from 'crypto';

export async function handleCardSpawn(sock, msg, from) {
    try {
        const sender = msg.key.participant || msg.key.remoteJid;
        const caption = msg.message.imageMessage.caption || '';
        
        const buffer = await downloadMediaMessage(msg, 'buffer', {});
        const cardId = crypto.randomBytes(8).toString('hex');
        
        let cardName = 'Unknown Card';
        let rarity = 'Common';
        let series = 'General';
        let value = 100;
        
        const lines = caption.split('\n');
        for (const line of lines) {
            if (line.toLowerCase().includes('name:')) {
                cardName = line.split(':')[1]?.trim() || cardName;
            }
            if (line.toLowerCase().includes('rarity:')) {
                rarity = line.split(':')[1]?.trim() || rarity;
            }
            if (line.toLowerCase().includes('series:')) {
                series = line.split(':')[1]?.trim() || series;
            }
            if (line.toLowerCase().includes('value:')) {
                value = parseInt(line.split(':')[1]?.trim()) || value;
            }
        }
        
        if (!caption.toLowerCase().includes('value:')) {
            switch (rarity.toLowerCase()) {
                case 'common':
                    value = 100;
                    break;
                case 'uncommon':
                    value = 250;
                    break;
                case 'rare':
                    value = 500;
                    break;
                case 'epic':
                    value = 1000;
                    break;
                case 'legendary':
                    value = 2500;
                    break;
                case 'mythic':
                    value = 5000;
                    break;
                default:
                    value = 100;
            }
        }
        
        const card = {
            id: cardId,
            name: cardName,
            rarity: rarity,
            series: series,
            value: value,
            spawnedAt: Date.now(),
            spawnedBy: sender
        };
        
        await saveSpawnedCard(cardId, card);
        
        const rarityEmojis = {
            'common': '⚪',
            'uncommon': '🟢',
            'rare': '🔵',
            'epic': '🟣',
            'legendary': '🟡',
            'mythic': '🔴'
        };
        
        const rarityEmoji = rarityEmojis[rarity.toLowerCase()] || '⚪';
        
        const spawnText = `
🎴 *A WILD CARD APPEARED!* 🎴

${rarityEmoji} *${cardName}*
📊 Rarity: ${rarity}
📚 Series: ${series}
💰 Value: $${value}

🆔 Card ID: \`${cardId}\`

Type *.get ${cardId}* to claim this card!
⏰ First come, first served!
🔥 Stored in Firebase
        `.trim();
        
        await sock.sendMessage(from, {
            image: buffer,
            caption: spawnText
        });
        
        setTimeout(async () => {
            await deleteSpawnedCard(cardId);
        }, 300000);
        
    } catch (error) {
        console.error('Error spawning card:', error);
    }
}

export async function getSpawnedCardData(cardId) {
    return await getSpawnedCard(cardId);
}

export async function claimCard(cardId, userId) {
    const card = await getSpawnedCard(cardId);
    if (!card) return null;
    
    const userCard = {
        id: card.id,
        name: card.name,
        rarity: card.rarity,
        series: card.series,
        value: card.value,
        claimedAt: Date.now(),
        level: 1
    };
    
    await addCard(userId, userCard);
    await deleteSpawnedCard(cardId);
    
    return userCard;
}
