
const { Client } = require('discord.js');
const { playAudio } = require('./commands/audio');
const { existsSync, readdirSync } = require('fs');
const { basename } = require('path')
const { searchDrink, searchStore } = require('./commands/drinks.js');

const client = new Client();
const prefix = '!';
const pathToAudios = "../sounds";
const audios = existsSync(pathToAudios) ? 
    readdirSync(pathToAudios)
    .filter(fileName => fileName.includes('.mp3')) 
    .map(fileName => basename(fileName, '.mp3')) : null;

client.login(process.env.GENERAL_BOT);
client.on('ready', () => {
    console.log("General Bot successfully connected.");
});


client.on('message', (msg) => {
    if (msg.author.bot) return;
    if (!msg.content.startsWith(prefix)) return;

    const args = msg.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    switch(command) {
        case 'search': 
            searchDrink(args, msg.channel);
            break;
        
        case 'locate': 
            searchStore(args, msg.channel);
            break;
        
        default:
            const audio = audios.find(audio => audio === command);
            if (audio) 
                playAudio(msg, `${pathToAudios}/${audio}.mp3`);
            break;
    }

    
})
