const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const cron = require('node-cron');

// 🔥 Create client
const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: './session'
    }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// 🔹 QR Code
client.on('qr', (qr) => {
    console.log('QR RECEIVED:', qr);
});

// 🔹 Ready
client.on('ready', async () => {
    console.log('✅ Bot Ready!');

    // 🔥 PRINT ALL GROUPS (first time only)
    const chats = await client.getChats();
    chats.forEach(chat => {
        if (chat.isGroup) {
            console.log("GROUP:", chat.name, chat.id._serialized);
        }
    });

    // 🔥 AUTO REMINDER (change group ID here)
    cron.schedule('0 10 * * *', () => {
        const groupId = "PASTE_YOUR_GROUP_ID@g.us";
        client.sendMessage(groupId, "📌 Daily Reminder: Update your tasks!");
    });
});

client.initialize();