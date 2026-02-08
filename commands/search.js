import axios from 'axios';

export async function ai({ sock, from, args }) {
    if (args.length === 0) {
        await sock.sendMessage(from, { text: '📝 Usage: .ai <your question>' });
        return;
    }
    
    const query = args.join(' ');
    
    try {
        await sock.sendMessage(from, { text: '🤖 Thinking...' });
        
        // Using a free AI API (you can replace with your preferred API)
        const response = await axios.get(`https://api.popcat.xyz/chatbot`, {
            params: {
                msg: query,
                owner: 'Kynx',
                botname: 'Violet'
            }
        });
        
        const answer = response.data.response || 'Sorry, I couldn\'t process that.';
        
        await sock.sendMessage(from, { 
            text: `🤖 *AI Response:*\n\n${answer}` 
        });
    } catch (error) {
        await sock.sendMessage(from, { 
            text: '❌ Failed to get AI response. Please try again later.' 
        });
    }
}

export async function google({ sock, from, args }) {
    if (args.length === 0) {
        await sock.sendMessage(from, { text: '📝 Usage: .google <search query>' });
        return;
    }
    
    const query = args.join(' ');
    
    try {
        await sock.sendMessage(from, { text: '🔍 Searching Google...' });
        
        // Using Google Custom Search API or web scraping
        // For demonstration, using a simple search results formatter
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        
        const searchText = `
🔍 *GOOGLE SEARCH*

Query: "${query}"

🌐 Search URL:
${searchUrl}

💡 Open the link above to see results!

━━━━━━━━━━━━━━
Pro tip: Use specific keywords for better results
        `.trim();
        
        await sock.sendMessage(from, { text: searchText });
    } catch (error) {
        await sock.sendMessage(from, { 
            text: '❌ Search failed. Please try again.' 
        });
    }
}
