require('dotenv').config();
const ytdl = require('ytdl-core');

async function playSong(channelQueue, msg, song) {
    if (!song) {
        channelQueue.vChannel.leave();
        channelQueue.get('queue').delete(process.env.MUSIC_CHANNEL_1_ID);
        return;
    }
    const dispatcher = channelQueue.connection
        .play(ytdl(song.url))
        .on('finish', () => {
            channelQueue.songs.shift();
            playSong(channelQueue, msg, channelQueue.songs[0]);
            if (channelQueue.songs.length > 0)
                channelQueue.txtChannel.send(`Now playing ${channelQueue.songs[0].url}`)
        })
}

async function stopSong(channelQueue) {
    channelQueue.songs = [];
    channelQueue.connection.dispatcher.end();
}

async function skipSong(channelQueue, msg) {
    if (!serverQueue) {
        return msg.channel.send('No song to play next.');
    }
    channelQueue.connection.dispatcher.end();
}

async function playAudioFile(msg, path) {
    const vChannel = msg.member.voice.channel;
    await vChannel.join()
        .then(connection => {
            const dispatcher = connection.play(path, { seek: 0, volume: 0.5 });
            dispatcher.on('speaking', speaking => {
                if (!speaking)
                    vChannel.leave()
            });
        });
}

function type(msg, msgToType) {
    msg.channel.send(msgToType);
}

module.exports = {
    playSong,
    stopSong,
    skipSong,
    type,
    playAudioFile
}