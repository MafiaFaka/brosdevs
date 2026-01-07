const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers, // Permite acceder a los miembros del servidor
    ],
});

// Token de tu bot
const token = 'MTQ1ODAxOTkyMjcxNzMxMTAwNw.GKCy_M.0fK-Eh_N-RAB8tYhj3sXvsNd6BeVu3X4YvW5kE';

client.once('ready', () => {
    console.log('Bot está listo');
});

// API para obtener el número de miembros
client.on('messageCreate', async (message) => {
    if (message.content.toLowerCase() === '!miembros') {
        // Obtener todos los miembros del servidor
        const guild = message.guild;
        await guild.members.fetch();  // Aseguramos que tenemos todos los miembros
        const memberCount = guild.memberCount;
        message.channel.send(`¡Hay ${memberCount} miembros en este servidor!`);
    }
});

// Log in con el token
client.login(token);
