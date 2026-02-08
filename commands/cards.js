import { getUserCards, updateUser, getUser, createAuction, getGroupAuctions, getAuction, updateAuction, deleteAuction, updateGroup } from '../database/firebase.js';
import { claimCard, getSpawnedCardData } from '../utils/cardSpawner.js';

export async function myCards({ sock, from, sender, user }) {
    if (!user.registered) {
        await sock.sendMessage(from, { text: '❌ Please register first using .register' });
        return;
    }
    
    const cards = await getUserCards(sender);
    
    if (cards.length === 0) {
        await sock.sendMessage(from, { 
            text: '📦 You don\'t have any cards yet!\n\nCards spawn randomly in groups when images are posted. Use .get <id> to claim them!' 
        });
        return;
    }
    
    let cardText = `🎴 *YOUR CARD COLLECTION* 🎴\n━━━━━━━━━━━━━━\n\n`;
    
    const rarityGroups = {};
    cards.forEach(card => {
        if (!rarityGroups[card.rarity]) {
            rarityGroups[card.rarity] = [];
        }
        rarityGroups[card.rarity].push(card);
    });
    
    const rarityOrder = ['Mythic', 'Legendary', 'Epic', 'Rare', 'Uncommon', 'Common'];
    const rarityEmojis = {
        'Common': '⚪',
        'Uncommon': '🟢',
        'Rare': '🔵',
        'Epic': '🟣',
        'Legendary': '🟡',
        'Mythic': '🔴'
    };
    
    rarityOrder.forEach(rarity => {
        if (rarityGroups[rarity]) {
            cardText += `${rarityEmojis[rarity]} *${rarity}* (${rarityGroups[rarity].length})\n`;
            rarityGroups[rarity].forEach(card => {
                cardText += `  • ${card.name} - $${card.value}\n`;
            });
            cardText += '\n';
        }
    });
    
    cardText += `━━━━━━━━━━━━━━\n📊 Total Cards: ${cards.length}\n💰 Total Value: $${cards.reduce((sum, c) => sum + c.value, 0)}\n🔥 Stored in Firebase`;
    
    await sock.sendMessage(from, { text: cardText });
}

export async function getCard({ sock, from, sender, user, args }) {
    if (!user.registered) {
        await sock.sendMessage(from, { text: '❌ Please register first using .register' });
        return;
    }
    
    if (args.length === 0) {
        await sock.sendMessage(from, { text: '📝 Usage: .get <card_id>' });
        return;
    }
    
    const cardId = args[0];
    const claimedCard = await claimCard(cardId, sender);
    
    if (!claimedCard) {
        await sock.sendMessage(from, { 
            text: '❌ Card not found or already claimed!\n\nWait for cards to spawn in the group.' 
        });
        return;
    }
    
    const rarityEmojis = {
        'Common': '⚪',
        'Uncommon': '🟢',
        'Rare': '🔵',
        'Epic': '🟣',
        'Legendary': '🟡',
        'Mythic': '🔴'
    };
    
    const rarityEmoji = rarityEmojis[claimedCard.rarity] || '⚪';
    
    const claimText = `
🎉 *CARD CLAIMED!* 🎉

${rarityEmoji} *${claimedCard.name}*
📊 Rarity: ${claimedCard.rarity}
📚 Series: ${claimedCard.series}
💰 Value: $${claimedCard.value}

✅ Added to your collection!
Use .mycards to view all your cards.
🔥 Saved to Firebase
    `.trim();
    
    await sock.sendMessage(from, { 
        text: claimText,
        mentions: [sender]
    });
}

export async function deck({ sock, from, sender, user }) {
    if (!user.registered) {
        await sock.sendMessage(from, { text: '❌ Please register first using .register' });
        return;
    }
    
    const cards = await getUserCards(sender);
    
    if (cards.length === 0) {
        await sock.sendMessage(from, { 
            text: '❌ You need cards to build a deck!\n\nCollect cards first using .get when they spawn.' 
        });
        return;
    }
    
    const sortedCards = cards.sort((a, b) => b.value - a.value).slice(0, 10);
    await updateUser(sender, { deck: sortedCards.map(c => c.id) });
    
    let deckText = `🃏 *YOUR BATTLE DECK* 🃏\n━━━━━━━━━━━━━━\n\n`;
    
    const rarityEmojis = {
        'Common': '⚪',
        'Uncommon': '🟢',
        'Rare': '🔵',
        'Epic': '🟣',
        'Legendary': '🟡',
        'Mythic': '🔴'
    };
    
    sortedCards.forEach((card, index) => {
        const rarityEmoji = rarityEmojis[card.rarity] || '⚪';
        deckText += `${index + 1}. ${rarityEmoji} ${card.name} ($${card.value})\n`;
    });
    
    deckText += `\n━━━━━━━━━━━━━━\n⚔️ Deck Power: ${sortedCards.reduce((sum, c) => sum + c.value, 0)}`;
    
    await sock.sendMessage(from, { text: deckText });
}

export async function giveCard({ sock, from, sender, user, args, msg }) {
    if (!user.registered) {
        await sock.sendMessage(from, { text: '❌ Please register first using .register' });
        return;
    }
    
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    if (!mentioned) {
        await sock.sendMessage(from, { text: '❌ Please mention a user to give a card to!' });
        return;
    }
    
    if (args.length < 2) {
        await sock.sendMessage(from, { text: '📝 Usage: .givecard @user <card_name>' });
        return;
    }
    
    const cardName = args.slice(1).join(' ');
    const userCards = await getUserCards(sender);
    const cardToGive = userCards.find(c => c.name.toLowerCase().includes(cardName.toLowerCase()));
    
    if (!cardToGive) {
        await sock.sendMessage(from, { text: `❌ You don't have a card matching "${cardName}"` });
        return;
    }
    
    const receiver = await getUser(mentioned);
    const newSenderCards = user.cards.filter(c => c.id !== cardToGive.id);
    const newReceiverCards = [...(receiver.cards || []), cardToGive];
    
    await updateUser(sender, { cards: newSenderCards });
    await updateUser(mentioned, { cards: newReceiverCards });
    
    await sock.sendMessage(from, { 
        text: `✅ You gave *${cardToGive.name}* to @${mentioned.split('@')[0]}!\n🔥 Transaction saved to Firebase`,
        mentions: [mentioned]
    });
}

export async function sellCard({ sock, from, sender, user, args }) {
    if (!user.registered) {
        await sock.sendMessage(from, { text: '❌ Please register first using .register' });
        return;
    }
    
    if (args.length === 0) {
        await sock.sendMessage(from, { text: '📝 Usage: .sellcard <card_name>' });
        return;
    }
    
    const cardName = args.join(' ');
    const userCards = await getUserCards(sender);
    const cardToSell = userCards.find(c => c.name.toLowerCase().includes(cardName.toLowerCase()));
    
    if (!cardToSell) {
        await sock.sendMessage(from, { text: `❌ You don't have a card matching "${cardName}"` });
        return;
    }
    
    const newCards = user.cards.filter(c => c.id !== cardToSell.id);
    await updateUser(sender, {
        cards: newCards,
        wallet: user.wallet + cardToSell.value
    });
    
    await sock.sendMessage(from, { 
        text: `✅ Sold *${cardToSell.name}* for $${cardToSell.value}!\n💰 New balance: $${user.wallet + cardToSell.value}` 
    });
}

export async function auction({ sock, from, sender, user, args, isGroup }) {
    if (!isGroup) {
        await sock.sendMessage(from, { text: '❌ This command can only be used in groups!' });
        return;
    }
    
    if (!user.registered) {
        await sock.sendMessage(from, { text: '❌ Please register first using .register' });
        return;
    }
    
    if (args.length < 2) {
        await sock.sendMessage(from, { text: '📝 Usage: .auction <card_name> <starting_bid>' });
        return;
    }
    
    const startBid = parseInt(args[args.length - 1]);
    const cardName = args.slice(0, -1).join(' ');
    
    if (!startBid || startBid < 1) {
        await sock.sendMessage(from, { text: '❌ Please provide a valid starting bid!' });
        return;
    }
    
    const userCards = await getUserCards(sender);
    const cardToAuction = userCards.find(c => c.name.toLowerCase().includes(cardName.toLowerCase()));
    
    if (!cardToAuction) {
        await sock.sendMessage(from, { text: `❌ You don't have a card matching "${cardName}"` });
        return;
    }
    
    const auction = {
        id: Date.now().toString(),
        card: cardToAuction,
        seller: sender,
        startBid: startBid,
        currentBid: startBid,
        highestBidder: null,
        endsAt: Date.now() + 300000
    };
    
    await createAuction(from, auction);
    
    const auctionText = `
🔨 *NEW AUCTION!* 🔨

🎴 Card: *${cardToAuction.name}*
📊 Rarity: ${cardToAuction.rarity}
💰 Starting Bid: $${startBid}
⏰ Ends in: 5 minutes

Type .bid ${auction.id} <amount> to bid!
    `.trim();
    
    await sock.sendMessage(from, { text: auctionText });
    
    setTimeout(async () => {
        const activeAuction = await getAuction(from, auction.id);
        
        if (activeAuction && activeAuction.highestBidder) {
            const winner = await getUser(activeAuction.highestBidder);
            const seller = await getUser(sender);
            
            const newSellerCards = seller.cards.filter(c => c.id !== cardToAuction.id);
            const newWinnerCards = [...(winner.cards || []), cardToAuction];
            
            await updateUser(sender, { 
                cards: newSellerCards,
                wallet: seller.wallet + activeAuction.currentBid 
            });
            await updateUser(activeAuction.highestBidder, { 
                cards: newWinnerCards,
                wallet: winner.wallet - activeAuction.currentBid
            });
            
            await sock.sendMessage(from, {
                text: `🔨 *AUCTION ENDED!*\n\n🎴 ${cardToAuction.name}\n🏆 Winner: @${activeAuction.highestBidder.split('@')[0]}\n💰 Final Bid: $${activeAuction.currentBid}`,
                mentions: [activeAuction.highestBidder]
            });
        } else {
            await sock.sendMessage(from, { text: `🔨 Auction ended with no bids. Card returned to seller.` });
        }
        
        await deleteAuction(from, auction.id);
    }, 300000);
}

export async function bid({ sock, from, sender, user, args, isGroup }) {
    if (!isGroup) {
        await sock.sendMessage(from, { text: '❌ This command can only be used in groups!' });
        return;
    }
    
    if (!user.registered) {
        await sock.sendMessage(from, { text: '❌ Please register first using .register' });
        return;
    }
    
    if (args.length < 2) {
        await sock.sendMessage(from, { text: '📝 Usage: .bid <auction_id> <amount>' });
        return;
    }
    
    const auctionId = args[0];
    const bidAmount = parseInt(args[1]);
    
    const auction = await getAuction(from, auctionId);
    
    if (!auction) {
        await sock.sendMessage(from, { text: '❌ Auction not found!' });
        return;
    }
    
    if (auction.seller === sender) {
        await sock.sendMessage(from, { text: '❌ You cannot bid on your own auction!' });
        return;
    }
    
    if (bidAmount <= auction.currentBid) {
        await sock.sendMessage(from, { text: `❌ Bid must be higher than $${auction.currentBid}!` });
        return;
    }
    
    if (user.wallet < bidAmount) {
        await sock.sendMessage(from, { text: '❌ Insufficient funds!' });
        return;
    }
    
    await updateAuction(from, auctionId, {
        currentBid: bidAmount,
        highestBidder: sender
    });
    
    await sock.sendMessage(from, { 
        text: `✅ @${sender.split('@')[0]} bid $${bidAmount} on ${auction.card.name}!\n\nCurrent highest bid: $${bidAmount}`,
        mentions: [sender]
    });
}

export async function rollCard({ sock, from, sender, user }) {
    if (!user.registered) {
        await sock.sendMessage(from, { text: '❌ Please register first using .register' });
        return;
    }
    
    const cost = 500;
    if (user.wallet < cost) {
        await sock.sendMessage(from, { text: `❌ You need $${cost} to roll a card!\n💰 Your balance: $${user.wallet}` });
        return;
    }
    
    const rarities = [
        { name: 'Common', chance: 0.50, value: 100 },
        { name: 'Uncommon', chance: 0.25, value: 250 },
        { name: 'Rare', chance: 0.15, value: 500 },
        { name: 'Epic', chance: 0.07, value: 1000 },
        { name: 'Legendary', chance: 0.025, value: 2500 },
        { name: 'Mythic', chance: 0.005, value: 5000 }
    ];
    
    const rand = Math.random();
    let cumulative = 0;
    let selectedRarity = rarities[0];
    
    for (const rarity of rarities) {
        cumulative += rarity.chance;
        if (rand <= cumulative) {
            selectedRarity = rarity;
            break;
        }
    }
    
    const cardNames = ['Dragon', 'Phoenix', 'Tiger', 'Wolf', 'Eagle', 'Serpent', 'Lion', 'Falcon', 'Panther', 'Bear'];
    const randomName = cardNames[Math.floor(Math.random() * cardNames.length)];
    
    const newCard = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: `${selectedRarity.name} ${randomName}`,
        rarity: selectedRarity.name,
        series: 'Gacha',
        value: selectedRarity.value,
        claimedAt: Date.now(),
        level: 1
    };
    
    const newCards = [...(user.cards || []), newCard];
    await updateUser(sender, {
        cards: newCards,
        wallet: user.wallet - cost
    });
    
    const rarityEmojis = {
        'Common': '⚪',
        'Uncommon': '🟢',
        'Rare': '🔵',
        'Epic': '🟣',
        'Legendary': '🟡',
        'Mythic': '🔴'
    };
    
    const rarityEmoji = rarityEmojis[newCard.rarity] || '⚪';
    
    const rollText = `
🎰 *CARD ROLL!* 🎰

${rarityEmoji} You got: *${newCard.name}*!
📊 Rarity: ${newCard.rarity}
💰 Value: $${newCard.value}

✅ Added to your collection!
💰 New balance: $${user.wallet - cost}
🔥 Saved to Firebase
    `.trim();
    
    await sock.sendMessage(from, { text: rollText });
}

export async function toggleCards({ sock, from, sender, args, isGroup, group }) {
    if (!isGroup) {
        await sock.sendMessage(from, { text: '❌ This command can only be used in groups!' });
        return;
    }
    
    const metadata = await sock.groupMetadata(from);
    const participant = metadata.participants.find(p => p.id === sender);
    const isAdmin = participant?.admin === 'admin' || participant?.admin === 'superadmin';
    
    if (!isAdmin) {
        await sock.sendMessage(from, { text: '❌ Only admins can use this command!' });
        return;
    }
    
    const status = args[0]?.toLowerCase();
    if (status === 'on') {
        await updateGroup(from, { cardSpawn: true });
        await sock.sendMessage(from, { text: '✅ Card spawning enabled! Cards will spawn when images are posted.' });
    } else if (status === 'off') {
        await updateGroup(from, { cardSpawn: false });
        await sock.sendMessage(from, { text: '❌ Card spawning disabled!' });
    } else {
        await sock.sendMessage(from, { text: '📝 Usage: .cards on/off' });
    }
}
