const ytdl = require('ytdl-core-discord');
const { MessageEmbed } = require('discord.js');
const defaultVolume = 0.5;

let connection = null;
let queue = [];
let currentIdx = 0;

async function setConnection(incomingConnection) {
    connection = incomingConnection;
}

async function addToQueue(songData) {
    queue.push(songData);
    if (queue.length === 1)
        play()
}

async function play(optionalIdx) {
    const audioOpts = {
        type: 'opus',
        fmt: 'mp3',
        volume: defaultVolume,
        highWaterMark: 1,
        filter: 'audioonly',
        encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200']
    };

    let dispatcher = null;

    if (optionalIdx && optionalIdx - 1 >= 0 && optionalIdx - 1 < queue.length) {
        if(optionalIdx-1 === currentIdx)
            return;
        currentIdx = optionalIdx - 1;
        dispatcher = connection.play(await ytdl(queue[currentIdx].url), audioOpts)
        .on('start', () => console.log('song started'))
        .on('finish', () => next())
    }

    if (!optionalIdx)
        connection.play(await ytdl(queue[currentIdx].url), audioOpts)
        .on('start', () => console.log('song started'))
        .on('finish', () => next())


}

async function pause() {
}

async function next() {
    currentIdx = currentIdx >= queue.length - 1 ? currentIdx : currentIdx + 1;
    play();
}

async function previous() {
    currentIdx = currentIdx <= 0 ? currentIdx : currentIdx - 1;
    play();
}

async function volume(connection, volume) {
    connection.setVolume(volume < 0 ? 0 : volume);
}

async function seeQueue(channel) {
    const embed = new MessageEmbed()
        .setTitle(`Current queue`)
        .setColor('#008369')
        .setDescription(queue.map((song, idx) => {
            if (idx === currentIdx)
                return `\`\`\`yaml\n${idx + 1}. ${song.title}\`\`\``;
            return `${idx + 1}. ${song.title}`;
        }))
    channel.send(embed);
}

module.exports = {
    addToQueue,
    play,
    pause,
    next,
    previous,
    volume,
    setConnection,
    seeQueue
}