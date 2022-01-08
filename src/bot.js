const { Client } = require('discord.js')
const { existsSync, readdirSync } = require('fs');
const { basename } = require('path')
const ytsr = require('ytsr');
const audio = require('./commands/audio');
const music = require('./commands/music');
const drinks = require('./commands/drinks');
const client = new Client();
const prefix = '!';
const pathToAudios = "../sounds";
const audios = existsSync(pathToAudios) ?
    readdirSync(pathToAudios)
        .filter(fileName => fileName.includes('.mp3'))
        .map(fileName => basename(fileName, '.mp3')) : null;

client.login(process.env.MUSIC_BOT);
client.on('ready', () => {
    const vChannel = client.channels.cache.get(process.env.MUSIC_CHANNEL_ID);
    vChannel.join().then(connection => {
        music.setConnection(connection);
        console.log("Music Bot successfully connected.");
    }).catch(e => {
        console.error(e);
    });
})

client.on('message', (msg) => {
    if (msg.author.bot) return;
    if (!msg.content.startsWith(prefix)) return;

    const args = msg.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === 'search') drinks.searchDrink(args, msg.channel)

    if (command === 'locate') drinks.searchStore(args, msg.channel);

    if (command === 'play')
        search(args.join(' '))
            .then(result => music.addToQueue(result));

    if (command === 'skip') music.skip(args.join(' '))

    if (command === 'resume') music.resume()

    if (command === 'pause') music.pause()

    if (command === 'next') music.next()

    if (command === 'vol') music.volume(args.join(' '));

    if (command === 'prev') music.previous();

    if (command === 'rm') music.remove(args.join(' '));

    if (command === 'q') music.seeQueue(msg.channel);

    if (command === 'mhelp') music.displayHelp(msg.channel);

    if (command === 'ahelp') audio.displayAudioHelp(msg.channel, audios.map(a => { return { name: a, value: a, inline: false } }));

    const a = audios.find(x => x === command);

    if (a)
        audio.playAudio(msg, `${pathToAudios}/${a}.mp3`);

    async function search(query) {
        const result = await ytsr(query);
        const songInfo = result.items.filter(x => x.type === 'video')[0];
        return {
            title: songInfo.title,
            url: songInfo.url,
            playing: false
        };
    };
});
