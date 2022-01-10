const { Client } = require('discord.js')
const { existsSync, readdirSync } = require('fs');
const { basename } = require('path')
const ytsr = require('ytsr');
const bot = new Client();
const music = require('./commands/music');
const prefix = '!';
const pathToAudios = "../sounds";
const drinks = require('./commands/drinks');
const audio = require('./commands/audio');
const audios = existsSync(pathToAudios) ?
    readdirSync(pathToAudios)
        .filter(fileName => fileName.includes('.mp3'))
        .map(fileName => basename(fileName, '.mp3')) : null;

const channel_id = process.env.CHANNEL_ID;
const token = process.env.BOT_TOKEN;

bot.login(token);
bot.on('ready', () => {
    const vChannel = bot.channels.cache.get(channel_id);
    vChannel.join().then(connection => {
        music.setConnection(connection);
        console.log("Music Bot successfully connected.");
    }).catch(e => {
        console.error(e);
    });
})

bot.on('message', (msg) => {
    if (msg.author.bot) return;
    if (!msg.content.startsWith(prefix)) return;

    const args = msg.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    //if (command === 'search') drinks.searchDrink(args, msg.channel)

    //if (command === 'locate') drinks.searchStore(args, msg.channel);

    if (command === 'play')
        search(args.join(' '), msg.author.username)
            .then(result => music.addToQueue(result));

    if (command === 'skip') music.skip(args.join(' '))

    if (command === 'resume') music.resume()

    if (command === 'pause') music.pause()

    if (command === 'next') music.next()

    if (command === 'vol') music.volume(args.join(' '));

    if (command === 'prev') music.previous();

    if (command === 'rm') music.remove(args.join(' '));

    if (command === 'clr') music.clear(args.join(' '));

    if (command === 'q') music.seeQueue(msg.channel);

    if (command === 'mhelp') music.displayHelp(msg.channel);

    //if (command === 'ahelp') audio.displayAudioHelp(msg.channel, audios.map(a => { return { name: a, value: a, inline: false } }));

    // const a = audios.find(x => x === command);

    // if (a)
    //     audio.playAudio(msg, `${pathToAudios}/${a}.mp3`);

    async function search(query, author) {
        const result = await ytsr(query);
        const songInfo = result.items.filter(x => x.type === 'video')[0];
        return {
            title: songInfo.title,
            url: songInfo.url,
            author: author,
            isPlaying: false
        };
    };
});
