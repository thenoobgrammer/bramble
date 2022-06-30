import { Client, IntentsString } from 'discord.js'
import { onInteraction } from './src/events/onInteraction';
import { onReady } from './src/events/onReady';
import { Song } from './src/interface/song';

require('dotenv').config();

const intentOptions: IntentsString[] = ["GUILDS", "GUILD_MESSAGES"];
const token: string = process.env.BOT_TOKEN as string
const BOT = new Client({ intents: intentOptions });
const queue: Song [] = []

BOT.login(token);

BOT.on('ready', async (client) => {
   await onReady(client)
})

BOT.on('interactionCreate', async (interaction) => { 
    await onInteraction(interaction, queue)
})
