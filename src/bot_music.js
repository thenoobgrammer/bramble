const { Client } = require('discord.js')
const ytsr = require('ytsr');
const { playSong, skipSong, stopSong, volume, leave } = require('./commands');
const QueueManager = require('./queue-manager.js');

const bot_2 = new Client();
const prefix = '!';

let queueManager = new QueueManager();

bot_2.login(process.env.PROD_TOKEN_2);
bot_2.on('ready', () => {
    const vChannel = bot_2.channels.cache.get(process.env.PROD_MUSIC_CHANNEL_1_ID);
    vChannel.join().then(connection => {
        queueManager.get('queue').set(vChannel.id, {
            vChannel: vChannel,
            connection: connection,
            songs: [],
            volume: 0.5,
            playing: true
        });
        console.log("Bot 2 successfully connected.");
    }).catch(e => {
        console.error(e);
    });
})


bot_2.on('message', (msg) => {
    if (msg.author.bot) return;
    if (!msg.content.startsWith(prefix)) return;

    const args = msg.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    let channelQueue = queueManager.get('queue').get(process.env.PROD_MUSIC_CHANNEL_1_ID);

    if (command === 'play') {
        play(channelQueue);
    }

    if (command === 'stop') {
        stopSong(channelQueue)
    }
    // if (command === 'skip') {
    //     skipSong(channelQueue)
    // }
    // if(command === 'volume') {
    //     volume(channelQueue, args.join(' '));
    // }
    // if(command === 'leave') {
    //     leave(channelQueue);
    // }
    async function play(channelQueue) {
        let result = await ytsr(args.join(' '))
        const songInfo = result.items.filter(x => x.type === 'video')[0];
        const song = {
            title: songInfo.title,
            url: songInfo.url
        }
        channelQueue.songs.push(song);
        playSong(channelQueue, song)
        console.log(`The song has been added to queue ${song.title}`);
    }
});
