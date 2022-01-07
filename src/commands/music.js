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
    if (optionalIdx && optionalIdx instanceof Number && optionalIdx >= 0 && optionalIdx < queue.length)
        currentIdx = optionalIdx;

    const dispatcher = connection.play(await ytdl(queue[currentIdx].url), { 
        type: 'opus',
        fmt: 'mp3', 
        volume: defaultVolume, 
        highWaterMark: 1,
        filter: 'audioonly',
        encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200']
    });
    dispatcher.on('start', () => console.log('song started'));
    dispatcher.on('finish', () => next());
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