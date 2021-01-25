
require('dotenv').config();
const { Client } = require('discord.js')
const axios = require('axios')
const { playAudioFile } = require('./actions');
const { fetch_by_genre} = require('./commands');
const { ZBEUB, KEVIN, MLGHORN, ROSA, AYOU, BRUH, GASP, GENRES } = require('./constants');
const bot = new Client();
const prefix = '!';

const TOKEN = process.env.TOKEN;

bot.login(TOKEN);

bot.on('ready' , () => {
    console.log('Bot logged in')
})

bot.on('message', (msg) => {
    if(msg.author.bot) return;
    if(!msg.content.startsWith(prefix)) return;

    const commandName = getCommandName(prefix, msg.content);

    if(commandName === 'anime') {
        const arg = getCommandArgs(prefix, msg.content)
        const genre = GENRES.find(x => x.key === arg);
        if(!genre)
            return;
        fetch_by_genre(commandName, genre.value, msg)
    }
    else if(commandName === 'play') {

    } else  {
        switch(commandName) {
            case 'zbeub':
                playAudioFile(msg, ZBEUB);
                break;
            case 'kevin':
                playAudioFile(msg, KEVIN)
                break;
            case 'airhorn':
                playAudioFile(msg, MLGHORN)
                break;
            case 'rosa':
                playAudioFile(msg, ROSA)
                break;
            case 'ayou':
                playAudioFile(msg, AYOU)
                break;
            case 'bruh':
                playAudioFile(msg, BRUH)
                break;
            case 'gasp':
                playAudioFile(msg, GASP)
                break;
            default:
                break;
        }
    }
})

function getCommandName(prefix, content) {
    return content.slice(prefix.length).split(' ')[0];
}

function getCommandArgs(prefix, content) {
    return content.slice(prefix.length).split(' ')[1];
}