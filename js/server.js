const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const app = express();

// Inicializar el cliente de Discord.js con los permisos necesarios
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,  // Necesario para obtener miembros del servidor
    ]
});

// Puerto que usará el servidor, proporcionado por Replit o 3000 por defecto
const port = process.env.PORT || 3000;
let memberCount = 0;  // Inicializamos el contador de miembros

// Conectar el bot de Discord
client.once('ready', () => {
    console.log(`¡Bot conectado como ${client.user.tag}!`);

    // Cambia 'TU_GUILD_ID' por el ID de tu servidor de Discord
    const guild = client.guilds.cache.get(1216777605454499921);
    
    if (guild) {
        memberCount = guild.memberCount;  // Obtiene el número de miembros del servidor
    }
});

// API de jugadores de Roblox
app.get('/api/players', async (req, res) => {
    const gameIds = req.query.gameIds.split(',');  // Obtiene los Game IDs desde la URL, separados por coma
    const stats = [];

    try {
        // Hacemos peticiones a la API de Roblox para cada Game ID
        for (const gameId of gameIds) {
            const url = `https://games.roblox.com/v1/games/${gameId}/stats`;
            const response = await axios.get(url);
            const data = response.data;

            stats.push({
                gameId: gameId,
                totalVisits: data.totalVisits,
                totalPlaying: data.players
            });
        }

        res.json(stats);  // Devuelve los resultados de todos los juegos solicitados
    } catch (error) {
        console.error('Error obteniendo los datos de jugadores:', error);
        res.status(500).json({ error: 'Error al obtener datos de jugadores' });
    }
});

// API de miembros de un grupo de Roblox
app.get('/api/groups', async (req, res) => {
    const groupId = '34022467';  // Reemplaza con tu Group ID de Roblox
    const url = `https://groups.roblox.com/v1/groups/${groupId}/users`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        res.json({
            totalMembers: data.data.length
        });
    } catch (error) {
        console.error('Error obteniendo los datos del grupo:', error);
        res.status(500).json({ error: 'Error al obtener datos del grupo' });
    }
});

// API para obtener el número de miembros de Discord
app.get('/api/discord', (req, res) => {
    res.json({ memberCount });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor backend escuchando en el puerto ${port}`);
});

// Loguear el bot con el token de Discord
client.login('TU_BOT_TOKEN');  // Reemplaza con el token de tu bot de Discord