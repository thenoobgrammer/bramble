const ytdl = require('ytdl-core');

async function playSong(channelQueue, song) {
    channelQueue.connection
        .play(ytdl(song.url), { volume: channelQueue.volume })
        .on('finish', () => {
            channelQueue.songs.shift();
            if (channelQueue.songs[0])
                console.log(`No songs to play next, please choose song`);
            else
                playSong(channelQueue, channelQueue.songs[0])
        })
}

async function stopSong(channelQueue) {
    if (!channelQueue)
        return;
    channelQueue.songs = [];
    channelQueue.connection.dispatcher.end();
}

async function skipSong(channelQueue) {
    if (!channelQueue)
        return;
    channelQueue.connection.dispatcher.end();
}

async function volume(channelQueue, volume) {
    if (!channelQueue)
        return;
    channelQueue.connection.setVolume(volume < 0 ? 0 : volume);
}

async function leave(channelQueue) {
    channelQueue.vChannel.leave();
}

async function playAudioFile(msg, path) {
    const vChannel = msg.member.voice.channel;
    await vChannel.join()
        .then(connection => {
            const dispatcher = connection.play(path, { seek: 0, volume: 0.5 });
            console.log(connection)
            dispatcher.on('finish', () => {
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
    volume,
    leave,
    type,
    playAudioFile
}