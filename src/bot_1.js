
const { Client } = require('discord.js');
const { playAudioFile, type } = require('./actions');
const { fetch_by_genre } = require('./commands');
const { SOUNDS, GENRES } = require('./constants');

const bot_1 = new Client();
const prefix = '!';

bot_1.login(process.env.PROD_TOKEN_1);
bot_1.on('ready', () => {
    console.log("Bot 1 successfully connected.");
})

bot_1.on('message', (msg) => {
    if (msg.author.bot) return;
    if (!msg.content.startsWith(prefix)) return;

    const args = msg.content.slice(prefix.length).trim().split(/ +/g);
    const commmand = args.shift().toLowerCase();

    if (commmand === 'anime') {
	const genre = GENRES.find(genre => genre.key === args[0]);
        if (!genre)
            return;
        fetch_by_genre(commmand, genre.value, msg)
            .then((url) => type(msg, url))
    }
    else {
        let audio = SOUNDS.find(audio => audio.key === commmand);
        if (audio) {
            playAudioFile(msg, audio.filePath);
        }
    }
})
