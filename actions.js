const ytdl = require('ytdl-core');

async function playSong(channelQueue, msg, song) {
    if (!song) {
        channelQueue.vChannel.leave();
        //queue.getdelete(msg.guild.id);
        return -1;
    }
    console.log(channelQueue)
    const dispatcher = channelQueue.connection
        .play(ytdl(song.url))
        .on('finish', () => {
            channelQueue.songs.shift();
            playSong(channelQueue, msg, channelQueue.songs[0]);
            if (channelQueue.songs.length > 0)
                channelQueue.txtChannel.send(`Now playing ${channelQueue.songs[0].url}`)
        })
}

async function stopSong(channelQueue, msg) {
    if (!msg.member.voice.channel) {
        return msg.channel.send('You need to join voice chan first');
    }
    channelQueue.songs = [];
    channelQueue.connection.dispatcher.end();
}

async function skipSong(channelQueue, msg) {
    if (!msg.member.voice.channel) {
        return msg.channel.send('You need to join voice chan first');
    }
    if (!serverQueue)
        return msg.channel.send('Queue is empty');
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