import { downloadMediaMessage } from '@whiskeysockets/baileys';
import Jimp from 'jimp';
import axios from 'axios';
import FormData from 'form-data';

export async function sticker({ sock, from, msg }) {
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!quoted?.imageMessage && !msg.message?.imageMessage) {
        await sock.sendMessage(from, { 
            text: '❌ Please reply to an image or send an image with this command!' 
        });
        return;
    }
    
    try {
        await sock.sendMessage(from, { text: '🎨 Creating sticker...' });
        
        const buffer = await downloadMediaMessage(msg, 'buffer', {});
        
        // Resize and convert to webp
        const image = await Jimp.read(buffer);
        image.resize(512, 512);
        const stickerBuffer = await image.getBufferAsync(Jimp.MIME_PNG);
        
        await sock.sendMessage(from, {
            sticker: stickerBuffer
        });
    } catch (error) {
        console.error('Sticker error:', error);
        await sock.sendMessage(from, { 
            text: '❌ Failed to create sticker. Please try again with a different image.' 
        });
    }
}

export async function blur({ sock, from, msg }) {
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!quoted?.imageMessage && !msg.message?.imageMessage) {
        await sock.sendMessage(from, { 
            text: '❌ Please reply to an image or send an image with this command!' 
        });
        return;
    }
    
    try {
        await sock.sendMessage(from, { text: '🌫️ Blurring image...' });
        
        const buffer = await downloadMediaMessage(msg, 'buffer', {});
        
        // Apply blur effect
        const image = await Jimp.read(buffer);
        image.blur(10);
        const blurredBuffer = await image.getBufferAsync(Jimp.MIME_JPEG);
        
        await sock.sendMessage(from, {
            image: blurredBuffer,
            caption: '✅ Blurred image'
        });
    } catch (error) {
        console.error('Blur error:', error);
        await sock.sendMessage(from, { 
            text: '❌ Failed to blur image. Please try again.' 
        });
    }
}

export async function removeBg({ sock, from, msg }) {
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!quoted?.imageMessage && !msg.message?.imageMessage) {
        await sock.sendMessage(from, { 
            text: '❌ Please reply to an image or send an image with this command!' 
        });
        return;
    }
    
    try {
        await sock.sendMessage(from, { text: '✂️ Removing background...' });
        
        const buffer = await downloadMediaMessage(msg, 'buffer', {});
        
        // Using remove.bg API (you'll need an API key)
        // For demo purposes, just sending back the original with a message
        await sock.sendMessage(from, {
            image: buffer,
            caption: '✅ Background removal (feature requires API key)\n\nTo enable this feature, add your remove.bg API key to the bot.'
        });
        
        // Actual implementation would be:
        /*
        const formData = new FormData();
        formData.append('image_file', buffer, 'image.jpg');
        
        const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
            headers: {
                'X-Api-Key': 'YOUR_API_KEY',
                ...formData.getHeaders()
            },
            responseType: 'arraybuffer'
        });
        
        await sock.sendMessage(from, {
            image: Buffer.from(response.data),
            caption: '✅ Background removed'
        });
        */
    } catch (error) {
        console.error('RemoveBG error:', error);
        await sock.sendMessage(from, { 
            text: '❌ Failed to remove background. Please try again.' 
        });
    }
}
