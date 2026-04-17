const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const cron = require('node-cron');

// 🔥 Create client
const client = new Client({
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// 🔹 QR Code (prints once)
client.on('qr', (qr) => {
    console.log('================ QR CODE ================');
    qrcode.generate(qr, { small: true });
    console.log('========================================');
});

// 🔹 Ready
client.on('ready', async () => {
    console.log('✅ Bot Ready!');

    // 🔥 PRINT ALL GROUPS
    const chats = await client.getChats();
    chats.forEach(chat => {
        if (chat.isGroup) {
            console.log("GROUP:", chat.name, chat.id._serialized);
        }
    });

    // 🔥 AUTO REMINDER (change ID after first run)
    cron.schedule('0 10 * * *', () => {
        const groupId = "PASTE_YOUR_GROUP_ID@g.us";
        client.sendMessage(groupId, "📌 Daily Reminder: Update your tasks!");
    });
});

// 🔹 Error handling (VERY IMPORTANT)
client.on('auth_failure', () => {
    console.error('❌ Authentication failed');
});

client.on('disconnected', (reason) => {
    console.log('⚠️ Client disconnected:', reason);
});

// 🔹 Start bot
client.initialize();

// 🔹 Keep alive logs
setInterval(() => {
    console.log("🚀 Bot running...");
}, 30000);