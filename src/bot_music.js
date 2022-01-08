const { Client } = require('discord.js')
const ytsr = require('ytsr');
const music = require('./commands/music');
const client = new Client();
const prefix = '!';
//const URL_MATCH = '^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.be)\/.+$';

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

    if (command === 'play')
        search(args.join(' '))
            .then(result => music.addToQueue(result));

    if (command === 'skip') music.play(args.join(' '))

    if (command === 'resume') music.resume()

    if (command === 'pause') music.pause()

    if (command === 'next') music.next()

    if (command === 'vol') music.volume(args.join(' '));

    if (command === 'prev') music.previous();

    if (command === 'rm') music.remove(args.join(' '));

    if (command === 'queue') music.seeQueue(msg.channel);

    if (command === 'mhelp') music.displayHelp(msg.channel);

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
